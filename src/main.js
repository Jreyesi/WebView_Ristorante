import { createApp } from 'vue'
import './styles/variables.css'
import './styles/components.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
