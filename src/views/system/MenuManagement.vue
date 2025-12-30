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
                <i class="fas fa-sitemap text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  菜单管理
                </h1>
                <p class="text-gray-400 text-lg">管理系统菜单结构，支持树形层级展示</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'menu:add'"
                @click="showAddModal(null)"
                class="px-6 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">新增菜单</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <button 
              v-permission="'menu:view'"
              @click="expandAll"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-expand"></i>
              <span>展开全部</span>
            </button>
            <button 
              v-permission="'menu:view'"
              @click="collapseAll"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-compress"></i>
              <span>收起全部</span>
            </button>

          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input 
                v-model="searchKeyword"
                type="text"
                placeholder="搜索菜单名称..."
                class="bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-64"
              >
              <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button 
              v-permission="'menu:view'"
              @click="handleSearch"
              class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 菜单树形表格 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl">
        <div class="p-6">
          <!-- 表格头部 -->
          <div class="grid grid-cols-11 gap-4 mb-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
            <div class="col-span-4 text-gray-300 font-medium">菜单名称</div>
            <div class="col-span-1 text-gray-300 font-medium">图标</div>
            <div class="col-span-2 text-gray-300 font-medium">路径</div>
            <div class="col-span-1 text-gray-300 font-medium text-center">类型</div>
            <div class="col-span-1 text-gray-300 font-medium text-center">状态</div>
            <div class="col-span-2 text-gray-300 font-medium text-right">操作</div>
          </div>
          
          <!-- 树形表格内容 -->
          <div class="space-y-1">
            <!-- 使用 MenuTreeItem 组件进行自我递归 -->
            <MenuTreeItem
              :menus="filteredMenuList"
              @edit-menu="editMenu"
              @delete-menu="deleteMenu"
              @show-add-modal="showAddModal"
              @toggle-expand="toggleExpand"
              :expanded-ids="expandedIds"
              :level="0"
            />
            
            <!-- 空状态 -->
            <div v-if="filteredMenuList.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-sitemap text-6xl mb-4"></i>
                <div class="text-xl font-medium mb-2">暂无菜单数据</div>
                <div class="text-sm">点击"新增菜单"按钮创建第一个菜单</div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>

    <!-- 菜单编辑模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 w-full max-w-md mx-4 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">{{ editingMenu.id ? '编辑菜单' : '新增菜单' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveMenu" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">菜单名称 *</label>
            <input 
              v-model="menuForm.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
              placeholder="请输入菜单名称"
            >
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">图标</label>
            <div class="flex items-center space-x-3">
              <div class="relative flex-1">
                <input 
                  v-model="menuForm.icon"
                  type="text"
                  class="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
                  placeholder="选择图标"
                  readonly
                >
                <button 
                  type="button"
                  @click="showIconPicker = true"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <i class="fas fa-palette"></i>
                </button>
              </div>
              <div v-if="menuForm.icon" class="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <i :class="menuForm.icon" class="text-primary"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">路径</label>
            <input 
              v-model="menuForm.path"
              type="text"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
              placeholder="例如: /system/menus"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">排序</label>
            <input 
              v-model.number="menuForm.sort_order"
              type="number"
              min="0"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
              placeholder="数字越大排序越靠前"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">类型</label>
            <select 
              v-model="menuForm.type"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
            >
              <option value="menu">菜单</option>
              <option value="function">功能</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
            <select 
              v-model="menuForm.status"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
            >
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">描述</label>
            <textarea 
              v-model="menuForm.description"
              rows="3"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none backdrop-blur-sm"
              placeholder="请输入菜单描述（可选）"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-4 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="px-6 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              取消
            </button>
            <button 
              v-permission="editingMenu.id ? 'menu:edit' : 'menu:add'"
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

    <!-- 图标选择器 -->
    <div v-if="showIconPicker" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">选择图标</h3>
          <button @click="showIconPicker = false" class="text-gray-400 hover:text-white transition-colors duration-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-8 gap-3">
          <button 
            v-for="icon in iconList" 
            :key="icon"
            @click="selectIcon(icon)"
            class="w-12 h-12 bg-white/10 hover:bg-gradient-to-br hover:from-primary to-primary-light text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
            :class="{ 'bg-gradient-to-br from-primary to-primary-light': menuForm.icon === icon }"
          >
            <i :class="icon" class="text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import MenuTreeItem from '../../components/MenuTreeItem.vue'
import { menuAPI } from '../../api/menu.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据状态
const menuList = ref([])
const loading = ref(false)

// 默认测试数据
const defaultMenuData = [
  {
    id: 1,
    name: '仪表盘',
    path: '/',
    icon: 'fas fa-tachometer-alt',
    sort_order: 1,
    status: 'active',
    description: '系统仪表盘首页',
    parent_id: null,
    type: 'menu',
    created_at: '2024-01-01 10:00:00',
    children: []
  },
  {
    id: 2,
    name: '企业管理',
    path: '',
    icon: 'fas fa-building',
    sort_order: 2,
    status: 'active',
    description: '企业相关管理功能',
    parent_id: null,
    type: 'menu',
    created_at: '2024-01-01 10:05:00',
    children: [
      {
        id: 21,
        name: '员工列表',
        path: '/users',
        icon: 'fas fa-users',
        sort_order: 1,
        status: 'active',
        description: '管理企业员工信息',
        parent_id: 2,
        type: 'function',
        created_at: '2024-01-01 10:06:00'
      },
      {
        id: 22,
        name: '部门管理',
        path: '/departments',
        icon: 'fas fa-sitemap',
        sort_order: 2,
        status: 'active',
        description: '管理企业部门结构',
        parent_id: 2,
        type: 'function',
        created_at: '2024-01-01 10:07:00'
      }
    ]
  },
  {
    id: 3,
    name: '业务管理',
    path: '',
    icon: 'fas fa-briefcase',
    sort_order: 3,
    status: 'active',
    description: '业务相关管理功能',
    parent_id: null,
    type: 'menu',
    created_at: '2024-01-01 10:10:00',
    children: [
      {
        id: 31,
        name: '费用管理',
        path: '/business/expenses',
        icon: 'fas fa-money-bill-wave',
        sort_order: 1,
        status: 'active',
        description: '管理业务费用报销',
        parent_id: 3,
        type: 'function',
        created_at: '2024-01-01 10:11:00'
      },
      {
        id: 32,
        name: '设备管理',
        path: '/business/equipment',
        icon: 'fas fa-tools',
        sort_order: 2,
        status: 'active',
        description: '管理业务设备资产',
        parent_id: 3,
        type: 'function',
        created_at: '2024-01-01 10:12:00'
      }
    ]
  },
  {
    id: 4,
    name: '系统设置',
    path: '',
    icon: 'fas fa-cog',
    sort_order: 4,
    status: 'active',
    description: '系统配置和管理',
    parent_id: null,
    type: 'menu',
    created_at: '2024-01-01 10:15:00',
    children: [
      {
        id: 41,
        name: '菜单管理',
        path: '/system/menus',
        icon: 'fas fa-sitemap',
        sort_order: 1,
        status: 'active',
        description: '管理系统菜单结构',
        parent_id: 4,
        type: 'function',
        created_at: '2024-01-01 10:16:00'
      },
      {
        id: 42,
        name: '设备分类',
        path: '/system/equipment-categories',
        icon: 'fas fa-layer-group',
        sort_order: 2,
        status: 'active',
        description: '管理设备分类信息',
        parent_id: 4,
        type: 'function',
        created_at: '2024-01-01 10:17:00'
      }
    ]
  },
  {
    id: 5,
    name: '多级菜单测试',
    path: '',
    icon: 'fas fa-layer-group',
    sort_order: 5,
    status: 'active',
    description: '测试无限层级菜单结构',
    parent_id: null,
    type: 'menu',
    created_at: '2024-01-01 10:20:00',
    children: [
      {
        id: 51,
        name: '二级菜单A',
        path: '/level2/a',
        icon: 'fas fa-folder-open',
        sort_order: 1,
        status: 'active',
        description: '二级菜单描述A',
        parent_id: 5,
        type: 'menu',
        created_at: '2024-01-01 10:21:00',
        children: [
          {
            id: 511,
            name: '三级功能X',
            path: '/level3/x',
            icon: 'fas fa-cog',
            sort_order: 1,
            status: 'active',
            description: '三级功能描述X',
            parent_id: 51,
            type: 'function',
            created_at: '2024-01-01 10:22:00'
          },
          {
            id: 512,
            name: '三级菜单B',
            path: '/level3/b',
            icon: 'fas fa-sitemap',
            sort_order: 2,
            status: 'active',
            description: '三级菜单描述B',
            parent_id: 51,
            type: 'menu',
            created_at: '2024-01-01 10:23:00',
            children: [
              {
                id: 5121,
                name: '四级功能Y',
                path: '/level4/y',
                icon: 'fas fa-star',
                sort_order: 1,
                status: 'active',
                description: '四级功能描述Y',
                parent_id: 512,
                type: 'function',
                created_at: '2024-01-01 10:24:00'
              },
              {
                id: 5122,
                name: '四级功能Z',
                path: '/level4/z',
                icon: 'fas fa-heart',
                sort_order: 2,
                status: 'active',
                description: '四级功能描述Z',
                parent_id: 512,
                type: 'function',
                created_at: '2024-01-01 10:25:00'
              }
            ]
          }
        ]
      },
      {
        id: 52,
        name: '二级功能B',
        path: '/level2/b',
        icon: 'fas fa-tag',
        sort_order: 2,
        status: 'active',
        description: '二级功能描述B',
        parent_id: 5,
        type: 'function',
        created_at: '2024-01-01 10:26:00'
      }
    ]
  }
]
const searchKeyword = ref('')
const expandedIds = ref([])

// 模态框状态
const showModal = ref(false)
const showIconPicker = ref(false)
const editingMenu = ref({})

// 保存状态
const isSaving = ref(false) // 保存状态，用于防重复点击

// 表单数据
const menuForm = ref({
  name: '',
  parent_id: '',
  icon: '',
  path: '',
  sort_order: 0,
  status: 'active',
  description: '',
  type: 'menu'
})

// 图标列表
const iconList = ref([
  'fas fa-home', 'fas fa-tachometer-alt', 'fas fa-chart-bar', 'fas fa-users', 'fas fa-user-shield',
  'fas fa-building', 'fas fa-sitemap', 'fas fa-briefcase', 'fas fa-money-bill-wave', 'fas fa-tools',
  'fas fa-clipboard-check', 'fas fa-file-invoice-dollar', 'fas fa-cog', 'fas fa-layer-group', 'fas fa-tags',
  'fas fa-project-diagram', 'fas fa-analytics', 'fas fa-database', 'fas fa-file-alt', 'fas fa-envelope',
  'fas fa-bell', 'fas fa-search', 'fas fa-filter', 'fas fa-sort', 'fas fa-download',
  'fas fa-upload', 'fas fa-share', 'fas fa-link', 'fas fa-bookmark', 'fas fa-heart',
  'fas fa-star', 'fas fa-thumbs-up', 'fas fa-comment', 'fas fa-edit', 'fas fa-trash',
  'fas fa-eye', 'fas fa-eye-slash', 'fas fa-lock', 'fas fa-unlock', 'fas fa-key',
  'fas fa-shield-alt', 'fas fa-user-check', 'fas fa-user-times', 'fas fa-sign-in-alt', 'fas fa-sign-out-alt'
])

// 递归搜索函数
const searchInTree = (menus, keyword) => {
  return menus.filter(menu => {
    const menuMatch = menu.name.toLowerCase().includes(keyword) || 
                     (menu.path && menu.path.toLowerCase().includes(keyword))
    
    if (menuMatch) return true
    
    // 递归搜索子菜单
    if (menu.children && menu.children.length > 0) {
      const childrenMatch = searchInTree(menu.children, keyword)
      if (childrenMatch.length > 0) return true
    }
    
    return false
  })
}

// 计算属性
const filteredMenuList = computed(() => {
  if (!searchKeyword.value) return menuList.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return searchInTree(menuList.value, keyword)
})

// 递归获取所有菜单（用于父菜单选择）
const getAllMenus = (menus, level = 0) => {
  let result = []
  menus.forEach(menu => {
    result.push({
      ...menu,
      level: level,
      displayName: '  '.repeat(level * 2) + '├─ ' + menu.name
    })
    if (menu.children && menu.children.length > 0) {
      result = result.concat(getAllMenus(menu.children, level + 1))
    }
  })
  return result
}

const mainMenuList = computed(() => {
  return getAllMenus(menuList.value)
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 加载菜单数据
const loadData = async () => {
  loading.value = true
  try {
    // 使用树形接口获取数据
    const response = await menuAPI.getMenuTree()
    if (response.success && response.data) {
      // 后端已经构建好树形结构，直接使用
      menuList.value = response.data
     
    } else {
      // 如果接口返回格式不符合预期，使用默认数据
      menuList.value = defaultMenuData
      ElMessage.warning({message: '接口数据格式异常，显示默认数据', duration: 1000})
    }
  } catch (error) {
    // API调用失败时，使用默认测试数据
    menuList.value = defaultMenuData
    ElMessage.error({message: '菜单数据加载失败，显示默认数据', duration: 1000})
  } finally {
    loading.value = false
  }
}

// 构建树形结构（支持无限层级）
const buildTree = (menus) => {
  const map = {}
  const result = []
  
  // 创建ID映射
  menus.forEach(menu => {
    map[menu.id] = { ...menu, children: [] }
  })
  
  // 构建树形结构
  menus.forEach(menu => {
    if (menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children.push(map[menu.id])
    } else if (!menu.parent_id) {
      result.push(map[menu.id])
    }
  })
  
  return result
}

// 展开/收起
const toggleExpand = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(id)
  }
}

const expandAll = () => {
  expandedIds.value = menuList.value.map(menu => menu.id)
}

const collapseAll = () => {
  expandedIds.value = []
}

// 搜索
const handleSearch = () => {
  // 搜索功能由计算属性自动处理
}

// 显示新增模态框
const showAddModal = (parentId = null) => {
  editingMenu.value = {}
  menuForm.value = {
    name: '',
    parent_id: parentId || '',
    icon: '',
    path: '',
    sort_order: 0,
    status: 'active',
    description: ''
  }
  showModal.value = true
}

// 编辑菜单
const editMenu = (menu) => {
  editingMenu.value = { ...menu }
  menuForm.value = {
    name: menu.name,
    parent_id: menu.parent_id || '',
    icon: menu.icon || '',
    path: menu.path || '',
    sort_order: menu.sort_order || 0,
    status: menu.status || 'active',
    description: menu.description || '',
    type: menu.type || 'menu'
  }
  showModal.value = true
}

// 保存菜单
const saveMenu = async () => {
  // 防重复点击检查
  if (isSaving.value) {
    return
  }
  
  try {
    // 表单验证
    if (!menuForm.value.name.trim()) {
      ElMessage.warning({message: '请输入菜单名称', duration: 1000})
      return
    }
    
    // 设置保存状态
    isSaving.value = true
    
    const formData = {
      ...menuForm.value,
      parent_id: menuForm.value.parent_id || null,
      sort_order: parseInt(menuForm.value.sort_order) || 0
    }
    
    let response
    if (editingMenu.value.id) {
      // 编辑模式
      response = await menuAPI.updateMenu(editingMenu.value.id, formData)
      if (response.success) {
        ElMessage.success({message: '菜单更新成功', duration: 1000})
      } else {
        ElMessage.error({message: response.message || '菜单更新失败', duration: 1000})
        isSaving.value = false // 重置保存状态
        return
      }
    } else {
      // 新增模式
      response = await menuAPI.createMenu(formData)
      if (response.success) {
        ElMessage.success({message: '菜单创建成功', duration: 1000})
      } else {
        ElMessage.error({message: response.message || '菜单创建失败', duration: 1000})
        isSaving.value = false // 重置保存状态
        return
      }
    }
    
    closeModal()
    loadData()
  } catch (error) {
    ElMessage.error({message: editingMenu.value.id ? '菜单更新失败' : '菜单创建失败', duration: 1000})
    isSaving.value = false // 重置保存状态
  }
}

// 删除菜单
const deleteMenu = async (menu) => {
  try {
    // 检查是否有子菜单
    if (menu.children && menu.children.length > 0) {
      await ElMessageBox.confirm(
        `菜单 "${menu.name}" 包含 ${menu.children.length} 个子菜单，删除操作将同时删除所有子菜单。是否继续？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
    } else {
      await ElMessageBox.confirm(
        `确定要删除菜单 "${menu.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
    }
    
    const response = await menuAPI.deleteMenu(menu.id)
    if (response.success) {
      ElMessage.success({message: '菜单删除成功', duration: 1000})
      loadData()
    } else {
      ElMessage.error({message: response.message || '菜单删除失败', duration: 1000})
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '菜单删除失败', duration: 1000})
    }
  }
}

// 选择图标
const selectIcon = (icon) => {
  menuForm.value.icon = icon
  showIconPicker.value = false
}



// 关闭模态框
const closeModal = () => {
  showModal.value = false
  showIconPicker.value = false
  editingMenu.value = {}
  menuForm.value = {
    name: '',
    parent_id: '',
    icon: '',
    path: '',
    sort_order: 0,
    status: 'active',
    description: ''
  }
  isSaving.value = false // 重置保存状态
}



// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 树形表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  background: rgba(55, 65, 81, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 子菜单缩进样式 */
tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  thead th,
  tbody td {
    padding: 0.75rem 0.5rem;
  }
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

/* 展开动画 */
.expand-enter-active {
  transition: all 0.3s ease-out;
}
.expand-leave-active {
  transition: all 0.2s ease-in;
}
.expand-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.expand-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 图标选择器网格 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 0.5rem;
}

.icon-button {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.icon-button:hover {
  transform: scale(1.1);
}

/* 自定义样式 */
.bg-primary {
  background-color: #3b82f6;
}
.bg-primary-light {
  background-color: #60a5fa;
}
.bg-success {
  background-color: #10b981;
}
.bg-success-light {
  background-color: #34d399;
}
.bg-info {
  background-color: #06b6d4;
}
.bg-danger {
  background-color: #ef4444;
}

/* 动画效果 */
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

/* 悬停效果 */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 背景装饰 */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

/* 毛玻璃效果增强 */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>