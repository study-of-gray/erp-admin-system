<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { ElTableV2, ElEmpty } from 'element-plus'
  import type { Column } from 'element-plus'
  import { http } from '@/utils/request'
  import type { PageParams, PageResult } from '@/types/http'

  type SortOrder = 'ascending' | 'descending' | null

  interface Props {
    columns: Column[]
    api?: string
    data?: any[]
    height?: number
    rowHeight?: number
    pagination?: boolean
    defaultPageParams?: Partial<PageParams>
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 500,
    rowHeight: 48,
    pagination: true,
    defaultPageParams: () => ({
      pageNum: 1,
      pageSize: 20
    })
  })

  const emit = defineEmits<{
    (e: 'loaded', data: any[]): void
    (e: 'sortChange', sort: { prop: string; order: SortOrder }): void
  }>()

  // 暴露loading状态给父组件
  const loading = ref(false)
  const tableData = ref<any[]>([])
  const total = ref(0)
  const currentPage = ref(props.defaultPageParams.pageNum || 1)
  const pageSize = ref(props.defaultPageParams.pageSize || 20)
  const sortParams = ref<{ prop: string; order: SortOrder }>({ prop: '', order: 'ascending' })

  const loadData = async (queryParams: Record<string, any> = {}): Promise<void> => {
    if (!props.api) {
      tableData.value = props.data || []
      emit('loaded', tableData.value)
      return
    }

    loading.value = true
    try {
      const params: PageParams = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        ...queryParams,
        ...(sortParams.value.prop
          ? {
              sortField: sortParams.value.prop,
              sortOrder: sortParams.value.order === 'ascending' ? 'asc' : 'desc'
            }
          : {})
      }
      const res = await http.get<PageResult<any>>(props.api, params, { showLoading: true })
      tableData.value = res.list
      total.value = res.total
      emit('loaded', res.list)
    } catch (err) {
      // 错误已在request拦截器中处理
    } finally {
      loading.value = false
    }
  }

  const handleSortChange = (sort: { prop: string; order: SortOrder }): void => {
    sortParams.value = sort
    currentPage.value = 1
    loadData()
    emit('sortChange', sort)
  }

  const handlePageChange = (page: number): void => {
    currentPage.value = page
    loadData()
  }

  const refresh = (params?: Record<string, any>): void => {
    currentPage.value = 1
    loadData(params)
  }

  // 暴露方法给父组件
  defineExpose({
    refresh,
    loadData,
    loading // 新增：暴露loading状态
  })

  onMounted(() => {
    loadData()
  })
</script>

<template>
  <div class="virtual-table">
    <ElTableV2
      :columns="columns"
      :data="tableData"
      :width="0"
      :height="height"
      :row-height="rowHeight"
    >
      <template #empty>
        <ElEmpty description="暂无数据" />
      </template>
    </ElTableV2>

    <div v-if="pagination && total > 0" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  /* 原有样式保持不变 */
</style>
