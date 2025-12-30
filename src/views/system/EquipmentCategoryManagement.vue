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
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-layer-group text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  设备分类管理
                </h1>
                <p class="text-gray-400 text-lg">管理系统中设备的主分类和子分类，支持层级结构管理</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'equipment_category:add'"
                @click="showAddMainCategoryModal"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">添加主分类</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类树形列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl">
        <div class="p-6">
          <div class="space-y-4">
            <!-- 主分类列表 -->
            <div v-for="category in mainCategories" :key="category.id" class="border border-white/10 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center flex-1">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mr-3">
                    <i :class="category.icon || 'fas fa-folder'" class="text-primary"></i>
                  </div>
                  <div class="flex-1 flex items-center">
                      <h3 class="text-white font-medium text-lg flex-shrink-0">{{ category.name }}</h3>
                      <p class="text-gray-400 text-sm flex-1 text-center">{{ category.description || '暂无描述' }}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    v-permission="'equipment_category:edit'"
                    @click="editMainCategory(category)"
                    class="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
                  >
                    <i class="fas fa-edit mr-1"></i>
                    编辑
                  </button>
                  <button 
                    v-permission="'equipment_category:delete'"
                    @click="deleteCategory(category)"
                    class="px-3 py-1 bg-danger/20 text-danger border border-danger/30 rounded-lg hover:bg-danger/30 transition-all duration-300 text-sm"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    删除
                  </button>
                  <button 
                    v-permission="'equipment_category:add'"
                    @click="showAddSubCategoryModal(category)"
                    class="px-3 py-2 bg-gradient-to-r from-success to-success-light text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  >
                    <i class="fas fa-plus mr-1"></i>
                    添加子分类
                  </button>
                </div>
              </div>
              
              <!-- 子分类列表 -->
              <div v-if="getSubCategories(category.id).length > 0" class="ml-8 mt-4 space-y-2">
                <div 
                  v-for="subCategory in getSubCategories(category.id)" 
                  :key="subCategory.id"
                  class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div class="flex items-center flex-1">
                    <div class="w-6 h-6 bg-gradient-to-br from-success/20 to-info/20 rounded flex items-center justify-center mr-3">
                      <i :class="subCategory.icon || 'fas fa-tag'" class="text-success text-sm"></i>
                    </div>
                    <div class="flex-1 flex items-center">
                    <div class="text-white font-medium flex-shrink-0">{{ subCategory.name }}</div>
                    <div class="text-gray-400 text-xs flex-1 text-center">{{ subCategory.description || '暂无描述' }}</div>

                  </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      v-permission="'equipment_category:edit'"
                      @click="editSubCategory(subCategory)"
                      class="px-2 py-1 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-all duration-300 text-xs"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-permission="'equipment_category:delete'"
                      @click="deleteCategory(subCategory)"
                      class="px-2 py-1 bg-danger/20 text-danger border border-danger/30 rounded hover:bg-danger/30 transition-all duration-300 text-xs"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-else class="ml-8 mt-4 text-center py-4 border-2 border-dashed border-white/10 rounded-lg">
                <div class="text-gray-400 text-sm">
                  <i class="fas fa-inbox mb-2"></i>
                  <div>暂无子分类</div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="mainCategories.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-layer-group text-6xl mb-4"></i>
                <div class="text-xl font-medium mb-2">暂无设备分类</div>
                <div class="text-sm">点击"添加主分类"按钮开始创建设备分类</div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类模态框 -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">
              {{ editingCategory ? (currentMainCategory ? '编辑子分类' : '编辑主分类') : (currentMainCategory ? '添加子分类' : '添加主分类') }}
            </h3>
            <button 
              @click="closeCategoryModal"
              class="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div v-if="currentMainCategory">
              <label class="block text-sm font-medium text-gray-400 mb-2">所属主分类</label>
              <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white">
                <i :class="currentMainCategory.icon" class="mr-2"></i>
                {{ currentMainCategory.name }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                {{ currentMainCategory ? '子分类名称' : '分类名称' }} <span class="text-danger">*</span>
              </label>
              <input 
                v-model="categoryForm.category_name"
                type="text" 
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                :placeholder="currentMainCategory ? '请输入子分类名称' : '请输入分类名称'"
              >
            </div>



            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">分类图标</label>
              <div class="flex space-x-2">
                <input 
                  v-model="categoryForm.icon"
                  type="text" 
                  class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="如：fas fa-industry"
                >
                <button 
                  type="button"
                  @click="showIconPicker = !showIconPicker"
                  class="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  <i :class="categoryForm.icon || 'fas fa-folder'"></i>
                </button>
              </div>
            </div>

            <!-- 图标选择器 -->
            <div v-if="showIconPicker" class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-3">
              <div class="text-sm text-gray-400 mb-2">常用图标</div>
              <div class="grid grid-cols-8 gap-2">
                <button 
                  v-for="icon in commonIcons" 
                  :key="icon"
                  type="button"
                  @click="selectIcon(icon)"
                  class="w-8 h-8 flex items-center justify-center text-white hover:bg-primary/20 rounded-lg transition-all duration-300"
                  :class="{ 'bg-primary/30': categoryForm.icon === icon }"
                >
                  <i :class="icon"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">分类描述</label>
              <textarea 
                v-model="categoryForm.description"
                rows="3"
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入分类描述（可选）"
              ></textarea>
            </div>



          </form>
        </div>

        <div class="px-6 py-4 border-t border-white/20 flex justify-end space-x-3">
          <button 
            v-permission="'equipment_category:view'"
            @click="closeCategoryModal"
            class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            取消
          </button>
          <button 
            v-permission="editingCategory ? 'equipment_category:edit' : 'equipment_category:add'"
            @click="saveCategory"
            :disabled="isSaving"
            class="px-6 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-success-light hover:to-success transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <i class="fas fa-save mr-2" :class="{ 'fa-spin': isSaving }"></i>
            {{ isSaving ? '保存中...' : (editingCategory ? '更新' : '保存') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getEquipmentCategories, 
  createEquipmentCategory, 
  updateEquipmentCategory, 
  deleteEquipmentCategory 
} from '../../api/equipmentCategory.js'

// 数据存储键名
const MAIN_CATEGORIES_KEY = 'equipmentMainCategories'
const SUB_CATEGORIES_KEY = 'equipmentSubCategories'

// 加载状态
const loading = ref(false)

// 响应式数据
const mainCategories = ref([])
const subCategories = ref([])

// 模态框状态
const showCategoryModal = ref(false)
const showIconPicker = ref(false)
const editingCategory = ref(null)
const currentMainCategory = ref(null) // 仅用于子分类时记录主分类
const isSaving = ref(false) // 保存状态，用于防重复点击

// 统一的表单数据
const categoryForm = ref({
  category_name: '',
  icon: '',
  description: ''
})

// 常用图标
const commonIcons = [
  'fas fa-industry', 'fas fa-cogs', 'fas fa-tools', 'fas fa-wrench',
  'fas fa-desktop', 'fas fa-laptop', 'fas fa-print', 'fas fa-copy',
  'fas fa-car', 'fas fa-truck', 'fas fa-ship', 'fas fa-plane',
  'fas fa-search', 'fas fa-microscope', 'fas fa-calculator', 'fas fa-chart-line',
  'fas fa-home', 'fas fa-building', 'fas fa-warehouse', 'fas fa-store'
]

// 计算属性
const totalSubCategories = computed(() => {
  return subCategories.value.length
})

const totalEquipmentCount = computed(() => {
  // 这里应该从设备数据中获取，暂时返回模拟数据
  const equipmentData = JSON.parse(localStorage.getItem('equipmentData') || '[]')
  return equipmentData.length
})

// 方法
const getSubCategories = (mainCategoryId) => {
  return subCategories.value.filter(sub => sub.mainCategoryId === mainCategoryId)
}

const loadCategories = async () => {
  try {
    loading.value = true
    const response = await getEquipmentCategories()
    
    if (response.success) {
      // 从后端获取的树形结构数据转换为前端需要的格式
      mainCategories.value = response.data.map(category => ({
        id: category.id,
        name: category.category_name,
        icon: category.icon || 'fas fa-folder',
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at
      }))
      
      // 提取所有子分类
      const allSubCategories = []
      response.data.forEach(category => {
        if (category.children && category.children.length > 0) {
          category.children.forEach(child => {
            allSubCategories.push({
              id: child.id,
              mainCategoryId: category.id,
              name: child.category_name,
              icon: child.icon,
              description: child.description,
              created_at: child.created_at,
              updated_at: child.updated_at
            })
          })
        }
      })
      subCategories.value = allSubCategories
    } else {
      // 如果获取失败，使用本地存储的数据作为备选
      loadLocalCategories()
    }
  } catch (error) {
    // 如果网络请求失败，使用本地存储的数据作为备选
    loadLocalCategories()
  } finally {
    loading.value = false
  }
}

// 加载本地存储的分类数据（作为备选）
const loadLocalCategories = () => {
  // 加载主分类
  const savedMainCategories = localStorage.getItem(MAIN_CATEGORIES_KEY)
  if (savedMainCategories) {
    mainCategories.value = JSON.parse(savedMainCategories)
  }

  // 加载子分类
  const savedSubCategories = localStorage.getItem(SUB_CATEGORIES_KEY)
  if (savedSubCategories) {
    subCategories.value = JSON.parse(savedSubCategories)
  }
}

const saveCategories = () => {
  localStorage.setItem(MAIN_CATEGORIES_KEY, JSON.stringify(mainCategories.value))
  localStorage.setItem(SUB_CATEGORIES_KEY, JSON.stringify(subCategories.value))
}

// 统一的分类管理方法
const showAddMainCategoryModal = () => {
  editingCategory.value = null
  currentMainCategory.value = null
  categoryForm.value = {
    category_name: '',
    parent_id: null,
    icon: '',
    description: ''
  }
  showCategoryModal.value = true
}

const editMainCategory = (category) => {
  editingCategory.value = category
  currentMainCategory.value = null
  categoryForm.value = {
    category_name: category.category_name || category.name,
    parent_id: category.parent_id || null,
    icon: category.icon,
    description: category.description
  }
  showCategoryModal.value = true
}

const showAddSubCategoryModal = (mainCategory) => {
  editingCategory.value = null
  currentMainCategory.value = mainCategory
  categoryForm.value = {
    category_name: '',
    parent_id: mainCategory.id,
    icon: '',
    description: ''
  }
  showCategoryModal.value = true
}

const editSubCategory = (subCategory) => {
  editingCategory.value = subCategory
  currentMainCategory.value = mainCategories.value.find(c => c.id === subCategory.mainCategoryId)
  categoryForm.value = {
    category_name: subCategory.category_name || subCategory.name,
    parent_id: subCategory.parent_id || subCategory.mainCategoryId,
    icon: subCategory.icon,
    description: subCategory.description
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
  currentMainCategory.value = null
  showIconPicker.value = false
  isSaving.value = false // 重置保存状态
}

const saveCategory = async () => {
  if (!categoryForm.value.category_name.trim()) {
    ElMessage.warning({message: '请输入分类名称', duration: 1000})
    return
  }

  // 防重复点击检查
  if (isSaving.value) {
    return
  }

  try {
    loading.value = true
    isSaving.value = true
    const categoryData = {
      category_name: categoryForm.value.category_name,
      parent_id: categoryForm.value.parent_id,
      icon: categoryForm.value.icon || (categoryForm.value.parent_id ? 'fas fa-tag' : 'fas fa-folder'),
      description: categoryForm.value.description
    }

    if (editingCategory.value) {
      // 更新现有分类
      const response = await updateEquipmentCategory(editingCategory.value.id, categoryData)
      if (response.success) {
        if (categoryData.parent_id) {
          // 子分类
          Object.assign(editingCategory.value, {
            name: categoryData.category_name,
            category_name: categoryData.category_name,
            icon: categoryData.icon,
            description: categoryData.description,
            parent_id: categoryData.parent_id
          })
        } else {
          // 主分类
          Object.assign(editingCategory.value, {
            name: categoryData.category_name,
            category_name: categoryData.category_name,
            icon: categoryData.icon,
            description: categoryData.description
          })
        }
        ElMessage.success({message: '分类更新成功', duration: 1000})
      } else {
        ElMessage.error({message: '更新失败：' + (response.error || '未知错误'), duration: 1000})
        isSaving.value = false // 失败时重置状态
        return
      }
    } else {
      // 创建新分类
      const response = await createEquipmentCategory(categoryData)
      if (response.success) {
        const newCategory = {
          id: response.data.id,
          category_name: categoryData.category_name,
          name: categoryData.category_name,
          icon: categoryData.icon,
          description: categoryData.description,
          parent_id: categoryData.parent_id,
          mainCategoryId: categoryData.parent_id, // 兼容现有逻辑
          created_at: response.data.created_at,
          updated_at: response.data.updated_at
        }
        
        if (categoryData.parent_id) {
          // 子分类
          subCategories.value.push(newCategory)
        } else {
          // 主分类
          mainCategories.value.push(newCategory)
        }
        ElMessage.success({message: '分类创建成功', duration: 1000})
      } else {
        ElMessage.error({message: '创建失败：' + (response.error || '未知错误'), duration: 1000})
        isSaving.value = false // 失败时重置状态
        return
      }
    }

    closeCategoryModal()
  } catch (error) {
    ElMessage.error({message: '保存失败：' + error.message, duration: 1000})
    isSaving.value = false // 异常时重置状态
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (category) => {
  const isMainCategory = !category.parent_id && !category.mainCategoryId
  const message = isMainCategory 
    ? `确定要删除主分类"${category.name || category.category_name}"吗？<br>注意：删除主分类将同时删除其下的所有子分类！`
    : `确定要删除子分类"${category.name || category.category_name}"吗？`
    
  try {
    await ElMessageBox.confirm(message, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    })
    try {
      loading.value = true
      const response = await deleteEquipmentCategory(category.id)
      
      if (response.success) {
        if (isMainCategory) {
          // 删除主分类及其下所有子分类
          mainCategories.value = mainCategories.value.filter(c => c.id !== category.id)
          subCategories.value = subCategories.value.filter(sub => sub.mainCategoryId !== category.id)
        } else {
          // 删除子分类
          subCategories.value = subCategories.value.filter(sub => sub.id !== category.id)
        }
        ElMessage.success({message: '分类删除成功', duration: 1000})
      } else {
        ElMessage.error({message: '删除失败：' + (response.error || '未知错误'), duration: 1000})
      }
    } catch (error) {
    ElMessage.error({message: '删除失败：' + error.message, duration: 1000})
  } finally {
    loading.value = false
  }
} catch (error) {
    // 用户取消删除操作
    if (error === 'cancel') {
      ElMessage.info({message: '已取消删除操作', duration: 1000})
    } else {
      ElMessage.error({message: '操作失败：' + error.message, duration: 1000})
    }
  }
}

// 图标选择
const selectIcon = (icon) => {
  categoryForm.value.icon = icon
  showIconPicker.value = false
}

// 生命周期
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>