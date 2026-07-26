// src/mock/menu.ts
import { MockMenu, PaginationResult } from './types'

// 模拟菜单数据（树形结构）
const menus: MockMenu[] = [
    {
        id: 1,
        menuName: '系统管理',
        menuCode: 'system',
        parentId: 0,
        icon: 'Setting',
        path: '/system',
        component: 'Layout',
        sortOrder: 1,
        status: 1,
        menuType: 1,
        permission: 'system:view',
        description: '系统管理目录',
        createTime: '2026-01-01',
        children: [
            {
                id: 11,
                menuName: '用户管理',
                menuCode: 'system:user',
                parentId: 1,
                icon: 'User',
                path: 'user',
                component: '/system/user/index',
                sortOrder: 1,
                status: 1,
                menuType: 2,
                permission: 'system:user:view',
                description: '用户管理菜单',
                createTime: '2026-01-01'
            },
            {
                id: 12,
                menuName: '角色管理',
                menuCode: 'system:role',
                parentId: 1,
                icon: 'UserFilled',
                path: 'role',
                component: '/system/role/index',
                sortOrder: 2,
                status: 1,
                menuType: 2,
                permission: 'system:role:view',
                description: '角色管理菜单',
                createTime: '2026-01-02'
            },
            {
                id: 13,
                menuName: '菜单管理',
                menuCode: 'system:menu',
                parentId: 1,
                icon: 'Menu',
                path: 'menu',
                component: '/system/menu/index',
                sortOrder: 3,
                status: 1,
                menuType: 2,
                permission: 'system:menu:view',
                description: '菜单管理菜单',
                createTime: '2026-01-03'
            }
        ]
    },
    {
        id: 2,
        menuName: '内容管理',
        menuCode: 'content',
        parentId: 0,
        icon: 'Document',
        path: '/content',
        component: 'Layout',
        sortOrder: 2,
        status: 1,
        menuType: 1,
        permission: 'content:view',
        description: '内容管理目录',
        createTime: '2026-01-04',
        children: [
            {
                id: 21,
                menuName: '文章管理',
                menuCode: 'content:article',
                parentId: 2,
                icon: 'Document',
                path: 'article',
                component: '/content/article/index',
                sortOrder: 1,
                status: 1,
                menuType: 2,
                permission: 'content:article:view',
                description: '文章管理菜单',
                createTime: '2026-01-04'
            }
        ]
    },
    {
        id: 3,
        menuName: '数据统计',
        menuCode: 'statistics',
        parentId: 0,
        icon: 'Chart',
        path: '/statistics',
        component: 'Layout',
        sortOrder: 3,
        status: 1,
        menuType: 1,
        permission: 'statistics:view',
        description: '数据统计目录',
        createTime: '2026-01-05',
        children: [
            {
                id: 31,
                menuName: '用户统计',
                menuCode: 'statistics:user',
                parentId: 3,
                icon: 'User',
                path: 'user',
                component: '/statistics/user/index',
                sortOrder: 1,
                status: 1,
                menuType: 2,
                permission: 'statistics:user:view',
                description: '用户统计菜单',
                createTime: '2026-01-05'
            }
        ]
    }
]

// 查询参数接口
export interface MenuQueryParams {
    menuName?: string
    menuType?: number
    status?: number
}

// 菜单服务类
class MenuService {
    // 获取菜单树
    getMenuTree(params: MenuQueryParams = {}): MockMenu[] {
        const { menuName, menuType, status } = params

        // 深拷贝菜单数据
        const cloneMenus = JSON.parse(JSON.stringify(menus)) as MockMenu[]

        // 筛选
        const filterMenu = (menuList: MockMenu[]): MockMenu[] => {
            return menuList.reduce((acc: MockMenu[], menu) => {
                let match = true

                if (menuName && !menu.menuName.includes(menuName)) {
                    match = false
                }
                if (menuType !== undefined && menu.menuType !== menuType) {
                    match = false
                }
                if (status !== undefined && menu.status !== status) {
                    match = false
                }

                if (match) {
                    acc.push(menu)
                } else if (menu.children) {
                    const filteredChildren = filterMenu(menu.children)
                    if (filteredChildren.length > 0) {
                        acc.push({ ...menu, children: filteredChildren })
                    }
                }

                return acc
            }, [])
        }

        return filterMenu(cloneMenus)
    }

    // 获取所有菜单（扁平化）
    getAllMenusFlat(): MockMenu[] {
        const flatten = (menuList: MockMenu[]): MockMenu[] => {
            let result: MockMenu[] = []
            menuList.forEach(menu => {
                result.push(menu)
                if (menu.children) {
                    result = result.concat(flatten(menu.children))
                }
            })
            return result
        }
        return flatten(menus)
    }

    // 根据ID获取菜单
    getMenuById(id: number): MockMenu | undefined {
        const flatMenus = this.getAllMenusFlat()
        return flatMenus.find(menu => menu.id === id)
    }

    // 添加菜单
    addMenu(menu: Omit<MockMenu, 'id' | 'createTime'>): MockMenu {
        const flatMenus = this.getAllMenusFlat()
        const newId = Math.max(...flatMenus.map(m => m.id)) + 1
        const newMenu: MockMenu = {
            ...menu,
            id: newId,
            createTime: '2026-01-01'
        }

        if (menu.parentId === 0) {
            // 顶级菜单
            menus.push(newMenu)
        } else {
            // 子菜单
            const addToTree = (menuList: MockMenu[], parentId: number, newItem: MockMenu): boolean => {
                for (let i = 0; i < menuList.length; i++) {
                    if (menuList[i].id === parentId) {
                        if (!menuList[i].children) {
                            menuList[i].children = []
                        }
                        menuList[i].children!.push(newItem)
                        return true
                    }
                    if (menuList[i].children && addToTree(menuList[i].children!, parentId, newItem)) {
                        return true
                    }
                }
                return false
            }

            if (!addToTree(menus, menu.parentId, newMenu)) {
                throw new Error(`Parent menu with id ${menu.parentId} not found`)
            }
        }

        return newMenu
    }

    // 更新菜单
    updateMenu(id: number, updates: Partial<MockMenu>): MockMenu | null {
        const updateInTree = (menuList: MockMenu[], id: number, updates: Partial<MockMenu>): boolean => {
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].id === id) {
                    menuList[i] = { ...menuList[i], ...updates }
                    return true
                }
                if (menuList[i].children && updateInTree(menuList[i].children!, id, updates)) {
                    return true
                }
            }
            return false
        }

        if (updateInTree(menus, id, updates)) {
            return this.getMenuById(id) || null
        }
        return null
    }

    // 删除菜单
    deleteMenu(id: number): boolean {
        const deleteFromTree = (menuList: MockMenu[], id: number): boolean => {
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].id === id) {
                    menuList.splice(i, 1)
                    return true
                }
                if (menuList[i].children && deleteFromTree(menuList[i].children!, id)) {
                    return true
                }
            }
            return false
        }

        return deleteFromTree(menus, id)
    }

    // 获取父级菜单选项（用于下拉选择）
    getParentMenuOptions(): { label: string; value: number }[] {
        const options: { label: string; value: number }[] = [{ label: '顶级菜单', value: 0 }]
        const flatMenus = this.getAllMenusFlat()

        flatMenus.forEach(menu => {
            if (menu.menuType === 1) {
                options.push({ label: menu.menuName, value: menu.id })
            }
        })

        return options
    }
}

// 导出单例实例
export const menuService = new MenuService()
export default menus