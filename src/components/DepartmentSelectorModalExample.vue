<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">部门选择模态框示例</h1>
      
      <!-- 触发按钮 -->
      <div class="mb-8">
        <button 
          @click="showDepartmentSelector = true"
          class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          选择部门
        </button>
      </div>

      <!-- 选中的部门信息 -->
      <div v-if="selectedDepartment" class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h3 class="text-xl font-bold text-white mb-4">选中的部门信息</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">部门ID</label>
            <div class="text-white">{{ selectedDepartment.id }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">部门名称</label>
            <div class="text-white">{{ selectedDepartment.name }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">部门编码</label>
            <div class="text-white">{{ selectedDepartment.code || '-' }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">上级部门ID</label>
            <div class="text-white">{{ selectedDepartment.parentId || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl text-center">
        <i class="fas fa-sitemap text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-400">暂未选择部门</p>
      </div>

      <!-- 部门选择模态框 -->
      <DepartmentSelectorModal 
        :visible="showDepartmentSelector"
        @update:visible="showDepartmentSelector = $event"
        @select="handleDepartmentSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DepartmentSelectorModal from './DepartmentSelectorModal.vue'

const showDepartmentSelector = ref(false)
const selectedDepartment = ref(null)

const handleDepartmentSelect = (department) => {
  selectedDepartment.value = department
}
</script>