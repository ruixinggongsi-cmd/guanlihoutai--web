<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/20 to-success/20 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/10 to-danger/10 rounded-full filter blur-2xl animate-pulse"></div>
    </div>
    
    <!-- 粒子效果背景 -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
    
    <!-- 主内容区 -->
    <div class="relative z-10 w-full max-w-md px-4">
      <!-- Logo区域 -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg mb-4 animate-glow">
          <i class="fas fa-shield-alt text-3xl text-white"></i>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          管理系统
        </h1>
        <p class="text-gray-300 text-sm">安全登录，保护您的数据</p>
      </div>
      
      <!-- 登录卡片 - 玻璃拟态效果 -->
      <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-slide-up">
        <!-- 卡片头部 -->
        <div class="bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-sm text-white text-center py-6 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <h2 class="text-xl font-semibold relative z-10">
            <i class="fas fa-sign-in-alt mr-2"></i>
            欢迎回来
          </h2>
          <p class="text-sm opacity-80 mt-1">请输入您的登录信息</p>
          <div v-if="errorMessage" class="mt-2 text-sm text-red-200 bg-red-500/20 rounded-lg px-3 py-1 inline-block">
            <i class="fas fa-exclamation-circle mr-1"></i>{{ errorMessage }}
          </div>
        </div>
        
        <!-- 表单区域 -->
        <div class="p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- 用户名输入 -->
            <div class="animate-slide-up">
              <label class="block text-sm font-medium text-gray-400 mb-2" for="username">
                <i class="fas fa-user mr-2 text-primary"></i>用户名
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-user text-gray-400 group-focus-within:text-primary transition-colors"></i>
                </div>
                <input
                  type="text"
                  class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 backdrop-blur-sm"
                  id="username"
                  v-model="username"
                  placeholder="请输入用户名"
                  required
                  autocomplete="username"
                />
              </div>
            </div>
            
            <!-- 密码输入 -->
            <div class="animate-slide-up" style="animation-delay: 0.1s;">
              <label class="block text-sm font-medium text-gray-400 mb-2" for="password">
                <i class="fas fa-lock mr-2 text-secondary"></i>密码
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-lock text-gray-400 group-focus-within:text-secondary transition-colors"></i>
                </div>
                <input
                  type="password"
                  class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 backdrop-blur-sm"
                  id="password"
                  v-model="password"
                  placeholder="请输入密码"
                  required
                  autocomplete="current-password"
                />
              </div>
            </div>
            
            <!-- 记住我和忘记密码 -->
            <div class="flex items-center justify-between animate-slide-up" style="animation-delay: 0.2s;">
              <div class="flex items-center">
                <input
                  class="h-4 w-4 text-primary bg-white/5 border-white/20 rounded focus:ring-primary/20 focus:ring-2 transition-all"
                  type="checkbox"
                  id="rememberMe"
                  v-model="rememberMe"
                />
                <label class="ml-2 block text-sm text-gray-400" for="rememberMe">记住我</label>
              </div>
              <a class="text-sm font-medium text-primary hover:text-primary-light transition-colors duration-300" href="#" @click.prevent="handleForgotPassword">
                忘记密码?
              </a>
            </div>
            
            <!-- 登录按钮 -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style="animation-delay: 0.3s;"
            >
              <template v-if="isLoading">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                登录中...
              </template>
              <template v-else>
                <i class="fas fa-sign-in-alt mr-2"></i>
                立即登录
              </template>
            </button>
            
            <!-- 错误消息 -->
            <div v-if="errorMessage" class="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger-light text-sm text-center animate-bounce-in backdrop-blur-sm">
              <i class="fas fa-exclamation-circle mr-2"></i>{{ errorMessage }}
            </div>
          </form>
        </div>
        
        <!-- 底部信息 -->
        <div class="bg-white/5 backdrop-blur-sm text-center py-4 border-t border-white/10">
          <div class="text-sm text-gray-400">
            还没有账号? 
            <a href="#" class="text-primary font-medium hover:text-primary-light transition-colors duration-300">
              联系管理员
            </a>
          </div>
        </div>
      </div>
      
      <!-- 底部装饰 -->
      <div class="text-center mt-6 text-sm text-gray-500 animate-fade-in" style="animation-delay: 0.5s;">
        <i class="fas fa-shield-alt mr-1"></i>
        您的连接是安全的
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores';
import { authAPI } from '../api/auth';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

// 页面加载时检查记住我功能
onMounted(() => {
  const rememberMeStored = localStorage.getItem('rememberMe');
  const savedUsername = localStorage.getItem('savedUsername');
  
  if (rememberMeStored === 'true' && savedUsername) {
    rememberMe.value = true;
    username.value = savedUsername;
  }
  
  // 如果已有token，直接跳转到首页
  if (userStore.isLoggedIn) {
    router.push('/');
  }
});

// 忘记密码处理
const handleForgotPassword = () => {
  ElMessage.info({message:'密码重置功能开发中，请联系管理员重置密码',  duration: 600 });
};

// 登录验证
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 验证输入
    if (!username.value.trim()) {
      errorMessage.value = '请输入用户名';
      isLoading.value = false;
      return;
    }
    
    if (!password.value) {
      errorMessage.value = '请输入密码';
      isLoading.value = false;
      return;
    }

    // 调用登录API
    const response = await authAPI.login({
      username: username.value.trim(),
      password: password.value
    });

    if (response && response.success && response.data) {
      const userData = response.data;
      
      // 构建用户信息
      const userInfo = {
        id: userData.user.id || userData.user.userId,
        username: userData.user.username,
        name: userData.user.name || userData.user.username,
        email: userData.user.email,
        roles: userData.user.roles || 'user',
        department: userData.user.department,
        token: userData.token,
        refreshToken: userData.refreshToken,
        roleInfo: userData.user.roleInfo || null // 添加角色信息
      };
     
     
      // 保存用户信息到状态管理
      userStore.setUserInfo(userData);
       console.log('登录成功:', userData);
     
      
      
      // 获取用户菜单
      try {
        const menuResponse = await authAPI.getMenusByRole();
        if (menuResponse && menuResponse.success && menuResponse.data) {
          console.log('获取用户菜单成功:', menuResponse.data.menus);
          userStore.setUserMenus(menuResponse.data.menus || []);
        }
      } catch (menuError) {
        console.error('获取用户菜单失败:', menuError);
        // 不影响登录流程，继续使用默认菜单
      }
      // 登录成功提示
      ElMessage.success({message:'登录成功！',  duration: 1000 });
      
      // 跳转到首页或之前访问的页面
      const redirect = '/';
      router.push(redirect);
      
    } else {
      errorMessage.value = response?.message || '登录失败，请检查用户名和密码';
    }
  } catch (error) {
    console.log('登录失败:', error);
    errorMessage.value = '登录失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 引入Font Awesome图标 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* 加载动画优化 */
.fa-spin {
  animation: fa-spin 1s linear infinite;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 玻璃拟态效果增强 */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* 输入框聚焦效果 */
.form-input {
  transition: all 0.3s ease;
}

.form-input:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
}

/* 按钮悬停效果增强 */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .max-w-md {
    margin: 0 1rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .py-6 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .w-20 {
    width: 3.5rem;
  }
  
  .h-20 {
    height: 3.5rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
}

/* 动画延迟 */
.animate-slide-up:nth-child(2) {
  animation-delay: 0.1s;
}

.animate-slide-up:nth-child(3) {
  animation-delay: 0.2s;
}

.animate-slide-up:nth-child(4) {
  animation-delay: 0.3s;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.7);
}
</style>