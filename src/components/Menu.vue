<script setup>
const menuData = [
  {
    category: 'Antipasti',
    items: [
      { name: 'Bruschetta al Pomodoro', desc: 'Pan tostado con tomate fresco, albahaca y aceite de oliva virgen extra', price: '$8.50', img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&q=80' },
      { name: 'Caprese', desc: 'Mozzarella fresca con tomate, albahaca y reducción de balsámico', price: '$10.00', img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=300&q=80' },
      { name: 'Calamari Fritti', desc: 'Calamares empanizados servidos con salsa marinara casera', price: '$12.00', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80' },
    ],
  },
  {
    category: 'Primi',
    items: [
      { name: 'Spaghetti alla Carbonara', desc: 'Pasta con huevo, panceta, pecorino y pimienta negra', price: '$16.00', img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=80' },
      { name: 'Lasagna alla Bolognese', desc: 'Capas de pasta con ragú de carne, bechamel y parmesano', price: '$18.00', img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&q=80' },
      { name: 'Risotto ai Funghi', desc: 'Arroz cremoso con hongos porcini y parmesano', price: '$17.00', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&q=80' },
    ],
  },
  {
    category: 'Secondi',
    items: [
      { name: 'Saltimbocca alla Romana', desc: 'Escalopa de ternera con jamón serrano, salvia y vino blanco', price: '$24.00', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80' },
      { name: 'Pollo alla Cacciatora', desc: 'Pollo guisado con tomate, aceitunas, alcaparras y hierbas', price: '$20.00', img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&q=80' },
      { name: 'Branzino al Forno', desc: 'Lubina al horno con limón, romero y aceite de oliva', price: '$28.00', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80' },
    ],
  },
  {
    category: 'Dolci',
    items: [
      { name: 'Tiramisù', desc: 'Clásico postre con mascarpone, café y cacao', price: '$9.00', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80' },
      { name: 'Panna Cotta', desc: 'Crema cocida con frutos rojos y coulis de mango', price: '$8.50', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
      { name: 'Cannoli Siciliani', desc: 'Canutos rellenos de ricota dulce con pistachos y chocolate', price: '$10.00', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80' },
    ],
  },
]
</script>

<template>
  <section id="menu" class="menu-section">
    <div class="container">
      <h2>La Carta</h2>
      <p class="section-subtitle">Descubre nuestra selección de platos tradicionales italianos</p>
      <div v-for="cat in menuData" :key="cat.category" class="menu-category">
        <h3>{{ cat.category }}</h3>
        <div class="menu-grid">
          <div v-for="(item, i) in cat.items" :key="i" class="menu-card">
            <div class="menu-img">
              <img :src="item.img" :alt="item.name" loading="lazy" />
            </div>
            <div class="menu-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.desc }}</p>
              <span class="menu-price">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
