import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Home from '../views/Home.vue';

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
