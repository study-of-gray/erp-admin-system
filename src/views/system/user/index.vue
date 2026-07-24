<script setup lang="ts">
  import { ref, reactive, h } from 'vue'
  import { ElInput, ElSelect, ElMessage, ElMessageBox } from 'element-plus'
  import QueryForm from '@/components/QueryForm.vue'
  import VirtualTable from '@/components/VirtualTable.vue'
  import type { Column } from 'element-plus'
  import type { UserQueryParams, UserFormParams, SysUserItem } from '@/types/system/user'
  import { http } from '@/utils/request'
  import { msgSuccess, msgError } from '@/utils/message'

  // 查询表单配置
  const formItems = [
    {
      type: 'input',
      prop: 'username',
      label: '用户名',
      placeholder: '请输入用户名'
    },
    {
      type: 'select',
      prop: 'status',
      label: '状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    {
      type: 'daterange',
      prop: 'createTime',
      label: '创建时间'
    }
  ]

  // 查询参数
  const queryParams = reactive<UserQueryParams>({
    pageNum: 1,
    pageSize: 20
  })

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
      cellRenderer: ({ rowData }) => {
        // 纯h()函数写法，无JSX
        return h(
          'span',
          {
            style: {
              color: rowData.status === 1 ? '#67c23a' : '#f56c6c'
            }
          },
          rowData.status === 1 ? '启用' : '禁用'
        )
      }
    },
    { key: 'createTime', title: '创建时间', width: 180 },
    {
      key: 'operation',
      title: '操作',
      width: 200,
      cellRenderer: ({ rowData }) => {
        // 纯h()函数写法，无JSX
        const buttons = [
          h(
            'button',
            {
              style: {
                marginRight: '8px',
                padding: '4px 8px',
                backgroundColor: 'var(--el-color-primary-light-9)',
                color: 'var(--el-color-primary)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              },
              onClick: () => handleEdit(rowData)
            },
            '编辑'
          )
        ]

        // 根据权限添加删除按钮
        if (rowData.role === 'admin') {
          buttons.push(
            h(
              'button',
              {
                style: {
                  padding: '4px 8px',
                  backgroundColor: 'var(--el-color-danger-light-9)',
                  color: 'var(--el-color-danger)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                },
                onClick: () => handleDelete(rowData.id)
              },
              '删除'
            )
          )
        }

        return h('div', { style: { display: 'flex' } }, buttons)
      }
    }
  ])

  // 表格引用
  const tableRef = ref<InstanceType<typeof VirtualTable>>()
  const dialogVisible = ref(false)
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
  const isEdit = ref(false)

  // 查询
  const handleSearch = (formData: Record<string, any>) => {
    Object.assign(queryParams, formData)
    tableRef.value?.refresh(queryParams)
  }

  // 重置
  const handleReset = () => {
    Object.keys(queryParams).forEach(key => {
      if (key !== 'pageNum' && key !== 'pageSize') {
        delete queryParams[key as keyof UserQueryParams]
      }
    })
    tableRef.value?.refresh(queryParams)
  }

  // 新增
  const handleAdd = () => {
    isEdit.value = false
    formData.value = {
      username: '',
      nickname: '',
      password: '',
      role: 'viewer',
      phone: '',
      email: '',
      status: 1
    }
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row: SysUserItem) => {
    isEdit.value = true
    formData.value = {
      id: row.id,
      username: row.username,
      nickname: row.nickname,
      role: row.role,
      phone: row.phone,
      email: row.email,
      status: row.status
    }
    dialogVisible.value = true
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('确认删除该用户吗？', '提示', { type: 'warning' })
      await http.delete('/system/user/delete', { id })
      msgSuccess('删除成功')
      tableRef.value?.refresh(queryParams)
    } catch (err) {
      // 用户取消或接口错误，已在拦截器处理
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      await formRef.value?.validate()
      await http.post('/system/user/save', formData.value)
      msgSuccess(isEdit.value ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      tableRef.value?.refresh(queryParams)
    } catch (err) {
      // 校验失败或接口错误，已在拦截器处理
    }
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
      :loading="tableRef?.loading || false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <VirtualTable
      ref="tableRef"
      :columns="tableColumns"
      api="/system/user/list"
      :default-page-params="queryParams"
      :height="500"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="{
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          password: isEdit ? [] : [{ required: true, message: '请输入密码', trigger: 'blur' }]
        }"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <ElInput v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <ElInput v-model="formData.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <ElSelect v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <ElOption label="管理员" value="admin" />
            <ElOption label="编辑者" value="editor" />
            <ElOption label="查看者" value="viewer" />
          </ElSelect>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <ElInput v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <ElInput v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <ElOption label="启用" :value="1" />
            <ElOption label="禁用" :value="0" />
          </ElSelect>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .user-management {
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }

    .operation-btns {
      button {
        margin-right: 8px;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;

        &.btn-edit {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }

        &.btn-delete {
          background-color: var(--el-color-danger-light-9);
          color: var(--el-color-danger);
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
