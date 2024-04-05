import './assets/app.css'

import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

// Axios
import axios from 'axios'
window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true
window.axios.defaults.withXSRFToken = true

// Global Filters
import globalFilters from './globalFilters'

// Loader
import Loader from './components/Loader.vue'

// Vue Toast Notification
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

// mitt
import mitt from 'mitt'
const emitter = mitt()

const app = createApp(App)
    .use(router)
    .use(store)
    .component('Loader', Loader)
    .use(ToastPlugin, {
        position: 'top'
    })

// app.config.globalProperties.$axios = axios
// app.config.globalProperties.$axios.defaults.withCredentials = true
// app.config.globalProperties.$axios.defaults.withXSRFToken = true

app.config.globalProperties.$filters = globalFilters
app.config.globalProperties.emitter = emitter

app.mount('#app')
