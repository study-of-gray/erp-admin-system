// test/unit/composables/useDialog.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useDialog } from '@/composables/useDialog'

describe('useDialog', () => {
    // 每个测试前重置状态
    let dialog: ReturnType<typeof useDialog>

    beforeEach(() => {
        // 默认初始化
        dialog = useDialog()
    })

    it('should initialize with default values', () => {
        expect(dialog.visible.value).toBe(false)
        expect(dialog.isEdit.value).toBe(false)
    })

    it('should initialize with custom initial state', () => {
        const customDialog = useDialog(true)
        expect(customDialog.visible.value).toBe(true)
        expect(customDialog.isEdit.value).toBe(false)
    })

    describe('open method', () => {
        it('should open dialog in non-edit mode by default', () => {
            dialog.open()
            expect(dialog.visible.value).toBe(true)
            expect(dialog.isEdit.value).toBe(false)
        })

        it('should open dialog in edit mode when specified', () => {
            dialog.open(true)
            expect(dialog.visible.value).toBe(true)
            expect(dialog.isEdit.value).toBe(true)
        })

        it('should preserve edit mode when reopening', () => {
            dialog.open(true)
            dialog.close()
            dialog.open(false)
            expect(dialog.isEdit.value).toBe(false)
        })
    })

    describe('close method', () => {
        it('should close dialog and reset edit mode', () => {
            dialog.open(true)
            dialog.close()
            expect(dialog.visible.value).toBe(false)
            expect(dialog.isEdit.value).toBe(false)
        })

        it('should handle closing already closed dialog', () => {
            dialog.close()
            expect(dialog.visible.value).toBe(false)
            expect(dialog.isEdit.value).toBe(false)
        })
    })

    describe('toggle method', () => {
        it('should toggle dialog visibility on', () => {
            dialog.toggle()
            expect(dialog.visible.value).toBe(true)
        })

        it('should toggle dialog visibility off', () => {
            dialog.open()
            dialog.toggle()
            expect(dialog.visible.value).toBe(false)
        })

        it('should not affect edit mode when toggling', () => {
            dialog.open(true)
            dialog.toggle() // 关闭
            expect(dialog.isEdit.value).toBe(true) // 编辑模式应保持

            dialog.toggle() // 再次打开
            expect(dialog.isEdit.value).toBe(true) // 编辑模式仍保持
        })
    })

    describe('state consistency', () => {
        it('should maintain correct state during rapid open/close cycles', () => {
            dialog.open()
            dialog.close()
            dialog.open(true)
            dialog.close()
            dialog.open()

            expect(dialog.visible.value).toBe(true)
            expect(dialog.isEdit.value).toBe(false)
        })

        it('should handle multiple opens without closing', () => {
            dialog.open()
            dialog.open(true)
            dialog.open(false)

            expect(dialog.visible.value).toBe(true)
            expect(dialog.isEdit.value).toBe(false)
        })
    })
})