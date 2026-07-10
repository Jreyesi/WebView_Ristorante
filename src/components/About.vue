<template>
  <section id="about" class="about-section">
    <div class="container" v-if="aboutData">
      <div class="about-grid">
        <div class="about-image" v-if="aboutData.imageUrl">
          <img
            :src="aboutData.imageUrl"
            alt="Ristorante Italia interior"
          />
        </div>
        <div class="about-text">
          <h2>{{ aboutData.title }}</h2>
          <p class="about-intro">
            {{ aboutData.intro }}
          </p>
          <p>
            {{ aboutData.body }}
          </p>
          <div class="about-values">
            <div class="value-item">
              <div class="value-icon">{{ aboutData.val1Icon }}</div>
              <h4>{{ aboutData.val1Title }}</h4>
              <p>{{ aboutData.val1Desc }}</p>
            </div>
            <div class="value-item">
              <div class="value-icon">{{ aboutData.val2Icon }}</div>
              <h4>{{ aboutData.val2Title }}</h4>
              <p>{{ aboutData.val2Desc }}</p>
            </div>
            <div class="value-item">
              <div class="value-icon">{{ aboutData.val3Icon }}</div>
              <h4>{{ aboutData.val3Title }}</h4>
              <p>{{ aboutData.val3Desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const aboutData = ref(null)

const fetchAboutData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/about')
    if (res.ok) {
      aboutData.value = await res.json()
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
  }
}

onMounted(() => {
  fetchAboutData()
})
</script>
