<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- 模态框标题 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">选择角色</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- 搜索区 -->
      <div class="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">搜索角色</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="输入角色名称或描述"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div class="flex items-end">
            <button 
              @click="fetchRoles"
              class="flex-1 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all duration-300 mr-2"
            >
              搜索
            </button>
            <button 
              @click="resetFilters"
              class="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 角色列表 -->
      <div class="flex-1 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载角色数据...</div>
        </div>
        <div v-else-if="filteredRoles.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-user-tag text-4xl mb-4 opacity-50"></i>
          <div>暂无角色数据</div>
        </div>
        <div v-else class="overflow-y-auto max-h-[45vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="role in filteredRoles" 
              :key="role.id" 
              @click="selectRole(role)"
              class="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              :class="{ 'ring-2 ring-primary bg-white/10': selectedRole?.id === role.id }"
            >
              <div class="flex items-center mb-3 relative">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-user-tag text-white text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">{{ role.name }}</div>
                  <div class="text-gray-400 text-sm">{{ role.code }}</div>
                </div>
                <!-- 选中状态显示 -->
                <div v-if="selectedRole?.id === role.id" class="absolute top-0 right-0 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">描述:</span>
                  <span class="text-gray-300 text-right flex-1 ml-2">{{ role.remarks || role.description || '暂无描述' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">状态:</span>
                  <div class="flex items-center">
                    <div :class="role.status ? 'bg-success' : 'bg-danger'" class="w-2 h-2 rounded-full mr-2"></div>
                    <span :class="role.status ? 'text-success' : 'text-danger'" class="text-sm font-medium">
                      {{ role.status ? '启用' : '禁用' }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">权限:</span>
                  <span class="text-gray-300">{{ role.permissions?.length || 0 }} 个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalRoles) }} 条，共 {{ totalRoles }} 条记录
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
          :disabled="!selectedRole"
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
import { roleGroupAPI } from '../api/roleGroup'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'select'])

// 数据状态
const roles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedRole = ref(null)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(12)
const totalRoles = ref(0)
const totalPages = ref(0)

// 计算属性 - 过滤角色
const filteredRoles = computed(() => {
  let result = roles.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(role => 
      role.name.toLowerCase().includes(query) ||
      (role.code && role.code.toLowerCase().includes(query)) ||
      (role.description && role.description.toLowerCase().includes(query))
    )
  }

  return result
})

// 获取角色列表
const fetchRoles = async () => {
  loading.value = true
  try {
    // 调用API获取权限组列表
    const params = {
      page: 1,
      pageSize: 1000, // 获取所有数据用于前端筛选
      status: true // 只获取启用的权限组
    }

    // 如果有搜索关键词，添加到参数中
    if (searchQuery.value) {
      params.keyword = searchQuery.value
    }

    const response = await roleGroupAPI.getRoleGroupList(params)

    if (response.success) {
      const list = response.data || []
      // 将接口数据格式映射为组件需要的格式
      roles.value = list.map(item => ({
        id: item.role_id || item.id,
        name: item.role_name || item.name,
        code: item.role_code || item.code,
        description: item.remarks || item.description || '',
        status: item.status,
        permissions: item.permissions || [],
        createdAt: item.created_at || item.createdAt || ''
      }))
      totalRoles.value = response.pagination?.total || response.total || list.length
      totalPages.value = Math.ceil(totalRoles.value / pageSize.value)
    } else {
      ElMessage.error({message: response.message || '获取角色列表失败', duration: 1000})
      roles.value = []
      totalRoles.value = 0
      totalPages.value = 0
    }
  } catch (error) {
    ElMessage.error({message: '获取角色列表失败', duration: 1000})
    roles.value = []
    totalRoles.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// 选择角色
const selectRole = (role) => {
  selectedRole.value = role
}

// 确认选择
const confirmSelection = () => {
  if (selectedRole.value) {
    emit('select', {
      id: selectedRole.value.id,
      name: selectedRole.value.name,
      code: selectedRole.value.code
    })
    closeModal()
  } else {
    ElMessage.warning({message: '请选择一个角色', duration: 1000})
  }
}

// 关闭模态框
const closeModal = () => {
  emit('update:visible', false)
  selectedRole.value = null
  searchQuery.value = ''
  currentPage.value = 1
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedRole.value = null
  currentPage.value = 1
  fetchRoles()
}

// 监听搜索词变化
watch(searchQuery, () => {
  currentPage.value = 1
  fetchRoles()
})

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchRoles()
  }
})

// 监听分页变化
watch(currentPage, () => {
  fetchRoles()
})

onMounted(() => {
  if (props.visible) {
    fetchRoles()
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>