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
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-user-shield text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  权限组管理
                </h1>
                <p class="text-gray-400 text-lg">管理系统权限组和角色配置</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'role_group:add'"
                @click="handleCreate"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">新增权限组</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl mb-6 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">权限组名称</label>
            <input 
              v-model="searchForm.roleName"
              type="text" 
              placeholder="输入权限组名称"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">权限组代码</label>
            <input 
              v-model="searchForm.roleCode"
              type="text" 
              placeholder="输入权限组代码"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">状态</label>
            <select 
              v-model="searchForm.status"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部状态</option>
              <option value="true" class="bg-slate-800 text-white">启用</option>
              <option value="false" class="bg-slate-800 text-white">禁用</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
       
            <button 
              @click="handleSearch"
              class="px-4 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-refresh mr-2"></i>
              搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div v-if="selectedRows.length > 0" class="mb-4 animate-fade-in">
        <div class="flex items-center space-x-4">
          <button 
            v-permission="'role_group:delete'"
            @click="handleBatchDelete"
            class="px-4 py-2 bg-danger/20 text-danger border border-danger/30 rounded-xl hover:bg-danger/30 transition-all duration-300"
          >
            <i class="fas fa-trash mr-2"></i>
            批量删除 ({{ selectedRows.length }})
          </button>
          <span class="text-gray-400 text-sm">
            已选择 {{ selectedRows.length }} 项
          </span>
        </div>
      </div>

      <!-- 权限组列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl animate-fade-in" style="animation-delay: 0.2s">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载权限组数据...</div>
        </div>
        <div v-else-if="tableData.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-user-shield text-4xl mb-4 opacity-50"></i>
          <div>暂无权限组数据</div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  <input 
                    type="checkbox" 
                    @change="handleSelectAll"
                    :checked="selectedRows.length === tableData.length && tableData.length > 0"
                    class="rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-2"
                  >
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">权限组代码</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">权限组名称</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">状态</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">数据权限</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">备注</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">创建时间</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="roleGroup in tableData" :key="roleGroup.role_id" class="hover:bg-white/5 transition-all duration-300">
                <td class="px-6 py-4">
                  <input 
                    type="checkbox" 
                    :value="roleGroup"
                    v-model="selectedRows"
                    class="rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-2"
                  >
                </td>
                <td class="px-6 py-4 text-white font-mono text-sm">{{ roleGroup.role_code }}</td>
                <td class="px-6 py-4 text-white font-medium">{{ roleGroup.role_name }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div :class="roleGroup.status ? 'bg-success' : 'bg-danger'" class="w-2 h-2 rounded-full mr-2"></div>
                    <span :class="roleGroup.status ? 'text-success' : 'text-danger'" class="text-sm font-medium">
                      {{ roleGroup.status ? '启用' : '禁用' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">
                  <div class="flex flex-wrap gap-1">
                    <el-tag
                    
                      class="border px-2 py-1 rounded-full text-xs"
                    >
                      <i :class="getDataPermissionDisplay(roleGroup).icon" class="mr-1"></i>
                      {{ getDataPermissionDisplay(roleGroup).label }}
                    </el-tag>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm max-w-xs truncate" :title="roleGroup.remarks">
                  {{ roleGroup.remarks || '-' }}
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">{{ formatDate(roleGroup.create_at) }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
               
                    <button 
                      v-permission="'role_group:edit'"
                      @click="handleEdit(roleGroup)"
                      class="p-2 text-gray-400 hover:text-primary transition-colors duration-300"
                      title="编辑"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                 
                    <button 
                      v-permission="'role_group:delete'"
                      @click="handleDelete(roleGroup)"
                      :disabled="roleGroup.system_role"
                      class="p-2 text-gray-400 hover:text-danger transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="删除"
                    >
                      <i class="fas fa-trash"></i>
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
            显示 {{ (pagination.current - 1) * pagination.pageSize + 1 }} 到 {{ Math.min(pagination.current * pagination.pageSize, pagination.total) }} 条，共 {{ pagination.total }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="pagination.current--"
              :disabled="pagination.current <= 1"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-gray-400">
              第 {{ pagination.current }} 页
            </span>
            <button 
              @click="pagination.current++"
              :disabled="pagination.current >= totalPages"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑权限组模态框 -->
    <RoleGroupModal
      v-model="modalVisible"
      :title="modalTitle"
      :data="currentRoleGroup"
      :issave="issave"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />

    <!-- 查看权限组详情模态框 -->
    <RoleGroupDetailModal
      v-model="detailModalVisible"
      :data="currentRoleGroup"
      @close="handleDetailModalClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { roleGroupAPI } from '../../api/roleGroup'
import { ElMessage, ElMessageBox } from 'element-plus'
import RoleGroupModal from '../../components/RoleGroupModal.vue'
import RoleGroupDetailModal from '../../components/RoleGroupDetailModal.vue'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const modalVisible = ref(false)
const detailModalVisible = ref(false)
const modalTitle = ref('')
const currentRoleGroup = ref({})
const issave = ref(false)
// 搜索表单
const searchForm = reactive({
  roleName: '',
  roleCode: '',
  status: ''
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 1000,
  total: 0
})

// 计算属性
const totalPages = computed(() => Math.ceil(pagination.total / pagination.pageSize))

// 方法定义
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getDataPermissionDisplay = (roleGroup) => {
  
  // 直接使用dataPermission字段进行判断
  const dataPermission = roleGroup.data_permission || 'all'
  const dataPermissionMap = {
    'all': { label: '全部数据', icon: 'fas fa-globe', color: 'success' },
    'department': { label: '部门数据', icon: 'fas fa-building', color: 'warning' },
    'personal': { label: '个人数据', icon: 'fas fa-user', color: 'info' }
  }
  
  const permissionConfig = dataPermissionMap[dataPermission] || dataPermissionMap['all']
  
  return {
    value: dataPermission,
    label: permissionConfig.label,
    icon: permissionConfig.icon,
    color: permissionConfig.color
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    
    // 构建搜索参数
    if (searchForm.roleName) {
      params.keyword = searchForm.roleName
    }
    if (searchForm.roleCode) {
      params.keyword = params.keyword ? `${params.keyword} ${searchForm.roleCode}` : searchForm.roleCode
    }
    if (searchForm.status !== '') {
      params.status = searchForm.status === 'true'
    }
    
    const response = await roleGroupAPI.getRoleGroupList(params)
    
    if (response.success || (response.data && response.data.success)) {
      const data = response.data || response
      tableData.value = data.data || data || []
      pagination.total = data.total || data.pagination?.total || 0
    } else {
      ElMessage.error({message: response.message || response.data?.message || '获取数据失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '获取权限组列表失败', duration: 1000})
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.roleName = ''
  searchForm.roleCode = ''
  searchForm.status = ''
  pagination.current = 1
  fetchData()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleSelectAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = [...tableData.value]
  } else {
    selectedRows.value = []
  }
}

const handleCreate = () => {
  modalTitle.value = '新增权限组'
  currentRoleGroup.value = {}
  modalVisible.value = true
}

const handleEdit = (row) => {
  modalTitle.value = '编辑权限组'
  currentRoleGroup.value = { ...row }
  modalVisible.value = true
}

const handleView = (row) => {
  currentRoleGroup.value = { ...row }
  detailModalVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限组 "${row.role_name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    
    const response = await roleGroupAPI.deleteRoleGroup(row.role_id)
    
    if (response.success || (response.data && response.data.success)) {
      ElMessage.success({message: '删除成功', duration: 1000})
      fetchData()
      
    } else {
      ElMessage.error({message: response.message || response.data?.message || '删除失败', duration: 1000})
     
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '删除权限组失败', duration: 1000})
    }
  } finally {
    loading.value = false
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning({message: '请选择要删除的权限组', duration: 1000})
    return
  }

  try {
    const roleNames = selectedRows.value.map(row => row.role_name).join(', ')
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个权限组吗？\n${roleNames}`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    const ids = selectedRows.value.map(row => row.role_id)
    const response = await roleGroupAPI.batchDeleteRoleGroups(ids)
    
    if (response.success || (response.data && response.data.success)) {
      ElMessage.success({message: '批量删除成功', duration: 1000})
      selectedRows.value = []
      fetchData()
    } else {
      ElMessage.error({message: response.message || response.data?.message || '批量删除失败', duration: 1000})
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '批量删除权限组失败', duration: 1000})
    }
  } finally {
    loading.value = false
  }
}

const handleModalConfirm = async (formData) => {
  try {
    loading.value = true
    issave.value=true
    let response
    
    if (currentRoleGroup.value.role_id) {
      // 编辑
      response = await roleGroupAPI.updateRoleGroup(currentRoleGroup.value.role_id, formData)
    } else {
      // 新增
      response = await roleGroupAPI.createRoleGroup(formData)
    }
    
    if (response.success || response.data) {
      ElMessage.success({message: currentRoleGroup.value.role_id ? '更新成功' : '创建成功', duration: 1000})
      modalVisible.value = false
      issave.value=false
      fetchData()
    } else {
      ElMessage.error({message: response.message || response.data?.message || '操作失败', duration: 1000})
      issave.value=false
    }
  } catch (error) {
    ElMessage.error({message: '保存权限组失败', duration: 1000})
  } finally {
    loading.value = false
    issave.value=false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  currentRoleGroup.value = {}
}

const handleDetailModalClose = () => {
  detailModalVisible.value = false
  currentRoleGroup.value = {}
}

// 监听搜索条件变化
watch([() => searchForm.roleName, () => searchForm.roleCode, () => searchForm.status], () => {
  pagination.current = 1
})

// 监听分页变化
watch(() => pagination.current, () => {
  fetchData()
})

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>