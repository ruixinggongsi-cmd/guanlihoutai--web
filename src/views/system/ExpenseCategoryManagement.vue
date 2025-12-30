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
              <div class="w-12 h-12 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-tags text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  费用分类管理
                </h1>
                <p class="text-gray-400 text-lg">管理系统中费用的主分类和子分类，支持层级结构管理</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'expense_category:add'"
                @click="showAddMainCategoryModal"
                :disabled="loading"
                class="px-6 py-3 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">添加主分类</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和操作栏 -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索分类名称或描述..."
                class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div class="flex space-x-3">
            <button
                v-permission="'expense_category:view'"
                @click="loadData"
                :disabled="loading"
                class="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
                刷新
              </button>
          </div>
        </div>
      </div>

      

      <!-- 分类树形列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl">
        <div class="p-6">
          <div v-if="loading" class="text-center py-12">
            <div class="text-gray-400">
              <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
              <div>正在加载数据...</div>
            </div>
          </div>
          <div v-else class="space-y-4">
            <!-- 主分类列表 -->
            <div v-for="category in filteredMainCategories" :key="category.id" class="border border-white/10 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center flex-1">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mr-3">
                    <i :class="category.icon || 'fas fa-folder'" class="text-primary"></i>
                  </div>
                  <div class="flex-1 flex items-center">
                  <h3 class="text-white font-medium text-lg flex-shrink-0">{{ category.category_name }}</h3>
                  <p class="text-gray-400 text-sm flex-1 text-center">{{ category.description || '暂无描述' }}</p>
                </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editMainCategory(category)"
                    :disabled="loading"
                    class="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm disabled:opacity-50"
                  >
                    <i class="fas fa-edit mr-1"></i>
                    编辑
                  </button>
                  <button 
                    @click="deleteCategory(category)"
                    :disabled="loading"
                    class="px-3 py-1 bg-danger/20 text-danger border border-danger/30 rounded-lg hover:bg-danger/30 transition-all duration-300 text-sm disabled:opacity-50"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    删除
                  </button>
                  <button 
                    v-permission="'expense_category:add'"
                    @click="showAddSubCategoryModal(category)"
                    :disabled="loading"
                    class="px-3 py-2 bg-gradient-to-r from-success to-success-light text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div class="text-white font-medium flex-shrink-0">{{ subCategory.category_name }}</div>
                    <div class="text-gray-400 text-xs flex-1 text-center">{{ subCategory.description || '暂无描述' }}</div>

                  </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      v-permission="'expense_category:edit'"
                      @click="editSubCategory(subCategory)"
                      :disabled="loading"
                      class="px-2 py-1 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-all duration-300 text-xs disabled:opacity-50"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-permission="'expense_category:delete'"
                      @click="deleteCategory(subCategory)"
                      :disabled="loading"
                      class="px-2 py-1 bg-danger/20 text-danger border border-danger/30 rounded hover:bg-danger/30 transition-all duration-300 text-xs disabled:opacity-50"
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
            <div v-if="filteredMainCategories.length === 0 && !loading" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-layer-group text-6xl mb-4"></i>
                <div class="text-xl font-medium mb-2">暂无费用分类</div>
                <div class="text-sm">点击"添加主分类"按钮开始创建费用分类</div>
              </div>
              <button 
                @click="showAddMainCategoryModal"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <i class="fas fa-plus mr-2"></i>
                添加第一个分类
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类模态框 -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">
              {{ editingCategory ? (currentMainCategory ? '编辑子分类' : '编辑主分类') : (currentMainCategory ? '添加子分类' : '添加主分类') }}
            </h3>
            <button 
              v-permission="'expense_category:view'"
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
                {{ currentMainCategory.category_name }}
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
                  placeholder="如：fas fa-building"
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
            v-permission="'expense_category:view'"
            @click="closeCategoryModal"
            class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            取消
          </button>
          <button 
            v-permission="editingCategory ? 'expense_category:edit' : 'expense_category:add'"
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
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { expenseCategoryAPI } from '../../api/expenseCategory'
import { ElMessage, ElMessageBox } from 'element-plus'

// 常用图标列表
const commonIcons = [
  'fas fa-folder', 'fas fa-building', 'fas fa-car', 'fas fa-plane', 'fas fa-train',
  'fas fa-utensils', 'fas fa-coffee', 'fas fa-gift', 'fas fa-shopping-bag', 'fas fa-shopping-cart',
  'fas fa-mobile-alt', 'fas fa-laptop', 'fas fa-desktop', 'fas fa-tablet-alt', 'fas fa-print',
  'fas fa-wifi', 'fas fa-plug', 'fas fa-lightbulb', 'fas fa-fan', 'fas fa-air-freshener',
  'fas fa-tools', 'fas fa-wrench', 'fas fa-hammer', 'fas fa-screwdriver', 'fas fa-cut',
  'fas fa-paint-brush', 'fas fa-palette', 'fas fa-pen', 'fas fa-pencil-alt', 'fas fa-marker',
  'fas fa-book', 'fas fa-file-alt', 'fas fa-copy', 'fas fa-sticky-note', 'fas fa-clipboard',
  'fas fa-calculator', 'fas fa-chart-line', 'fas fa-chart-bar', 'fas fa-chart-pie', 'fas fa-percentage',
  'fas fa-money-bill-wave', 'fas fa-credit-card', 'fas fa-coins', 'fas fa-piggy-bank', 'fas fa-university',
  'fas fa-briefcase', 'fas fa-suitcase', 'fas fa-bag-shopping', 'fas fa-box', 'fas fa-cube',
  'fas fa-truck', 'fas fa-shipping-fast', 'fas fa-warehouse', 'fas fa-store', 'fas fa-shop',
  'fas fa-users', 'fas fa-user-tie', 'fas fa-user-friends', 'fas fa-people-group', 'fas fa-person',
  'fas fa-heart', 'fas fa-star', 'fas fa-thumbs-up', 'fas fa-thumbs-down', 'fas fa-smile',
  'fas fa-envelope', 'fas fa-phone', 'fas fa-fax', 'fas fa-mail-bulk', 'fas fa-paper-plane',
  'fas fa-clock', 'fas fa-calendar', 'fas fa-calendar-alt', 'fas fa-stopwatch', 'fas fa-hourglass',
  'fas fa-map-marker-alt', 'fas fa-location-arrow', 'fas fa-compass', 'fas fa-globe', 'fas fa-earth',
  'fas fa-home', 'fas fa-key', 'fas fa-lock', 'fas fa-unlock', 'fas fa-shield-alt',
  'fas fa-camera', 'fas fa-video', 'fas fa-microphone', 'fas fa-headphones', 'fas fa-volume-up'
]

// 响应式数据
const mainCategories = ref([])
const subCategories = ref([])
const selectedMainCategory = ref('')
const loading = ref(false)
const searchQuery = ref('')
const selectedCategories = ref([])

// 表单数据
const categoryForm = ref({ 
  category_name: '', 
  description: '', 
  icon: '', 
  parent_id: ''
})

// 模态框状态
const showCategoryModal = ref(false)
const showIconPicker = ref(false)
const editingCategory = ref(false)
const currentMainCategory = ref(null)
const currentEditingCategory = ref(null)
const isSaving = ref(false) // 保存状态，用于防重复点击

// 计算属性
const filteredSubCategories = computed(() => {
  if (!selectedMainCategory.value) return []
  return subCategories.value.filter(sub => sub.parentId === selectedMainCategory.value)
})

// 计算属性 - 搜索过滤
const filteredMainCategories = computed(() => {
  if (!searchQuery.value) return mainCategories.value
  return mainCategories.value.filter(category => 
    category.category_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

// 获取子分类
const getSubCategories = (parentId) => {
  // 从主分类中找到对应的主分类，返回其子分类
  const mainCategory = mainCategories.value.find(category => category.id === parentId)
  return mainCategory?.children || []
}

// 选择图标
const selectIcon = (icon) => {
  categoryForm.icon = icon;
  showIconPicker.value = false;
};

// 方法
const loadData = async () => {
  try {
    loading.value = true
    
    // 加载所有分类
    const res = await expenseCategoryAPI.getExpenseCategories()
    if (res.success) {
      // 后端返回的是树形结构数据，主分类已经包含children属性
      mainCategories.value = res.data
      // 不再需要单独的subCategories数组，子分类通过主分类的children属性获取
      subCategories.value = []
    }
    
    ElMessage.success({message: '数据加载成功', duration: 1000})
  } catch (error) {
    ElMessage.error({message: '加载数据失败', duration: 1000})
  } finally {
    loading.value = false
  }
}

const showAddMainCategoryModal = () => {
  editingCategory.value = false
  currentMainCategory.value = null
  categoryForm.value = { 
    category_name: '', 
    description: '', 
    icon: ''
  }
  showCategoryModal.value = true
}

const showAddSubCategoryModal = (mainCategory) => {
  currentMainCategory.value = mainCategory
  editingCategory.value = false
  categoryForm.value = { 
    category_name: '', 
    description: '', 
    icon: '', 
    parent_id: mainCategory.id
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  showIconPicker.value = false
  editingCategory.value = false
  currentMainCategory.value = null
  currentEditingCategory.value = null
  isSaving.value = false // 重置保存状态
}

const saveCategory = async () => {
  // 防重复点击检查
  if (isSaving.value) {
    return
  }

  try {
    isSaving.value = true
    
    const data = {
      category_name: categoryForm.value.category_name.trim(),
      description: categoryForm.value.description?.trim() || '',
      icon: categoryForm.value.icon || null,
      parent_id: categoryForm.value.parent_id || null
    };
    
    let response;
    if (editingCategory.value) {
      // 编辑模式
      if (currentEditingCategory.value?.id) {
        response = await expenseCategoryAPI.updateExpenseCategory(currentEditingCategory.value.id, data);
      } else {
        ElMessage.error({message: '未找到要更新的分类', duration: 1000});
        isSaving.value = false // 失败时重置状态
        return;
      }
    } else {
      // 添加模式
      response = await expenseCategoryAPI.createExpenseCategory(data);
    }
    
    if (response.success) {
      ElMessage.success({message: editingCategory.value ? '分类更新成功' : '分类添加成功', duration: 1000});
      closeCategoryModal();
      loadData();
    } else {
      ElMessage.error({message: response.message || '操作失败', duration: 1000});
      isSaving.value = false // 失败时重置状态
    }
  } catch (error) {
    ElMessage.error({message: '保存失败：' + error.message, duration: 1000});
    isSaving.value = false // 异常时重置状态
  }
};

const editMainCategory = (category) => {
  editingCategory.value = true
  currentMainCategory.value = null
  currentEditingCategory.value = category
  categoryForm.value = { 
    category_name: category.category_name,
    description: category.description || '',
    icon: category.icon || ''
  }
  showCategoryModal.value = true
}

// 删除分类（统一方法）
const deleteCategory = async (category) => {
  const categoryType = category.parent_id ? '子分类' : '主分类';
  const message = category.parent_id 
    ? `确定要删除${categoryType}「${category.category_name}」吗？`
    : `确定要删除${categoryType}「${category.category_name}」吗？注意：删除主分类将同时删除其下的所有子分类！`;
    
  try {
    await ElMessageBox.confirm(message, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    });
    
    const response = await expenseCategoryAPI.deleteExpenseCategory(category.id);
    if (response.success) {
      ElMessage.success({message: `${categoryType}删除成功`, duration: 1000});
      loadData();
    } else {
      ElMessage.error({message: response.message || '删除失败', duration: 1000});
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '删除失败：' + error.message, duration: 1000});
    }
  }
};

const deleteMainCategory = deleteCategory

const editSubCategory = (subCategory) => {
  editingCategory.value = true
  currentEditingCategory.value = subCategory
  categoryForm.value = { 
    category_name: subCategory.category_name,
    description: subCategory.description || '',
    icon: subCategory.icon || '',
    parent_id: subCategory.parent_id
  }
  showCategoryModal.value = true
}

const deleteSubCategory = deleteCategory

// 保存子分类 - 已整合到统一的saveCategory方法中
const saveSubCategory = saveCategory

// 方法 - 搜索功能
const handleSearch = async () => {
  if (!searchQuery.value) {
    await loadData()
    return
  }
  
  try {
    loading.value = true
    const res = await expenseCategoryAPI.getExpenseCategories()
    
    if (res.success) {
      // 本地搜索过滤，支持搜索主分类和子分类
      const filteredData = res.data.filter(category => {
        // 搜索主分类
        const matchMainCategory = 
          category.category_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
        
        // 搜索子分类
        const matchSubCategory = category.children && category.children.some(child =>
          child.category_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (child.description && child.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
        
        return matchMainCategory || matchSubCategory
      })
      
      // 如果搜索子分类，需要过滤子分类
      mainCategories.value = filteredData.map(category => {
        if (category.children && category.children.length > 0) {
          const filteredChildren = category.children.filter(child =>
            child.category_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (child.description && child.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
          )
          return {
            ...category,
            children: filteredChildren
          }
        }
        return category
      })
    }
  } catch (error) {
    ElMessage.error({message: '搜索失败：' + error.message, duration: 1000})
  } finally {
    loading.value = false
  }
}

// 监听搜索输入
watch(searchQuery, () => {
  handleSearch()
})

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-modal-fade-in {
  animation: modal-fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: modal-scale-in 0.3s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
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
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 按钮悬停效果 */
.btn-hover-effect {
  transition: all 0.3s ease;
}

.btn-hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 输入框聚焦效果 */
.input-focus-effect {
  transition: all 0.3s ease;
}

.input-focus-effect:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>