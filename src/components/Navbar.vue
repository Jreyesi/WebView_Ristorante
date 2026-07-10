<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const isAdmin = ref(false)
let authInterval = null

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  isAdmin.value = !!localStorage.getItem('adminToken')
  authInterval = setInterval(() => {
    isAdmin.value = !!localStorage.getItem('adminToken')
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (authInterval) clearInterval(authInterval)
})

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="nav-container">
      <a href="#hero" class="nav-logo">
        Ristorante Italia
      </a>
      <button
        class="hamburger"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav-links" :class="{ open: menuOpen }">
        <li><a href="#hero" @click="closeMenu">Inicio</a></li>
        <li><a href="#about" @click="closeMenu">Nosotros</a></li>
        <li><a href="#menu" @click="closeMenu">Carta</a></li>
        <li><a href="#prices" @click="closeMenu">Precios</a></li>
        <li><a href="#reservation" @click="closeMenu">Reserva</a></li>
        <li><a href="#contact" @click="closeMenu">Contacto</a></li>
        <li v-if="isAdmin"><router-link to="/reportes" @click="closeMenu">Reportes</router-link></li>
      </ul>
    </div>
  </nav>
</template>
