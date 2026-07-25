// src/types/system/role.ts
export interface RoleFormParams {
    id?: number
    roleName: string
    roleCode: string
    description: string
    status: number
    permissions: string[]
}

export interface SysRoleItem extends RoleFormParams {
    id: number
    createTime: string
}

// 权限树节点类型
export interface PermissionTreeNode {
    label: string
    value: string
    children?: PermissionTreeNode[]
}