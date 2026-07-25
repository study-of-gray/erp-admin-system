<script setup lang="ts">
  import { ref, h } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import QueryForm from '@/components/QueryForm.vue'
  import type { MenuFormParams, SysMenuItem } from '@/types/system/menu'
  import { msgSuccess } from '@/utils/message'
  import { usePagination } from '@/composables/usePagination'
  import { useDialog } from '@/composables/useDialog'
  import { MENU_TYPE_OPTIONS, ICON_OPTIONS } from '@/types/system/menu'

  // 查询表单配置
  const formItems = [
    { type: 'input', prop: 'menuName', label: '菜单名称', placeholder: '请输入菜单名称' },
    {
      type: 'select',
      prop: 'menuType',
      label: '菜单类型',
      options: MENU_TYPE_OPTIONS
    },
    {
      type: 'select',
      prop: 'status',
      label: '状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  ]

  // Hooks
  const { pagination, total, handlePageChange, handleSizeChange, resetPagination } = usePagination()
  const { visible, isEdit, open, close } = useDialog()

  // ===== 菜单数据（纯前端假数据，树形结构）=====
  const tableData = ref<SysMenuItem[]>([
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
  ])

  // 初始化总数（树形表格需要扁平化处理）
  const flattenData = (data: SysMenuItem[]): SysMenuItem[] => {
    const result: SysMenuItem[] = []
    const traverse = (items: SysMenuItem[]) => {
      items.forEach(item => {
        result.push(item)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    traverse(data)
    return result
  }
  total.value = flattenData(tableData.value).length

  // 表单数据
  const formRef = ref()
  const formData = ref<MenuFormParams>({
    menuName: '',
    menuCode: '',
    parentId: 0,
    icon: '',
    path: '',
    component: '',
    sortOrder: 0,
    status: 1,
    menuType: 1,
    permission: '',
    description: ''
  })

  // 查询（前端过滤）
  const handleSearch = (formData: Record<string, any>) => {
    const { menuName, menuType, status } = formData
    let filtered = [...tableData.value]

    if (menuName) {
      filtered = filterTree(filtered, item => item.menuName.includes(menuName))
    }
    if (menuType !== undefined && menuType !== '') {
      filtered = filterTree(filtered, item => item.menuType === menuType)
    }
    if (status !== undefined && status !== '') {
      filtered = filterTree(filtered, item => item.status === status)
    }

    tableData.value = filtered
    total.value = flattenData(filtered).length
    resetPagination()
  }

  // 树形过滤辅助函数
  const filterTree = (
    data: SysMenuItem[],
    predicate: (item: SysMenuItem) => boolean
  ): SysMenuItem[] => {
    return data.reduce((acc: SysMenuItem[], item) => {
      if (predicate(item)) {
        acc.push(item)
      } else if (item.children) {
        const filteredChildren = filterTree(item.children!, predicate)
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren })
        }
      }
      return acc
    }, [])
  }

  // 重置
  const handleReset = () => {
    // 恢复原始数据
    tableData.value = [
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
    total.value = flattenData(tableData.value).length
    resetPagination()
  }

  // 新增
  const handleAdd = (parentId: number = 0) => {
    open(false)
    formData.value = {
      menuName: '',
      menuCode: '',
      parentId,
      icon: '',
      path: '',
      component: '',
      sortOrder: 0,
      status: 1,
      menuType: 1,
      permission: '',
      description: ''
    }
  }

  // 编辑
  const handleEdit = (row: SysMenuItem) => {
    open(true)
    formData.value = { ...row }
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('确认删除该菜单吗？删除后子菜单也将被删除！', '提示', {
        type: 'warning'
      })
      // 递归删除
      const removeFromTree = (data: SysMenuItem[], id: number): SysMenuItem[] => {
        return data.reduce((acc: SysMenuItem[], item) => {
          if (item.id !== id) {
            const newItem = { ...item }
            if (newItem.children) {
              newItem.children = removeFromTree(newItem.children, id)
            }
            acc.push(newItem)
          }
          return acc
        }, [])
      }
      tableData.value = removeFromTree(tableData.value, id)
      total.value = flattenData(tableData.value).length
      msgSuccess('删除成功')
    } catch {
      // 取消删除
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (isEdit.value) {
      // 编辑
      const updateInTree = (
        data: SysMenuItem[],
        id: number,
        newData: MenuFormParams
      ): SysMenuItem[] => {
        return data.map(item => {
          if (item.id === id) {
            return { ...item, ...newData }
          }
          if (item.children) {
            return { ...item, children: updateInTree(item.children, id, newData) }
          }
          return item
        })
      }
      tableData.value = updateInTree(tableData.value, formData.value.id!, formData.value)
      msgSuccess('编辑成功')
    } else {
      // 新增
      const newId = Math.max(...flattenData(tableData.value).map(item => item.id)) + 1
      const newMenu: SysMenuItem = {
        ...formData.value,
        id: newId,
        createTime: new Date().toLocaleDateString()
      } as SysMenuItem

      if (formData.value.parentId === 0) {
        // 顶级菜单
        tableData.value.push(newMenu)
      } else {
        // 子菜单
        const addToTree = (
          data: SysMenuItem[],
          parentId: number,
          newItem: SysMenuItem
        ): SysMenuItem[] => {
          return data.map(item => {
            if (item.id === parentId) {
              return { ...item, children: [...(item.children || []), newItem] }
            }
            if (item.children) {
              return { ...item, children: addToTree(item.children, parentId, newItem) }
            }
            return item
          })
        }
        tableData.value = addToTree(tableData.value, formData.value.parentId, newMenu)
      }
      total.value = flattenData(tableData.value).length
      msgSuccess('新增成功')
    }
    close()
  }

  // 获取菜单类型标签
  const getMenuTypeTag = (type: number) => {
    const option = MENU_TYPE_OPTIONS.find(opt => opt.value === type)
    const typeMap: Record<number, string> = {
      1: 'primary',
      2: 'success',
      3: 'warning'
    }
    return { label: option?.label || '未知', type: typeMap[type] || 'info' }
  }
</script>

<template>
  <div class="menu-management">
    <div class="page-header">
      <h2>菜单管理</h2>
      <el-button type="primary" @click="handleAdd(0)">新增目录</el-button>
    </div>

    <QueryForm
      :form-items="formItems"
      :loading="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 菜单树形表格 -->
    <el-table
      :data="
        tableData.slice(
          (pagination.pageNum - 1) * pagination.pageSize,
          pagination.pageNum * pagination.pageSize
        )
      "
      :height="500"
      :loading="false"
      row-key="id"
      default-expand-all
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="menuName" label="菜单名称" width="200" />
      <el-table-column prop="menuCode" label="菜单编码" width="180" />
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由路径" min-width="180" />
      <el-table-column prop="component" label="组件路径" min-width="180" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column prop="menuType" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getMenuTypeTag(row.menuType).type">
            {{ getMenuTypeTag(row.menuType).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.menuType === 1" type="primary" link @click="handleAdd(row.id)">
            新增子项
          </el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑菜单弹窗 -->
    <el-dialog
      v-model="visible"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      width="600px"
      @close="close"
    >
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单编码" prop="menuCode">
          <el-input v-model="formData.menuCode" placeholder="如：system:user" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="formData.menuType" placeholder="请选择菜单类型">
            <el-option
              v-for="item in MENU_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-input v-model="formData.parentId" disabled placeholder="0表示顶级菜单" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="formData.icon" placeholder="请选择图标" clearable>
            <el-option
              v-for="item in ICON_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="formData.path" placeholder="如：/system/user" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="formData.component" placeholder="如：/system/user/index" />
        </el-form-item>
        <el-form-item label="排序号" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="formData.permission" placeholder="如：system:user:view" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入菜单描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
  .menu-management {
    padding: 20px;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
</style>
