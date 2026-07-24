<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { ElTableV2, ElEmpty } from 'element-plus'
  import type { Column, SortOrder } from 'element-plus'
  import { http } from '@/utils/request'
  import type { PageParams, PageResult } from '@/types/http'

  interface Props {
    /** 表格列配置 */
    columns: Column[]
    /** 接口地址，优先级高于data */
    api?: string
    /** 静态数据，优先级低于api */
    data?: any[]
    /** 表格高度 */
    height?: number
    /** 行高 */
    rowHeight?: number
    /** 是否开启分页 */
    pagination?: boolean
    /** 默认分页参数 */
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
    /** 数据加载完成回调 */
    (e: 'loaded', data: any[]): void
    /** 排序变化回调 */
    (e: 'sortChange', sort: { prop: string; order: SortOrder }): void
  }>()

  const tableData = ref<any[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(props.defaultPageParams.pageNum || 1)
  const pageSize = ref(props.defaultPageParams.pageSize || 20)
  const sortParams = ref<{ prop: string; order: SortOrder }>({ prop: '', order: 'ascending' })

  // 加载表格数据
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

  // 排序变化处理
  const handleSortChange = (sort: { prop: string; order: SortOrder }): void => {
    sortParams.value = sort
    currentPage.value = 1
    loadData()
    emit('sortChange', sort)
  }

  // 页码变化处理
  const handlePageChange = (page: number): void => {
    currentPage.value = page
    loadData()
  }

  // 对外暴露刷新方法
  const refresh = (params?: Record<string, any>): void => {
    currentPage.value = 1
    loadData(params)
  }

  onMounted(() => {
    loadData()
  })

  defineExpose({
    refresh,
    loadData
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
      :sort-by="sortParams"
      @sort-change="handleSortChange"
    >
      <template #empty>
        <ElEmpty description="暂无数据" />
      </template>
    </ElTableV2>

    <!-- 分页器 -->
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
  .virtual-table {
    background-color: #fff;
    padding: 16px;
    border-radius: 4px;

    .table-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-light);
    }
  }

  /* 响应式适配：768px以下分页器左对齐 */
  @media screen and (max-width: 768px) {
    .virtual-table {
      padding: 12px;

      .table-pagination {
        justify-content: flex-start;
      }
    }
  }
</style>
