/* src/router/index.ts 路由配置 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/views/dashboard/index.vue'),
            meta: { requiresAuth: true, title: '控制台' }
        }
    ]
})

// 路由守卫：预留权限校验逻辑，供n8n后续注入
router.beforeEach(async (to, from, next) => {
    /* TODO: n8n注入权限校验逻辑
     * 1. 读取本地token
     * 2. 校验token有效性
     * 3. 无权限跳转登录页
     */
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('ERP_TOKEN')
        if (!token) {
            next('/login')
            return
        }
    }
    next()
})

export default router