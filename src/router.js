'use strict'
import { createWebHistory, createRouter } from 'vue-router'

import LoginView from '@/pages/Login.vue'
import HomeView from '@/pages/Home.vue'
import { decodeCredential } from 'vue3-google-login'
import LogoutView from '@/pages/Logout.vue'
import CharacterOverview from '@/pages/CharacterOverview.vue'

const routes = [
  { path: '/login', component: LoginView, meta: { requireAuthentication: false } },
  { path: '/logout', component: LogoutView, meta: { requireAuthentication: false } },
  { path: '/', component: HomeView, meta: { requireAuthentication: true } },
  { path: '/character/:id', component: CharacterOverview, meta: { requireAuthentication: true } }
]

const router = createRouter({
  history: createWebHistory(),
  // linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes
})

async function logout(path = '/logout') {
  localStorage.removeItem('Token')
  localStorage.removeItem('UserData')
  await router.push({ path: path, replace: true })
  window.location.reload()
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('Token')
  if (to.path === '/logout') {
    if (token) {
      await logout()
    }
  }

  if (to.meta.requireAuthentication) {
    if (token) {
      // User is authenticated, proceed to the route
      let userData = decodeCredential(token)
      // validate expire time in userdata
      if (userData['exp'] < Math.floor(Date.now() / 1000)) {
        await logout('/login')
        next('/login')
      }
      next()
    } else {
      // User is not authenticated, redirect to login
      next('/login')
    }
  } else {
    // Non-protected route, allow access
    if (token && to.path === '/login') {
      next('/')
    }
    next()
  }
})

export { routes }
export default router
