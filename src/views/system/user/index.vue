<script setup lang="ts">
  import { ref, h, onMounted } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import QueryForm from '@/components/QueryForm.vue'
  import type { UserQueryParams, UserFormParams, SysUserItem } from '@/types/system/user'
  import { msgSuccess } from '@/utils/message'
  import { usePagination } from '@/composables/usePagination'
  import { useDialog } from '@/composables/useDialog'

  // 查询表单配置
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

  // Hooks
  const { pagination, total, handlePageChange, handleSizeChange, resetPagination } = usePagination()
  const { visible, isEdit, open, close } = useDialog()

  // ===== 核心：纯前端假数据 =====
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
    },
    {
      id: 6,
      username: 'test01',
      nickname: '测试用户1',
      role: 'viewer',
      phone: '13800138005',
      email: 'test01@erp.com',
      status: 1,
      createTime: '2026-01-06'
    },
    {
      id: 7,
      username: 'test02',
      nickname: '测试用户2',
      role: 'editor',
      phone: '13800138006',
      email: 'test02@erp.com',
      status: 0,
      createTime: '2026-01-07'
    },
    {
      id: 8,
      username: 'dev01',
      nickname: '开发用户1',
      role: 'admin',
      phone: '13800138007',
      email: 'dev01@erp.com',
      status: 1,
      createTime: '2026-01-08'
    },
    {
      id: 9,
      username: 'ops01',
      nickname: '运维用户1',
      role: 'admin',
      phone: '13800138008',
      email: 'ops01@erp.com',
      status: 1,
      createTime: '2026-01-09'
    },
    {
      id: 10,
      username: 'qa01',
      nickname: '测试用户1',
      role: 'viewer',
      phone: '13800138009',
      email: 'qa01@erp.com',
      status: 1,
      createTime: '2026-01-10'
    }
  ])

  // 初始化总数（关键！）
  total.value = tableData.value.length

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

  // 查询（前端过滤）
  const handleSearch = (formData: Record<string, any>) => {
    const { username, status } = formData
    let filtered = [...tableData.value]

    if (username) {
      filtered = filtered.filter(item => item.username.includes(username))
    }
    if (status !== undefined && status !== '') {
      filtered = filtered.filter(item => item.status === status)
    }

    tableData.value = filtered
    total.value = filtered.length
    resetPagination()
  }

  // 重置
  const handleReset = () => {
    // 恢复原始数据
    tableData.value = [
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
      },
      {
        id: 6,
        username: 'test01',
        nickname: '测试用户1',
        role: 'viewer',
        phone: '13800138005',
        email: 'test01@erp.com',
        status: 1,
        createTime: '2026-01-06'
      },
      {
        id: 7,
        username: 'test02',
        nickname: '测试用户2',
        role: 'editor',
        phone: '13800138006',
        email: 'test02@erp.com',
        status: 0,
        createTime: '2026-01-07'
      },
      {
        id: 8,
        username: 'dev01',
        nickname: '开发用户1',
        role: 'admin',
        phone: '13800138007',
        email: 'dev01@erp.com',
        status: 1,
        createTime: '2026-01-08'
      },
      {
        id: 9,
        username: 'ops01',
        nickname: '运维用户1',
        role: 'admin',
        phone: '13800138008',
        email: 'ops01@erp.com',
        status: 1,
        createTime: '2026-01-09'
      },
      {
        id: 10,
        username: 'qa01',
        nickname: '测试用户1',
        role: 'viewer',
        phone: '13800138009',
        email: 'qa01@erp.com',
        status: 1,
        createTime: '2026-01-10'
      }
    ]
    total.value = tableData.value.length
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
      tableData.value = tableData.value.filter(item => item.id !== id)
      total.value = tableData.value.length
      msgSuccess('删除成功')
    } catch {
      // 取消删除
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (isEdit.value) {
      // 编辑
      const index = tableData.value.findIndex(item => item.id === formData.value.id)
      if (index > -1) {
        tableData.value[index] = { ...formData.value } as SysUserItem
      }
      msgSuccess('编辑成功')
    } else {
      // 新增
      const newId = Math.max(...tableData.value.map(item => item.id)) + 1
      tableData.value.unshift({
        ...formData.value,
        id: newId,
        createTime: new Date().toLocaleDateString()
      } as SysUserItem)
      total.value = tableData.value.length
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

    <!-- 使用普通 el-table 替代 VirtualTable（更简单稳定） -->
    <el-table
      :data="
        tableData.slice(
          (pagination.pageNum - 1) * pagination.pageSize,
          pagination.pageNum * pagination.pageSize
        )
      "
      :height="500"
      :loading="false"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'"
          >
            {{ row.role === 'admin' ? '管理员' : row.role === 'editor' ? '编辑员' : '观察员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
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
</style>
