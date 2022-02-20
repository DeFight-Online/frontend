import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Battle from '../views/Battle.vue'
import Invenotory from '../views/Inventory.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Battle',
    component: Battle,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Invenotory,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
