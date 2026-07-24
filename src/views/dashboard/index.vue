<!-- src/views/dashboard/index.vue 修正版 -->
<script setup lang="ts">
  import { ref, h } from 'vue'
  import QueryForm from '@/components/QueryForm.vue'
  import VirtualTable from '@/components/VirtualTable.vue'
  import type { Column } from 'element-plus'
  import { msgInfo } from '@/utils/message'

  // 查询表单配置
  const formItems = ref([
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
  ])

  // 表格列配置 - 使用 h() 替代 JSX
  const tableColumns = ref<Column[]>([
    {
      key: 'id',
      title: 'ID',
      width: 80,
      sortable: true
    },
    {
      key: 'username',
      title: '用户名',
      width: 120,
      sortable: true
    },
    {
      key: 'role',
      title: '角色',
      width: 120
    },
    {
      key: 'createTime',
      title: '创建时间',
      width: 180
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      cellRenderer: ({ rowData }) => h('span', null, rowData.status === 1 ? '启用' : '禁用')
    },
    {
      key: 'operation',
      title: '操作',
      width: 150,
      cellRenderer: ({ rowData }) =>
        h('div', null, [
          h(
            'button',
            {
              onClick: () => msgInfo(`查看${rowData.username}`)
            },
            '查看'
          ),
          h(
            'button',
            {
              onClick: () => msgInfo(`编辑${rowData.username}`)
            },
            '编辑'
          )
        ])
    }
  ])

  // 模拟表格数据
  const mockTableData = ref(
    Array.from({ length: 200 }).map((_, index) => ({
      id: index + 1,
      username: `user${index + 1}`,
      role: index % 3 === 0 ? '管理员' : '普通用户',
      createTime: '2026-07-24 16:00:00',
      status: index % 2
    }))
  )

  const tableLoading = ref(false)

  const handleSearch = (formData: Record<string, any>): void => {
    msgInfo(`查询参数：${JSON.stringify(formData)}`)
    tableLoading.value = true
    setTimeout(() => {
      tableLoading.value = false
    }, 1000)
  }

  const handleReset = (): void => {
    msgInfo('重置查询条件')
  }
</script>

<template>
  <div class="dashboard-container">
    <h1>欢迎来到ERP控制台</h1>

    <QueryForm
      :form-items="formItems"
      :loading="tableLoading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <VirtualTable
      :columns="tableColumns"
      :data="mockTableData"
      :height="500"
      :loading="tableLoading"
    />
  </div>
</template>

<style scoped lang="scss">
  .dashboard-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f5f7fa;
  }

  h1 {
    margin-bottom: 24px;
    color: var(--el-text-color-primary);
  }
</style>
