<template>
  <nav class="relative z-50 nav-glass-enhanced">
    <div class="backdrop-blur-lg bg-black/70 border-b border-white/10 shadow-xl">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <!-- Logo区域 -->
          <div class="flex items-center flex-shrink-0">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg">
                <i class="fas fa-chart-line text-white text-lg"></i>
              </div>
              <div class="ml-3">
                <h1 class="text-xl font-bold text-white">管理系统</h1>
                <p class="text-xs text-gray-400">Management System</p>
              </div>
            </div>
          </div>

          <!-- 主导航菜单 -->
          <div class="hidden md:block flex-1">
            <div class="flex items-baseline space-x-2 ml-8">
              <!-- 一级菜单项 -->
              <template v-for="item in menuItems" :key="item.name">
                <div class="relative group" v-if="item.children && item.children.length > 0">
                  <!-- 有子菜单的项 -->
                  <div class="relative group">
                    <button 
                      class="text-gray-300 hover:text-white hover:bg-white/10 px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
                    >
                      <i :class="item.icon" class="mr-1 text-gray-400"></i>
                      {{ item.name }}
                      <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-300 group-hover:rotate-180"></i>
                    </button>
                    
                    <!-- 二级下拉菜单 - 鼠标悬停显示 -->
                    <div class="absolute top-full left-0 mt-2 w-48 dropdown-glass rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <template v-for="child in item.children" :key="child.name">
                        <router-link
                          :to="child.path"
                          class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover"
                        >
                          <i :class="child.icon" class="mr-3 text-gray-400"></i>
                          {{ child.name }}
                          <span v-if="child.badge" 
                                class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">
                            {{ child.badge }}
                          </span>
                        </router-link>
                      </template>
                    </div>
                  </div>
                  
                  
                </div>
                
                <!-- 无子菜单的项 - 直接跳转 -->
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  class="text-gray-300 hover:text-white hover:bg-white/10 px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
                  :class="{ 'nav-item-active': $route.path === item.path }"
                >
                  <i :class="item.icon" class="mr-1 text-gray-400"></i>
                  {{ item.name }}
                  <span v-if="item.badge" 
                        class="ml-2 bg-danger text-white text-xs px-2 py-1 rounded-full">
                    {{ item.badge }}
                  </span>
                </router-link>
              </template>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="md:hidden ml-auto">
            <button @click="toggleMobileMenu" class="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300">
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>

          <!-- 右侧用户信息 -->
          <div class="hidden md:flex items-center space-x-3 ml-auto">
          
            
            <!-- 用户菜单 -->
            <div class="relative group">
              <button class="flex items-center space-x-2 text-gray-300 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium">{{ userStore.userInfo?.username || '管理员' }}</p>
                  <p class="text-xs text-gray-500">{{ userStore.userInfo?.roleInfo?.role_name || userStore.userInfo?.role || 'admin' }}</p>
                </div>
                <i class="fas fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
              </button>
            
              <!-- 用户下拉菜单 -->
              <div class="absolute right-0 top-full mt-2 w-48 dropdown-glass rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <button @click="openChangePasswordModal" class="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover">
                  <i class="fas fa-user mr-3 text-gray-400"></i>
                  修改密码 
                </button>
              
                <hr class="border-white/10 my-2">
                <button @click="logout" class="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover">
                  <i class="fas fa-sign-out-alt mr-3 text-gray-400"></i>
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="isMobileMenuOpen" class="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/20 z-50 md:hidden mobile-menu-enter">
      <div class="px-3 py-2 space-y-1">
        <template v-for="item in menuItems" :key="item.name">
          <!-- 有子菜单的移动端项 -->
          <div v-if="item.children && item.children.length > 0" class="relative">
            <button 
              @click="toggleMobileSubmenu(item.name)" 
              class="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between border-l-2 border-transparent"
              :class="{ 
                'bg-white/10 text-white border-primary-light': activeMobileSubmenu === item.name,
                'hover:border-white/30': activeMobileSubmenu !== item.name 
              }"
            >
              <div class="flex items-center">
                <i :class="item.icon" class="mr-3 text-gray-400"></i>
                {{ item.name }}
              </div>
              <i class="fas fa-chevron-down text-xs transition-transform duration-300" :class="{ 'rotate-180': activeMobileSubmenu === item.name }"></i>
            </button>
            <!-- 移动端子菜单 -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0 overflow-hidden"
              enter-to-class="opacity-100 max-h-96 overflow-hidden"
              leave-from-class="opacity-100 max-h-96 overflow-hidden"
              leave-to-class="opacity-0 max-h-0 overflow-hidden"
            >
              <div v-if="activeMobileSubmenu === item.name" class="pl-6 mt-2 space-y-2 overflow-hidden">
                <router-link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.path"
                  class="block text-gray-400 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center border-l-2 border-white/20 hover:border-primary-light"
                  @click="closeMobileMenu"
                >
                  <i :class="child.icon" class="mr-3 text-gray-400"></i>
                  {{ child.name }}
                  <span v-if="child.badge" class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">{{ child.badge }}</span>
                </router-link>
              </div>
            </transition>
          </div>
          <!-- 无子菜单的移动端项 - 直接跳转 -->
          <router-link
            v-else-if="item.path"
            :to="item.path"
            class="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center border-l-2 border-transparent"
            :class="{ 
              'bg-white/20 text-white border-primary-light': $route.path === item.path,
              'hover:border-white/30': $route.path !== item.path 
            }"
            @click="closeMobileMenu"
          >
            <i :class="item.icon" class="mr-3 text-gray-400"></i>
            {{ item.name }}
            <span v-if="item.badge" class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">{{ item.badge }}</span>
          </router-link>
        </template>
        
        <!-- 移动端用户菜单 -->
        <div class="border-t border-white/20 pt-4 mt-4">
          <div class="px-3 py-3 text-gray-300 bg-white/5 rounded-xl">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mr-3 shadow-lg">
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ userStore.userInfo?.username || '管理员' }}</p>
                <p class="text-xs text-gray-500">{{ userStore.userInfo?.roleInfo?.role_name || userStore.userInfo?.role || 'admin' }}</p>
              </div>
            </div>
            <div class="space-y-2 pl-13">
              <button @click="openChangePasswordModal" class="block w-full text-left text-gray-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-l-2 border-transparent hover:border-primary-light">
                <i class="fas fa-user-edit mr-2 text-gray-400"></i>
                修改密码
              </button>
             
              <button @click="logout" class="block w-full text-left text-gray-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-l-2 border-transparent hover:border-red-400">
                <i class="fas fa-sign-out-alt mr-2 text-red-400"></i>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 移动端菜单遮罩 -->
    <div v-if="isMobileMenuOpen" @click.stop="closeMobileMenu" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

  </nav>

  <!-- 修改密码弹窗 -->
  <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">修改密码</h3>
        <button @click="closeChangePasswordModal" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="submitChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            当前密码 <span class="text-danger">*</span>
          </label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="请输入当前密码"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            新密码 <span class="text-danger">*</span>
          </label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="请输入新密码"
            required
          >
          <p class="text-xs text-gray-400 mt-1">密码长度至少6位</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            确认新密码 <span class="text-danger">*</span>
          </label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="请再次输入新密码"
            required
          >
        </div>

        <div v-if="passwordError" class="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg p-3">
          {{ passwordError }}
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="closeChangePasswordModal"
            class="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-medium transition-all duration-300"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores'
import { changePassword } from '../api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isMobileMenuOpen = ref(false)
const activeMobileSubmenu = ref(null)

// 修改密码相关状态
const showChangePasswordModal = ref(false)
const isSubmitting = ref(false)
const passwordError = ref('')
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
// 菜单数据 - 使用动态数据，添加日志管理菜单
const menuItems = computed(() => {
  const dynamicMenus = userStore.userMenus || [];
  
  // 添加日志管理菜单（作为动态菜单的补充）
  const logManagementMenu = {
  };
  
  // 检查是否已经存在日志管理菜单，如果不存在则添加
  const hasLogMenu = dynamicMenus.some(menu => menu.name === '日志管理');
  if (!hasLogMenu) {
    return [...dynamicMenus, logManagementMenu];
  }
  
  return dynamicMenus;
}); 


// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  activeMobileSubmenu.value = null
}

// 切换移动端子菜单
const toggleMobileSubmenu = (menuName) => {
  activeMobileSubmenu.value = activeMobileSubmenu.value === menuName ? null : menuName
}

// 监听路由变化，自动关闭移动端菜单
watch(() => route.path, () => {
  if (isMobileMenuOpen.value) {
    closeMobileMenu()
  }
})



// 退出登录
const logout = () => {
  // 清除用户登录状态
  userStore.logout()
  // 跳转到登录页
  router.push('/login')
}

// 打开修改密码弹窗
const openChangePasswordModal = () => {
  showChangePasswordModal.value = true
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  closeMobileMenu()
}

// 关闭修改密码弹窗
const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
}

// 提交修改密码
const submitChangePassword = async () => {
  // 验证表单
  if (!passwordForm.value.currentPassword) {
    passwordError.value = '请输入当前密码'
    return
  }
  
  if (!passwordForm.value.newPassword) {
    passwordError.value = '请输入新密码'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = '新密码长度至少6位'
    return
  }
  
  if (!passwordForm.value.confirmPassword) {
    passwordError.value = '请确认新密码'
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }
  
  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    passwordError.value = '新密码不能与当前密码相同'
    return
  }
  
  // 清除错误信息
  passwordError.value = ''
  isSubmitting.value = true
  
  try {
    // 调用修改密码API
    const response = await changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    if (response.success) {
      // 成功提示
      alert('密码修改成功！请重新登录。')
      // 关闭弹窗
      closeChangePasswordModal()
      // 退出登录，要求用户重新登录
      logout()
    } else {
      passwordError.value = response.message || '密码修改失败'
    }
  } catch (error) {
    passwordError.value = error.message || '密码修改失败，请检查网络连接'
  } finally {
    isSubmitting.value = false
  }
}


</script>

<style scoped>
/* 下拉菜单动画 */
.dropdown-enter-active {
  transition: all 0.3s ease-out;
}

.dropdown-leave-active {
  transition: all 0.2s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 玻璃拟态增强效果 */
nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 导航项悬停效果 */
.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 用户菜单动画 */
.group:hover .transition-transform {
  transform: rotate(180deg);
}

/* 移动端菜单动画 */
.mobile-menu-enter {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端响应式 */
@media (max-width: 767px) {
  .hidden.md:block {
    display: none !important;
  }
  
  /* 移动端菜单最大高度 */
  .mobile-menu-enter {
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
}
</style>