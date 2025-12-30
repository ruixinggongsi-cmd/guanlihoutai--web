<template>
  <transition-group name="expand" tag="div" class="space-y-1">
    <template v-for="dept in departments" :key="dept.id">
      <div class="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
           :style="{ paddingLeft: (16 + (getDeptLevel(dept) * 20)) + 'px' }"
           @dblclick="dept.children && dept.children.length > 0 && $emit('toggle-expand', dept.id)">
        <div class="col-span-5 flex items-center">
          <button v-if="dept.children && dept.children.length > 0" @click.stop="$emit('toggle-expand', dept.id)" class="mr-3 text-gray-400 hover:text-white">
            <i :class="expandedIds.includes(dept.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="text-sm"></i>
          </button>
          <div v-else class="w-4 mr-3"></div>
          <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mr-3">
            <i class="fas fa-sitemap text-white text-sm"></i>
          </div>
          <div>
            <div class="text-white font-medium">{{ dept.name }}</div>
            <div class="text-gray-400 text-xs">{{ dept.description || '暂无描述' }}</div>
          </div>
        </div>
        <div class="col-span-2"><span class="text-gray-400 text-xs">{{ dept.code || '-' }}</span></div>
        <div class="col-span-2"><span class="text-gray-400 text-xs">{{ getParentDepartmentName(dept.parentId) || '顶级部门' }}</span></div>
        <div class="col-span-1 text-center">
          <span :class="['px-2 py-1 rounded-full text-xs', dept.status === 'active' ? 'bg-success/20 text-success' : 'bg-gray-500/20 text-gray-400']">{{ dept.status === 'active' ? '启用' : '禁用' }}</span>
        </div>
        <div class="col-span-2 flex justify-end space-x-2">
          <button 
            v-permission="'department:add'"
            @click.stop="$emit('show-add-modal', dept.id)" 
            class="px-2 py-1 bg-gradient-to-r from-success to-success-light text-white text-xs font-medium rounded shadow-lg hover:shadow-xl transition-all duration-300" 
            title="添加子部门"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button 
            v-permission="'department:edit'"
            @click.stop="$emit('edit-dept', dept)" 
            class="px-2 py-1 bg-white/10 text-white text-xs border border-white/20 rounded hover:bg-white/20 transition-all duration-300" 
            title="编辑"
          >
            <i class="fas fa-edit"></i>
          </button>
          <!-- 禁用操作已移除 -->
          <button 
            v-permission="'department:delete'"
            @click.stop="$emit('delete-dept', dept)" 
            class="px-2 py-1 bg-danger/20 text-danger text-xs border border-danger/30 rounded hover:bg-danger/30 transition-all duration-300" 
            title="删除"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <DepartmentTreeItem v-if="dept.children && dept.children.length > 0 && expandedIds.includes(dept.id)"
                          :departments="dept.children" 
                          :expanded-ids="expandedIds" 
                          :level="level + 1"
                          :parent-depts="allParentDepts"
                          @edit-dept="$emit('edit-dept', $event)"
                          @delete-dept="$emit('delete-dept', $event)"

                          @show-add-modal="$emit('show-add-modal', $event)"
                          @toggle-expand="$emit('toggle-expand', $event)" />
    </template>
  </transition-group>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  departments: { type: Array, required: true },
  expandedIds: { type: Array, default: () => [] },
  level: { type: Number, default: 0 },
  parentDepts: { type: Array, default: () => [] }
})

const emit = defineEmits(['edit-dept', 'delete-dept', 'show-add-modal', 'toggle-expand'])

// 计算所有父部门列表用于查找
const allParentDepts = computed(() => {
  const parents = [...props.parentDepts];
  const collectParents = (depts) => {
    depts.forEach(dept => {
      parents.push({
        id: dept.id,
        name: dept.name,
        code: dept.code
      });
      if (dept.children && dept.children.length > 0) {
        collectParents(dept.children);
      }
    });
  };
  collectParents(props.departments);
  return parents;
});

const getDeptLevel = (dept) => {
  return props.level;
}

const getParentDepartmentName = (parentId) => {
  if (!parentId) return null;
  const parent = allParentDepts.value.find(dept => dept.id === parentId);
  return parent ? parent.name : null;
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>