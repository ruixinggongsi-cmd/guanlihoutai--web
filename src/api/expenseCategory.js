import request from '../utils/request'

// 费用分类管理API
export const expenseCategoryAPI = {
  /**
   * 获取所有费用分类（树形结构）
   */
  getExpenseCategories() {
    return request.get('/expense-categories')
  },

  /**
   * 获取分类详情
   * @param {string} id - 分类ID
   */
  getExpenseCategory(id) {
    return request.get(`/expense-categories/${id}`)
  },

  /**
   * 获取子分类
   * @param {string} id - 父分类ID
   */
  getSubCategories(id) {
    return request.get(`/expense-categories/${id}/children`)
  },

  /**
   * 创建分类
   * @param {Object} data - 分类数据
   * @param {string} data.category_name - 分类名称
   * @param {string} data.category_code - 分类编码（可选）
   * @param {string} data.parent_id - 父分类ID（可选，null表示主分类）
   * @param {string} data.icon - 图标（可选）
   * @param {string} data.description - 描述（可选）
   * @param {string} data.status - 状态（可选，active/inactive）
   * @param {number} data.sort_order - 排序权重（可选）
   */
  createExpenseCategory(data) {
    return request.post('/expense-categories', data)
  },

  /**
   * 更新分类
   * @param {string} id - 分类ID
   * @param {Object} data - 分类数据
   */
  updateExpenseCategory(id, data) {
    return request.put(`/expense-categories/${id}`, data)
  },

  /**
   * 删除分类
   * @param {string} id - 分类ID
   */
  deleteExpenseCategory(id) {
    return request.delete(`/expense-categories/${id}`)
  }
}

// 导出单独的方法，保持向后兼容性
export const getExpenseCategories = () => expenseCategoryAPI.getExpenseCategories()
export const getExpenseCategory = (id) => expenseCategoryAPI.getExpenseCategory(id)
export const getSubCategories = (id) => expenseCategoryAPI.getSubCategories(id)
export const createExpenseCategory = (data) => expenseCategoryAPI.createExpenseCategory(data)
export const updateExpenseCategory = (id, data) => expenseCategoryAPI.updateExpenseCategory(id, data)
export const deleteExpenseCategory = (id) => expenseCategoryAPI.deleteExpenseCategory(id)

export default expenseCategoryAPI