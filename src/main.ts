import App from './App.vue'
import { createApp } from 'vue'
import "./style.css"
import './samples/node-api'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(Toast);
app.mount('#app')