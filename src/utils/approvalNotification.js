import { expenseApplicationsAPI } from '@/api/expenseApplications'

/**
 * 审批通知服务
 * 用于检测新的审批订单并显示桌面通知
 */
class ApprovalNotificationService {
  constructor() {
    this.checkInterval = null // 轮询定时器
    this.checkIntervalMs = 10000 // 默认10秒检查一次（更频繁的检查）
    this.lastCheckTime = null // 上次检查时间
    this.lastPendingCount = 0 // 上次待审批数量
    this.isEnabled = false // 是否启用
    this.notificationPermission = null // 通知权限状态
    this.isFirstCheck = true // 是否是第一次检查
  }

  /**
   * 请求通知权限
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('此浏览器不支持桌面通知')
      return false
    }

    if (Notification.permission === 'granted') {
      this.notificationPermission = 'granted'
      return true
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission()
        this.notificationPermission = permission
        return permission === 'granted'
      } catch (error) {
        console.error('请求通知权限失败:', error)
        return false
      }
    }

    this.notificationPermission = 'denied'
    return false
  }

  /**
   * 显示通知
   */
  showNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null
    }

    const defaultOptions = {
      body: options.body || '您有新的审批订单需要处理',
      icon: options.icon || '/vite.svg',
      badge: '/vite.svg',
      tag: 'approval-notification', // 使用tag避免重复通知
      requireInteraction: false, // 不需要用户交互
      silent: false, // 播放声音
      ...options
    }

    try {
      const notification = new Notification(title, defaultOptions)
      
      // 点击通知时聚焦到窗口
      notification.onclick = () => {
        window.focus()
        notification.close()
        
        // 如果提供了回调，执行回调
        if (options.onclick) {
          options.onclick()
        }
      }

      // 自动关闭通知（5秒后）
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('显示通知失败:', error)
      return null
    }
  }

  /**
   * 检查新的审批订单
   */
  async checkNewApprovals() {
    try {
      const response = await expenseApplicationsAPI.getPendingApprovals({
        page: 1,
        pageSize: 1 // 只需要获取数量，不需要详细数据
      })

      if (response.success) {
        const currentCount = response.pagination?.total || 0
        
        console.log(`[审批通知] 当前待审批数量: ${currentCount}, 上次数量: ${this.lastPendingCount}, 是否首次检查: ${this.isFirstCheck}`)
        
        // 如果是第一次检查（登录后首次检查），且有待审批订单，立即显示通知
        if (this.isFirstCheck && currentCount > 0) {
          console.log(`[审批通知] 🔔 登录后首次检查发现 ${currentCount} 个待审批订单，立即显示通知`)
          this.showNotification(
            `您有 ${currentCount} 个待审批订单`,
            {
              body: `请及时处理这些审批订单`,
              icon: '/vite.svg',
              onclick: () => {
                // 跳转到审批页面
                const router = window.__VUE_ROUTER__ || window.$router
                if (router) {
                  router.push('/approval/expense')
                } else if (window.location.pathname !== '/approval/expense') {
                  window.location.href = '/approval/expense'
                }
                window.focus()
              }
            }
          )
          this.isFirstCheck = false // 标记首次检查已完成
        }
        // 如果数量增加了，说明有新订单（登录后新增的）
        else if (currentCount > this.lastPendingCount && !this.isFirstCheck) {
          const newCount = currentCount - this.lastPendingCount
          console.log(`[审批通知] 🔔 检测到 ${newCount} 个新的审批订单，立即显示通知`)
          this.showNotification(
            `您有 ${newCount} 个新的审批订单`,
            {
              body: `当前共有 ${currentCount} 个待审批订单，请及时处理`,
              icon: '/vite.svg',
              onclick: () => {
                // 跳转到审批页面
                const router = window.__VUE_ROUTER__ || window.$router
                if (router) {
                  router.push('/approval/expense')
                } else if (window.location.pathname !== '/approval/expense') {
                  window.location.href = '/approval/expense'
                }
                window.focus()
              }
            }
          )
        }
        // 如果数量减少了（用户审批了订单），不显示通知，但更新计数
        else if (currentCount < this.lastPendingCount) {
          console.log(`[审批通知] 待审批数量从 ${this.lastPendingCount} 减少到 ${currentCount}，用户已处理部分订单`)
        }

        this.lastPendingCount = currentCount
        this.lastCheckTime = new Date()
        this.isFirstCheck = false // 首次检查完成后，后续都是常规检查
      } else {
        console.warn('[审批通知] 获取待审批订单失败:', response.message)
      }
    } catch (error) {
      console.error('[审批通知] 检查审批订单失败:', error)
    }
  }

  /**
   * 启动通知服务
   */
  async start(intervalMs = null) {
    if (this.isEnabled) {
      console.warn('通知服务已经在运行中')
      return
    }

    // 请求通知权限
    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      console.warn('未获得通知权限，无法启动通知服务')
      return false
    }

    // 设置检查间隔
    if (intervalMs) {
      this.checkIntervalMs = intervalMs
    }

    // 立即检查一次
    await this.checkNewApprovals()

    // 启动定时检查
    this.checkInterval = setInterval(() => {
      this.checkNewApprovals()
    }, this.checkIntervalMs)

    this.isEnabled = true
    console.log(`审批通知服务已启动，检查间隔: ${this.checkIntervalMs}ms`)
    return true
  }

  /**
   * 停止通知服务
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isEnabled = false
    this.isFirstCheck = true // 重置首次检查标记
    this.lastPendingCount = 0 // 重置计数
    console.log('审批通知服务已停止')
  }
  
  /**
   * 立即检查一次（不等待定时器）
   */
  async checkImmediately() {
    if (!this.isEnabled) {
      console.warn('[审批通知] 服务未启动，无法立即检查')
      return
    }
    console.log('[审批通知] 执行立即检查...')
    await this.checkNewApprovals()
  }

  /**
   * 检查服务状态
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      permission: this.notificationPermission || Notification?.permission || 'unknown',
      lastCheckTime: this.lastCheckTime,
      lastPendingCount: this.lastPendingCount,
      checkInterval: this.checkIntervalMs
    }
  }
}

// 创建单例实例
const approvalNotificationService = new ApprovalNotificationService()

export default approvalNotificationService

