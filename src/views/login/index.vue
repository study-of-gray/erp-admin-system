<!-- src/views/login/index.vue 最终版 -->
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { msgWarning } from '@/utils/message'
  import { UserFilled, Lock } from '@element-plus/icons-vue'

  const router = useRouter()
  const userStore = useUserStore()
  const loginForm = ref({
    username: '',
    password: '',
    role: 'admin' // 临时角色选择，方便测试
  })
  const loading = ref(false)

  const handleLogin = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
      msgWarning('请输入用户名和密码')
      return
    }

    loading.value = true
    try {
      await userStore.login({
        username: loginForm.value.username,
        password: loginForm.value.password,
        role: loginForm.value.role
      })
      // 登录成功后，路由守卫会自动处理跳转
    } catch {
      // 错误已在store中处理
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h2>ERP管理系统</h2>
      <el-input
        v-model="loginForm.username"
        placeholder="用户名"
        class="form-item"
        :prefix-icon="UserFilled"
      />
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码"
        class="form-item"
        :prefix-icon="Lock"
        @keyup.enter="handleLogin"
      />
      <el-select v-model="loginForm.role" placeholder="选择测试角色" class="form-item">
        <el-option label="管理员（admin）" value="admin" />
        <el-option label="编辑者（editor）" value="editor" />
        <el-option label="查看者（viewer）" value="viewer" />
      </el-select>
      <el-button type="primary" :loading="loading" class="form-item" @click="handleLogin">
        登录
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
