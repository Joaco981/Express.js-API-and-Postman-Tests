// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Dashboard from '../views/dashboard.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem("usuario");
  if (to.path === '/dashboard' && !usuario) {
    next('/');
  } else {
    next();
  }
});

export default router
