<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- 模态框标题 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">选择部门</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">搜索部门</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="输入部门名称或代码"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">上级部门</label>
            <select 
              v-model="parentFilter"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部部门</option>
              <option v-for="dept in departmentOptions" :key="dept.value" :value="dept.value" class="bg-slate-800 text-white">
                {{ dept.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button 
            @click="fetchDepartments"
            class="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all duration-300"
          >
            搜索
          </button>
          <button 
            @click="resetFilters"
            class="px-4 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            重置
          </button>
        </div>
      </div>

      <!-- 部门树形列表 -->
      <div class="flex-1 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载部门数据...</div>
        </div>
        <div v-else-if="filteredDepartments.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-sitemap text-4xl mb-4 opacity-50"></i>
          <div>暂无部门数据</div>
        </div>
        <div v-else class="overflow-y-auto max-h-[45vh]">
          <!-- 树形表格头部 -->
          <div class="grid grid-cols-12 gap-4 mb-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <div class="col-span-6 text-gray-300 font-medium">部门信息</div>
            <div class="col-span-3 text-gray-300 font-medium">部门编码</div>
            <div class="col-span-3 text-gray-300 font-medium">上级部门</div>
          </div>
          
          <!-- 树形表格内容 -->
          <div class="space-y-1">
            <DepartmentTreeSelectItem
              :departments="departmentTree"
              :expanded-ids="expandedIds"
              :level="0"
              :selected-id="selectedDepartment?.id"
              @select-department="selectDepartment"
              @toggle-expand="toggleExpand"
            />
          </div>
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
          :disabled="!selectedDepartment"
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
import { departmentAPI } from '../api/department'
import DepartmentTreeSelectItem from './DepartmentTreeSelectItem.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'select'])

// 数据状态
const departments = ref([])
const loading = ref(false)
const searchQuery = ref('')
const parentFilter = ref('')
const departmentOptions = ref([])
const selectedDepartment = ref(null)
const expandedIds = ref([])
const departmentTree = ref([])

// 计算属性 - 过滤部门
const filteredDepartments = computed(() => {
  let result = departments.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(dept => 
      dept.name.toLowerCase().includes(query) ||
      (dept.code && dept.code.toLowerCase().includes(query))
    )
  }

  // 上级部门过滤
  if (parentFilter.value) {
    result = result.filter(dept => dept.parentId === parentFilter.value)
  }

  return result
})

// 获取部门列表
const fetchDepartments = async () => {
  loading.value = true
  try {
    const params = {
      page: 1,
      pageSize: 1000, // 获取所有部门
      keyword: searchQuery.value,
      department: parentFilter.value,
      status: 'active' // 只获取启用的部门
    }

    const response = await departmentAPI.getDepartmentList(params)
    
    if (response.success) {
      departments.value = response.data.map(dept => ({
        id: dept.id,
        code: dept.department_code || '',
        name: dept.department_name,
        parentId: dept.parent_id || '',
        description: dept.remarks || '',
        status: dept.status || 'active',
        createdAt: dept.create_at || new Date().toISOString()
      }))
      
      // 构建树形结构
      departmentTree.value = buildDepartmentTree(departments.value)
    } else {
      ElMessage.error({message: response.message || '获取部门列表失败', duration: 1000})
      departments.value = []
      departmentTree.value = []
    }
  } catch (error) {
    ElMessage.error({message: '获取部门列表失败', duration: 1000})
  } finally {
    loading.value = false
  }
}

// 构建树形结构
const buildDepartmentTree = (departments) => {
  const deptMap = new Map()
  const result = []
  
  // 创建部门映射
  departments.forEach(dept => {
    deptMap.set(dept.id, { ...dept, children: [] })
  })
  
  // 构建树形结构
  departments.forEach(dept => {
    const deptNode = deptMap.get(dept.id)
    if (dept.parentId) {
      const parent = deptMap.get(dept.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(deptNode)
      }
    } else {
      result.push(deptNode)
    }
  })
  
  return result
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  parentFilter.value = ''
  fetchDepartments()
}

// 选择部门
const selectDepartment = (department) => {
  selectedDepartment.value = department
}

// 确认选择
const confirmSelection = () => {
  if (selectedDepartment.value) {
    emit('select', {
      id: selectedDepartment.value.id,
      name: selectedDepartment.value.name,
      code: selectedDepartment.value.code,
      parentId: selectedDepartment.value.parentId
    })
    closeModal()
  }
}

// 关闭模态框
const closeModal = () => {
  emit('update:visible', false)
  selectedDepartment.value = null
  resetFilters()
}

// 获取部门选项
const fetchDepartmentOptions = async () => {
  try {
    const response = await departmentAPI.getDepartmentOptions()
    if (response.success && response.data) {
      departmentOptions.value = response.data.map(dept => ({
        value: dept.id,
        label: dept.department_name || dept.name || '未知部门'
      }))
    } else {
      console.error('获取部门选项失败:', response?.message)
      ElMessage.error({message: response?.message || '获取部门选项失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '获取部门选项失败', duration: 1000})
  }
}

// 展开/收起
const toggleExpand = (deptId) => {
  const index = expandedIds.value.indexOf(deptId)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(deptId)
  }
}

// 获取上级部门名称
const getParentDepartmentName = (parentId) => {
  if (!parentId) return null
  const parent = departmentOptions.value.find(d => d.value === parentId)
  return parent ? parent.label : null
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchDepartments()
  }
})

// 组件挂载时获取部门选项
onMounted(() => {
  fetchDepartmentOptions()
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