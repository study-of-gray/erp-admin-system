// src/types/system/menu.ts
export interface MenuFormParams {
    id?: number
    menuName: string
    menuCode: string
    parentId: number
    icon?: string
    path?: string
    component?: string
    sortOrder: number
    status: number
    menuType: number // 1:目录 2:菜单 3:按钮
    permission?: string
    description?: string
}

export interface SysMenuItem extends MenuFormParams {
    id: number
    children?: SysMenuItem[]
    createTime: string
}

// 菜单类型选项
export const MENU_TYPE_OPTIONS = [
    { label: '目录', value: 1 },
    { label: '菜单', value: 2 },
    { label: '按钮', value: 3 }
]

// 图标选项（简化版）
export const ICON_OPTIONS = [
    { label: 'Home', value: 'Home' },
    { label: 'User', value: 'User' },
    { label: 'Setting', value: 'Setting' },
    { label: 'Document', value: 'Document' },
    { label: 'Chart', value: 'Chart' },
    { label: 'Lock', value: 'Lock' }
]