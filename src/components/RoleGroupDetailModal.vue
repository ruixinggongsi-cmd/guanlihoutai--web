<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-slate-800/90 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-white/10">
        <h3 class="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          权限组详情
        </h3>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
        >
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- 模态框内容 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="space-y-6">
          <!-- 基本信息 -->
          <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
            <h4 class="text-lg font-medium text-white mb-4 flex items-center">
              <i class="fas fa-info-circle mr-2 text-primary"></i>
              基本信息
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">权限组代码</label>
                <div class="text-white font-mono text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ roleGroupData.role_code }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">权限组名称</label>
                <div class="text-white font-medium bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ roleGroupData.role_name }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">状态</label>
                <div class="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  <div :class="roleGroupData.status ? 'bg-success' : 'bg-danger'" class="w-2 h-2 rounded-full mr-2"></div>
                  <span :class="roleGroupData.status ? 'text-success' : 'text-danger'" class="font-medium">
                    {{ roleGroupData.status ? '启用' : '禁用' }}
                  </span>
                </div>
              </div>
              

            </div>
            
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-400 mb-1">备注</label>
              <div class="text-white bg-white/10 border border-white/20 rounded-lg px-4 py-3 min-h-[80px]">
                {{ roleGroupData.remarks || '暂无备注' }}
              </div>
            </div>
          </div>

          <!-- 权限配置 -->
          <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
            <h4 class="text-lg font-medium text-white mb-4 flex items-center">
              <i class="fas fa-shield-alt mr-2 text-success"></i>
              权限配置
            </h4>
            
            <div v-if="permissionModules.length === 0" class="text-gray-400 text-center py-8">
              <i class="fas fa-lock text-4xl mb-4 opacity-50"></i>
              <div>暂无权限配置</div>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="module in permissionModules"
                :key="module.value"
                class="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-4"
              >
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-success mr-3"></i>
                  <div>
                    <div class="text-white font-medium">{{ module.label }}</div>
                    <div class="text-gray-400 text-sm">{{ module.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统信息 -->
          <div class="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
            <h4 class="text-lg font-medium text-white mb-4 flex items-center">
              <i class="fas fa-clock mr-2 text-info"></i>
              系统信息
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">创建时间</label>
                <div class="text-white bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ formatDate(roleGroupData.create_at) }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">更新时间</label>
                <div class="text-white bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ formatDate(roleGroupData.update_at) }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">创建人</label>
                <div class="text-white bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ roleGroupData.create_by || '系统' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">更新人</label>
                <div class="text-white bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  {{ roleGroupData.update_by || '系统' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="flex justify-end space-x-4 p-6 border-t border-white/10">
        <button 
          @click="handleClose"
          class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <i class="fas fa-check mr-2"></i>
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

// Emits定义
const emit = defineEmits(['update:modelValue', 'close'])

// 响应式数据
const visible = ref(false)
const roleGroupData = reactive({
  role_id: '',
  role_code: '',
  role_name: '',
  status: true,
  remarks: '',
  permission: {},
  create_at: '',
  update_at: '',
  create_by: '',
  update_by: ''
})

// 计算属性
const permissionModules = computed(() => {
  if (!roleGroupData.permission) return []
  
  try {
    const permission = typeof roleGroupData.permission === 'string' 
      ? JSON.parse(roleGroupData.permission) 
      : roleGroupData.permission
    
    const modules = permission.modules || []
    const moduleMap = {
      'user': { label: '用户管理', description: '管理用户账号、角色分配' },
      'department': { label: '部门管理', description: '管理部门组织架构' },
      'role': { label: '权限组管理', description: '管理权限组和权限配置' },
      'system': { label: '系统设置', description: '系统配置和参数设置' },
      'report': { label: '报表管理', description: '查看和管理各类报表' },
      'log': { label: '日志管理', description: '查看系统操作日志' }
    }
    
    return modules.map(module => ({
      value: module,
      ...moduleMap[module]
    }))
  } catch (error) {
    console.error('解析权限配置失败:', error)
    return []
  }
})

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

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(() => props.data, (newData) => {
  if (newData) {
    Object.assign(roleGroupData, {
      role_id: newData.role_id || '',
      role_code: newData.role_code || '',
      role_name: newData.role_name || '',
      status: newData.status !== undefined ? newData.status : true,
      remarks: newData.remarks || '',
      permission: newData.permission || {},
      create_at: newData.create_at || '',
      update_at: newData.update_at || '',
      create_by: newData.create_by || '',
      update_by: newData.update_by || ''
    })
  }
}, { immediate: true })

onMounted(() => {
  visible.value = props.modelValue
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
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>