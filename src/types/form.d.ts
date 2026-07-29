import type { FormItemType } from 'element-plus'

export interface FormItem {
    type: FormItemType
    prop: string
    label: string
    placeholder?: string
    options?: Array<{
        label: string
        value: string | number | boolean
    }>
    disabled?: boolean
    [key: string]: any
}