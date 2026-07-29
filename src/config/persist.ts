// src/config/persist.ts
export const persistConfig = {
    key: 'ERP_USER_STORE',
    storage: localStorage,
    pick: ['token', 'userInfo'] as const
} as const

// 其他 store 的持久化配置也可以放在这里
export const appPersistConfig = {
    key: 'ERP_APP_STORE',
    storage: localStorage,
    pick: ['sidebarCollapsed', 'theme'] as const
} as const