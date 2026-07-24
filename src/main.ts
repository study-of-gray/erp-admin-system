import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import ElementPlus from 'element-plus'
import '@/styles/element/index.scss'
import '@/styles/layout.scss' // 新增：引入布局样式
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')