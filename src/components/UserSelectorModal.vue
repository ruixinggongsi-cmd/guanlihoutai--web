<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- 模态框标题 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">选择用户</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">搜索用户</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="输入用户名、邮箱或手机号"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">部门筛选</label>
            <select 
              v-model="departmentFilter"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部部门</option>
              <option v-for="dept in departmentOptions" :key="dept.id" :value="dept.id" class="bg-slate-800 text-white">
                {{ dept.department_name }}
              </option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button 
              @click="fetchUsers"
              class="flex-1 px-3 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all duration-300"
            >
              搜索
            </button>
            <button 
              @click="resetFilters"
              class="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="flex-1 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载用户数据...</div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-users text-4xl mb-4 opacity-50"></i>
          <div>暂无用户数据</div>
        </div>
        <div v-else class="overflow-y-auto max-h-[40vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="user in filteredUsers" 
              :key="user.id" 
              @click="selectUser(user)"
              class="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              :class="{ 'ring-2 ring-primary bg-white/10': selectedUser?.id === user.id }"
            >
              <div class="flex items-center mb-3 relative">
                <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-user text-white text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">{{ user.name || user.username }}</div>
                  <div class="text-gray-400 text-sm">{{ user.email }}</div>
                </div>
                <!-- 选中状态显示 -->
                <div v-if="selectedUser?.id === user.id" class="absolute top-0 right-0 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">部门:</span>
                  <span class="text-gray-300">{{ getDepartmentName(user.department) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">角色:</span>
                  <span :class="getRoleClass(user.roles)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getRoleName(user.roles) }}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条记录
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
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
          </button>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="mt-6 flex justify-end space-x-4">
        <button 
          @click="closeModal"
          class="px-6 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          取消
        </button>
        <button 
          @click="confirmSelection"
          :disabled="!selectedUser"
          class="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          确认选择
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userAPI } from '../api/users'
import { departmentAPI } from '../api/department'
import { roleGroupAPI } from '../api/roleGroup'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'select'])

// 数据状态
const users = ref([])
const loading = ref(false)
const searchQuery = ref('')
const departmentFilter = ref('')
const departmentOptions = ref([])
const roleOptions = ref([])
const selectedUser = ref(null)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(12)
const totalUsers = ref(0)
const totalPages = ref(0)

// 计算属性 - 过滤用户
const filteredUsers = computed(() => {
  let result = users.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query)
    )
  }

  // 部门过滤
  if (departmentFilter.value) {
    result = result.filter(user => user.department === departmentFilter.value)
  }

  return result
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      department: departmentFilter.value
    }

    const response = await userAPI.getUserList(params)
    
    if (response && response.success) {
      // 将接口数据格式映射为组件需要的格式
      users.value = (response.data || []).map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        roles: user.roles,
        createdAt: user.create_at || user.created_at || user.createdAt
      }))
      
      // 设置分页信息 - 优先使用分页信息
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
    } else {
      ElMessage.error({message: response?.message || '获取用户列表失败', duration: 1000})
      users.value = []
      totalUsers.value = 0
      totalPages.value = 0
    }
  } catch (error) {
    ElMessage.error({message: '获取用户列表失败', duration: 1000})
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  departmentFilter.value = ''
  currentPage.value = 1
  fetchUsers()
}

// 选择用户
const selectUser = (user) => {
  selectedUser.value = user
}

// 确认选择
const confirmSelection = () => {
  if (selectedUser.value) {
    emit('select', {
      id: selectedUser.value.id,
      name: selectedUser.value.name || selectedUser.value.username,
      email: selectedUser.value.email,
      department: selectedUser.value.department
    })
    closeModal()
  }
}

// 关闭模态框
const closeModal = () => {
  emit('update:visible', false)
  selectedUser.value = null
  resetFilters()
}

// 获取部门选项
const fetchDepartmentOptions = async () => {
  try {
    const response = await departmentAPI.getDepartmentOptions()
    if (response.success && response.data) {
      departmentOptions.value = response.data.map(dept => ({
        id: dept.id,
        department_name: dept.department_name || dept.name || dept.label
      }))
    } else {
      ElMessage.error({message: response?.message || '获取部门选项失败', duration: 1000})
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
      roleOptions.value = response.data.map(role => ({
        id: role.role_id,
        role_code: role.role_code,
        role_name: role.role_name
      }))
    } else {
      ElMessage.error({message: response?.message || '获取角色选项失败', duration: 1000})
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

// 获取角色中文名称
const getRoleName = (roleId) => {
  if (!roleId) return '-'
  const role = roleOptions.value.find(r => r.id === roleId)
  return role ? role.role_name : roleId
}

// 获取角色样式
const getRoleClass = (roleId) => {
  if (!roleId) return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  
  const role = roleOptions.value.find(r => r.id === roleId)
  const roleCode = role ? role.role_code : 'unknown'
  
  const roleClassMap = {
    'admin': 'bg-danger/20 text-danger border border-danger/30',
    'manager': 'bg-warning/20 text-warning border border-warning/30',
    'employee': 'bg-info/20 text-info border border-info/30',
    'user': 'bg-success/20 text-success border border-success/30'
  }
  return roleClassMap[roleCode] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}



// 监听分页变化
watch(currentPage, () => {
  fetchUsers()
})

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchUsers()
  }
})

// 组件挂载时获取部门选项
onMounted(() => {
  fetchDepartmentOptions()
  fetchRoleOptions()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>