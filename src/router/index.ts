import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/tracker',
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/TrackerView.vue'),
    },
    {
      path: '/charsheet',
      name: 'charsheet',
      component: () => import('../views/CharsheetView.vue'),
    },
  ],
})

export default router
