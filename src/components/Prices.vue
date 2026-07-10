<script setup>
import { ref, onMounted } from 'vue'

const priceData = ref([])

const fetchPrices = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/prices')
    if (res.ok) {
      priceData.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch prices')
  }
}

onMounted(() => {
  fetchPrices()
})
</script>

<template>
  <section id="prices" class="prices-section">
    <div class="container">
      <h2>Precios</h2>
      <p class="section-subtitle">Calidad premium a precios justos — relación calidad-precio inmejorable</p>
      <div class="prices-grid">
        <div v-for="(p, i) in priceData" :key="i" class="price-card">
          <div class="price-icon">{{ p.icon }}</div>
          <h3>{{ p.name }}</h3>
          <p class="price-desc">{{ p.desc }}</p>
          <span class="price-range">{{ p.range }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
