import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('../views/user/UserManagement.vue'),
    meta: { requiresAuth: true }
  },
 
  {
    path: '/departments',
    name: 'DepartmentManagement',
    component: () => import('../views/user/DepartmentManagement.vue'),
    meta: { requiresAuth: true, permission: 'department:view' }
  },
  {
      path: '/role-groups',
      name: 'RoleGroupManagement',
      component: () => import('../views/user/RoleGroupManagement.vue'),
      meta: { requiresAuth: true, permission: 'role_group:view' }
    },
  {
    path: '/system/menus',
    name: 'MenuManagement',
    component: () => import('../views/system/MenuManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/system/equipment-categories',
    name: 'EquipmentCategoryManagement',
    component: () => import('../views/system/EquipmentCategoryManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/system/expense-categories',
    name: 'ExpenseCategoryManagement',
    component: () => import('../views/system/ExpenseCategoryManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/business/expenses',
    name: 'ExpenseManagement',
    component: () => import('../views/business/ExpenseManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/business/equipment',
    name: 'EquipmentManagement',
    component: () => import('../views/business/EquipmentManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/business/customers',
    name: 'CustomerManagement',
    component: () => import('../views/business/CustomerManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/business/contact-records',
    name: 'ContactRecordManagement',
    component: () => import('../views/business/ContactRecordManagement.vue')
  },
  {
    path: '/business/base-materials',
    name: 'BaseMaterialManagement',
    component: () => import('../views/business/BaseMaterialManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/system/database-compare',
    name: 'DatabaseCompare',
    component: () => import('../views/system/DatabaseCompare.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/approval/expenses',
    name: 'ExpenseApproval',
    component: () => import('../views/approval/ExpenseApproval.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/approval/equipment',
    name: 'EquipmentApproval',
    component: () => import('../views/approval/EquipmentApproval.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/system/approval-flows',
    name: 'ApprovalFlowConfig',
    component: () => import('../views/system/ApprovalFlowConfig.vue'),
    meta: { requiresAuth: true }
  },
  {    
    path: '/statistics/expense',
    name: 'ExpenseStatistics',
    component: () => import('../views/statistics/ExpenseStatistics.vue'),
    meta: { requiresAuth: true }
  },
  {    
    path: '/statistics/equipment',
    name: 'EquipmentStatistics',
    component: () => import('../views/statistics/EquipmentStatistics.vue'),
    meta: { requiresAuth: true }
  },
  {    
    path: '/statistics/customers',
    name: 'CustomerStatistics',
    component: () => import('../views/statistics/CustomerStatistics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/my-tasks',
    name: 'MyTasks',
    component: () => import('../views/tasks/MyTasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/published-tasks',
    name: 'PublishedTasks',
    component: () => import('../views/tasks/PublishedTasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logs/login-logs',
    name: 'LoginLogs',
    component: () => import('../views/logs/LoginLogs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logs/operation-logs',
    name: 'OperationLogs',
    component: () => import('../views/logs/OperationLogs.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.userToken !== null
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // 检查页面级权限
  if (to.meta.permission && isAuthenticated) {
    const { permissionUtils } = await import('../utils/permission.js')
    if (!permissionUtils.hasPermission(to.meta.permission)) {
      // 如果没有权限，跳转到无权限页面或首页
      next('/')
      return
    }
  }
  
  if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router