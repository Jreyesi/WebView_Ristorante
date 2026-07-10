<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('adminToken', data.token)
      router.push('/admin')
    } else {
      errorMsg.value = data.error || 'Credenciales incorrectas'
    }
  } catch (error) {
    errorMsg.value = 'Error al conectar con el servidor'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Acceso Admin</h2>
      <p class="subtitle">Ingresa tus credenciales para gestionar el menú</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input id="username" type="text" v-model="username" required placeholder="admin" />
        </div>
        
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input id="password" type="password" v-model="password" required placeholder="••••••••" />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>
      
      <router-link to="/" class="back-link">← Volver al Restaurante</router-link>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--creamy);
  font-family: var(--font-sans);
  padding: 20px;
}

.login-box {
  background: var(--white);
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-top: 5px solid var(--green-italia);
}

h2 {
  font-family: var(--font-serif);
  color: var(--dark);
  font-size: 2rem;
  margin-bottom: 0.5rem;
  position: relative;
}

h2::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: var(--red-italia);
  margin: 8px auto 1.5rem;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);
  font-family: var(--font-sans);
}

.input-group input:focus {
  outline: none;
  border-color: var(--green-italia);
  box-shadow: 0 0 0 3px rgba(0, 146, 70, 0.1);
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  background: var(--red-italia);
  color: var(--white);
  margin-top: 0.5rem;
}

.btn:hover:not(:disabled) {
  background: #b8222e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(206, 43, 55, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: var(--red-italia);
  font-size: 0.9rem;
  background: rgba(206, 43, 55, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: -0.5rem;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.9rem;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--green-italia);
}
</style>
