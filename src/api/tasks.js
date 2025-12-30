import request from '../utils/request.js'

/**
 * 任务中心API
 * 基于后端 manageApi/src/routes/tasks.js 接口封装
 */
export const taskAPI = {
  // ===== 基础任务管理接口 =====

  /**
   * 获取任务列表（分页）
   * GET /tasks/list
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.status - 状态筛选
   * @param {string} params.priority - 优先级筛选
   * @param {string} params.taskType - 任务类型筛选
   * @param {string} params.search - 搜索关键词
   * @param {boolean} params.assignedToMe - 分配给我的
   * @param {boolean} params.createdByMe - 我创建的
   * @param {number} params.executionProgress - 执行进度筛选
   */
  getTaskList(params = {}) {
    return request.get('/tasks/list', params)
  },

  /**
   * 获取任务详情
   * GET /tasks/:id/details
   * @param {string|number} id - 任务ID
   */
  getTaskDetails(id) {
    return request.get(`/tasks/${id}/details`)
  },

  /**
   * 创建任务
   * POST /tasks
   * @param {Object} data - 任务数据
   * @param {string} data.title - 任务标题（必填）
   * @param {string} data.description - 任务描述
   * @param {string} data.taskType - 任务类型（必填）
   * @param {string} data.priority - 优先级，默认medium
   * @param {string} data.status - 状态，默认pending
   * @param {string} data.assignedTo - 分配给的用户ID
   * @param {string} data.dueDate - 截止日期
   * @param {Array} data.attachments - 附件列表
   * @param {number} data.executionProgress - 执行进度，默认0
   */
  createTask(data) {
    return request.post('/tasks', data)
  },

  /**
   * 更新任务
   * PUT /tasks/:id
   * @param {string|number} id - 任务ID
   * @param {Object} data - 更新数据（只更新提供的字段）
   */
  updateTask(id, data) {
    return request.put(`/tasks/${id}`, data)
  },

  /**
   * 删除任务
   * DELETE /tasks/:id
   * @param {string|number} id - 任务ID
   */
  deleteTask(id) {
    return request.delete(`/tasks/${id}/delete`)
  },

  /**
   * 更新任务状态
   * put /tasks/:id/status
   * @param {string|number} id - 任务ID
   * @param {string} status - 新状态
   * @param {string} comment - 备注（可选）
   * @param {number} executionProgress - 执行进度（可选）
   */
  updateTaskStatus(id, status, comment = '', executionProgress) {
    const data = { status, comment }
    if (executionProgress !== undefined) {
      data.executionProgress = executionProgress
    }
    return request.put(`/tasks/${id}/status`, data)
  },

  /**
   * 分配任务
   * put /tasks/:id/assign
   * @param {string|number} id - 任务ID
   * @param {string} assignedTo - 分配给的用户ID
   * @param {string} comment - 备注（可选）
   * @param {string} assigneeName - 负责人姓名（可选）
   * @param {string} assigneeDepartmentId - 负责人部门ID（可选）
   */
  assignTask(id, assignedTo, comment = '', assigneeName = '', assigneeDepartmentId = '') {
    return request.put(`/tasks/${id}/assign`, { 
      assignedTo, 
      comment,
      assigneeName,
      assigneeDepartmentId 
    })
  },

  /**
   * 获取任务统计信息
   * GET /tasks/statistics/summary
   */
  getTaskStatistics() {
    return request.get('/tasks/statistics/summary')
  },

  /**
   * 根据任务等级统计当前登录用户的任务
   * GET /tasks/statistics/priority
   * @param {Object} params - 查询参数
   * @param {string} params.taskType - 任务类型筛选
   * @param {string} params.status - 状态筛选
   */
  getTaskPriorityStatistics(params = {}) {
    return request.get('/tasks/statistics/priority', params)
  },

  /**
   * 获取我的任务（分配给我的任务）
   * GET /tasks/my-tasks
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.status - 状态筛选
   * @param {string} params.priority - 优先级筛选
   * @param {string} params.search - 搜索关键词
   */
  getMyTasks(params = {}) {
    return request.get('/tasks/my-tasks', params)
  },

  /**
   * 获取我发布的任务（我创建的任务）
   * GET /tasks/published-tasks
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.status - 状态筛选
   * @param {string} params.priority - 优先级筛选
   * @param {string} params.search - 搜索关键词
   */
  getPublishedTasks(params = {}) {
    return request.get('/tasks/published-tasks', params)
  },

  // ===== 任务进度管理接口 =====

  /**
   * 更新任务进度
   * put /tasks/:id/progress
   * @param {string|number} id - 任务ID
   * @param {number} executionProgress - 执行进度（0-100）
   * @param {string} comment - 备注（可选）
   */
  updateTaskProgress(id, executionProgress, comment = '') {
    return request.put(`/tasks/${id}/progress`, { executionProgress, comment })
  },

  /**
   * 获取任务进度历史
   * GET /tasks/:id/progress-history
   * @param {string|number} id - 任务ID
   * @param {Object} params - 分页参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认20
   */
  getTaskProgressHistory(id, params = {}) {
    return request.get(`/tasks/${id}/progress-history`, params)
  },

  /**
   * 获取任务进度统计
   * GET /tasks/stats/progress
   * @param {Object} params - 查询参数
   * @param {string} params.taskType - 任务类型筛选
   * @param {string} params.status - 状态筛选
   */
  getTaskProgressStats(params = {}) {
    return request.get('/tasks/stats/progress', params)
  },

  // ===== 任务统计接口 =====

  /**
   * 获取用户任务基本统计信息
   * GET /task-statistics/basic-stats
   * @param {Object} params - 查询参数
   * @param {string} params.role_type - 角色类型 ('assignee' 或 'creator'), 默认 'assignee'
   */
  getTaskBasicStats(params = {}) {
    return request.get('/task-statistics/basic-stats', params)
  },

  /**
   * 获取用户任务优先级统计信息
   * GET /task-statistics/priority-stats
   * @param {Object} params - 查询参数
   * @param {string} params.role_type - 角色类型 ('assignee' 或 'creator'), 默认 'assignee'
   */
  getTaskPriorityStats(params = {}) {
    return request.get('/task-statistics/priority-stats', params)
  },

  // ===== 任务执行记录接口 =====

  /**
   * 添加任务执行记录
   * POST /tasks/:id/executions
   * @param {string|number} id - 任务ID
   * @param {Object} data - 执行记录数据
   * @param {string} data.actionType - 操作类型（必填）
   * @param {string} data.actionDescription - 操作描述（必填，建议包含备注信息）
   * @param {string} data.statusAfter - 操作后状态（可选）
   * @param {number} data.currentProgress - 当前进度（可选，0-100）
   */
  addTaskExecution(id, data) {
    return request.post(`/tasks/${id}/executions`, data)
  },

  /**
   * 修改任务执行记录
   * PUT /tasks/:id/executions/:executionId
   * @param {string|number} id - 任务ID
   * @param {string|number} executionId - 执行记录ID
   * @param {Object} data - 更新数据（只更新提供的字段）
   */
  updateTaskExecution(id, executionId, data) {
    return request.put(`/tasks/${id}/executions/${executionId}`, data)
  }
}

// ===== 单独导出的函数（保持向后兼容性） =====

// 基础任务管理
export const getTaskList = (params) => taskAPI.getTaskList(params)
export const getTaskDetails = (id) => taskAPI.getTaskDetails(id)
export const createTask = (data) => taskAPI.createTask(data)
export const updateTask = (id, data) => taskAPI.updateTask(id, data)
export const deleteTask = (id) => taskAPI.deleteTask(id)
export const updateTaskStatus = (id, status, comment, executionProgress) => taskAPI.updateTaskStatus(id, status, comment, executionProgress)
export const assignTask = (id, assignedTo, comment) => taskAPI.assignTask(id, assignedTo, comment)
export const getTaskStatistics = () => taskAPI.getTaskStatistics()
export const getTaskPriorityStatistics = (params) => taskAPI.getTaskPriorityStatistics(params)
export const getMyTasks = (params) => taskAPI.getMyTasks(params)
export const getPublishedTasks = (params) => taskAPI.getPublishedTasks(params)

// 任务进度管理
export const updateTaskProgress = (id, executionProgress, comment) => taskAPI.updateTaskProgress(id, executionProgress, comment)
export const getTaskProgressHistory = (id, params) => taskAPI.getTaskProgressHistory(id, params)
export const getTaskProgressStats = (params) => taskAPI.getTaskProgressStats(params)

// 任务执行记录
export const addTaskExecution = (id, data) => taskAPI.addTaskExecution(id, data)
export const updateTaskExecution = (id, executionId, data) => taskAPI.updateTaskExecution(id, executionId, data)

export default taskAPI