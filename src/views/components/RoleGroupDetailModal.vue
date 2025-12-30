<template>
  <el-dialog
    v-model="visible"
    title="权限组详情"
    width="700px"
    :close-on-click-modal="true"
    @close="handleClose"
  >
    <div class="role-group-detail" v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="权限组ID">
          {{ data.role_id || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="权限组代码">
          {{ data.role_code || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="权限组名称">
          {{ data.fole_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="data.status ? 'success' : 'danger'">
            {{ data.status ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ formatDate(data.create_at) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ data.remarks || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="permission-section">
        <h4>权限配置</h4>
        <div class="permission-content">
          <div v-if="permissionModules.length > 0" class="permission-modules">
            <el-tag
              v-for="module in permissionModules"
              :key="module.value"
              type="success"
              effect="plain"
              class="module-tag"
            >
              {{ module.label }}
            </el-tag>
          </div>
          <div v-else class="no-permission">
            <el-empty description="暂无权限配置" :image-size="60" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

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

const emit = defineEmits(['update:modelValue', 'close'])

// 响应式数据
const visible = ref(false)
const loading = ref(false)

// 可用模块映射
const moduleMap = reactive({
  'user': '用户管理',
  'department': '部门管理',
  'role': '权限组管理',
  'system': '系统设置',
  'report': '报表管理',
  'log': '日志管理'
})

// 计算属性
const permissionModules = computed(() => {
  if (!props.data.permission) return []
  
  try {
    const permission = typeof props.data.permission === 'string' 
      ? JSON.parse(props.data.permission) 
      : props.data.permission
    
    const modules = permission.modules || []
    return modules.map(module => ({
      value: module,
      label: moduleMap[module] || module
    }))
  } catch (error) {
    return []
  }
})

// 监听props变化
watch(() => props.modelValue, (val) => {
  visible.value = val
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
</script>

<style scoped>
.role-group-detail {
  padding: 20px 0;
}

.permission-section {
  margin-top: 30px;
}

.permission-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.permission-content {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 20px;
  min-height: 100px;
}

.permission-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.module-tag {
  margin: 0;
}

.no-permission {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

:deep(.el-descriptions__label) {
  width: 120px;
  text-align: right;
}
</style>