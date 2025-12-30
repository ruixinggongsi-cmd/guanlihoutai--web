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
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-building text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  部门管理
                </h1>
                <p class="text-gray-400 text-lg">管理企业部门结构和员工分配</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'department:add'"
                @click="showAddModal = true"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">添加部门</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl mb-6 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-400 mb-2">搜索部门</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="输入部门名称或代码"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">上级部门</label>
            <select 
              v-model="parentFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部部门</option>
              <option v-for="dept in departmentOptions" :key="dept.value" :value="dept.value" class="bg-slate-800 text-white">
                {{ dept.label }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
             <button 
              v-permission="'department:view'"
              @click="fetchDepartments"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              搜索
            </button>
            <button 
              v-permission="'department:view'"
              @click="resetFilters"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 部门树形列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl animate-fade-in" style="animation-delay: 0.2s">
        <div class="p-6">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-3 text-gray-400">加载中...</span>
          </div>
          
          <!-- 空状态 -->
          <div v-else-if="filteredDepartments.length === 0" class="text-center py-12">
            <i class="fas fa-sitemap text-4xl text-gray-500 mb-4"></i>
            <p class="text-gray-400">暂无部门数据</p>
          </div>
          
          <!-- 树形表格头部 -->
          <div v-else>
            <div class="grid grid-cols-12 gap-4 mb-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
              <div class="col-span-5 text-gray-300 font-medium">部门信息</div>
              <div class="col-span-2 text-gray-300 font-medium">部门编码</div>
              <div class="col-span-2 text-gray-300 font-medium">上级部门</div>
              <div class="col-span-1 text-gray-300 font-medium text-center">状态</div>
              <div class="col-span-2 text-gray-300 font-medium text-right">操作</div>
            </div>
            
            <!-- 树形表格内容 -->
            <div class="space-y-1">
              <DepartmentTreeItem
                :departments="departmentTree"
                :expanded-ids="expandedIds"
                :level="0"
                @edit-dept="editDepartment"
                @delete-dept="deleteDepartment"
            
                @show-add-modal="showAddModalFromTree"
                @toggle-expand="toggleExpand"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑部门模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold text-white mb-6">{{ showEditModal ? '编辑部门' : '添加部门' }}</h3>
        
        <form @submit.prevent="saveDepartment" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">部门名称 *</label>
            <input 
              v-model="departmentForm.name"
              type="text" 
              required
              placeholder="请输入部门名称"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">上级部门</label>
            <select 
              v-model="departmentForm.parentId"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">顶级部门</option>
              <option v-for="dept in departmentOptions" :key="dept.value" :value="dept.value" class="bg-slate-800 text-white">
                {{ dept.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">部门描述</label>
            <textarea 
              v-model="departmentForm.description"
              rows="3"
              placeholder="请输入部门描述信息"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
            ></textarea>
          </div>

         

          <div class="flex justify-end space-x-4 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="px-6 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              取消
            </button>
            <button 
                type="submit"
                :disabled="isSaving"
                class="px-8 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-success-light hover:to-success transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <i class="fas fa-save mr-2" :class="{ 'fa-spin': isSaving }"></i>
                {{ isSaving ? '保存中...' : '保存' }}
              </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 员工管理模态框 -->
    <div v-if="showEmployeeModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-white">{{ currentDepartment.name }} - 员工管理</h3>
          <button @click="closeEmployeeModal" class="text-gray-400 hover:text-white transition-colors duration-300">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- 员工列表 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-white">当前员工 ({{ departmentEmployees.length }}人)</h4>
            <button 
              @click="showAddEmployeeModal = true"
              v-permission="'department:edit'"
              class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <i class="fas fa-plus mr-2"></i>
              添加员工
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="emp in departmentEmployees" :key="emp.id" 
                 class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-user text-white text-xs"></i>
                </div>
                <div>
                  <div class="text-white font-medium text-sm">{{ emp.username }}</div>
                  <div class="text-gray-400 text-xs">{{ emp.email }}</div>
                </div>
              </div>
              <button 
                @click="removeEmployee(emp)"
                v-permission="'department:edit'"
                class="text-gray-400 hover:text-danger transition-colors duration-300"
                title="移出部门"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 可添加员工列表 -->
        <div>
          <h4 class="text-lg font-semibold text-white mb-4">可添加员工</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            <div v-for="emp in availableEmployees" :key="emp.id" 
                 class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-user text-white text-xs"></i>
                </div>
                <div>
                  <div class="text-white font-medium text-sm">{{ emp.username }}</div>
                  <div class="text-gray-400 text-xs">{{ emp.email }}</div>
                </div>
              </div>
              <button 
                @click="addEmployee(emp)"
                class="text-gray-400 hover:text-success transition-colors duration-300"
                title="添加到部门"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div v-if="availableEmployees.length === 0" class="text-center text-gray-400 py-8">
            暂无可添加的员工
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import DepartmentTreeItem from '../../components/DepartmentTreeItem.vue'
import { ElMessage } from 'element-plus'
import { departmentAPI } from '../../api/department.js'

// 搜索和筛选
const searchQuery = ref('')
const parentFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(1000)
const totalDepartments = ref(0)

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showEmployeeModal = ref(false)
const showAddEmployeeModal = ref(false)

// 保存按钮加载状态
const isSaving = ref(false)

// 当前编辑的部门
const currentDepartment = ref({})

// 部门表单
const departmentForm = ref({
  name: '',
  parentId: '',
  description: '',
  status: 'active'
})

// 部门数据
const departments = ref([])
const departmentOptions = ref([])
const allEmployees = ref([])
const loading = ref(false)

// 树形结构数据
const expandedIds = ref([])
const departmentTree = ref([])

// 计算属性
const filteredDepartments = computed(() => {
  return departments.value
})

const totalPages = computed(() => Math.ceil(totalDepartments.value / pageSize.value))

const departmentEmployees = computed(() => {
  return allEmployees.value.filter(emp => emp.departmentId === currentDepartment.value.id)
})

const availableEmployees = computed(() => {
  return allEmployees.value.filter(emp => !emp.departmentId)
})

// 方法
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const getParentDepartmentName = (parentId) => {
  if (!parentId) return null
  const parent = departmentOptions.value.find(dept => dept.value === parentId)
  return parent ? parent.label : null
}

const resetFilters = () => {
  searchQuery.value = ''
  parentFilter.value = ''
  currentPage.value = 1
}

// 树形结构处理方法
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

const toggleExpand = (deptId) => {
  const index = expandedIds.value.indexOf(deptId)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(deptId)
  }
}

const showAddModalFromTree = (parentId) => {
  departmentForm.value.parentId = parentId
  showAddModal.value = true
}

const editDepartment = (dept) => {
  currentDepartment.value = { ...dept }
  departmentForm.value = { 
    name: dept.name,
    parentId: dept.parentId || '',
    description: dept.description || '',
    status: dept.status
  }
  showEditModal.value = true
}

const manageEmployees = (dept) => {
  currentDepartment.value = { ...dept }
  showEmployeeModal.value = true
}



const deleteDepartment = async (dept) => {
  if (confirm(`确定要删除部门「${dept.name}」吗？此操作不可恢复。`)) {
    try {
      const response = await departmentAPI.deleteDepartment(dept.id)
      
      if (response.success) {
        const index = departments.value.findIndex(d => d.id === dept.id)
        if (index > -1) {
          departments.value.splice(index, 1)
          // 重置相关员工的部门ID
          allEmployees.value.forEach(emp => {
            if (emp.departmentId === dept.id) {
              emp.departmentId = ''
            }
          })
        }
        console.log(`部门 ${dept.name} 已删除`)
        ElMessage.success({message: `部门 ${dept.name} 已删除`, duration: 1000})
        await fetchDepartments()
      } else {
        ElMessage.error({message: `删除失败: ${response.message}`, duration: 1000})
      }
    } catch (error) {
      ElMessage.error({message: '删除部门失败: ' + (error.message || '未知错误'), duration: 1000})
    }
  }
}

const saveDepartment = async () => {
  // 验证表单
  if (!departmentForm.value.name.trim()) {
    ElMessage.error({message: '请输入部门名称', duration: 1000})
    return
  }
  
  // 防止重复点击
  if (isSaving.value) {
    return
  }
  
  isSaving.value = true
  
  try {
    const formData = {
      name: departmentForm.value.name,
      parentId: departmentForm.value.parentId || null,
      description: departmentForm.value.description || '',
      status: departmentForm.value.status
    }
    
    let response
    if (showEditModal.value) {
      // 编辑模式
      response = await departmentAPI.updateDepartment(currentDepartment.value.id, formData)
    } else {
      // 添加模式
      response = await departmentAPI.createDepartment(formData)
    }
    
    if (response.success) {
      // 重新加载部门列表
      await fetchDepartments()
      ElMessage.success({message: showEditModal.value ? '部门更新成功' : '部门创建成功', duration: 1000})
      closeModal()
    } else {
      ElMessage.error({message: `保存失败: ${response.message}`, duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '保存部门失败: ' + (error.message || '未知错误'), duration: 1000})
  } finally {
    isSaving.value = false
  }
}

const removeEmployee = (emp) => {
  if (confirm(`确定要将 ${emp.username} 移出 ${currentDepartment.value.name} 部门吗？`)) {
    emp.departmentId = ''
    // 更新部门员工数量
    const dept = departments.value.find(d => d.id === currentDepartment.value.id)
    if (dept) {
      dept.employeeCount--
    }
  }
}

const addEmployee = (emp) => {
  emp.departmentId = currentDepartment.value.id
  // 更新部门员工数量
  const dept = departments.value.find(d => d.id === currentDepartment.value.id)
  if (dept) {
    dept.employeeCount++
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  isSaving.value = false // 重置保存状态
  departmentForm.value = {
    name: '',
    parentId: '',
    description: '',
    status: 'active'
  }
  currentDepartment.value = {}
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  currentDepartment.value = {}
}

// 获取部门列表
const fetchDepartments = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value,
      department: parentFilter.value
    }
    
    console.log('正在获取部门列表，参数:', params)
    const response = await departmentAPI.getDepartmentList(params)
    console.log('部门列表响应:', response)
    
    if (response.success) {
      // 直接使用后端返回的数据格式
      departments.value = response.data.map(dept => ({
        id: dept.id,
        code: dept.department_code || '',
        name: dept.department_name,
        parentId: dept.parent_id || '',
        description: dept.remarks || '',
        status: dept.status || 'active',
        employeeCount: 0, // 后端没有员工数量字段，设为0
        createdAt: dept.create_at || new Date().toISOString()
      }))
      
      totalDepartments.value = response.pagination?.total || response.total || 0
      
      // 构建树形结构
      departmentTree.value = buildDepartmentTree(departments.value)
      console.log('树形结构构建完成:', departmentTree.value)
    } else {
      console.error('获取部门列表失败:', response.message)
      ElMessage.error({message: '获取部门列表失败: ' + response.message, duration: 1000})
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    console.error('错误详情:', error.message, error.stack)
    ElMessage.error({message: '获取部门列表失败: ' + (error.message || '网络错误'), duration: 1000})
  } finally {
    loading.value = false
  }
}

// 获取部门选项（用于下拉选择）
const fetchDepartmentOptions = async () => {
  try {
    console.log('正在获取部门选项...')
    const response = await departmentAPI.getDepartmentOptions()
    console.log('部门选项响应:', response)
    
    if (response.success) {
      // 直接使用后端返回的数据格式
      departmentOptions.value = response.data.map(dept => ({
        value: dept.id,
        label: dept.department_name || '未知部门'
      }))
      console.log('部门选项获取成功，共', departmentOptions.value.length, '个选项')
    } else {
      console.error('获取部门选项失败:', response.message)
    }
  } catch (error) {
    console.error('获取部门选项失败:', error)
    console.error('错误详情:', error.message)
  }
}
// 监听分页变化
watch([currentPage, pageSize], () => {
  fetchDepartments()
})

// 生命周期
onMounted(() => {
  fetchDepartments()
  fetchDepartmentOptions()
  console.log('部门管理页面加载完成')
})
</script>