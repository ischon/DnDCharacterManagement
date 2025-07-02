'use strict'
import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase/app.js'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import CharacterOverview from '@/pages/CharacterOverview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/character/:id',
    name: 'CharacterOverview',
    component: CharacterOverview,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Track if auth state has been determined
let authStateDetermined = false

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  authStateDetermined = true
  console.log('Auth state determined:', !!user)
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = auth.currentUser

  console.log('Router guard:', { to: to.path, requiresAuth, user: !!user, authStateDetermined })

  // If auth state hasn't been determined yet, wait a bit
  if (!authStateDetermined) {
    console.log('Auth state not determined yet, waiting...')
    setTimeout(() => {
      router.push(to.path)
    }, 100)
    return
  }

  if (requiresAuth) {
    // Check if user is authenticated
    if (!user) {
      console.log('Route requires auth but user not authenticated, redirecting to login')
      next('/login')
    } else {
      console.log('User authenticated, proceeding to protected route')
      next()
    }
  } else {
    // Non-protected route
    if (to.path === '/login' && user) {
      // User is already logged in, redirect to home
      console.log('User already authenticated, redirecting to home')
      next('/')
    } else {
      console.log('Non-protected route, proceeding')
      next()
    }
  }
})

export default router
