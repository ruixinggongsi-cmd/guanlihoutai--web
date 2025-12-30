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
                <i class="fas fa-project-diagram text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  审批流程配置
                </h1>
                <p class="text-gray-400 text-lg">配置和管理各类审批流程，定义审批节点和规则</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'approval_flow:add'"
                @click="showAddFlowModal"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">新建流程</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 流程类型筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-3">
            <button 
              @click="filterByType('all')"
              :class="['px-4 py-2 rounded-xl transition-all duration-300', typeFilter === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10']"
            >
              全部类型
            </button>
            <button 
              @click="filterByType('expense')"
              :class="['px-4 py-2 rounded-xl transition-all duration-300', typeFilter === 'expense' ? 'bg-primary text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10']"
            >
              费用审批
            </button>
            <button 
              @click="filterByType('equipment')"
              :class="['px-4 py-2 rounded-xl transition-all duration-300', typeFilter === 'equipment' ? 'bg-primary text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10']"
            >
              设备审批
            </button>
           
          </div>
         
        </div>
      </div>

      <!-- 流程列表 -->
        <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-white/20">
          <h3 class="text-lg font-semibold text-white">审批流程列表</h3>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p class="text-gray-400 mt-2">正在加载审批流程...</p>
        </div>
        
        <div v-else class="divide-y divide-white/10">
          <div v-for="flow in paginatedFlows" :key="flow.id" class="p-6 hover:bg-white/5 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <h4 class="text-lg font-semibold text-white mr-3">{{ flow.name }}</h4>
                  <span :class="getStatusClass(flow.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(flow.status) }}
                  </span>
                  <span :class="getTypeClass(flow.type)" class="px-2 py-1 text-xs font-medium rounded-full ml-2">
                    {{ getTypeText(flow.type) }}
                  </span>
                </div>
                <p class="text-gray-400 text-sm mb-3">{{ flow.description }}</p>
                
                <!-- 流程节点展示 -->
                <div class="flex items-center space-x-4 mb-3">
                  <div class="flex items-center" v-for="(node, index) in flow.nodes" :key="node.id">
                    <div class="flex items-center justify-center w-8 h-8 bg-primary/20 text-primary rounded-full text-xs font-medium">
                      {{ index + 1 }}
                    </div>
                    <div class="ml-2 text-sm text-gray-300">
                      {{ node.name }}
                    </div>
                    <i v-if="index < flow.nodes.length - 1" class="fas fa-arrow-right text-gray-500 mx-3"></i>
                  </div>
                </div>
                
              
              </div>
              
              <div class="flex space-x-2 ml-6">
                <button 
                  v-permission="'approval_flow:view'"
                  @click="viewFlow(flow)"
                  class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <i class="fas fa-eye mr-1"></i>
                  查看
                </button>
                <button 
                  v-permission="'approval_flow:edit'"
                  @click="editFlow(flow)"
                  class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors btn-transition"
                >
                  <i class="fas fa-edit mr-1"></i>
                  编辑
                </button>
                <button 
                  v-permission="'approval_flow:edit'"
                  v-if="flow.status === 'active'"
                  @click="toggleFlowStatus(flow)"
                  class="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors btn-transition"
                >
                  <i class="fas fa-pause mr-1"></i>
                  停用
                </button>
                <button 
                  v-permission="'approval_flow:edit'"
                  v-else
                  @click="toggleFlowStatus(flow)"
                  class="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors btn-transition"
                >
                  <i class="fas fa-play mr-1"></i>
                  启用
                </button>
                <button 
                  v-permission="'approval_flow:delete'"
                  @click="deleteFlow(flow)"
                  class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors btn-transition"
                >
                  <i class="fas fa-trash mr-1"></i>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="paginatedFlows.length === 0 && !loading" class="text-center py-12">
          <i class="fas fa-project-diagram text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-400 text-lg">暂无审批流程</p>
          <button 
            v-permission="'approval_flow:add'"
            @click="showAddFlowModal"
            class="mt-4 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors"
          >
            创建第一个流程
          </button>
        </div>
        
        <!-- 分页组件 -->
        <div v-if="totalFlows > 0" class="px-6 py-4 border-t border-white/20 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalFlows) }} 条，共 {{ totalFlows }} 条
          </div>
          <div class="flex items-center space-x-2">
            <button 
              v-permission="'approval_flow:view'"
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              首页
            </button>
            <button 
              v-permission="'approval_flow:view'"
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-white">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button 
              v-permission="'approval_flow:view'"
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
            <button 
              v-permission="'approval_flow:view'"
              @click="currentPage = totalPages" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              末页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 流程配置模态框 -->
    <div v-if="showFlowModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">
              {{ isEditing ? '编辑审批流程' : '新建审批流程' }}
            </h3>
            <button 
              v-permission="'approval_flow:view'"
              @click="closeFlowModal"
              class="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveFlow" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-3">流程名称</label>
                <input 
                  v-model="flowForm.name" 
                  type="text" 
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 input-focus-effect"
                  placeholder="请输入流程名称"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-3">流程类型</label>
                <select 
                  v-model="flowForm.type" 
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="expense" class="bg-gray-800">费用审批</option>
                  <option value="equipment" class="bg-gray-800">设备审批</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-3">流程描述</label>
              <textarea 
                v-model="flowForm.description" 
                rows="3"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 input-focus-effect"
                placeholder="请输入流程描述"
              ></textarea>
            </div>
            
            <!-- 审批节点配置 -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <label class="block text-sm font-medium text-gray-300">审批节点</label>
                <button 
                  v-permission="'approval_flow:edit'"
                  type="button"
                  @click="addNode"
                  class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 btn-hover-effect"
                >
                  <i class="fas fa-plus mr-2"></i>
                  添加节点
                </button>
              </div>
              
              <div class="space-y-4">
                <div v-for="(node, index) in flowForm.nodes" :key="node.id" class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-4">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {{ index + 1 }}
                      </div>
                      <span class="text-sm font-medium text-white">审批节点</span>
                    </div>
                    <button
                      v-permission="'approval_flow:edit'"
                      @click="removeNode(index)"
                      class="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                    >
                      <i class="fas fa-trash mr-1"></i>
                      删除
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs text-gray-400 mb-2">节点名称</label>
                      <input 
                        v-model="node.name" 
                        type="text" 
                        class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="如：部门经理审批"
                        required
                      >
                    </div>
                    <div>
                      <label class="block text-xs text-gray-400 mb-2">审批类型</label>
                      <select 
                        v-model="node.approvalType" 
                        @change="handleApprovalTypeChange(node, index)"
                        class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      >
                        <option value="dept_manager" class="bg-gray-800">直属部门</option>
                        <option value="user" class="bg-gray-800">指定用户</option>
                        <option value="role" class="bg-gray-800">指定角色</option>
                        <option value="department" class="bg-gray-800">指定部门</option>
                        <option value="auto" class="bg-gray-800">自动审批</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-400 mb-2">审批人/角色</label>
                      <div class="relative" v-if="node.approvalType !== 'auto' && node.approvalType !== 'dept_manager'">
                        <input 
                          :value="typeof node.approver === 'object' && node.approver !== null ? node.approver.name : node.approver" 
                          type="text" 
                          class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          placeholder="用户ID、角色名或部门名"
                          required
                          readonly
                          @click="openSelectorModal(index, node.approvalType)"
                        >
                        <button 
                          v-permission="'approval_flow:edit'"
                          type="button"
                          @click="openSelectorModal(index, node.approvalType)"
                          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <i class="fas fa-search"></i>
                        </button>
                      </div>
                      <div v-else-if="node.approvalType === 'dept_manager'" class="space-y-2">
                        <div class="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-center">
                          <i class="fas fa-user-tie mr-1"></i>
                          部门负责人
                        </div>
                        <div class="flex items-center space-x-2">
                          <label class="flex items-center text-xs text-gray-400">
                            <input 
                              v-model="node.hierarchical" 
                              type="checkbox" 
                              class="mr-1 rounded"
                            >
                            层级审批
                          </label>
                          <el-tooltip content="启用后，申请将按部门层级逐级上报审批" placement="top">
                            <i class="fas fa-info-circle text-gray-400 text-xs"></i>
                          </el-tooltip>
                        </div>
                      </div>
                      <div v-else class="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
                        <i class="fas fa-check-circle mr-1"></i>
                        自动通过
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="flowForm.nodes.length === 0" class="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                <i class="fas fa-plus-circle text-3xl text-gray-400 mb-3"></i>
                <p class="text-gray-400">暂无审批节点，点击上方按钮添加</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button 
                v-permission="'approval_flow:view'"
                type="button"
                @click="closeFlowModal"
                class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                取消
              </button>
              <button 
                v-permission="isEditing ? 'approval_flow:edit' : 'approval_flow:add'"
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
    </div>
  </div>

  <!-- 用户选择模态框 -->
  <UserSelectorModal
    :visible="showUserSelector"
    @update:visible="showUserSelector = $event"
    @select="handleUserSelect"
  />

  <!-- 部门选择模态框 -->
  <DepartmentSelectorModal
    :visible="showDepartmentSelector"
    @update:visible="showDepartmentSelector = $event"
    @select="handleDepartmentSelect"
  />

  <!-- 角色选择模态框 -->
  <RoleSelectorModal
    :visible="showRoleSelector"
    @update:visible="showRoleSelector = $event"
    @select="handleRoleSelect"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { approvalFlowConfigAPI } from '../../api/approvalFlowConfig.js'
import NavigationBar from '../../components/NavigationBar.vue'
import UserSelectorModal from '../../components/UserSelectorModal.vue'
import DepartmentSelectorModal from '../../components/DepartmentSelectorModal.vue'
import RoleSelectorModal from '../../components/RoleSelectorModal.vue'

// 响应式数据
const flows = ref([])
const typeFilter = ref('all')
const showFlowModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalFlows = ref(0)

// 选择模态框状态
const showUserSelector = ref(false)
const showDepartmentSelector = ref(false)
const showRoleSelector = ref(false)
const currentNodeIndex = ref(-1)

// 流程表单
const flowForm = ref({
  id: null,
  name: '',
  type: 'expense',
  description: '',
  status: 'active',
  nodes: [],
  creator: '系统管理员',
  createdAt: new Date().toISOString()
})

// 保存状态，用于防重复点击
const isSaving = ref(false)

// 计算属性
const totalPages = computed(() => Math.ceil(totalFlows.value / pageSize.value))

const activeFlows = computed(() => {
  return flows.value.filter(flow => flow.status === 'active').length
})

const avgProcessingTime = computed(() => {
  // 模拟平均处理时间
  return 24
})

const totalParticipants = computed(() => {
  // 模拟参与人员数量
  return 15
})

const filteredFlows = computed(() => {
  if (typeFilter.value === 'all') {
    return flows.value
  }
  return flows.value.filter(flow => flow.type === typeFilter.value)
})

// 分页后的流程数据
const paginatedFlows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFlows.value.slice(start, end)
})

// 方法
const loadFlows = async () => {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      type: typeFilter.value === 'all' ? undefined : typeFilter.value
    }
    
    const response = await approvalFlowConfigAPI.getApprovalFlowList(params)
    
    if (response.success) {
      // 转换API数据格式到本地格式
      flows.value = response.data.map(flow => ({
        id: flow.id,
        name: flow.flow_name,
        type: flow.flow_type,
        description: flow.description,
        status: flow.status || 'active', // 直接使用API返回的status字符串值
        creator: flow.creator,
        createdAt: flow.created_at,
        updatedAt: flow.updated_at,
        nodes: flow.nodes || []
      }))
      
      // 设置总记录数
      totalFlows.value = response.pagination?.total || response.total || flows.value.length
      
    } else {
      ElMessage.error({message: '加载审批流程配置失败: ' + response.message, duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '加载审批流程配置失败，请重试', duration: 1000})
  } finally {
    loading.value = false
  }
}

// 模拟数据加载方法
const loadMockFlows = () => {
  flows.value = [
    {
      id: 1,
      name: '费用报销审批流程',
      type: 'expense',
      description: '员工费用报销的标准审批流程，包含部门经理和财务审核',
      status: 'active',
      creator: '系统管理员',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      nodes: [
        {
          id: 1,
          name: '部门经理审批',
          approvalType: 'role',
          approver: {
            id: 'role_001',
            name: '部门经理',
            type: 'role'
          }
        },
        {
          id: 2,
          name: '财务审核',
          approvalType: 'role',
          approver: {
            id: 'role_002',
            name: '财务专员',
            type: 'role'
          }
        }
      ]
    },
    {
      id: 2,
      name: '设备采购审批流程',
      type: 'equipment',
      description: '设备采购申请的审批流程，需要多级审批',
      status: 'active',
      creator: '系统管理员',
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      nodes: [
        {
          id: 1,
          name: '部门负责人审批',
          approvalType: 'role',
          approver: {
            id: 'role_003',
            name: '部门负责人',
            type: 'role'
          }
        },
        {
          id: 2,
          name: 'IT部门评估',
          approvalType: 'department',
          approver: {
            id: 'dept_it',
            name: 'IT部门',
            type: 'department'
          }
        },
        {
          id: 3,
          name: '总经理审批',
          approvalType: 'role',
          approver: {
            id: 'role_004',
            name: '总经理',
            type: 'role'
          }
        }
      ]
    },
    {
      id: 3,
      name: '请假申请审批流程',
      type: 'leave',
      description: '员工请假申请的标准审批流程',
      status: 'inactive',
      creator: 'HR管理员',
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-01T09:15:00Z',
      nodes: [
        {
          id: 1,
          name: '直属上级审批',
          approvalType: 'role',
          approver: {
            id: 'role_005',
            name: '直属上级',
            type: 'role'
          }
        },
        {
          id: 2,
          name: 'HR审核',
          approvalType: 'department',
          approver: {
            id: 'dept_hr',
            name: '人事部',
            type: 'department'
          }
        }
      ]
    },
    {
      id: 4,
      name: '合同审批流程',
      type: 'custom',
      description: '合同签署的标准审批流程，包含法务审核',
      status: 'active',
      creator: '法务管理员',
      createdAt: '2024-02-10T11:20:00Z',
      updatedAt: '2024-02-10T11:20:00Z',
      nodes: [
        {
          id: 1,
          name: '部门负责人审批',
          approvalType: 'role',
          approver: {
            id: 'role_006',
            name: '部门负责人',
            type: 'role'
          }
        },
        {
          id: 2,
          name: '法务审核',
          approvalType: 'department',
          approver: {
            id: 'dept_legal',
            name: '法务部',
            type: 'department'
          }
        },
        {
          id: 3,
          name: '总经理审批',
          approvalType: 'role',
          approver: {
            id: 'role_007',
            name: '总经理',
            type: 'role'
          }
        }
      ]
    },
    {
      id: 5,
      name: '项目立项审批流程',
      type: 'custom',
      description: '新项目立项的标准审批流程',
      status: 'active',
      creator: '项目管理员',
      createdAt: '2024-02-15T16:45:00Z',
      updatedAt: '2024-02-15T16:45:00Z',
      nodes: [
        {
          id: 1,
          name: '项目经理申请',
          approvalType: 'role',
          approver: {
            id: 'role_010',
            name: '项目经理',
            type: 'role'
          }
        },
        {
          id: 2,
          name: '部门负责人审批',
          approvalType: 'role',
          approver: {
            id: 'role_011',
            name: '部门负责人',
            type: 'role'
          }
        },
        {
          id: 3,
          name: '财务评估',
          approvalType: 'department',
          approver: {
            id: 'dept_finance',
            name: '财务部',
            type: 'department'
          }
        },
        {
          id: 4,
          name: '总经理审批',
          approvalType: 'role',
          approver: {
            id: 'role_012',
            name: '总经理',
            type: 'role'
          }
        }
      ]
    }
  ]
}

const filterByType = (type) => {
  typeFilter.value = type
  currentPage.value = 1
}

const showAddFlowModal = () => {
  isEditing.value = false
  flowForm.value = {
    id: null,
    name: '',
    type: 'expense',
    description: '',
    status: 'active',
    nodes: [],
    creator: '系统管理员',
    createdAt: new Date().toISOString()
  }
  showFlowModal.value = true
}

const editFlow = (flow) => {
  isEditing.value = true
  flowForm.value = {
    ...flow,
    nodes: [...flow.nodes]
  }
  showFlowModal.value = true
}

const viewFlow = (flow) => {
  editFlow(flow)
}

const closeFlowModal = () => {
  showFlowModal.value = false
  isEditing.value = false
  flowForm.value = {
    id: null,
    name: '',
    type: 'expense',
    description: '',
    status: 'active',
    nodes: [],
    creator: '系统管理员',
    createdAt: new Date().toISOString()
  }
  // 重置选择模态框状态
  showUserSelector.value = false
  showDepartmentSelector.value = false
  showRoleSelector.value = false
  currentNodeIndex.value = -1
  isSaving.value = false // 重置保存状态
}

const addNode = () => {
  const newNode = {
    id: Date.now(),
    name: '',
    approvalType: 'role',
    approver: {
      id: '',
      name: '',
      type: 'role'
    }
  }
  flowForm.value.nodes.push(newNode)
  // 自动为新节点添加变化监听
  handleApprovalTypeChange(newNode, flowForm.value.nodes.length - 1)
}

const removeNode = (index) => {
  flowForm.value.nodes.splice(index, 1)
}

const saveFlow = async () => {
  // 防重复点击检查
  if (isSaving.value) {
    return
  }
  
  if (!flowForm.value.name.trim()) {
    ElMessage.warning({message: '请输入流程名称', duration: 1000})
    return
  }
  
  if (flowForm.value.nodes.length === 0) {
    ElMessage.warning({message: '请至少添加一个审批节点', duration: 1000})
    return
  }
  
  // 验证节点信息
  for (let node of flowForm.value.nodes) {
    if (!node.name.trim()) {
      ElMessage.warning({message: '请填写所有节点的名称', duration: 1000})
      return
    }
    // 只对非自动审批类型验证审批人
    if (node.approvalType !== 'auto') {
      // 兼容新旧数据格式
      const approverName = typeof node.approver === 'object' && node.approver !== null ? node.approver.name : node.approver
      if (!approverName || !approverName.trim()) {
        ElMessage.warning({message: '请填写所有节点的审批人/角色', duration: 1000})
        return
      }
    }
  }
  
  isSaving.value = true // 开始保存
  
  try {
    // 准备API数据格式
    const apiData = {
      flow_name: flowForm.value.name,
      flow_type: flowForm.value.type,
      description: flowForm.value.description,
      status: flowForm.value.status, // 直接使用字符串状态值
      nodes: flowForm.value.nodes,
      creator: flowForm.value.creator || '系统管理员'
    }
    
    let response
    if (isEditing.value) {
      // 编辑现有流程
      response = await approvalFlowConfigAPI.updateApprovalFlow(flowForm.value.id, apiData)
    } else {
      // 新建流程
      response = await approvalFlowConfigAPI.createApprovalFlow(apiData)
    }
    
    if (response.success) {
      closeFlowModal()
      ElMessage.success({message: '流程配置保存成功！', duration: 1000})
      // 重新加载数据
      await loadFlows()
    } else {
      isSaving.value = false // 保存失败时重置状态
      ElMessage.error({message: '保存流程失败: ' + response.message, duration: 1000})
    }
  } catch (error) {
    isSaving.value = false // 异常时重置状态
    ElMessage.error({message: '保存流程失败，请重试', duration: 1000})
  }
}

const toggleFlowStatus = async (flow) => {
  try {
    await ElMessageBox.confirm(
      `确定要${flow.status === 'active' ? '禁用' : '启用'}流程「${flow.name}」吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const newStatus = flow.status === 'active' ? 'inactive' : 'active'
    const response = await approvalFlowConfigAPI.updateApprovalFlowStatus(flow.id, newStatus)
    
    if (response.success) {
      ElMessage.success({message: `流程「${flow.name}」${flow.status === 'active' ? '已禁用' : '已启用'}`, duration: 1000})
      // 重新加载数据
      await loadFlows()
    } else {
      ElMessage.error({message: '更新流程状态失败: ' + response.message, duration: 1000})
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '更新流程状态失败，请重试', duration: 1000})
    }
  }
}

const deleteFlow = async (flow) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除流程「${flow.name}」吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await approvalFlowConfigAPI.deleteApprovalFlow(flow.id)
    
    if (response.success) {
      ElMessage.success({message: '流程删除成功！', duration: 1000})
      // 重新加载数据
      await loadFlows()
    } else {
      ElMessage.error({message: '删除流程失败: ' + response.message, duration: 1000})
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error({message: '删除流程失败，请重试', duration: 1000})
    }
  }
}

// 状态样式
const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return '启用'
    case 'inactive':
      return '停用'
    default:
      return '未知'
  }
}

// 类型样式
const getTypeClass = (type) => {
  switch (type) {
    case 'expense':
      return 'bg-blue-100 text-blue-800'
    case 'equipment':
      return 'bg-purple-100 text-purple-800'
    case 'leave':
      return 'bg-orange-100 text-orange-800'
    case 'custom':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type) => {
  switch (type) {
    case 'expense':
      return '费用审批'
    case 'equipment':
      return '设备审批'
    case 'leave':
      return '请假审批'
    case 'custom':
      return '自定义审批'
    default:
      return '未知'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 处理审批类型变化
 const handleApprovalTypeChange = (node, index) => {
   if (node.approvalType === 'auto') {
     // 自动审批类型，清空审批人信息
     node.approver = {
       id: '',
       name: '',
       type: 'auto'
     }
   } else if (node.approvalType === 'dept_manager') {
     // 部门负责人类型，设置默认信息
     node.approver = {
       id: 'dept_manager',
       name: '部门负责人',
       type: 'dept_manager'
     }
     // 初始化层级审批属性
     if (node.hierarchical === undefined) {
       node.hierarchical = false
     }
   } else {
     // 其他类型，重置审批人信息
     node.approver = {
       id: '',
       name: '',
       type: node.approvalType
     }
   }
 }

// 打开选择模态框
const openSelectorModal = (nodeIndex, approvalType) => {
  currentNodeIndex.value = nodeIndex
  
  switch (approvalType) {
    case 'user':
      showUserSelector.value = true
      break
    case 'department':
      showDepartmentSelector.value = true
      break
    case 'role':
      showRoleSelector.value = true
      break
    default:
      // 对于auto类型，不打开选择框
      break
  }
}

// 处理用户选择
const handleUserSelect = (user) => {
  if (currentNodeIndex.value >= 0 && flowForm.value.nodes[currentNodeIndex.value]) {
    flowForm.value.nodes[currentNodeIndex.value].approver = {
      id: user.id,
      name: user.name,
      type: 'user'
    }
  }
  showUserSelector.value = false
}

// 处理部门选择
const handleDepartmentSelect = (department) => {
  if (currentNodeIndex.value >= 0 && flowForm.value.nodes[currentNodeIndex.value]) {
    flowForm.value.nodes[currentNodeIndex.value].approver = {
      id: department.id,
      name: department.name,
      type: 'department'
    }
  }
  showDepartmentSelector.value = false
}

// 处理角色选择
const handleRoleSelect = (role) => {
  if (currentNodeIndex.value >= 0 && flowForm.value.nodes[currentNodeIndex.value]) {
    flowForm.value.nodes[currentNodeIndex.value].approver = {
      id: role.id,
      name: role.name,
      type: 'role'
    }
  }
  showRoleSelector.value = false
}

// 监听类型筛选变化
watch(typeFilter, () => {
  currentPage.value = 1
  loadFlows()
})

// 监听分页变化
watch([currentPage, pageSize], () => {
  loadFlows()
})

// 生命周期
onMounted(() => {
  loadFlows()
})
</script>

<style scoped>
/* 加载动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 流程卡片悬停效果 */
.flow-card {
  transition: all 0.3s ease;
}

.flow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 按钮动画 */
.btn-transition {
  transition: all 0.2s ease;
}

.btn-transition:hover {
  transform: translateY(-1px);
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 新增模态框动画类 */
.animate-modal-fade-in {
  animation: modalFadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

/* 输入框聚焦效果 */
.input-focus-effect:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 按钮悬停效果 */
.btn-hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}
</style>