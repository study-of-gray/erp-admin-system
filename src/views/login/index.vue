<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { msgWarning, msgSuccess } from '@/utils/message'

  const router = useRouter()
  const userStore = useUserStore()
  const loginForm = ref({
    username: '',
    password: ''
  })
  const loading = ref(false)

  const handleLogin = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
      msgWarning('请输入用户名和密码')
      return
    }

    loading.value = true
    try {
      await userStore.login(loginForm.value)
      msgSuccess('登录成功')
    } catch {
      // 错误已在store中处理
    } finally {
      loading.value = false
    }
  }
</script>
<!-- template部分保持不变 -->

<template>
  <div class="login-container">
    <div class="login-form">
      <h2>ERP管理系统</h2>
      <el-input v-model="loginForm.username" placeholder="用户名" class="form-item" />
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码"
        class="form-item"
        @keyup.enter="handleLogin"
      />
      <el-button type="primary" :loading="loading" class="form-item" @click="handleLogin">
        登录
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  /* 仅保留组件级作用域样式，具体样式在独立文件中定义 */
</style>
