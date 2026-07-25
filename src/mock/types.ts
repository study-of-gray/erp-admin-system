// src/mock/types.ts
export interface MockUser {
    id: number
    username: string
    nickname: string
    role: string
    phone: string
    email: string
    status: number
    createTime: string
}

export interface MockRole {
    id: number
    roleName: string
    roleCode: string
    description: string
    status: number
    permissions: string[]
    createTime: string
}

export interface MockMenu {
    id: number
    menuName: string
    menuCode: string
    parentId: number
    icon?: string
    path?: string
    component?: string
    sortOrder: number
    status: number
    menuType: number
    permission?: string
    description?: string
    children?: MockMenu[]
    createTime: string
}

export interface PaginationResult<T> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
}