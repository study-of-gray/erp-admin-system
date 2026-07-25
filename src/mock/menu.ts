// mock/menu.ts 最终修正版
import { MockMethod } from 'vite-plugin-mock'

// 菜单配置映射：角色 -> 可访问菜单
const menuMap: Record<string, any[]> = {
    admin: [
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: '控制台', requiresAuth: true }
        },
        {
            path: '/system',
            name: 'system',
            meta: { title: '系统管理', requiresAuth: true },
            children: [
                {
                    path: 'user',
                    name: 'system-user',
                    meta: { title: '用户管理', requiresAuth: true, roles: ['admin', 'editor', 'viewer'] }
                }
            ]
        }
    ],
    editor: [
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: '控制台', requiresAuth: true }
        },
        {
            path: '/system',
            name: 'system',
            meta: { title: '系统管理', requiresAuth: true },
            children: [
                {
                    path: 'user',
                    name: 'system-user',
                    meta: { title: '用户管理', requiresAuth: true, roles: ['admin', 'editor', 'viewer'] }
                }
            ]
        }
    ],
    viewer: [
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: '控制台', requiresAuth: true }
        },
        {
            path: '/system',
            name: 'system',
            meta: { title: '系统管理', requiresAuth: true },
            children: [
                {
                    path: 'user',
                    name: 'system-user',
                    meta: { title: '用户管理', requiresAuth: true, roles: ['admin', 'editor', 'viewer'] }
                }
            ]
        }
    ]
}

export default [
    {
        url: '/api/system/menu/list',
        method: 'get',
        response: (req: { query: { role: string } }) => {
            const { role } = req.query
            const menus = menuMap[role] || []
            return {
                code: 200,
                data: menus,
                message: 'success',
                timestamp: Date.now()
            }
        }
    }
] as MockMethod[]