// src/mock/role.ts
import { MockRole, PaginationResult } from './types'

// 模拟角色数据
const roles: MockRole[] = [
    { id: 1, roleName: '超级管理员', roleCode: 'ROLE_ADMIN', description: '系统最高权限', status: 1, permissions: ['system:user', 'system:role', 'system:menu'], createTime: '2026-01-01' },
    { id: 2, roleName: '编辑员', roleCode: 'ROLE_EDITOR', description: '内容编辑权限', status: 1, permissions: ['system:user:view', 'system:content'], createTime: '2026-01-02' },
    { id: 3, roleName: '观察员', roleCode: 'ROLE_VIEWER', description: '只读权限', status: 1, permissions: ['system:user:view', 'system:content:view'], createTime: '2026-01-03' },
    { id: 4, roleName: '运维人员', roleCode: 'ROLE_OPS', description: '系统运维权限', status: 1, permissions: ['system:monitor', 'system:log'], createTime: '2026-01-04' },
    { id: 5, roleName: '测试人员', roleCode: 'ROLE_TESTER', description: '测试专用角色', status: 0, permissions: ['system:test'], createTime: '2026-01-05' },
    { id: 6, roleName: '财务专员', roleCode: 'ROLE_FINANCE', description: '财务管理权限', status: 1, permissions: ['finance:report', 'finance:bill'], createTime: '2026-01-06' },
    { id: 7, roleName: '人事专员', roleCode: 'ROLE_HR', description: '人事管理权限', status: 1, permissions: ['hr:employee', 'hr:salary'], createTime: '2026-01-07' },
    { id: 8, roleName: '客服人员', roleCode: 'ROLE_SERVICE', description: '客户服务权限', status: 1, permissions: ['service:ticket', 'service:customer'], createTime: '2026-01-08' },
    { id: 9, roleName: '开发工程师', roleCode: 'ROLE_DEVELOPER', description: '开发权限', status: 1, permissions: ['dev:code', 'dev:deploy'], createTime: '2026-01-09' },
    { id: 10, roleName: '产品经理', roleCode: 'ROLE_PM', description: '产品管理权限', status: 1, permissions: ['product:plan', 'product:requirement'], createTime: '2026-01-10' }
]

// 查询参数接口
export interface RoleQueryParams {
    roleName?: string
    status?: number
    pageNum?: number
    pageSize?: number
}

// 角色服务类
class RoleService {
    // 获取角色列表（支持分页和筛选）
    getRoles(params: RoleQueryParams = {}): PaginationResult<MockRole> {
        const { roleName, status, pageNum = 1, pageSize = 10 } = params

        let filteredRoles = [...roles]

        // 筛选
        if (roleName) {
            filteredRoles = filteredRoles.filter(role => role.roleName.includes(roleName))
        }
        if (status !== undefined) {
            filteredRoles = filteredRoles.filter(role => role.status === status)
        }

        // 分页
        const start = (pageNum - 1) * pageSize
        const end = start + pageSize
        const list = filteredRoles.slice(start, end)

        return {
            list,
            total: filteredRoles.length,
            pageNum,
            pageSize
        }
    }

    // 获取所有角色（不分页）
    getAllRoles(): MockRole[] {
        return [...roles]
    }

    // 根据ID获取角色
    getRoleById(id: number): MockRole | undefined {
        return roles.find(role => role.id === id)
    }

    // 添加角色
    addRole(role: Omit<MockRole, 'id' | 'createTime'>): MockRole {
        const newId = Math.max(...roles.map(r => r.id)) + 1
        const newRole: MockRole = {
            ...role,
            id: newId,
            createTime: new Date().toLocaleDateString()
        }
        roles.push(newRole)
        return newRole
    }

    // 更新角色
    updateRole(id: number, updates: Partial<MockRole>): MockRole | null {
        const index = roles.findIndex(role => role.id === id)
        if (index === -1) return null

        roles[index] = { ...roles[index], ...updates }
        return roles[index]
    }

    // 删除角色
    deleteRole(id: number): boolean {
        const index = roles.findIndex(role => role.id === id)
        if (index === -1) return false

        roles.splice(index, 1)
        return true
    }

    // 更新角色权限
    updateRolePermissions(id: number, permissions: string[]): MockRole | null {
        const index = roles.findIndex(role => role.id === id)
        if (index === -1) return null

        roles[index].permissions = permissions
        return roles[index]
    }
}

// 导出单例实例
export const roleService = new RoleService()
export default roles