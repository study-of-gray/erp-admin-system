export const persistConfig = {
    key: 'ERP_USER_STORE',
    storage: localStorage,
    pick: ['token', 'userInfo']
}

export const appPersistConfig = {
    key: 'ERP_APP_STORE',
    storage: localStorage,
    pick: ['sidebarCollapsed', 'theme']
}