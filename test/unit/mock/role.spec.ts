import { describe, it, expect, afterEach } from 'vitest'
import { roleService } from '@/mock/role' // 使用 @ 别名

describe('roleService', () => {
    // 清理：防止测试之间互相污染（因为 Mock 是内存存储）
    afterEach(() => {
        // 如果有重置方法最好，没有的话可能需要深拷贝恢复初始数据
        // 此处假设 roleService 内部维护状态，测试需注意顺序
    })

    it('should calculate total correctly after adding a role', () => {
        const initial = roleService.getRoles()
        roleService.addRole({
            roleName: 'Test',
            roleCode: 'TEST',
            description: '',
            status: 1,
            permissions: []
        })
        const updated = roleService.getRoles()
        expect(updated.total).toBe(initial.total + 1)
    })
})