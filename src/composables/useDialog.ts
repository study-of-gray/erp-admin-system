import { ref } from 'vue'

export function useDialog(initialState = false) {
    const visible = ref(initialState)
    const isEdit = ref(false)

    const open = (editMode = false) => {
        isEdit.value = editMode
        visible.value = true
    }

    const close = () => {
        visible.value = false
        isEdit.value = false
    }

    const toggle = () => {
        visible.value = !visible.value
    }

    const reset = () => {
        visible.value = initialState
        isEdit.value = false
    }

    return {
        visible,
        isEdit,
        open,
        close,
        toggle,
        reset
    }
}