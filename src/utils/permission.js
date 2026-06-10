import { useUserStore } from '../stores/user'

const DATABASE_COMPARE_MENU_ID = '550e8400-e29b-41d4-a716-446655440019'
const DATABASE_COMPARE_BASIC_PERMISSIONS = [
  'database_compare:view',
  'database_compare:compare',
  'database_compare:import'
]

function walkMenus(menus, visitor) {
  if (!menus || !Array.isArray(menus)) return
  menus.forEach(menu => {
    visitor(menu)
    if (menu.children?.length) walkMenus(menu.children, visitor)
  })
}

function hasDatabaseCompareMenuAccess(userMenus) {
  let found = false
  walkMenus(userMenus, menu => {
    if (
      menu.path === '/system/database-compare' ||
      String(menu.id) === DATABASE_COMPARE_MENU_ID
    ) {
      found = true
    }
  })
  return found
}

/**
 * 权限检查工具函数
 */
export const permissionUtils = {
  /**
   * 检查用户是否有指定权限
   * @param {string} permissionCode - 权限代码（菜单路径或功能代码）
   * @returns {boolean} 是否有权限
   */
  hasPermission(permissionCode) {
    const userStore = useUserStore()
    
    // 如果用户没有登录，返回false
    if (!userStore.isLoggedIn) {
      return false
    }

    // 超级管理员拥有全部功能权限
    if (this.isSuperAdmin()) {
      return true
    }
    
    // 获取用户菜单列表，只提取功能选项（type='function'的菜单项）
    const userMenus = userStore.userMenus || []
    
    // 从菜单中提取功能权限
    const functionPermissions = []
    
    // 递归遍历菜单，提取所有功能权限
    const extractFunctions = (menus) => {
      menus.forEach(menu => {
        // 如果当前菜单是功能类型，添加到权限列表
        if (menu.type === 'function' && menu.path) {
          functionPermissions.push(menu)
        }
        
        // 如果有子菜单，递归处理
        if (menu.children && Array.isArray(menu.children)) {
          extractFunctions(menu.children)
        }
      })
    }
    
    
    // 提取所有功能权限
    extractFunctions(userMenus)
    
    const hasExplicit = functionPermissions.some(permission => {
      if (permission.path === permissionCode) return true
      if (permission.code === permissionCode) return true
      if (permission.name === permissionCode) return true
      return false
    })
    if (hasExplicit) return true

    // 向后兼容：有「数据库对比」菜单即可使用基础功能
    if (
      DATABASE_COMPARE_BASIC_PERMISSIONS.includes(permissionCode) &&
      hasDatabaseCompareMenuAccess(userMenus)
    ) {
      return true
    }

    return false
  },

  /**
   * 检查用户是否有多个权限中的任意一个
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否有任意权限
   */
  hasAnyPermission(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false
    }
    
    return permissionCodes.some(code => this.hasPermission(code))
  },

  /**
   * 检查用户是否拥有所有指定权限
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否拥有所有权限
   */
  hasAllPermissions(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false
    }
    
    return permissionCodes.every(code => this.hasPermission(code))
  },

  /**
   * 是否为超级管理员（可查看/删除全部数据）
   */
  isSuperAdmin() {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      return false
    }

    const user = userStore.userInfo || {}
    const username = String(user.username || '').toLowerCase()
    const roleCode = user.roleInfo?.role_code || user.role_code || ''
    const roleName = user.roleInfo?.role_name || user.role_name || ''

    return (
      username === 'admin' ||
      roleCode === 'superadmin' ||
      roleName === '超级管理员'
    )
  }
}

/**
 * 生成权限代码
 * @param {string} module - 模块名称
 * @param {string} action - 操作类型（add, edit, delete, view, approve等）
 * @returns {string} 权限代码
 */
export const generatePermissionCode = (module, action) => {
  const actionMap = {
    'add': 'add',
    'create': 'add',
    'edit': 'edit',
    'update': 'edit',
    'delete': 'delete',
    'remove': 'delete',
    'view': 'view',
    'query': 'view',
    'approve': 'approve',
    'audit': 'approve',
    'export': 'export',
    'import': 'import',
    'search': 'search',
    'reset': 'reset'
  }
  
  const normalizedAction = actionMap[action] || action
  return `${module}:${normalizedAction}`
}

/**
 * 从菜单路径生成权限代码
 * @param {string} path - 菜单路径
 * @param {string} action - 操作类型
 * @returns {string} 权限代码
 */
export const generatePermissionFromPath = (path, action) => {
  if (!path) return ''
  
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\//, '')
  
  // 将路径转换为模块名
  const module = cleanPath.replace(/\//g, '_')
  
  return generatePermissionCode(module, action)
}

export default permissionUtils