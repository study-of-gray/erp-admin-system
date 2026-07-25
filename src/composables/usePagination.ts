// src/composables/usePagination.ts
import { reactive, ref } from 'vue'
import type { PageParams } from '@/types/http'

export function usePagination(defaultPageSize = 20) {
    const pagination = reactive<PageParams>({
        pageNum: 1,
        pageSize: defaultPageSize
    })

    const total = ref(0)
    const loading = ref(false)

    const handlePageChange = (page: number) => {
        pagination.pageNum = page
    }

    const handleSizeChange = (size: number) => {
        pagination.pageSize = size
        pagination.pageNum = 1
    }

    const resetPagination = () => {
        pagination.pageNum = 1
        pagination.pageSize = defaultPageSize
    }

    return {
        pagination,
        total,
        loading,
        handlePageChange,
        handleSizeChange,
        resetPagination
    }
}