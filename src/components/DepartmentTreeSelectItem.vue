<template>
  <transition-group name="expand" tag="div" class="space-y-1">
    <template v-for="dept in departments" :key="dept.id">
      <div 
        class="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer relative"
        :style="{ paddingLeft: (16 + (level * 20)) + 'px' }"
        :class="{ 
          'ring-2 ring-primary bg-white/10': selectedId === dept.id,
          'hover:bg-white/10': selectedId !== dept.id
        }"
        @click="$emit('select-department', dept)"
        @dblclick="dept.children && dept.children.length > 0 && $emit('toggle-expand', dept.id)"
      >
        <div class="col-span-6 flex items-center">
          <button 
            v-if="dept.children && dept.children.length > 0" 
            @click.stop="$emit('toggle-expand', dept.id)" 
            class="mr-3 text-gray-400 hover:text-white"
          >
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
        <div class="col-span-3">
          <span class="text-gray-400 text-sm">{{ dept.code || '-' }}</span>
        </div>
        <div class="col-span-3">
          <span class="text-gray-400 text-sm">{{ getParentDepartmentName(dept.parentId) || '顶级部门' }}</span>
        </div>
        <!-- 选中状态显示 -->
        <div v-if="selectedId === dept.id" class="absolute top-2 right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
          <i class="fas fa-check text-white text-xs"></i>
        </div>
      </div>
      
      <!-- 递归渲染子部门 -->
      <DepartmentTreeSelectItem 
        v-if="dept.children && dept.children.length > 0 && expandedIds.includes(dept.id)"
        :departments="dept.children" 
        :expanded-ids="expandedIds" 
        :level="level + 1"
        :selected-id="selectedId"
        :parent-depts="allParentDepts"
        @select-department="$emit('select-department', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </template>
  </transition-group>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  departments: { type: Array, required: true },
  expandedIds: { type: Array, default: () => [] },
  level: { type: Number, default: 0 },
  selectedId: { type: String, default: null },
  parentDepts: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-department', 'toggle-expand'])

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