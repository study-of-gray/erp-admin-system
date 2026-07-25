// src/mock/__tests__/role.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { roleService } from '../role'

describe('roleService', () => {
    // 每次测试前重置状态（如果 Mock 数据是可变的，这很重要）
    beforeEach(() => {
        // 如果你的 mock 数据支持重置，可以在这里调用
        // 例如：roleService.reset()
    })

    it('should get roles with pagination', () => {
        const result = roleService.getRoles({ pageNum: 1, pageSize: 2 })
        expect(result.list.length).toBe(2)
        expect(result.total).toBeGreaterThan(2)
        expect(result.pageNum).toBe(1)
        expect(result.pageSize).toBe(2)
    })

    it('should add a new role and update total count', () => {
        const initialResult = roleService.getRoles()
        const initialTotal = initialResult.total

        roleService.addRole({
            roleName: 'Test Role',
            roleCode: 'TEST',
            description: 'test',
            status: 1,
            permissions: []
        })

        const newResult = roleService.getRoles()
        expect(newResult.total).toBe(initialTotal + 1)
    })

    it('should delete a role', () => {
        const roles = roleService.getRoles()
        const firstRoleId = roles.list[0].id

        const success = roleService.deleteRole(firstRoleId)
        expect(success).toBe(true)

        const found = roleService.getRoleById(firstRoleId)
        expect(found).toBeUndefined()
    })
})