// src/mock/user.ts
import { MockUser, PaginationResult } from './types'

// 模拟用户数据
const users: MockUser[] = [
    { id: 1, username: 'admin', nickname: '管理员', role: 'admin', phone: '13800138000', email: 'admin@erp.com', status: 1, createTime: '2026-01-01' },
    { id: 2, username: 'editor', nickname: '编辑员', role: 'editor', phone: '13800138001', email: 'editor@erp.com', status: 1, createTime: '2026-01-02' },
    { id: 3, username: 'viewer', nickname: '观察员', role: 'viewer', phone: '13800138002', email: 'viewer@erp.com', status: 0, createTime: '2026-01-03' },
    { id: 4, username: 'user01', nickname: '业务用户1', role: 'viewer', phone: '13800138003', email: 'user01@erp.com', status: 1, createTime: '2026-01-04' },
    { id: 5, username: 'user02', nickname: '业务用户2', role: 'editor', phone: '13800138004', email: 'user02@erp.com', status: 1, createTime: '2026-01-05' },
    { id: 6, username: 'test01', nickname: '测试用户1', role: 'viewer', phone: '13800138005', email: 'test01@erp.com', status: 1, createTime: '2026-01-06' },
    { id: 7, username: 'test02', nickname: '测试用户2', role: 'editor', phone: '13800138006', email: 'test02@erp.com', status: 0, createTime: '2026-01-07' },
    { id: 8, username: 'dev01', nickname: '开发用户1', role: 'admin', phone: '13800138007', email: 'dev01@erp.com', status: 1, createTime: '2026-01-08' },
    { id: 9, username: 'ops01', nickname: '运维用户1', role: 'admin', phone: '13800138008', email: 'ops01@erp.com', status: 1, createTime: '2026-01-09' },
    { id: 10, username: 'qa01', nickname: '测试用户1', role: 'viewer', phone: '13800138009', email: 'qa01@erp.com', status: 1, createTime: '2026-01-10' }
]

// 查询参数接口
export interface UserQueryParams {
    username?: string
    status?: number
    pageNum?: number
    pageSize?: number
}

// 用户服务类
class UserService {
    // 获取用户列表（支持分页和筛选）
    getUsers(params: UserQueryParams = {}): PaginationResult<MockUser> {
        const { username, status, pageNum = 1, pageSize = 10 } = params

        let filteredUsers = [...users]

        // 筛选
        if (username) {
            filteredUsers = filteredUsers.filter(user => user.username.includes(username))
        }
        if (status !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.status === status)
        }

        // 分页
        const start = (pageNum - 1) * pageSize
        const end = start + pageSize
        const list = filteredUsers.slice(start, end)

        return {
            list,
            total: filteredUsers.length,
            pageNum,
            pageSize
        }
    }

    // 获取所有用户（不分页）
    getAllUsers(): MockUser[] {
        return [...users]
    }

    // 根据ID获取用户
    getUserById(id: number): MockUser | undefined {
        return users.find(user => user.id === id)
    }

    // 添加用户
    addUser(user: Omit<MockUser, 'id' | 'createTime'>): MockUser {
        const newId = Math.max(...users.map(u => u.id)) + 1
        const newUser: MockUser = {
            ...user,
            id: newId,
            createTime: new Date().toLocaleDateString()
        }
        users.push(newUser)
        return newUser
    }

    // 更新用户
    updateUser(id: number, updates: Partial<MockUser>): MockUser | null {
        const index = users.findIndex(user => user.id === id)
        if (index === -1) return null

        users[index] = { ...users[index], ...updates }
        return users[index]
    }

    // 删除用户
    deleteUser(id: number): boolean {
        const index = users.findIndex(user => user.id === id)
        if (index === -1) return false

        users.splice(index, 1)
        return true
    }

    // 批量删除用户
    batchDeleteUsers(ids: number[]): number {
        let deletedCount = 0
        ids.forEach(id => {
            const index = users.findIndex(user => user.id === id)
            if (index !== -1) {
                users.splice(index, 1)
                deletedCount++
            }
        })
        return deletedCount
    }
}

// 导出单例实例
export const userService = new UserService()
export default users