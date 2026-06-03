<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
      </ul>
    </div>
  </nav>
</template>
