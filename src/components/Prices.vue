<script setup>
const priceData = [
  { name: 'Antipasti', range: '$8 — $15', icon: '\u{1F957}', desc: 'Entradas y aperitivos tradicionales' },
  { name: 'Primi (Pastas)', range: '$12 — $22', icon: '\u{1F35D}', desc: 'Pastas artesanales y risottos' },
  { name: 'Secondi (Carnes / Pescados)', range: '$18 — $35', icon: '\u{1F969}', desc: 'Platos fuertes de carne y pescado' },
  { name: 'Dolci (Postres)', range: '$7 — $14', icon: '\u{1F370}', desc: 'Postres caseros tradicionales' },
  { name: 'Vinos y Bebidas', range: '$25 — $80', icon: '\u{1F377}', desc: 'Selección de vinos italianos y cocktails' },
]
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
