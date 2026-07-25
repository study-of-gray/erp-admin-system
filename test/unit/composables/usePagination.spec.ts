import { describe, it, expect } from 'vitest'
import { usePagination } from '@/composables/usePagination' // 使用 @ 别名

describe('usePagination', () => {
    it('should initialize with default values', () => {
        const { pagination, total } = usePagination()
        expect(pagination.pageNum).toBe(1)
        expect(pagination.pageSize).toBe(20)
        expect(total.value).toBe(0)
    })

    it('should reset pageNum to 1 when pageSize changes', () => {
        const { pagination, handleSizeChange } = usePagination()
        pagination.pageNum = 5
        handleSizeChange(50)
        expect(pagination.pageNum).toBe(1)
    })
})