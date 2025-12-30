<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-6 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
            <i class="fas fa-code text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              审批流配置示例
            </h1>
            <p class="text-gray-400 text-lg">演示在编辑审批节点时弹出用户、部门、角色选择模态框的功能</p>
          </div>
        </div>
      </div>

      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-white">审批流程配置</h2>
          <button 
            @click="showFlowModal = true"
            class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <i class="fas fa-plus mr-2"></i>
            创建流程
          </button>
        </div>

        <!-- 流程配置模态框 -->
        <div v-if="showFlowModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-white">新建审批流程</h3>
                <button 
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
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="请输入流程名称"
                      required
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-3">流程类型</label>
                    <select 
                      v-model="flowForm.type" 
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="expense" class="bg-gray-800">费用审批</option>
                      <option value="equipment" class="bg-gray-800">设备审批</option>
                      <option value="leave" class="bg-gray-800">请假审批</option>
                      <option value="custom" class="bg-gray-800">自定义审批</option>
                    </select>
                  </div>
                </div>
                
                <!-- 审批节点配置 -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <label class="block text-sm font-medium text-gray-300">审批节点</label>
                    <button 
                      type="button"
                      @click="addNode"
                      class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg transition-all duration-300"
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
                            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="如：部门经理审批"
                            required
                          >
                        </div>
                        <div>
                          <label class="block text-xs text-gray-400 mb-2">审批类型</label>
                          <select 
                            v-model="node.approvalType" 
                            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="user" class="bg-gray-800">指定用户</option>
                            <option value="role" class="bg-gray-800">指定角色</option>
                            <option value="department" class="bg-gray-800">指定部门</option>
                            <option value="auto" class="bg-gray-800">自动审批</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-xs text-gray-400 mb-2">审批人/角色</label>
                          <div class="relative">
                            <input 
                              v-model="node.approver" 
                              type="text" 
                              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="点击选择用户、部门或角色"
                              required
                              readonly
                              @click="openSelectorModal(index, node.approvalType)"
                            >
                            <button 
                              type="button"
                              @click="openSelectorModal(index, node.approvalType)"
                              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                              <i class="fas fa-search"></i>
                            </button>
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
                    type="button"
                    @click="closeFlowModal"
                    class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    class="px-8 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-success-light hover:to-success transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50"
                  >
                    <i class="fas fa-save mr-2"></i>
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- 选择器模态框 -->
        <UserSelectorModal
          :visible="showUserSelector"
          @update:visible="showUserSelector = $event"
          @select="handleUserSelect"
        />

        <DepartmentSelectorModal
          :visible="showDepartmentSelector"
          @update:visible="showDepartmentSelector = $event"
          @select="handleDepartmentSelect"
        />

        <RoleSelectorModal
          :visible="showRoleSelector"
          @update:visible="showRoleSelector = $event"
          @select="handleRoleSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserSelectorModal from '../../components/UserSelectorModal.vue'
import DepartmentSelectorModal from '../../components/DepartmentSelectorModal.vue'
import RoleSelectorModal from '../../components/RoleSelectorModal.vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const showFlowModal = ref(false)
const currentNodeIndex = ref(-1)

// 选择模态框状态
const showUserSelector = ref(false)
const showDepartmentSelector = ref(false)
const showRoleSelector = ref(false)

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

// 添加节点
const addNode = () => {
  const newNode = {
    id: Date.now(),
    name: '',
    approvalType: 'role',
    approver: ''
  }
  flowForm.value.nodes.push(newNode)
}

// 删除节点
const removeNode = (index) => {
  flowForm.value.nodes.splice(index, 1)
}

// 关闭流程模态框
const closeFlowModal = () => {
  showFlowModal.value = false
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
}

// 保存流程
const saveFlow = () => {
  if (!flowForm.value.name.trim()) {
    ElMessage.error({
      message: '请输入流程名称',
      duration: 1000
    })
    return
  }
  
  if (flowForm.value.nodes.length === 0) {
    ElMessage.error({
      message: '请至少添加一个审批节点',
      duration: 1000
    })
    return
  }
  
  // 验证节点信息
  for (let node of flowForm.value.nodes) {
    if (!node.name.trim()) {
      ElMessage.error({
        message: '请填写所有节点的名称',
        duration: 1000
      })
      return
    }
    if (!node.approver.trim()) {
      ElMessage.error({
        message: '请填写所有节点的审批人/角色',
        duration: 1000
      })
      return
    }
  }
  
  ElMessage.success({
    message: '流程配置保存成功！',
    duration: 1000
  })
  closeFlowModal()
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
    flowForm.value.nodes[currentNodeIndex.value].approver = `${user.name} (ID: ${user.id})`
  }
  showUserSelector.value = false
}

// 处理部门选择
const handleDepartmentSelect = (department) => {
  if (currentNodeIndex.value >= 0 && flowForm.value.nodes[currentNodeIndex.value]) {
    flowForm.value.nodes[currentNodeIndex.value].approver = `${department.name} (ID: ${department.id})`
  }
  showDepartmentSelector.value = false
}

// 处理角色选择
const handleRoleSelect = (role) => {
  if (currentNodeIndex.value >= 0 && flowForm.value.nodes[currentNodeIndex.value]) {
    flowForm.value.nodes[currentNodeIndex.value].approver = `${role.name} (ID: ${role.id})`
  }
  showRoleSelector.value = false
}
</script>

<style scoped>
/* 背景装饰 */
.bg-gradient-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.bg-gradient-decoration::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(120, 119, 198, 0.3) 0%, transparent 50%);
  animation: gradientMove 20s ease-in-out infinite;
}

@keyframes gradientMove {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
</style>