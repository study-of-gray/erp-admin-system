<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from 'element-plus'
  import type { FormInstance } from 'element-plus'

  /** 表单项类型 */
  type FormItemType = 'input' | 'select' | 'date' | 'daterange'

  /** 表单项配置 */
  interface FormItem {
    type: FormItemType
    prop: string
    label: string
    placeholder?: string
    options?: Array<{ label: string; value: any }>
    clearable?: boolean
    style?: Record<string, any>
  }

  interface Props {
    /** 表单项配置 */
    formItems: FormItem[]
    /** 查询按钮加载状态 */
    loading?: boolean
    /** 表单列数，响应式适配 */
    colCount?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    colCount: 4
  })

  const emit = defineEmits<{
    /** 查询事件，返回表单值 */
    (e: 'search', formData: Record<string, any>): void
    /** 重置事件 */
    (e: 'reset'): void
  }>()

  const formRef = ref<FormInstance>()
  const formData = ref<Record<string, any>>({})

  // 初始化表单数据
  watch(
    () => props.formItems,
    items => {
      items.forEach(item => {
        if (!(item.prop in formData.value)) {
          formData.value[item.prop] = ''
        }
      })
    },
    { immediate: true, deep: true }
  )

  // 响应式列宽计算
  const colSpan = computed(() => {
    const baseSpan = 24 / props.colCount
    // 移动端适配：768px以下占满一行
    return baseSpan >= 6 ? baseSpan : 24
  })

  const handleSearch = (): void => {
    emit('search', { ...formData.value })
  }

  const handleReset = (): void => {
    formRef.value?.resetFields()
    formData.value = {}
    props.formItems.forEach(item => {
      formData.value[item.prop] = ''
    })
    emit('reset')
  }

  // 对外暴露重置方法
  defineExpose({
    reset: handleReset
  })
</script>

<template>
  <div class="query-form">
    <el-form ref="formRef" :model="formData" inline label-width="80px">
      <el-row :gutter="16">
        <el-col v-for="item in formItems" :key="item.prop" :span="colSpan" :style="item.style">
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- 输入框 -->
            <ElInput
              v-if="item.type === 'input'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              :clearable="item.clearable !== false"
              @keyup.enter="handleSearch"
            />
            <!-- 选择器 -->
            <ElSelect
              v-else-if="item.type === 'select'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              :clearable="item.clearable !== false"
              style="width: 100%"
            >
              <ElOption
                v-for="opt in item.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ElSelect>
            <!-- 日期选择器 -->
            <ElDatePicker
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              type="date"
              :placeholder="item.placeholder || `请选择${item.label}`"
              :clearable="item.clearable !== false"
              style="width: 100%"
            />
            <!-- 日期范围选择器 -->
            <ElDatePicker
              v-else-if="item.type === 'daterange'"
              v-model="formData[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="item.clearable !== false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan" class="form-buttons">
          <el-form-item>
            <ElButton type="primary" :loading="loading" @click="handleSearch">查询</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
  .query-form {
    background-color: #fff;
    padding: 20px 20px 0;
    border-radius: 4px;
    margin-bottom: 16px;

    .form-buttons {
      text-align: right;
    }
  }

  /* 响应式适配：768px以下调整布局 */
  @media screen and (max-width: 768px) {
    .query-form {
      padding: 16px 16px 0;

      .el-form--inline .el-form-item {
        width: 100%;
        margin-right: 0;
      }

      .form-buttons {
        text-align: left;
      }
    }
  }
</style>
