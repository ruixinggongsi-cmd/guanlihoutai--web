<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full filter blur-2xl animate-pulse"></div>
    </div>
    
    <!-- 导航栏组件 -->
    <NavigationBar />

    <!-- 主内容区 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  员工管理
                </h1>
                <p class="text-gray-400 text-lg">管理企业员工信息和权限配置</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'user:add'"
                @click="showAddModal = true"
                class="px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">添加员工</span>
              </button>
            
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl mb-6 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">搜索员工</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="输入用户名、邮箱或手机号"
              
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">部门筛选</label>
            <select 
              v-model="departmentFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部部门</option>
              <option v-for="dept in departmentOptions" :key="dept.id" :value="dept.id" class="bg-slate-800 text-white">
                {{ dept.department_name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">员工状态</label>
            <select 
              v-model="statusFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部状态</option>
              <option :value="true" class="bg-slate-800 text-white">启用</option>
              <option :value="false" class="bg-slate-800 text-white">禁用</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button 
              v-permission="'user:view'"
              @click="fetchUsers"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group"
            >
              <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
              <span>搜索</span>
            </button>
            <button 
              @click="resetFilters"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group border border-gray-500/30"
            >
              <i class="fas fa-undo group-hover:rotate-180 transition-transform duration-500"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl animate-fade-in" style="animation-delay: 0.2s">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载用户数据...</div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-users text-4xl mb-4 opacity-50"></i>
          <div>暂无用户数据</div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">用户信息</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">部门</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">角色</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">状态</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">注册时间</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-white/5 transition-all duration-300">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mr-3">
                      <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <div class="text-left">
                      <div class="text-white font-medium">{{ user.name || user.username }}</div>
                      <div class="text-gray-400 text-sm">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20 px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i class="fas fa-building text-xs"></i>
                    <span>{{ getDepartmentName(user.department) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div :class="getRoleClass(user.roles)" class="px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i :class="user.roles === 'admin' ? 'fas fa-crown' : user.roles === 'user' ? 'fas fa-user' : 'fas fa-user-secret'" class="text-xs"></i>
                    <span>{{ getRoleName(user.roles) || '员工' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div :class="user.status ? 'bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20' : 'bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'" class="px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i :class="user.status ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="text-xs"></i>
                    <span>{{ user.status ? '启用' : '禁用' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-700/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20 px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i class="fas fa-calendar-alt text-xs"></i>
                    <span>{{ user.create_at ? formatDate(user.create_at) : '-' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      v-permission="'user:edit'"
                      @click="editUser(user)"
                      class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                      title="编辑"
                    >
                      <i class="fas fa-edit group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                    <button 
                      v-permission="'user:edit'"
                      @click="toggleUserStatus(user)"
                      :class="user.status ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'"
                      class="text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                      :title="user.status ? '禁用' : '启用'"
                    >
                      <i :class="user.status ? 'fas fa-ban group-hover:scale-110 transition-transform duration-300' : 'fas fa-check group-hover:scale-110 transition-transform duration-300'"></i>
                    </button>
                    <button 
                      v-permission="'user:delete'"
                      @click="deleteUser(user)"
                      class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                      title="删除"
                    >
                      <i class="fas fa-trash group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="bg-white/5 px-6 py-4 border-t border-white/20 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage <= 1"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <i class="fas fa-chevron-left mr-1"></i>
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-gray-400">
              第 {{ currentPage }} 页
            </span>
            <button 
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑用户模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold text-white mb-6">{{ showEditModal ? '编辑员工' : '添加员工' }}</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 左列 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">用户名 <span class="text-red-400">*</span></label>
                <input 
                  v-model="userForm.username"
                  type="text" 
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">员工姓名 <span class="text-red-400">*</span></label>
                <input 
                  v-model="userForm.name"
                  type="text" 
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">邮箱 <span class="text-red-400">*</span></label>
                <input 
                  v-model="userForm.email"
                  type="email" 
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">手机号</label>
                <input 
                  v-model="userForm.phone"
                  type="tel" 
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
            </div>
            
            <!-- 右列 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">
                  {{ showEditModal ? '新密码' : '密码' }}
                  <span v-if="!showEditModal" class="text-red-400">*</span>
                  <span v-if="showEditModal" class="text-xs text-gray-500 ml-2">(留空则不修改)</span>
                </label>
                <input 
                  v-model="userForm.password"
                  type="password" 
                  :required="!showEditModal"
                  :placeholder="showEditModal ? '输入新密码' : '请输入初始密码'"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
              
              <div v-if="!showEditModal || userForm.password">
                <label class="block text-sm font-medium text-gray-400 mb-2">确认密码
                  <span v-if="!showEditModal" class="text-red-400">*</span>
                  <span v-if="showEditModal && userForm.password" class="text-red-400">*</span>
                </label>
                <input 
                  v-model="userForm.confirmPassword"
                  type="password" 
                  :required="!showEditModal || !!userForm.password"
                  placeholder="请再次输入密码"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">部门</label>
                <select 
                  v-model="userForm.department"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="" class="bg-slate-800 text-white">请选择部门</option>
                  <option v-for="dept in departmentOptions" :key="dept.id" :value="dept.id" class="bg-slate-800 text-white">
                    {{ dept.department_name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">角色 <span class="text-red-400">*</span></label>
                <select 
                  v-model="userForm.roles"
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="" class="bg-slate-800 text-white">请选择角色</option>
                  <option v-for="role in roleOptions" :key="role.role_id" :value="role.role_id" class="bg-slate-800 text-white">
                    {{ role.role_name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">状态 <span class="text-red-400">*</span></label>
                <select 
                  v-model="userForm.status"
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option :value="true" class="bg-slate-800 text-white">启用</option>
                  <option :value="false" class="bg-slate-800 text-white">禁用</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">备注</label>
            <textarea 
              v-model="userForm.remarks"
              rows="3"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            ></textarea>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50 active:scale-95 relative overflow-hidden group"
            >
              <span class="relative z-10 flex items-center justify-center">
                <i class="fas fa-times mr-3 text-lg group-hover:animate-pulse"></i>
                取消
              </span>
              <span class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
            </button>
            <button 
              type="submit"
              :disabled="isSaving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 active:scale-95 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span class="relative z-10 flex items-center justify-center">
                <i class="fas fa-save mr-3 text-lg" :class="{ 'fa-spin': isSaving }"></i>
                {{ isSaving ? '保存中...' : '保存' }}
              </span>
              <span class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { userAPI } from '../../api/users'
import { departmentAPI } from '../../api/department'
import { roleGroupAPI } from '../../api/roleGroup'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')

// 部门选项
const departmentOptions = ref([])

// 角色选项
const roleOptions = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)

// 加载状态
const loading = ref(false)

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const isSaving = ref(false) // 保存状态

// 用户表单
const userForm = ref({
  id: null,
  username: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  roles: '',
  status: 'active',
  remarks: '',
  password: '',
  confirmPassword: ''
})

// 重置用户表单
const resetUserForm = () => {
  userForm.value = {
    id: null,
    username: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    roles: 'user',
    status: 'active',
    remarks: '',
    password: '',
    confirmPassword: ''
  }
}

// 用户数据
const users = ref([])

// 计算属性 - 现在直接从API获取数据，不再本地筛选
const filteredUsers = computed(() => users.value)

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

// 方法
const getRoleClass = (role) => {
  const classes = {
    admin: 'bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20 backdrop-blur-sm',
    user: 'bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm',
    guest: 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20 text-gray-400 border border-gray-500/30 shadow-lg shadow-gray-500/20 backdrop-blur-sm'
  }
  return classes[role] || 'bg-gradient-to-r from-emerald-500/20 via-emerald-600/20 to-emerald-700/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20 backdrop-blur-sm'
}

const getRoleName = (role) => {
  // 首先尝试从roleOptions中查找角色名称
  if (role) {
    const roleItem = roleOptions.value.find(item => item.role_id === role)
    if (roleItem && roleItem.role_name) {
      return roleItem.role_name
    }
  }
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value,
      status: statusFilter.value,
      department: departmentFilter.value
    }
    
    const response = await userAPI.getUserList(params)
    if (response && response.data) {
      users.value = response.data.map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        roles: user.roles,
        status: user.status,
        create_at: user.create_at || user.created_at,
        lastLogin: user.last_login || user.create_at // 优先使用最后登录时间
      }))
      
      // 设置分页信息
      if (response.pagination) {
        totalUsers.value = response.pagination.total
        totalPages.value = response.pagination.totalPages
      } else if (response.total !== undefined) {
        totalUsers.value = response.total
        totalPages.value = Math.ceil(totalUsers.value / pageSize.value)
      } else {
        totalUsers.value = users.value.length
        totalPages.value = Math.ceil(totalUsers.value / pageSize.value)
      }
    }
  } catch (error) {
    ElMessage.error({message: '获取用户列表失败', duration: 1000})
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  departmentFilter.value = ''
  currentPage.value = 1
  fetchUsers()
}

const editUser = (user) => {
  // 直接使用当前选中的用户数据，不再重新获取
  userForm.value = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    department: user.department,
    roles: user.roles,
    status: user.status,
    remarks: user.remarks || ''
  }
  showEditModal.value = true
}

const toggleUserStatus = async (user) => {
  try {
    const newStatus = !user.status;
    const response = await userAPI.updateUser(user.id, {
      status: newStatus
    })
    if (response && response.success) {
      user.status = newStatus
      ElMessage.success({message: '状态更新成功', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '更新用户状态失败', duration: 1000})
  }
}

const deleteUser = async (user) => {
  if (confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) {
    try {
      const response = await userAPI.deleteUser(user.id)
      if (response && response.success) {
        await fetchUsers()
        ElMessage.success({message: '删除用户成功', duration: 1000})
      }
    } catch (error) {
      ElMessage.error({message: '删除用户失败', duration: 1000})
    }
  }
}

const saveUser = async () => {
  try {
    // 防止重复提交
    if (isSaving.value) {
      return
    }
    
    let response
    
    // 验证密码
    if (userForm.value.password) {
      if (userForm.value.password !== userForm.value.confirmPassword) {
        ElMessage.error({message: '两次输入的密码不一致', duration: 1000})
        return
      }
      
      if (userForm.value.password.length < 6) {
        ElMessage.error({message: '密码长度至少为6位', duration: 1000})
        return
      }
    }
    
    // 添加用户时必须输入密码
    if (!showEditModal.value && !userForm.value.password) {
      ElMessage.error({message: '请输入密码', duration: 1000})
      return
    }
    
    isSaving.value = true
    
    if (showEditModal.value) {
      // 编辑用户
      const updateData = {
        username: userForm.value.username,
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone,
        department: userForm.value.department,
        roles: userForm.value.roles,
        status: userForm.value.status,
        remarks: userForm.value.remarks
      }
      
      // 如果有新密码，添加到更新数据中
      if (userForm.value.password) {
        updateData.password = userForm.value.password
      }
      
      response = await userAPI.updateUser(userForm.value.id, updateData)
      
      if (response && response.success) {
        ElMessage.success({message: '更新用户成功', duration: 1000})
      } else {
        ElMessage.error({message: response.message || '更新用户失败', duration: 1000})
        isSaving.value = false // 失败时重置状态
        return
      }
    } else {
      // 添加用户
      response = await userAPI.createUser({
        username: userForm.value.username,
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone,
        department: userForm.value.department,
        roles: userForm.value.roles,
        status: userForm.value.status === 'active',
        remarks: userForm.value.remarks,
        password: userForm.value.password
      })
      
      if (response && response.success) {
        ElMessage.success({message: '创建用户成功', duration: 1000})
      } else {
        ElMessage.error({message: response.message || '创建用户失败', duration: 1000})
        isSaving.value = false // 失败时重置状态
        return
      }
    }
    
    if (response && response.success) {
      closeModal()
      await fetchUsers()
    }
  } catch (error) {
    ElMessage.error({message: '保存用户失败', duration: 1000})
    isSaving.value = false // 失败时重置状态
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  isSaving.value = false // 重置保存状态
  resetUserForm()
}

// 获取部门选项
const fetchDepartmentOptions = async () => {
  try {
    const response = await departmentAPI.getDepartmentOptions()
    if (response.success && response.data) {
      departmentOptions.value = response.data
    }
  } catch (error) {
    ElMessage.error({message: '获取部门选项失败', duration: 1000})
  }
}

// 获取角色选项
const fetchRoleOptions = async () => {
  try {
    const response = await roleGroupAPI.getRoleGroupOptions()
    if (response.success && response.data) {
      roleOptions.value = response.data
    }
  } catch (error) {
    ElMessage.error({message: '获取角色选项失败', duration: 1000})
  }
}

// 获取部门中文名称
const getDepartmentName = (departmentValue) => {
 
  if (!departmentValue) return '-'
  const dept = departmentOptions.value.find(d => d.id === departmentValue)
  return dept ? dept.department_name : departmentValue
}


watch(currentPage, () => {
  fetchUsers()
})

// 组件挂载时获取数据
onMounted(() => {
  fetchDepartmentOptions()
  fetchRoleOptions()
 
  fetchUsers()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>