import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import router from '@/router.js'

const app = createApp(App)

app.use(vue3GoogleLogin, {
    // clientId: '640359260149-o226ntm3p39eqlahvsk994tig7pi551f.apps.googleusercontent.com'
    clientId: '640359260149-386mld806cv0sg02bt8lt78guslg29hu.apps.googleusercontent.com'
})
app.use(router)

app.mount('#app')