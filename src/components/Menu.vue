<script setup>
import { ref, onMounted } from 'vue'

const menuData = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/categories')
    const categories = await res.json()
    // Transform backend data to match expected frontend structure if needed,
    // but we can just use it directly
    menuData.value = categories
  } catch (error) {
    console.error('Error fetching menu:', error)
  }
})
</script>

<template>
  <section id="menu" class="menu-section">
    <div class="container">
      <h2>La Carta</h2>
      <p class="section-subtitle">Descubre nuestra selección de platos tradicionales italianos</p>
      <div v-for="cat in menuData" :key="cat.id" class="menu-category">
        <h3>{{ cat.name }}</h3>
        <div class="menu-grid">
          <div v-for="item in cat.menuItems" :key="item.id" class="menu-card">
            <div class="menu-img">
              <img :src="item.imageUrl" :alt="item.title" loading="lazy" />
            </div>
            <div class="menu-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <span class="menu-price">{{ item.price }}</span>
            </div>
          </div>
        </div>
        <p v-if="!cat.menuItems || cat.menuItems.length === 0" style="text-align: center; color: #888;">
          No hay platos en esta categoría aún.
        </p>
      </div>
      <p v-if="menuData.length === 0" style="text-align: center; color: #888; padding: 2rem;">
        Cargando menú o menú vacío. Ve al panel de administración para agregar categorías y platos.
      </p>
    </div>
  </section>
</template>
