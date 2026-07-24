import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import ElementPlus from 'element-plus'
import '@/styles/element/index.scss'
import '@/styles/layout.scss'
import App from './App.vue'
import registerPermissionDirective from '@/directives/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
registerPermissionDirective(app)

app.mount('#app')