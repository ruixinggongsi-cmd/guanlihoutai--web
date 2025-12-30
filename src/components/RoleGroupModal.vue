<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-slate-800/90 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-scale-in">
      <!-- 模态框头部 - 固定在顶部 -->
      <div class="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
        <h3 class="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {{ title }}
        </h3>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
        >
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- 模态框内容 - 可滚动区域 -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="flex gap-6 items-start">
            <!-- 左侧：基本信息 + 数据权限 -->
            <div ref="leftContentRef" class="flex-1 space-y-6">
              <!-- 基本信息 -->
              <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
                <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                  <i class="fas fa-info-circle mr-2 text-primary"></i>
                  基本信息
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      权限组代码 <span class="text-danger">*</span>
                    </label>
                    <input 
                      v-model="formData.role_code"
                      type="text"
                      required
                      :disabled="isEdit"
                      placeholder="输入权限组代码"
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    >
                    <p class="text-xs text-gray-400 mt-1">权限组代码一旦创建不可修改</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      权限组名称 <span class="text-danger">*</span>
                    </label>
                    <input 
                      v-model="formData.role_name"
                      type="text"
                      required
                      placeholder="输入权限组名称"
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    >
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    备注
                  </label>
                  <textarea 
                    v-model="formData.remarks"
                    rows="3"
                    placeholder="输入备注信息"
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- 数据权限 -->
              <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
                <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                  <i class="fas fa-database mr-2 text-warning"></i>
                  数据权限
                </h4>
                
                <div class="grid grid-cols-1 gap-4">
                  <div 
                    @click="formData.data_permission = 'all'"
                    :class="[
                      'backdrop-blur-lg rounded-xl border p-4 cursor-pointer transition-all duration-300',
                      formData.data_permission === 'all' 
                        ? 'bg-primary/20 border-primary text-white' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    ]"
                  >
                    <div class="flex items-center">
                      <div class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                           :class="formData.data_permission === 'all' ? 'border-primary bg-primary' : 'border-gray-400'">
                        <div v-if="formData.data_permission === 'all'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div class="font-medium flex items-center">
                          <i class="fas fa-globe mr-2"></i>
                          全部数据
                        </div>
                        <div class="text-xs mt-1 opacity-75">可查看系统内所有数据</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    @click="formData.data_permission = 'department'"
                    :class="[
                      'backdrop-blur-lg rounded-xl border p-4 cursor-pointer transition-all duration-300',
                      formData.data_permission === 'department' 
                        ? 'bg-primary/20 border-primary text-white' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    ]"
                  >
                    <div class="flex items-center">
                      <div class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                           :class="formData.data_permission === 'department' ? 'border-primary bg-primary' : 'border-gray-400'">
                        <div v-if="formData.data_permission === 'department'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div class="font-medium flex items-center">
                          <i class="fas fa-building mr-2"></i>
                          部门数据
                        </div>
                        <div class="text-xs mt-1 opacity-75">仅可查看所在部门的数据</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    @click="formData.data_permission = 'personal'"
                    :class="[
                      'backdrop-blur-lg rounded-xl border p-4 cursor-pointer transition-all duration-300',
                      formData.data_permission === 'personal' 
                        ? 'bg-primary/20 border-primary text-white' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    ]"
                  >
                    <div class="flex items-center">
                      <div class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                           :class="formData.data_permission === 'personal' ? 'border-primary bg-primary' : 'border-gray-400'">
                        <div v-if="formData.data_permission === 'personal'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div class="font-medium flex items-center">
                          <i class="fas fa-user mr-2"></i>
                          个人数据
                        </div>
                        <div class="text-xs mt-1 opacity-75">仅可查看自己创建的数据</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：权限配置 -->
            <div class="w-96">
              <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col" :style="permissionCardStyle">
                <h4 class="text-lg font-medium text-white mb-4 flex items-center flex-shrink-0">
                  <i class="fas fa-shield-alt mr-2 text-success"></i>
                  权限配置
                </h4>
                <div class="flex-1 overflow-y-auto custom-scrollbar permission-scroll-area">
                  <div v-if="menuTreeLoading" class="flex justify-center items-center h-32">
                    <i class="fas fa-spinner fa-spin text-primary text-xl"></i>
                  </div>
                  <div v-else-if="menuTreeError" class="text-danger text-center py-4">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    {{ menuTreeError }}
                  </div>
                  <div v-else-if="menuTree.length === 0" class="text-gray-400 text-center py-4">
                    <i class="fas fa-info-circle mr-2"></i>
                    暂无菜单数据
                  </div>
                  <div v-else class="space-y-1">
                    <MenuTreePermission 
                      :menus="menuTree"
                      :selected-permissions="selectedPermissions"
                      :expanded-ids="expandedMenuIds"
                      :menu-map="menuMap"
                      :root-menus="menuTree"
                      @permission-change="handlePermissionChange"
                      @toggle-expand="handleToggleExpand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

      <!-- 操作按钮 - 固定在底部 -->
      <div class="flex justify-end space-x-4 p-6 border-t border-white/10 flex-shrink-0">
        <button 
          type="button"
          @click="handleClose"
          class="px-6 py-3 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20"
        >
          取消
        </button>
        <button 
          type="submit"
          @click="handleSubmit"
          class="px-6 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl hover:from-success-light hover:to-success disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { menuAPI } from '../api/menu.js'
import MenuTreePermission from './MenuTreePermission.vue'

// Props定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '权限组管理'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  issave: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 响应式数据
const loading = ref(false)
const visible = ref(false)
const leftContentRef = ref(null)
const rightCardHeight = ref('auto')
const isloading = ref(false)

// 表单数据
const formData = reactive({
  role_code: '',
  role_name: '',
  status: true,
  remarks: '',
  permission: {},
  data_permission: 'all' // 数据权限：all-全部数据，department-部门数据，personal-个人数据
})

const selectedModules = ref([])
const menuTree = ref([])
const menuTreeLoading = ref(false)
const menuTreeError = ref('')
const selectedPermissions = ref({})
const expandedMenuIds = ref([])
const menuMap = ref({})

// 权限模块配置
const permissionModules = [
  {
    value: 'user',
    label: '用户管理',
    description: '管理用户账号、角色分配'
  },
  {
    value: 'department',
    label: '部门管理',
    description: '管理部门组织架构'
  },
  {
    value: 'role',
    label: '权限组管理',
    description: '管理权限组和权限配置'
  },
  {
    value: 'system',
    label: '系统设置',
    description: '系统配置和参数设置'
  },
  {
    value: 'report',
    label: '报表管理',
    description: '查看和管理各类报表'
  },
  {
    value: 'log',
    label: '日志管理',
    description: '查看系统操作日志'
  }
]

// 计算属性
const isEdit = computed(() => !!props.data.role_id)

// 权限配置card样式
const permissionCardStyle = computed(() => ({
  height: rightCardHeight.value === 'auto' ? 'auto' : `${rightCardHeight.value}px`
}))

// 方法定义
const syncHeights = () => {
  nextTick(() => {
    if (leftContentRef.value) {
      rightCardHeight.value = leftContentRef.value.offsetHeight
    }
  })
}

const resetForm = () => {
  Object.assign(formData, {
    role_code: '',
    role_name: '',
    status: true,
    remarks: '',
    permission: {},
    data_permission: 'all'
  })
  selectedModules.value = []
  selectedPermissions.value = {}
}

// 递归获取所有菜单ID
const getAllMenuIds = (menus) => {
  let ids = []
  menus.forEach(menu => {
    ids.push(menu.id)
    if (menu.children && menu.children.length > 0) {
      ids = ids.concat(getAllMenuIds(menu.children))
    }
  })
  return ids
}

// 构建菜单ID到菜单对象的映射
const buildMenuMap = (menus) => {
  const map = {}
  const buildMap = (menuList) => {
    menuList.forEach(menu => {
      map[menu.id] = menu
      if (menu.children && menu.children.length > 0) {
        buildMap(menu.children)
      }
    })
  }
  buildMap(menus)
  return map
}

// 查找菜单的所有父节点ID
const findParentIds = (menuId, menuMap, rootMenus) => {
  const parentIds = []
  
  const findParent = (currentId, path = []) => {
    const menu = menuMap[currentId]
    if (!menu) return []
    
    // 在根菜单中查找父菜单
    for (const rootMenu of rootMenus) {
      if (findMenuInChildren(rootMenu, currentId)) {
        const parent = findParentMenu(rootMenu, currentId)
        if (parent && parent.id !== currentId) {
          const newPath = [...path, parent.id]
          // 继续向上查找
          const grandParents = findParent(parent.id, newPath)
          return [...grandParents, ...newPath]
        }
      }
    }
    
    return path
  }
  
  return findParent(menuId)
}

// 在菜单树中查找指定ID的菜单
const findMenuInChildren = (menu, targetId) => {
  if (menu.id === targetId) return true
  if (menu.children && menu.children.length > 0) {
    return menu.children.some(child => findMenuInChildren(child, targetId))
  }
  return false
}

// 查找指定菜单的父菜单
const findParentMenu = (rootMenu, targetId, parent = null) => {
  if (rootMenu.id === targetId) return parent
  if (rootMenu.children && rootMenu.children.length > 0) {
    for (const child of rootMenu.children) {
      const result = findParentMenu(child, targetId, rootMenu)
      if (result) return result
    }
  }
  return null
}

// 加载菜单树数据
const loadMenuTree = async () => {
  menuTreeLoading.value = true
  menuTreeError.value = ''
  try {
    const response = await menuAPI.getMenuTree()
    if (response.success && response.data) {
      menuTree.value = response.data
      // 构建菜单映射
      menuMap.value = buildMenuMap(response.data)
      // 默认展开所有菜单
      expandedMenuIds.value = getAllMenuIds(response.data)
    } else {
      menuTree.value = []
      menuMap.value = {}
      expandedMenuIds.value = []
    }
  } catch (error) {
    menuTreeError.value = '加载菜单树失败，请重试'
    menuTree.value = []
    menuMap.value = {}
    expandedMenuIds.value = []
  } finally {
    menuTreeLoading.value = false
  }
}

// 处理权限变更
const handlePermissionChange = (permissions) => {
  selectedPermissions.value = permissions
}

// 处理菜单展开/收起
const handleToggleExpand = (menuId) => {
  const index = expandedMenuIds.value.indexOf(menuId)
  if (index > -1) {
    expandedMenuIds.value.splice(index, 1)
  } else {
    expandedMenuIds.value.push(menuId)
  }
}

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

const handleSubmit = async () => {
  // 防止重复提交
  if (loading.value) {
    return
  }
  
  // 表单验证
  if (!formData.role_code.trim()) {
    ElMessage.error({message: '请输入权限组代码', duration: 1000})
    return
  }
  
  if (!formData.role_name.trim()) {
    ElMessage.error({message: '请输入权限组名称', duration: 1000})
    return
  }

  // 构建权限配置 - 基于菜单树形结构
  const permission = {
    modules: Object.keys(selectedPermissions.value),
    permissions: selectedPermissions.value
  }

  const submitData = {
    ...formData,
    permission: permission
  }

  loading.value = true
  try {
    await emit('confirm', submitData)
    // 成功时保持loading状态，等待父组件关闭模态框
  } catch (error) {
    ElMessage.error({message: error.message || '保存权限组失败', duration: 1000})
    // 操作失败时重置loading状态，允许再次点击
    loading.value = false
  }
  // 注意：成功时不重置loading，等待父组件关闭模态框
}

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    loadMenuTree()
    if (!props.data.role_id) {
      resetForm()
    }
    // 延迟同步高度，确保DOM渲染完成
    setTimeout(() => {
      syncHeights()
    }, 100)
  }
})

watch(() => props.data, (newData) => {
  if (newData && newData.role_id) {
    // 编辑模式
    Object.assign(formData, {
      role_code: newData.role_code || '',
      role_name: newData.role_name || '',
      status: newData.status !== undefined ? newData.status : true,
      remarks: newData.remarks || '',
      data_permission: newData.data_permission || 'all'
    })
    
    // 解析权限配置
    if (newData.permission) {
      try {
        const permission = typeof newData.permission === 'string' 
          ? JSON.parse(newData.permission) 
          : newData.permission
        
        selectedModules.value = permission.modules || []
        selectedPermissions.value = permission.permissions || {}
      } catch (error) {
        selectedModules.value = []
        selectedPermissions.value = {}
      }
    }
  } else {
    // 新增模式
    resetForm()
  }
}, { immediate: true })
watch(() => props.issave, (newVal) => {
  console.log(newVal)
    loading.value = newVal
})
// 监听selectedModules变化
watch(selectedModules, (newModules) => {
  // 不需要在这里更新formData.permission，因为提交时会构建
})

onMounted(() => {
  visible.value = props.modelValue
  // 监听窗口大小变化
  window.addEventListener('resize', syncHeights)
})

onUnmounted(() => {
  console.log(props.issave)
  loading.value = props.issave
  // 移除监听
  window.removeEventListener('resize', syncHeights)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* 动画效果 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 1), rgba(139, 92, 246, 1));
}

/* Firefox滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.6) rgba(255, 255, 255, 0.05);
}

/* 权限配置区域特殊样式 */
.permission-scroll-area {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  margin: 4px 0;
}

.permission-scroll-area:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-color: rgba(255, 255, 255, 0.12);
}

/* 权限滚动条特殊效果 */
.permission-scroll-area::-webkit-scrollbar-track {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 4px;
}

.permission-scroll-area::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
  box-shadow: 
    0 0 8px rgba(99, 102, 241, 0.4),
    inset 0 0 2px rgba(255, 255, 255, 0.3);
}

.permission-scroll-area::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
  box-shadow: 
    0 0 12px rgba(99, 102, 241, 0.6),
    inset 0 0 2px rgba(255, 255, 255, 0.4);
}
</style>