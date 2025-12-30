<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="权限组代码" prop="role_code">
        <el-input
          v-model="formData.role_code"
          placeholder="请输入权限组代码"
          :disabled="!!formData.role_id"
        />
      </el-form-item>

      <el-form-item label="权限组名称" prop="fole_name">
        <el-input
          v-model="formData.fole_name"
          placeholder="请输入权限组名称"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="true">启用</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="权限配置" prop="permission">
        <div class="permission-config">
          <div class="permission-header">
            <span>模块权限</span>
            <el-button type="primary" link @click="handleSelectAll">
              全选
            </el-button>
            <el-button type="info" link @click="handleSelectNone">
              全不选
            </el-button>
          </div>
          
          <el-checkbox-group v-model="formData.permission.modules" class="permission-groups">
            <el-checkbox 
              v-for="module in availableModules" 
              :key="module.value"
              :label="module.value"
            >
              {{ module.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>

      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { roleGroupAPI } from '@/api/roleGroup'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 响应式数据
const visible = ref(false)
const loading = ref(false)
const formRef = ref()

// 可用模块列表
const availableModules = ref([
  { value: 'user', label: '用户管理' },
  { value: 'department', label: '部门管理' },
  { value: 'role', label: '权限组管理' },
  { value: 'system', label: '系统设置' },
  { value: 'report', label: '报表管理' },
  { value: 'log', label: '日志管理' }
])

// 表单数据
const formData = reactive({
  role_id: null,
  role_code: '',
  fole_name: '',
  status: true,
  permission: {
    modules: []
  },
  remarks: ''
})

// 表单验证规则
const formRules = {
  role_code: [
    { required: true, message: '请输入权限组代码', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, 
      message: '权限组代码必须以字母开头，只能包含字母、数字和下划线', 
      trigger: 'blur' 
    }
  ],
  fole_name: [
    { required: true, message: '请输入权限组名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 监听props变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(() => props.data, (val) => {
  if (val && val.role_id) {
    // 编辑模式
    Object.assign(formData, {
      ...val,
      permission: typeof val.permission === 'string' 
        ? JSON.parse(val.permission || '{"modules":[]}') 
        : (val.permission || { modules: [] })
    })
  } else {
    // 新增模式
    Object.assign(formData, {
      role_id: null,
      role_code: '',
      fole_name: '',
      status: true,
      permission: { modules: [] },
      remarks: ''
    })
  }
}, { immediate: true })

// 方法定义
const handleSelectAll = () => {
  formData.permission.modules = availableModules.value.map(m => m.value)
}

const handleSelectNone = () => {
  formData.permission.modules = []
}

const checkRoleCodeExists = async (code, excludeId = null) => {
  try {
    const response = await roleGroupAPI.checkRoleCodeExists(code, excludeId)
    return response.data?.data?.exists || false
  } catch (error) {
    return false
  }
}

const handleConfirm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    
    // 检查权限组代码是否已存在
    const exists = await checkRoleCodeExists(formData.role_code, formData.role_id)
    if (exists) {
      ElMessage.error({message: '权限组代码已存在，请使用其他代码', duration: 1000})
      loading.value = false
      return
    }
    
    // 准备提交数据
    const submitData = {
      ...formData,
      permission: JSON.stringify(formData.permission)
    }
    
    emit('confirm', submitData)
  } catch (error) {
    return false
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  
  // 重置表单
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  })
}
</script>

<style scoped>
.permission-config {
  width: 100%;
}

.permission-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.permission-header span {
  font-weight: 500;
  margin-right: auto;
}

.permission-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-groups .el-checkbox {
  margin-right: 0;
}
</style>