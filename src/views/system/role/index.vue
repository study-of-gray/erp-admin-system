<script setup lang="ts">
  import { ref, h, onMounted } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import QueryForm from '@/components/QueryForm.vue'
  import type { RoleFormParams, SysRoleItem } from '@/types/system/role'
  import { msgSuccess } from '@/utils/message'
  import { usePagination } from '@/composables/usePagination'
  import { useDialog } from '@/composables/useDialog'
  import { roleService } from '@/mock' // 导入角色服务

  // 查询表单配置
  const formItems = [
    { type: 'input', prop: 'roleName', label: '角色名称', placeholder: '请输入角色名称' },
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

  // 表格数据
  const tableData = ref<SysRoleItem[]>([])

  // 权限选项
  const permissionOptions = [
    {
      label: '系统管理',
      value: 'system',
      children: [
        { label: '用户管理', value: 'system:user' },
        { label: '角色管理', value: 'system:role' },
        { label: '菜单管理', value: 'system:menu' }
      ]
    },
    {
      label: '内容管理',
      value: 'content',
      children: [
        { label: '文章管理', value: 'content:article' },
        { label: '分类管理', value: 'content:category' }
      ]
    }
  ]

  // 表单数据
  const formRef = ref()
  const formData = ref<RoleFormParams>({
    roleName: '',
    roleCode: '',
    description: '',
    status: 1,
    permissions: []
  })

  // 权限分配弹窗
  const permissionVisible = ref(false)
  const currentRole = ref<SysRoleItem | null>(null)
  const selectedPermissions = ref<string[]>([])

  // 加载数据
  const loadData = () => {
    const params = {
      roleName: '',
      status: undefined,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const result = roleService.getRoles(params)

    tableData.value = result.list as unknown as SysRoleItem[]
    total.value = result.total
  }

  // 初始化加载
  onMounted(() => {
    loadData()
  })

  // 查询
  const handleSearch = (formData: Record<string, any>) => {
    const params = {
      roleName: formData.roleName || '',
      status: formData.status,
      pageNum: 1,
      pageSize: pagination.pageSize
    }

    const result = roleService.getRoles(params)
    tableData.value = result.list as unknown as SysRoleItem[]
    total.value = result.total
    pagination.pageNum = 1
  }

  // 重置
  const handleReset = () => {
    loadData()
    pagination.pageNum = 1
  }

  // 新增
  const handleAdd = () => {
    open(false)
    formData.value = {
      roleName: '',
      roleCode: '',
      description: '',
      status: 1,
      permissions: []
    }
  }

  // 编辑
  const handleEdit = (row: SysRoleItem) => {
    open(true)
    formData.value = {
      ...row,
      permissions: [...row.permissions]
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('确认删除该角色吗？', '提示', { type: 'warning' })
      roleService.deleteRole(id)
      msgSuccess('删除成功')
      loadData()
    } catch {
      // 取消删除
    }
  }

  // 分配权限
  const handleAssignPermission = (row: SysRoleItem) => {
    currentRole.value = row
    selectedPermissions.value = [...row.permissions]
    permissionVisible.value = true
  }

  // 保存权限
  const savePermissions = () => {
    if (currentRole.value) {
      roleService.updateRolePermissions(currentRole.value.id, selectedPermissions.value)
      msgSuccess('权限分配成功')
      permissionVisible.value = false
      loadData()
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (isEdit.value) {
      // 编辑
      roleService.updateRole(formData.value.id!, {
        roleName: formData.value.roleName,
        roleCode: formData.value.roleCode,
        description: formData.value.description,
        status: formData.value.status,
        permissions: formData.value.permissions
      })
      msgSuccess('编辑成功')
    } else {
      // 新增
      roleService.addRole({
        roleName: formData.value.roleName,
        roleCode: formData.value.roleCode,
        description: formData.value.description,
        status: formData.value.status,
        permissions: formData.value.permissions
      })
      msgSuccess('新增成功')
    }
    close()
    loadData()
  }
</script>

<template>
  <div class="role-management">
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
    </div>

    <QueryForm
      :form-items="formItems"
      :loading="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 角色表格 -->
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
      <el-table-column prop="roleName" label="角色名称" width="150" />
      <el-table-column prop="roleCode" label="角色编码" width="180" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="permissions" label="权限数量" width="100">
        <template #default="{ row }">
          <el-tag type="info">{{ row.permissions.length }}</el-tag>
        </template>
      </el-table-column>
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
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link @click="handleAssignPermission(row)">分配权限</el-button>
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

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="visible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="500px"
      @close="close"
    >
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="formData.roleCode" placeholder="自动生成或手动输入" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
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

    <!-- 分配权限弹窗 -->
    <el-dialog
      v-model="permissionVisible"
      title="分配权限"
      width="600px"
      @close="permissionVisible = false"
    >
      <div v-if="currentRole" class="permission-assign">
        <div class="current-role">
          <strong>当前角色：</strong>
          {{ currentRole.roleName }} ({{ currentRole.roleCode }})
        </div>
        <div class="permission-tree">
          <el-tree
            :data="permissionOptions"
            show-checkbox
            node-key="value"
            :default-checked-keys="selectedPermissions"
            @check="(_, data) => (selectedPermissions = data.checkedKeys)"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
  .role-management {
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
  .permission-assign {
    max-height: 400px;
    overflow-y: auto;
  }
  .current-role {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
  .permission-tree {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
  }
</style>
