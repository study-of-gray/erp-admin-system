/* src/main.ts 修正后 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import ElementPlus from 'element-plus'
import '@/styles/element/index.scss'
// 移除未创建的views.scss导入，避免解析失败
// import '@/styles/views.scss'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')