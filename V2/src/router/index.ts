import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

/**
 * Helper to get the current user, or wait for initialization
 */
const getCurrentUser = () => {
  return new Promise<User | null>((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DataDump.vue'), // Temporary DataDump for all views
      meta: { requiresAuth: true }
    },
    {
      path: '/character/:id',
      name: 'CharacterSheet',
      component: () => import('../views/DataDump.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dm',
      name: 'DMConsole',
      component: () => import('../views/DataDump.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    }
  ]
});

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = await getCurrentUser();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
