<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-4">用户Store持久化测试</h2>
    
    <div class="space-y-4">
      <div class="bg-gray-100 p-4 rounded">
        <h3 class="font-semibold">当前用户信息：</h3>
        <pre class="text-sm mt-2">{{ JSON.stringify(userStore.userInfo, null, 2) || '未登录' }}</pre>
      </div>
      
      <div class="bg-gray-100 p-4 rounded">
        <h3 class="font-semibold">当前Token：</h3>
        <p class="text-sm mt-2 break-all">{{ userStore.userToken || '无Token' }}</p>
      </div>
      
      <div class="bg-gray-100 p-4 rounded">
        <h3 class="font-semibold">当前Refresh Token：</h3>
        <p class="text-sm mt-2 break-all">{{ userStore.refreshToken || '无Refresh Token' }}</p>
      </div>
      
      <div class="space-x-4">
        <el-button type="primary" @click="simulateLogin">模拟登录</el-button>
        <el-button type="danger" @click="userStore.logout">退出登录</el-button>
        <el-button @click="refreshPage">刷新页面</el-button>
      </div>
      
      <div class="text-sm text-gray-600">
        <p>操作说明：</p>
        <ul class="list-disc list-inside mt-2">
          <li>点击"模拟登录"设置测试数据</li>
          <li>点击"刷新页面"验证数据是否持久化</li>
          <li>点击"退出登录"清除所有数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const simulateLogin = () => {
  try {
    const testData = {
      user: {
        id: 1,
        username: 'testuser',
        name: '测试用户',
        email: 'test@example.com',
        data_permission: 'all'
      },
      token: 'test-token-' + Date.now(),
      refreshToken: 'test-refresh-token-' + Date.now()
    }
    
    userStore.setUserInfo(testData)
    console.log('模拟登录数据已设置')
  } catch (error) {
    // 静默处理错误
  } finally {
    // 重新加载页面以应用更改
    window.location.reload()
  }
}

const refreshPage = () => {
  window.location.reload()
}
</script>