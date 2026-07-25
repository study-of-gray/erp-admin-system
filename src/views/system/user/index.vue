<script setup lang="ts">
  import { ref, h } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import QueryForm from '@/components/QueryForm.vue'
  import VirtualTable from '@/components/VirtualTable.vue'
  import type { Column } from 'element-plus'
  import type { UserQueryParams, UserFormParams, SysUserItem } from '@/types/system/user'
  import { msgSuccess } from '@/utils/message'
  import { usePagination } from '@/composables/usePagination'
  import { useDialog } from '@/composables/useDialog'

  // 查询表单配置（静态）
  const formItems = [
    { type: 'input', prop: 'username', label: '用户名', placeholder: '请输入用户名' },
    {
      type: 'select',
      prop: 'status',
      label: '状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    { type: 'daterange', prop: 'createTime', label: '创建时间' }
  ]

  // 分页逻辑（Hook复用，无请求依赖）
  const { pagination, total, handlePageChange, handleSizeChange, resetPagination } = usePagination()
  // 弹窗逻辑（Hook复用，无请求依赖）
  const { visible, isEdit, open, close } = useDialog()

  // 表格列配置
  const tableColumns = ref<Column[]>([
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'username', title: '用户名', width: 120 },
    { key: 'nickname', title: '昵称', width: 120 },
    { key: 'role', title: '角色', width: 100 },
    { key: 'phone', title: '手机号', width: 140 },
    { key: 'email', title: '邮箱', width: 180 },
    {
      key: 'status',
      title: '状态',
      width: 100,
      cellRenderer: ({ rowData }) =>
        h(
          'span',
          { style: { color: rowData.status === 1 ? '#67c23a' : '#f56c6c' } },
          rowData.status === 1 ? '启用' : '禁用'
        )
    },
    { key: 'createTime', title: '创建时间', width: 180 },
    {
      key: 'operation',
      title: '操作',
      width: 200,
      cellRenderer: ({ rowData }) =>
        h('div', { class: 'operation-btns' }, [
          h('button', { class: 'btn-edit', onClick: () => handleEdit(rowData) }, '编辑'),
          h('button', { class: 'btn-delete', onClick: () => handleDelete(rowData.id) }, '删除')
        ])
    }
  ])

  // ===== 硬编码假数据（零依赖，绝对不报错）=====
  const tableData = ref<SysUserItem[]>([
    {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      role: 'admin',
      phone: '13800138000',
      email: 'admin@erp.com',
      status: 1,
      createTime: '2026-01-01'
    },
    {
      id: 2,
      username: 'editor',
      nickname: '编辑员',
      role: 'editor',
      phone: '13800138001',
      email: 'editor@erp.com',
      status: 1,
      createTime: '2026-01-02'
    },
    {
      id: 3,
      username: 'viewer',
      nickname: '观察员',
      role: 'viewer',
      phone: '13800138002',
      email: 'viewer@erp.com',
      status: 0,
      createTime: '2026-01-03'
    },
    {
      id: 4,
      username: 'user01',
      nickname: '业务用户1',
      role: 'viewer',
      phone: '13800138003',
      email: 'user01@erp.com',
      status: 1,
      createTime: '2026-01-04'
    },
    {
      id: 5,
      username: 'user02',
      nickname: '业务用户2',
      role: 'editor',
      phone: '13800138004',
      email: 'user02@erp.com',
      status: 1,
      createTime: '2026-01-05'
    }
  ])
  // 总条数写死，分页组件可正常交互
  total.value = 5
  // ============================================

  // 表单数据
  const formRef = ref()
  const formData = ref<UserFormParams>({
    username: '',
    nickname: '',
    password: '',
    role: 'viewer',
    phone: '',
    email: '',
    status: 1
  })

  // 查询（仅重置分页，无请求）
  const handleSearch = () => {
    resetPagination()
  }

  // 重置（无请求）
  const handleReset = () => {
    resetPagination()
  }

  // 新增
  const handleAdd = () => {
    open(false)
    formData.value = {
      username: '',
      nickname: '',
      password: '',
      role: 'viewer',
      phone: '',
      email: '',
      status: 1
    }
  }

  // 编辑
  const handleEdit = (row: SysUserItem) => {
    open(true)
    formData.value = { ...row }
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('确认删除该用户吗？', '提示', { type: 'warning' })
      // 仅前端删除假数据，无请求
      tableData.value = tableData.value.filter(item => item.id !== id)
      total.value--
      msgSuccess('删除成功')
    } catch {
      // 取消删除，静默处理
    }
  }

  // 提交表单（仅前端更新假数据，无请求）
  const handleSubmit = async () => {
    if (isEdit.value) {
      // 编辑：更新假数据
      const index = tableData.value.findIndex(item => item.id === formData.value.id)
      if (index > -1) tableData.value[index] = { ...formData.value } as SysUserItem
      msgSuccess('编辑成功')
    } else {
      // 新增：插入假数据
      const newId = Math.max(...tableData.value.map(item => item.id)) + 1
      tableData.value.unshift({
        ...formData.value,
        id: newId,
        createTime: new Date().toLocaleDateString()
      } as SysUserItem)
      total.value++
      msgSuccess('新增成功')
    }
    close()
  }
</script>

<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>

    <QueryForm
      :form-items="formItems"
      :loading="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <VirtualTable
      ref="tableRef"
      :columns="tableColumns"
      :data="tableData"
      :height="500"
      :loading="false"
    />

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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="visible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
      @close="close"
    >
      <el-form ref="formRef" :model="formData" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑员" value="editor" />
            <el-option label="观察员" value="viewer" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
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
  .user-management {
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
  .operation-btns {
    display: flex;
    gap: 8px;
  }
  .btn-edit,
  .btn-delete {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .btn-edit {
    color: #409eff;
  }
  .btn-edit:hover {
    background: #ecf5ff;
  }
  .btn-delete {
    color: #f56c6c;
  }
  .btn-delete:hover {
    background: #fef0f0;
  }
</style>
