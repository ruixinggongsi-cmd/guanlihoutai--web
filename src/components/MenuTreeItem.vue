<template>
  <transition-group name="expand" tag="div" class="space-y-1">
    <template v-for="menu in menus" :key="menu.id">
      <div class="grid grid-cols-11 gap-4 items-center px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
           :style="{ paddingLeft: (16 + (getMenuLevel(menu) * 20)) + 'px' }"
           @dblclick="menu.children && menu.children.length > 0 && $emit('toggle-expand', menu.id)">
        <div class="col-span-4 flex items-center">
          <button v-if="menu.children && menu.children.length > 0" @click.stop="$emit('toggle-expand', menu.id)" class="mr-3 text-gray-400 hover:text-white">
            <i :class="expandedIds.includes(menu.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="text-sm"></i>
          </button>
          <div v-else class="w-4 mr-3"></div>
          <div :class="getIconClasses()" class="mr-3">
            <i :class="[menu.icon || getDefaultIcon(), getIconStyle()]"></i>
          </div>
          <div>
            <div class="text-white font-medium">{{ menu.name }}</div>
            <div class="text-gray-400 text-xs">{{ menu.description || '暂无描述' }}</div>
          </div>
        </div>
        <div class="col-span-1"><span class="text-gray-400 text-xs">{{ menu.icon || '-' }}</span></div>
        <div class="col-span-2"><span class="text-gray-400 text-xs">{{ menu.path || '-' }}</span></div>
        <div class="col-span-1 text-center">
          <span :class="['px-2 py-1 rounded-full text-xs', menu.type === 'menu' ? 'bg-primary/20 text-primary' : 'bg-info/20 text-info']">{{ menu.type === 'menu' ? '菜单' : '功能' }}</span>
        </div>
        <div class="col-span-1 text-center">
          <span :class="['px-2 py-1 rounded-full text-xs', menu.status === 'active' ? 'bg-success/20 text-success' : 'bg-gray-500/20 text-gray-400']">{{ menu.status === 'active' ? '启用' : '禁用' }}</span>
        </div>
        <div class="col-span-2 flex justify-end space-x-2">
          <button v-permission="'menu:add'" @click.stop="$emit('show-add-modal', menu.id)" class="px-2 py-1 bg-gradient-to-r from-success to-success-light text-white text-xs font-medium rounded shadow-lg hover:shadow-xl transition-all duration-300" title="添加子菜单"><i class="fas fa-plus"></i></button>
          <button v-permission="'menu:edit'" @click.stop="$emit('edit-menu', menu)" class="px-2 py-1 bg-white/10 text-white text-xs border border-white/20 rounded hover:bg-white/20 transition-all duration-300" title="编辑"><i class="fas fa-edit"></i></button>
          <button v-permission="'menu:delete'" @click.stop="$emit('delete-menu', menu)" class="px-2 py-1 bg-danger/20 text-danger text-xs border border-danger/30 rounded hover:bg-danger/30 transition-all duration-300" title="删除"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <MenuTreeItem v-if="menu.children && menu.children.length > 0 && expandedIds.includes(menu.id)"
                    :menus="menu.children" :expanded-ids="expandedIds" :level="level + 1"
                    @edit-menu="$emit('edit-menu', $event)"
                    @delete-menu="$emit('delete-menu', $event)"
                    @show-add-modal="$emit('show-add-modal', $event)"
                    @toggle-expand="$emit('toggle-expand', $event)" />
    </template>
  </transition-group>
</template>

<script setup>
const props = defineProps({
  menus: { type: Array, required: true },
  expandedIds: { type: Array, default: () => [] },
  level: { type: Number, default: 0 }
})

const emit = defineEmits(['edit-menu', 'delete-menu', 'show-add-modal', 'toggle-expand'])

const getIconClasses = () => {
  return 'bg-gradient-to-br rounded flex items-center justify-center from-primary/20 to-secondary/20 w-8 h-8 rounded-lg';
}

const getIconStyle = () => {
  return 'text-xs text-primary';
}

const getDefaultIcon = () => {
  return 'fas fa-folder';
}

const getMenuLevel = (menu) => {
  return props.level;
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