/** 用户列表项 */
export interface SysUserItem {
    id: number
    username: string
    nickname: string
    role: string
    email?: string
    phone?: string
    avatar?: string
    status: 'active' | 'inactive' | 'locked'
    createTime: string
    updateTime?: string
}

export interface SysRoleItem {
    id: number
    roleName: string
    roleCode: string
    description?: string
    permissions: string[]
    createTime: string
}

export interface SysMenuItem {
    id: number
    menuName: string
    menuCode: string
    menuType: 'dir' | 'menu' | 'button'
    icon?: string
    path?: string
    component?: string
    parentId: number | null
    sort: number
    visible: boolean
    createTime: string
}

/** 用户查询参数 */
export interface UserQueryParams extends PageParams {
    username?: string
    status?: 0 | 1
    startTime?: string
    endTime?: string
}

/** 用户表单参数 */
export interface UserFormParams {
    id?: number
    username: string
    nickname: string
    password?: string
    role: string
    phone: string
    email: string
    status: 0 | 1
}