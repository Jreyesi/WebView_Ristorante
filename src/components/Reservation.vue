<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  people: 1,
  message: '',
})

const errors = reactive({})
const touched = reactive({})
const status = ref('idle')

const todayStr = new Date().toISOString().split('T')[0]

function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim() || value.trim().length < 2)
        return 'Nombre requerido (mínimo 2 caracteres)'
      return ''
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Correo electrónico inválido'
      return ''
    case 'phone': {
      const digits = String(value).replace(/[\s-]/g, '')
      if (!/^\d{10,}$/.test(digits))
        return 'Debe tener al menos 10 dígitos numéricos'
      return ''
    }
    case 'date': {
      if (!value) return 'Selecciona una fecha'
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selected = new Date(value + 'T12:00:00')
      if (selected < today) return 'La fecha debe ser hoy o posterior'
      return ''
    }
    case 'time': {
      if (!value) return 'Selecciona una hora'
      const hour = parseInt(value.split(':')[0], 10)
      if (hour < 12 || hour > 23)
        return 'Solo reservamos de 12:00 a 23:00 hrs'
      return ''
    }
    case 'people': {
      const ppl = parseInt(value, 10)
      if (isNaN(ppl) || ppl < 1 || ppl > 20)
        return 'Debe ser entre 1 y 20 personas'
      return ''
    }
    default:
      return ''
  }
}

function validateAll() {
  const keys = Object.keys(form)
  let valid = true
  for (const key of keys) {
    const err = validateField(key, form[key])
    if (err) {
      errors[key] = err
      valid = false
    } else {
      delete errors[key]
    }
  }
  return valid
}

function handleChange(name, value) {
  form[name] = value
  touched[name] = true
  const err = validateField(name, value)
  if (err) {
    errors[name] = err
  } else {
    delete errors[name]
  }
}

function handleSubmit(e) {
  e.preventDefault()
  const keys = Object.keys(form)
  for (const key of keys) {
    touched[key] = true
  }
  if (!validateAll()) return
  status.value = 'loading'
  setTimeout(() => {
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.phone = ''
    form.date = ''
    form.time = ''
    form.people = 1
    form.message = ''
    for (const key of keys) {
      delete errors[key]
      delete touched[key]
    }
    setTimeout(() => { status.value = 'idle' }, 4000)
  }, 1500)
}

function showError(field) {
  return touched[field] && errors[field]
}
</script>

<template>
  <section id="reservation" class="reservation-section">
    <div class="container">
      <h2>Reserva tu Mesa</h2>
      <p class="section-subtitle">
        Déjanos tus datos y te confirmaremos la reserva a la brevedad
      </p>

      <div v-if="status === 'success'" class="form-success">
        <span class="success-icon">✓</span>
        <p>¡Reserva enviada con éxito! Te contactaremos pronto para confirmar.</p>
      </div>

      <form class="reservation-form" @submit.prevent="handleSubmit" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre completo *</label>
            <input
              type="text"
              id="name"
              :value="form.name"
              @input="handleChange('name', $event.target.value)"
              placeholder="Tu nombre"
              :class="{ error: showError('name') }"
            />
            <span v-if="showError('name')" class="field-error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label for="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              :value="form.email"
              @input="handleChange('email', $event.target.value)"
              placeholder="correo@ejemplo.com"
              :class="{ error: showError('email') }"
            />
            <span v-if="showError('email')" class="field-error">{{ errors.email }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              :value="form.phone"
              @input="handleChange('phone', $event.target.value)"
              placeholder="10 dígitos (solo números)"
              :class="{ error: showError('phone') }"
            />
            <span v-if="showError('phone')" class="field-error">{{ errors.phone }}</span>
          </div>
          <div class="form-group">
            <label for="people">Número de personas *</label>
            <select
              id="people"
              :value="form.people"
              @change="handleChange('people', $event.target.value)"
              :class="{ error: showError('people') }"
            >
              <option v-for="i in 20" :key="i" :value="i">
                {{ i }} {{ i === 1 ? 'persona' : 'personas' }}
              </option>
            </select>
            <span v-if="showError('people')" class="field-error">{{ errors.people }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Fecha *</label>
            <input
              type="date"
              id="date"
              :value="form.date"
              @input="handleChange('date', $event.target.value)"
              :min="todayStr"
              :class="{ error: showError('date') }"
            />
            <span v-if="showError('date')" class="field-error">{{ errors.date }}</span>
          </div>
          <div class="form-group">
            <label for="time">Hora *</label>
            <input
              type="time"
              id="time"
              :value="form.time"
              @input="handleChange('time', $event.target.value)"
              :class="{ error: showError('time') }"
            />
            <span v-if="showError('time')" class="field-error">{{ errors.time }}</span>
          </div>
        </div>

        <div class="form-group full">
          <label for="message">Mensaje especial (opcional)</label>
          <textarea
            id="message"
            :value="form.message"
            @input="handleChange('message', $event.target.value)"
            placeholder="Alergias, ocasión especial, preferencias..."
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-submit"
          :disabled="status === 'loading'"
        >
          {{ status === 'loading' ? 'Enviando...' : 'Confirmar Reserva' }}
        </button>
      </form>
    </div>
  </section>
</template>
