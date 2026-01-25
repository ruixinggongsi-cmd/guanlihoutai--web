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
              <template v-for="item in menuItems" :key="item.id || item.name">
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
                    <div class="absolute top-full left-0 mt-2 w-48 dropdown-glass rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <!-- 过滤并排序：只显示type='menu'的菜单项，按sort_order排序 -->
                      <template v-for="child in filteredMenuChildren(item)" :key="child.id || child.name">
                        <!-- 有三级子菜单的项 -->
                        <div v-if="child.children && filteredMenuChildren(child).length > 0" class="relative group/submenu">
                          <!-- 如果有path，点击可以跳转；同时鼠标悬停显示子菜单 -->
                          <router-link
                            v-if="child.path"
                            :to="child.path"
                            class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover"
                          >
                            <i :class="child.icon || 'fas fa-circle'" class="mr-3 text-gray-400"></i>
                            <span class="flex-1">{{ child.name }}</span>
                            <i class="fas fa-chevron-right ml-2 text-xs"></i>
                            <span v-if="child.badge" 
                                  class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">
                              {{ child.badge }}
                            </span>
                          </router-link>
                          <!-- 如果没有path，只显示子菜单 -->
                          <div
                            v-else
                            class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover cursor-pointer"
                          >
                            <i :class="child.icon || 'fas fa-circle'" class="mr-3 text-gray-400"></i>
                            <span class="flex-1">{{ child.name }}</span>
                            <i class="fas fa-chevron-right ml-2 text-xs"></i>
                            <span v-if="child.badge" 
                                  class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">
                              {{ child.badge }}
                            </span>
                          </div>
                          <!-- 三级下拉菜单 -->
                          <div class="absolute left-full top-0 ml-2 w-48 dropdown-glass rounded-2xl py-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-300 z-50">
                            <template v-for="grandchild in filteredMenuChildren(child)" :key="grandchild.id || grandchild.name">
                              <router-link
                                :to="grandchild.path"
                                class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover"
                              >
                                <i :class="grandchild.icon || 'fas fa-circle'" class="mr-3 text-gray-400"></i>
                                {{ grandchild.name }}
                                <span v-if="grandchild.badge" 
                                      class="ml-auto bg-danger text-white text-xs px-2 py-1 rounded-full">
                                  {{ grandchild.badge }}
                                </span>
                              </router-link>
                            </template>
                          </div>
                        </div>
                        <!-- 无三级子菜单的项 - 直接跳转 -->
                        <router-link
                          v-else
                          :to="child.path"
                          class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center dropdown-item-hover"
                        >
                          <i :class="child.icon || 'fas fa-circle'" class="mr-3 text-gray-400"></i>
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
import approvalNotificationService from '@/utils/approvalNotification'

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
  
  // 调试：输出菜单数据
  console.log('=== 前端菜单数据调试 ===');
  console.log('菜单总数:', dynamicMenus.length);
  
  // 输出所有顶级菜单
  console.log('所有顶级菜单:', dynamicMenus.map(m => ({
    id: m.id,
    name: m.name,
    path: m.path,
    type: m.type,
    hasChildren: !!m.children,
    childrenCount: m.children?.length || 0
  })));
  
  // 查找客户管理菜单
  const findMenu = (menus, targetId, parentPath = '') => {
    for (const menu of menus) {
      const currentPath = parentPath ? `${parentPath} > ${menu.name}` : menu.name;
      if (String(menu.id) === String(targetId)) {
        console.log(`✅ 找到客户管理菜单，路径: ${currentPath}`);
        return { menu, path: currentPath };
      }
      if (menu.children && menu.children.length > 0) {
        const found = findMenu(menu.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  const customerManagementResult = findMenu(dynamicMenus, '550e8400-e29b-41d4-a716-446655440012');
  if (customerManagementResult) {
    const customerManagementMenu = customerManagementResult.menu;
    console.log('客户管理菜单:', customerManagementMenu.name);
    console.log('客户管理菜单位置:', customerManagementResult.path);
    console.log('客户管理子菜单数量:', customerManagementMenu.children?.length || 0);
    console.log('客户管理子菜单完整列表:', customerManagementMenu.children || []);
    
    // 检查客户管理菜单的父菜单
    const findParent = (menus, targetId, parent = null) => {
      for (const menu of menus) {
        if (String(menu.id) === String(targetId)) {
          return parent;
        }
        if (menu.children && menu.children.length > 0) {
          const found = findParent(menu.children, targetId, menu);
          if (found !== null) return found;
        }
      }
      return null;
    };
    const parentMenu = findParent(dynamicMenus, '550e8400-e29b-41d4-a716-446655440012');
    if (parentMenu) {
      console.log('客户管理菜单的父菜单:', parentMenu.name, parentMenu.id);
      console.log('父菜单是否有子菜单:', !!parentMenu.children, parentMenu.children?.length || 0);
    } else {
      console.log('客户管理菜单是顶级菜单');
    }
    
    // 详细输出每个子菜单
    if (customerManagementMenu.children && customerManagementMenu.children.length > 0) {
      customerManagementMenu.children.forEach((child, index) => {
        console.log(`子菜单 ${index + 1}:`, {
          id: child.id,
          name: child.name,
          path: child.path,
          icon: child.icon,
          type: child.type,
          sort_order: child.sort_order,
          hasChildren: !!child.children,
          childrenCount: child.children?.length || 0
        });
      });
      
      // 检查"数据库对比"菜单
      const databaseCompareMenu = customerManagementMenu.children.find(c => 
        String(c.id) === '550e8400-e29b-41d4-a716-446655440019' || 
        c.name === '数据库对比'
      );
      if (databaseCompareMenu) {
        console.log('✅ 找到数据库对比菜单:', databaseCompareMenu);
      } else {
        console.log('❌ 未找到数据库对比菜单');
        console.log('所有子菜单ID:', customerManagementMenu.children.map(c => c.id));
        console.log('所有子菜单名称:', customerManagementMenu.children.map(c => c.name));
      }
    }
  } else {
    console.log('❌ 未找到客户管理菜单');
  }
  
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

// 过滤菜单子项：只显示type='menu'且有path的菜单项
const filteredMenuChildren = (item) => {
  // 记录所有调用，特别是客户管理相关的
  if (item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012' || 
      item.name === '申请管理' || item.name === '业务管理') {
    console.log('🔍 filteredMenuChildren 被调用，菜单:', item.name, item.id);
  }
  
  if (!item.children || !Array.isArray(item.children)) {
    if (item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012') {
      console.log('❌ 客户管理菜单没有子菜单或子菜单不是数组');
    }
    return [];
  }
  
  // 详细日志：输出所有子菜单信息（包括申请管理和客户管理）
  if (item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012' ||
      item.name === '申请管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440003') {
    console.log(`=== ${item.name}子菜单过滤调试 ===`);
    console.log('菜单ID:', item.id);
    console.log('菜单名称:', item.name);
    console.log('原始子菜单数量:', item.children.length);
    console.log('原始子菜单列表:', item.children.map(c => ({
      id: c.id,
      name: c.name,
      path: c.path,
      type: c.type,
      sort_order: c.sort_order,
      hasPath: !!c.path,
      isMenuType: c.type === 'menu'
    })));
  }
  
  const filtered = item.children.filter(c => {
    // 对于子菜单，只要有path就可以显示（不强制要求type必须是'menu'）
    // 因为很多功能菜单（type='function'）也需要作为子菜单显示在导航栏中
    const hasPath = !!c.path;
    const isMenuType = c.type === 'menu';
    const hasChildren = c.children && c.children.length > 0;
    
    // 允许显示的条件：
    // 1. 有path且type是menu
    // 2. 有path且是子菜单项（有children）
    // 3. 有path且type是function（功能菜单也需要显示）
    const shouldInclude = hasPath && (isMenuType || hasChildren || c.type === 'function');
    
    if ((item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012' ||
         item.name === '申请管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440003') && !shouldInclude) {
      console.log(`过滤掉菜单项: ${c.name} (path: ${c.path || '无'}, type: ${c.type || '无'})`);
    }
    
    return shouldInclude;
  });
  
  const sorted = filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  
  if (item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012' ||
      item.name === '申请管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440003') {
    console.log('过滤后的菜单数量:', sorted.length);
    console.log('过滤后的菜单列表:', sorted.map(m => ({
      id: m.id,
      name: m.name, 
      path: m.path, 
      type: m.type,
      sort_order: m.sort_order
    })));
    
    // 检查"客户管理"是否在申请管理的过滤后的列表中
    if (item.name === '申请管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440003') {
      const customerManagementInFiltered = sorted.find(m => String(m.id) === '550e8400-e29b-41d4-a716-446655440012' || m.name === '客户管理');
      if (customerManagementInFiltered) {
        console.log('✅ 客户管理在申请管理的过滤后的列表中:', customerManagementInFiltered);
      } else {
        console.log('❌ 客户管理不在申请管理的过滤后的列表中');
        console.log('可能原因: path为空或type不是menu');
        const customerManagementInOriginal = item.children.find(c => String(c.id) === '550e8400-e29b-41d4-a716-446655440012' || c.name === '客户管理');
        if (customerManagementInOriginal) {
          console.log('客户管理原始数据:', {
            path: customerManagementInOriginal.path,
            type: customerManagementInOriginal.type,
            hasPath: !!customerManagementInOriginal.path,
            isMenuType: customerManagementInOriginal.type === 'menu'
          });
        }
      }
    }
    
    // 检查"数据库对比"是否在客户管理的过滤后的列表中
    if (item.name === '客户管理' || String(item.id) === '550e8400-e29b-41d4-a716-446655440012') {
      const dbCompareInFiltered = sorted.find(m => String(m.id) === '550e8400-e29b-41d4-a716-446655440019' || m.name === '数据库对比');
      if (dbCompareInFiltered) {
        console.log('✅ 数据库对比在客户管理的过滤后的列表中:', dbCompareInFiltered);
      } else {
        console.log('❌ 数据库对比不在客户管理的过滤后的列表中');
        console.log('可能原因: path为空或type不是menu');
        const dbCompareInOriginal = item.children.find(c => String(c.id) === '550e8400-e29b-41d4-a716-446655440019' || c.name === '数据库对比');
        if (dbCompareInOriginal) {
          console.log('数据库对比原始数据:', {
            path: dbCompareInOriginal.path,
            type: dbCompareInOriginal.type,
            hasPath: !!dbCompareInOriginal.path,
            isMenuType: dbCompareInOriginal.type === 'menu'
          });
        }
      }
    }
  }
  
  return sorted;
};

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

// 启动审批通知服务
const startApprovalNotification = async () => {
  // 只在用户已登录时启动
  if (!userStore.isLoggedIn) {
    console.log('[审批通知] 用户未登录，不启动通知服务')
    return
  }

  try {
    console.log('[审批通知] 尝试启动通知服务...')
    const started = await approvalNotificationService.start(10000) // 10秒检查一次（更频繁）
    if (started) {
      console.log('[审批通知] ✅ 通知服务已成功启动，将每10秒检查一次新订单')
      // 启动后立即检查一次（确保登录时立即显示通知）
      setTimeout(async () => {
        await approvalNotificationService.checkImmediately()
        const status = approvalNotificationService.getStatus()
        console.log('[审批通知] 服务状态:', status)
      }, 2000) // 延迟2秒后立即检查，确保用户信息已加载
    } else {
      console.warn('[审批通知] ⚠️ 通知服务启动失败，可能是未获得通知权限')
      // 如果权限被拒绝，提示用户
      if (Notification.permission === 'denied') {
        console.warn('[审批通知] 通知权限已被拒绝，请在浏览器设置中允许通知')
      }
    }
  } catch (error) {
    console.error('[审批通知] ❌ 启动通知服务失败:', error)
  }
}

// 停止审批通知服务
const stopApprovalNotification = () => {
  approvalNotificationService.stop()
}

// 监听用户登录状态变化
watch(() => userStore.isLoggedIn, (isLoggedIn, wasLoggedIn) => {
  if (isLoggedIn && !wasLoggedIn) {
    // 用户刚登录（从未登录变为已登录），启动通知服务
    console.log('[审批通知] 检测到用户登录，启动通知服务')
    startApprovalNotification()
  } else if (!isLoggedIn && wasLoggedIn) {
    // 用户退出，停止通知服务
    console.log('[审批通知] 检测到用户退出，停止通知服务')
    stopApprovalNotification()
  }
}, { immediate: false }) // 不使用 immediate，避免重复启动

// 组件挂载时，如果用户已登录，启动通知服务（用于页面刷新后恢复）
onMounted(() => {
  if (userStore.isLoggedIn) {
    console.log('[审批通知] 页面加载时检测到用户已登录，启动通知服务')
    startApprovalNotification()
  } else {
    console.log('[审批通知] 页面加载时用户未登录，不启动通知服务')
  }
})

// 组件卸载时停止通知服务
onUnmounted(() => {
  stopApprovalNotification()
})

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