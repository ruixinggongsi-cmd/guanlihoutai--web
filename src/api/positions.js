import request from '../utils/request'

// 职位管理API
export const positionsAPI = {
  /**
   * 获取职位列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认100
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.status - 状态筛选：active/inactive
   */
  getPositionList(params = {}) {
    return request.get('/positions/list', params)
  },

  /**
   * 获取职位选项（用于下拉选择）
   */
  getPositionOptions() {
    return request.get('/positions/options')
  },

  /**
   * 获取职位详情
   * @param {string} id - 职位ID
   */
  getPosition(id) {
    return request.get(`/positions/${id}`)
  },

  /**
   * 创建职位
   * @param {Object} data - 职位数据
   * @param {string} data.position_name - 职位名称（必填）
   * @param {string} data.position_code - 职位编码（可选）
   * @param {string} data.description - 职位描述（可选）
   * @param {number} data.sort_order - 排序权重（可选）
   * @param {string} data.status - 状态（可选，默认active）
   */
  createPosition(data) {
    return request.post('/positions', data)
  },

  /**
   * 更新职位
   * @param {string} id - 职位ID
   * @param {Object} data - 职位数据
   */
  updatePosition(id, data) {
    return request.put(`/positions/${id}`, data)
  },

  /**
   * 删除职位
   * @param {string} id - 职位ID
   */
  deletePosition(id) {
    return request.delete(`/positions/${id}`)
  }
}

export default positionsAPI

