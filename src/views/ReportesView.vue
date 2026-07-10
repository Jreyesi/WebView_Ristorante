<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const reservations = ref([])
const loading = ref(true)

const fetchReservations = async () => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/reservations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('adminToken')
      router.push('/login')
      return
    }

    if (res.ok) {
      reservations.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch reservations')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  // Fix timezone issue when parsing strings like YYYY-MM-DD
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date)
}

const updateStatus = async (id, newStatus) => {
  const token = localStorage.getItem('adminToken')
  if (!token) return

  try {
    const res = await fetch(`http://localhost:3000/api/reservations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (res.ok) {
      const updatedReservation = await res.json()
      const index = reservations.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reservations.value[index].status = updatedReservation.status
      }
    }
  } catch (err) {
    console.error('Failed to update status')
  }
}

onMounted(() => {
  fetchReservations()
})
</script>

<template>
  <div class="reportes-container">
    <div class="reportes-header">
      <router-link to="/" class="back-link">&larr; Volver al inicio</router-link>
      <h1>Reporte de Reservaciones</h1>
      <p>Administra y revisa las reservas realizadas por los clientes.</p>
    </div>

    <div class="reportes-content">
      <div v-if="loading" class="loading-state">
        <p>Cargando reservaciones...</p>
      </div>
      <div v-else-if="reservations.length === 0" class="empty-state">
        <p>No hay reservaciones registradas por el momento.</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="reservations-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Fecha y Hora</th>
              <th>Personas</th>
              <th>Mensaje / Notas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in reservations" :key="res.id">
              <td>
                <strong>{{ res.name }}</strong>
              </td>
              <td>
                <a :href="`mailto:${res.email}`" class="contact-link">{{ res.email }}</a><br/>
                <a :href="`tel:${res.phone}`" class="contact-link">{{ res.phone }}</a>
              </td>
              <td>
                <span class="date-badge">{{ formatDate(res.date) }}</span>
                <span class="time-badge">{{ res.time }}</span>
              </td>
              <td>
                <span class="people-badge">{{ res.people }} {{ res.people === 1 ? 'persona' : 'personas' }}</span>
              </td>
              <td>
                <p class="res-message">{{ res.message || '-' }}</p>
              </td>
              <td>
                <select 
                  :value="res.status || 'Pendiente'" 
                  @change="e => updateStatus(res.id, e.target.value)"
                  class="status-select"
                  :class="{
                    'status-pendiente': res.status === 'Pendiente' || !res.status,
                    'status-confirmada': res.status === 'Confirmada',
                    'status-completada': res.status === 'Completada',
                    'status-cancelada': res.status === 'Cancelada'
                  }"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reportes-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.reportes-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #c0392b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.back-link:hover {
  color: #a93226;
}

.reportes-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}
.reportes-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.reportes-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  color: #7f8c8d;
  font-size: 1.2rem;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.reservations-table th, .reservations-table td {
  padding: 20px;
  border-bottom: 1px solid #edf2f7;
}

.reservations-table th {
  background-color: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reservations-table tbody tr:hover {
  background-color: #fbfbfc;
}

.contact-link {
  color: #3498db;
  text-decoration: none;
}
.contact-link:hover {
  text-decoration: underline;
}

.date-badge, .time-badge, .people-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 5px;
  margin-right: 5px;
}

.date-badge {
  background-color: #e3f2fd;
  color: #1976d2;
}

.time-badge {
  background-color: #fff3e0;
  color: #f57c00;
}

.people-badge {
  background-color: #e8f5e9;
  color: #388e3c;
}

.res-message {
  font-size: 0.9rem;
  color: #606f7b;
  margin: 0;
  max-width: 250px;
  line-height: 1.4;
}

.status-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.status-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.status-pendiente {
  background-color: #fff3e0;
  color: #e67e22;
  border-color: #fbd38d;
}

.status-confirmada {
  background-color: #e3f2fd;
  color: #2980b9;
  border-color: #90cdf4;
}

.status-completada {
  background-color: #e8f5e9;
  color: #27ae60;
  border-color: #9ae6b4;
}

.status-cancelada {
  background-color: #ffebee;
  color: #c0392b;
  border-color: #feb2b2;
}
</style>
