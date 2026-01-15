<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
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
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-box text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  底料数据管理
                </h1>
                <p class="text-gray-400 text-lg">管理和维护底料数据，支持去重检查功能</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="showAddModal = true"
                class="px-6 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">新增底料</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <div class="relative">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索底料名称、编号或描述..."
                class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <select 
              v-model="statusFilter"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">所有状态</option>
              <option value="active" class="bg-slate-800">可用</option>
              <option value="inactive" class="bg-slate-800">不可用</option>
              <option value="archived" class="bg-slate-800">已归档</option>
            </select>
            <select 
              v-model="categoryFilter"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">所有分类</option>
              <option v-for="cat in categories" :key="cat" :value="cat" class="bg-slate-800">{{ cat }}</option>
            </select>
            <button 
              @click="searchMaterials"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-search mr-2"></i>
              搜索
            </button>
            <button 
              @click="resetFilter"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-redo mr-2"></i>
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 底料列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">底料名称</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">编号</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">分类</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">规格</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">价格</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">创建时间</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="material in materials" :key="material.id" class="hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ material.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ material.code || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ material.category || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ material.specification || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ material.price ? `¥${material.price}` : '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(material.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(material.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ formatDate(material.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editMaterial(material)"
                      class="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <i class="fas fa-edit mr-1"></i>
                      编辑
                    </button>
                    <button 
                      @click="deleteMaterial(material)"
                      class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <i class="fas fa-trash mr-1"></i>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="materials.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-400">
                  <i class="fas fa-box-open text-4xl mb-4 opacity-50"></i>
                  <p>暂无底料数据</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="px-6 py-4 border-t border-white/20 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCount) }} 条，共 {{ totalCount }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              < 上一页
            </button>
            <span class="px-4 py-2 text-white">{{ currentPage }}/{{ totalPages }}</span>
            <button 
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页 >
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑底料模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative w-full max-w-3xl mx-4 bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-white/20 sticky top-0 bg-slate-800/90 z-10">
          <h3 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {{ showEditModal ? '编辑底料' : '新增底料' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="saveMaterial" class="p-6 space-y-6">
          <!-- 去重检查提示 -->
          <div v-if="duplicateCheckResult" :class="duplicateCheckResult.isDuplicate ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'" class="p-4 rounded-xl border">
            <div class="flex items-center space-x-2">
              <i :class="duplicateCheckResult.isDuplicate ? 'fas fa-exclamation-triangle text-red-400' : 'fas fa-check-circle text-green-400'"></i>
              <span :class="duplicateCheckResult.isDuplicate ? 'text-red-300' : 'text-green-300'" class="text-sm font-medium">
                {{ duplicateCheckResult.message }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">底料名称 *</label>
              <input 
                v-model="currentMaterial.name" 
                type="text" 
                required
                @blur="checkDuplicate"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入底料名称"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">底料编号</label>
              <input 
                v-model="currentMaterial.code" 
                type="text" 
                @blur="checkDuplicate"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入底料编号（可选）"
              >
              <p class="text-xs text-gray-400 mt-1">如果填写编号，将检查名称+编号的组合是否重复</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">分类</label>
              <input 
                v-model="currentMaterial.category" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入分类"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">规格</label>
              <input 
                v-model="currentMaterial.specification" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入规格"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">单位</label>
              <input 
                v-model="currentMaterial.unit" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="如：kg、个、箱等"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">价格</label>
              <input 
                v-model.number="currentMaterial.price" 
                type="number" 
                step="0.01"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="0.00"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">状态 *</label>
              <select 
                v-model="currentMaterial.status" 
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="active" class="bg-slate-800">可用</option>
                <option value="inactive" class="bg-slate-800">不可用</option>
                <option value="archived" class="bg-slate-800">已归档</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">来源</label>
              <input 
                v-model="currentMaterial.source" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入来源"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">供应商</label>
              <input 
                v-model="currentMaterial.supplier" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入供应商名称"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">供应商联系方式</label>
              <input 
                v-model="currentMaterial.supplier_contact" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="电话、邮箱等"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">描述</label>
              <textarea 
                v-model="currentMaterial.description" 
                rows="3"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入描述信息"
              ></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">备注</label>
              <textarea 
                v-model="currentMaterial.notes" 
                rows="3"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入备注信息"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-4 pt-6 border-t border-white/20">
            <button 
              type="button" 
              @click="closeModal"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-times mr-2"></i>
              取消
            </button>
            <button 
              type="submit"
              :disabled="duplicateCheckResult && duplicateCheckResult.isDuplicate"
              class="px-8 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-success-light hover:to-success transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-save mr-2"></i>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { baseMaterialAPI } from '../../api/baseMaterials.js'
import { ElMessage } from 'element-plus'

// 响应式数据
const materials = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const showAddModal = ref(false)
const showEditModal = ref(false)
const duplicateCheckResult = ref(null)
const categories = ref([])

const currentMaterial = ref({
  name: '',
  code: '',
  category: '',
  description: '',
  specification: '',
  unit: '',
  price: null,
  status: 'active',
  source: '',
  supplier: '',
  supplier_contact: '',
  notes: ''
})

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 方法
const loadData = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      category: categoryFilter.value
    }
    
    const response = await baseMaterialAPI.getBaseMaterialList(params)
    
    if (response.success) {
      materials.value = response.data
      totalCount.value = response.pagination.total
      
      // 提取分类列表
      const uniqueCategories = [...new Set(response.data.map(m => m.category).filter(Boolean))]
      categories.value = uniqueCategories
    } else {
      ElMessage.error({message: response.message || '获取底料列表失败', duration: 2000})
    }
  } catch (error) {
    console.error('加载底料数据失败:', error)
    ElMessage.error({message: '加载底料数据失败', duration: 2000})
  }
}

const searchMaterials = () => {
  currentPage.value = 1
  loadData()
}

const resetFilter = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  currentPage.value = 1
  loadData()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadData()
  }
}

const editMaterial = (material) => {
  currentMaterial.value = { ...material }
  duplicateCheckResult.value = null
  showEditModal.value = true
}

const deleteMaterial = async (material) => {
  if (confirm(`确定要删除底料 "${material.name}" 吗？此操作不可恢复。`)) {
    try {
      const response = await baseMaterialAPI.deleteBaseMaterial(material.id)
      
      if (response.success) {
        ElMessage.success({message: '底料删除成功', duration: 2000})
        loadData()
      } else {
        ElMessage.error({message: response.message || '删除底料失败', duration: 2000})
      }
    } catch (error) {
      console.error('删除底料失败:', error)
      ElMessage.error({message: '删除底料失败', duration: 2000})
    }
  }
}

// 检查底料是否重复
const checkDuplicate = async () => {
  if (!currentMaterial.value.name || !currentMaterial.value.name.trim()) {
    duplicateCheckResult.value = null
    return
  }

  try {
    const response = await baseMaterialAPI.checkDuplicate({
      name: currentMaterial.value.name.trim(),
      code: currentMaterial.value.code ? currentMaterial.value.code.trim() : '',
      id: showEditModal.value ? currentMaterial.value.id : null
    })
    
    if (response.success) {
      duplicateCheckResult.value = response
    }
  } catch (error) {
    console.error('检查底料重复失败:', error)
  }
}

const saveMaterial = async () => {
  if (!currentMaterial.value.name || !currentMaterial.value.name.trim()) {
    ElMessage.error({message: '底料名称不能为空', duration: 2000})
    return
  }

  // 如果检查到重复，不允许保存
  if (duplicateCheckResult.value && duplicateCheckResult.value.isDuplicate) {
    ElMessage.warning({message: '底料重复，请修改名称或编号', duration: 2000})
    return
  }
  
  try {
    let response
    
    if (showEditModal.value) {
      response = await baseMaterialAPI.updateBaseMaterial(currentMaterial.value.id, currentMaterial.value)
    } else {
      response = await baseMaterialAPI.createBaseMaterial(currentMaterial.value)
    }
    
    if (response.success) {
      ElMessage.success({message: showEditModal.value ? '底料更新成功' : '底料创建成功', duration: 2000})
      closeModal()
      loadData()
    } else {
      ElMessage.error({message: response.message || (showEditModal.value ? '更新底料失败' : '创建底料失败'), duration: 2000})
    }
  } catch (error) {
    console.error('保存底料失败:', error)
    ElMessage.error({message: showEditModal.value ? '更新底料失败' : '创建底料失败', duration: 2000})
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentMaterial.value = {
    name: '',
    code: '',
    category: '',
    description: '',
    specification: '',
    unit: '',
    price: null,
    status: 'active',
    source: '',
    supplier: '',
    supplier_contact: '',
    notes: ''
  }
  duplicateCheckResult.value = null
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-yellow-500/20 text-yellow-400',
    archived: 'bg-gray-500/20 text-gray-400'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    active: '可用',
    inactive: '不可用',
    archived: '已归档'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
})
</script>

