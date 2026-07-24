import { MockMethod } from 'vite-plugin-mock'
import type { SysUserItem, UserQueryParams } from '@/types/system/user'

// 模拟数据库数据
const userList: SysUserItem[] = Array.from({ length: 300 }).map((_, index) => ({
    id: index + 1,
    username: `user${index + 1}`,
    nickname: `用户${index + 1}`,
    role: index % 3 === 0 ? 'admin' : index % 3 === 1 ? 'editor' : 'viewer',
    phone: `138${String(index).padStart(8, '0')}`,
    email: `user${index + 1}@erp.com`,
    status: index % 2 as 0 | 1,
    createTime: '2026-07-24 16:00:00'
}))

export default [
    // 用户分页列表
    {
        url: '/api/system/user/list',
        method: 'get',
        response: (req: { query: UserQueryParams }) => {
            const { pageNum = 1, pageSize = 20, username, status, startTime, endTime } = req.query
            let filteredList = [...userList]

            // 筛选逻辑
            if (username) {
                filteredList = filteredList.filter(item => item.username.includes(username))
            }
            if (status !== undefined) {
                filteredList = filteredList.filter(item => item.status === status)
            }
            if (startTime && endTime) {
                filteredList = filteredList.filter(item =>
                    item.createTime >= startTime && item.createTime <= endTime
                )
            }

            // 分页逻辑
            const start = (pageNum - 1) * pageSize
            const end = start + pageSize
            const list = filteredList.slice(start, end)

            return {
                code: 200,
                data: {
                    list,
                    total: filteredList.length,
                    pageNum,
                    pageSize
                },
                message: 'success',
                timestamp: Date.now()
            }
        }
    },
    // 新增/编辑用户
    {
        url: '/api/system/user/save',
        method: 'post',
        response: (req: { body: UserFormParams }) => {
            const { id } = req.body
            if (id) {
                // 编辑逻辑
                const index = userList.findIndex(item => item.id === id)
                if (index > -1) {
                    userList[index] = { ...userList[index], ...req.body }
                }
            } else {
                // 新增逻辑
                const newUser: SysUserItem = {
                    id: userList.length + 1,
                    ...req.body,
                    createTime: new Date().toLocaleString()
                }
                userList.unshift(newUser)
            }
            return {
                code: 200,
                data: null,
                message: '操作成功',
                timestamp: Date.now()
            }
        }
    },
    // 删除用户
    {
        url: '/api/system/user/delete',
        method: 'delete',
        response: (req: { query: { id: string } }) => {
            const id = Number(req.query.id)
            const index = userList.findIndex(item => item.id === id)
            if (index > -1) {
                userList.splice(index, 1)
            }
            return {
                code: 200,
                data: null,
                message: '删除成功',
                timestamp: Date.now()
            }
        }
    }
] as MockMethod[]