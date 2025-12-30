import { permissionUtils } from '../utils/permission'

/**
 * v-permission 权限指令
 * 使用方式：
 * 1. v-permission="'user:add'" - 检查单个权限
 * 2. v-permission="['user:add', 'user:edit']" - 检查多个权限（满足任意一个）
 * 3. v-permission:all="['user:add', 'user:edit']" - 检查多个权限（满足所有）
 * 4. v-permission:module="'user'" - 检查模块权限
 */
export const permissionDirective = {
  // 指令挂载时
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  
  // 指令更新时
  updated(el, binding) {
    checkPermission(el, binding)
  }
}

/**
 * 检查权限并控制元素显示
 */
function checkPermission(el, binding) {
  const { value, arg, modifiers } = binding
 
  let hasPermission = false
  
  try {
    // 根据不同的修饰符和参数进行权限检查
    if (arg === 'all') {
      // v-permission:all - 需要所有权限
      hasPermission = permissionUtils.hasAllPermissions(value)
    } else if (arg === 'module') {
      // v-permission:module="'user'" - 检查模块权限
      const modulePermissions = [
        `${value}:add`,
        `${value}:edit`, 
        `${value}:delete`,
        `${value}:view`,
        `${value}:approve`
      ]
    
      hasPermission = permissionUtils.hasAnyPermission(modulePermissions)
    } else if (Array.isArray(value)) {
      // v-permission="['user:add', 'user:edit']" - 数组形式，满足任意一个
      hasPermission = permissionUtils.hasAnyPermission(value)
    } else if (typeof value === 'string') {
      // v-permission="'user:add'" - 字符串形式
      hasPermission = permissionUtils.hasPermission(value)
    } else {
      console.warn('v-permission指令参数类型错误，支持字符串和数组')
      return
    }
    
    // 如果没有权限，隐藏元素
    if (!hasPermission) {
      // 保存原始display样式
      if (!el._originalDisplay) {
        el._originalDisplay = el.style.display
      }
      el.style.display = 'none'
    } else {
      // 有权限时恢复原始display样式
      if (el._originalDisplay !== undefined) {
        el.style.display = el._originalDisplay === 'none' ? '' : el._originalDisplay
        delete el._originalDisplay
      }
    }
    
  } catch (error) {
    console.error('权限检查失败:', error)
    // 权限检查失败时，默认隐藏元素
    el.style.display = 'none'
  }
}

/**
 * 批量权限检查函数
 * 用于在组件中批量检查多个元素的权限
 */
export const batchCheckPermissions = (elements) => {
  elements.forEach(({ el, permission }) => {
    const binding = {
      value: permission,
      arg: null,
      modifiers: {}
    }
    checkPermission(el, binding)
  })
}

export default permissionDirective