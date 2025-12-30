<template>
  <transition-group name="expand" tag="div" class="space-y-1">
    <template v-for="menu in menus" :key="menu.id">
      <div class="flex items-center px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
           :style="{ paddingLeft: (16 + (getMenuLevel(menu) * 20)) + 'px' }">
        <div class="flex items-center flex-1">
          <button v-if="menu.children && menu.children.length > 0" @click="toggleExpand(menu.id)" class="mr-3 text-gray-400 hover:text-white">
            <i :class="expandedIds.includes(menu.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="text-sm"></i>
          </button>
          <div v-else class="w-4 mr-3"></div>
          <label class="flex items-center cursor-pointer flex-1">
            <input 
              type="checkbox"
              :checked="isMenuSelected(menu)"
              @change="handleMenuCheckChange(menu, $event)"
              class="mr-3 text-primary focus:ring-primary rounded"
            >
            <div class="flex items-center flex-1">
              <div class="mr-3 text-gray-400">
                <i :class="getMenuIcon(menu)" class="text-sm"></i>
              </div>
              <div class="flex-1">
                <div class="text-white font-medium text-left">{{ menu.name }}<span class="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                    {{ menu.type === 'menu' ? '菜单' : '功能' }}
                  </span></div>
               
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- 递归显示子菜单 -->
      <MenuTreePermission v-if="menu.children && menu.children.length > 0 && expandedIds.includes(menu.id)"
                          :menus="menu.children" 
                          :selected-permissions="selectedPermissions"
                          :level="level + 1"
                          :expanded-ids="expandedIds"
                          :menu-map="menuMap"
                          :root-menus="rootMenus"
                          @permission-change="$emit('permission-change', selectedPermissions)"
                          @toggle-expand="toggleExpand" />
    </template>
  </transition-group>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  menus: {
    type: Array,
    required: true
  },
  selectedPermissions: {
    type: Object,
    default: () => ({})
  },
  level: {
    type: Number,
    default: 0
  },
  expandedIds: {
    type: Array,
    default: () => []
  },
  menuMap: {
    type: Object,
    default: () => ({})
  },
  rootMenus: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['permission-change', 'toggle-expand'])

// 获取菜单图标
const getMenuIcon = (menu) => {
  if (menu.icon) {
    return menu.icon
  }
  return menu.type === 'menu' ? 'fas fa-folder' : 'fas fa-cog'
}

// 获取菜单层级
const getMenuLevel = (menu) => {
  return props.level
}

// 切换展开状态
const toggleExpand = (menuId) => {
  emit('toggle-expand', menuId)
}

// 检查菜单是否被选中
const isMenuSelected = (menu) => {
  return !!props.selectedPermissions[menu.id]
}

// 递归处理子菜单的选中状态
const handleChildrenCheck = (menu, checked) => {
  if (menu.children && menu.children.length > 0) {
    menu.children.forEach(child => {
      if (checked) {
        // 选中子菜单
        props.selectedPermissions[child.id] = {
          menuName: child.name,
          menuPath: child.path || '',
          menuType: child.type || 'menu',
          menuIcon: child.icon || ''
        }
      } else {
        // 取消选中子菜单
        delete props.selectedPermissions[child.id]
      }
      // 递归处理子菜单的子菜单
      handleChildrenCheck(child, checked)
    })
  }
}

// 处理父节点的选中状态
const handleParentCheck = (menuId, checked) => {
  if (!props.rootMenus || props.rootMenus.length === 0) {
    return
  }
  
  // 在菜单树中查找父菜单
  const findParentMenu = (rootMenu, targetId, parent = null) => {
    if (rootMenu.id === targetId) return parent
    if (rootMenu.children && rootMenu.children.length > 0) {
      for (const child of rootMenu.children) {
        const result = findParentMenu(child, targetId, rootMenu)
        if (result) return result
      }
    }
    return null
  }
  
  // 查找指定菜单的父菜单
  const findParent = (currentId, rootMenus) => {
    for (const rootMenu of rootMenus) {
      const parent = findParentMenu(rootMenu, currentId)
      if (parent) {
        return parent
      }
    }
    return null
  }
  
  // 检查菜单的所有子节点是否都被选中
  const checkAllChildrenSelected = (menu) => {
    if (!menu.children || menu.children.length === 0) return true
    return menu.children.every(child => {
      return props.selectedPermissions[child.id] && checkAllChildrenSelected(child)
    })
  }
  
  // 向上处理父节点的选中状态
  const processParent = (currentId) => {
    const parent = findParent(currentId, props.rootMenus)
    if (parent) {
      if (checked) {
        // 选中状态：立即选中父节点（不需要检查所有子节点）
        props.selectedPermissions[parent.id] = {
          menuName: parent.name,
          menuPath: parent.path || '',
          menuType: parent.type || 'menu',
          menuIcon: parent.icon || ''
        }
        // 继续向上处理，直到根节点
        processParent(parent.id)
      } else {
        // 取消选中状态：检查是否有其他子节点仍然被选中
        const hasOtherSelectedChildren = parent.children && parent.children.some(child => {
          return props.selectedPermissions[child.id] && child.id !== currentId
        })
        
        // 只有当没有其他子节点被选中时，才取消父节点的选中
        if (!hasOtherSelectedChildren) {
          delete props.selectedPermissions[parent.id]
          // 继续向上处理
          processParent(parent.id)
        }
      }
    }
  }
  
  processParent(menuId)
}

// 处理菜单复选框变更
const handleMenuCheckChange = (menu, event) => {
  const checked = event.target.checked
  const menuId = menu.id
  
  if (checked) {
    // 选中菜单，给予所有权限
    if (!props.selectedPermissions[menuId]) {
      props.selectedPermissions[menuId] = {
        menuName: menu.name,
        menuPath: menu.path || '',
        menuType: menu.type || 'menu',
        menuIcon: menu.icon || ''
      }
    }
    // 级联选中所有子菜单
    handleChildrenCheck(menu, true)
    // 向上处理父节点的选中状态
    handleParentCheck(menuId, true)
  } else {
    // 取消选中，删除权限
    delete props.selectedPermissions[menuId]
    // 级联取消选中所有子菜单
    handleChildrenCheck(menu, false)
    // 向上处理父节点的取消选中状态
    handleParentCheck(menuId, false)
  }
  
  emit('permission-change', props.selectedPermissions)
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