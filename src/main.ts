import App from './App.vue';
import { createApp } from 'vue';
import './style.css';
import './samples/node-api';
import Toast, { POSITION, useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Toast, {
    transition: 'Vue-Toastification__fade',
    maxToasts: 20,
    newestOnTop: true
});
const toast = useToast();
app.config.errorHandler = function (err) {
    if (err instanceof Error) {
        toast.error(err.message, {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            icon: true,
            rtl: false
        });
    } else {
        console.error(err);
    }
};
app.mount('#app');
