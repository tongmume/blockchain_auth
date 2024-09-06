import { createApp } from 'vue'
import { createPinia } from 'pinia';
import PiniaPersistedState from 'pinia-plugin-persistedstate';
import './style.css'
import router from './router';
import App from './App.vue'
import i18n from './i18n'; // 导入 i18n
import './auto-update';
const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();
pinia.use(PiniaPersistedState);

app.use(pinia);
app.use(i18n); // 使用 i18n
app.use(router);

app.mount('#app');
