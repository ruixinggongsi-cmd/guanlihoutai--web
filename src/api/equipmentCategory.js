import request from '../utils/request'

// 设备分类管理API
export const equipmentCategoryAPI = {
  /**
   * 获取所有设备分类（树形结构）
   */
  getEquipmentCategories() {
    return request.get('/equipment-categories')
  },

  /**
   * 获取分类详情
   * @param {string} id - 分类ID
   */
  getEquipmentCategory(id) {
    return request.get(`/equipment-categories/${id}`)
  },

  /**
   * 获取子分类
   * @param {string} id - 父分类ID
   */
  getSubCategories(id) {
    return request.get(`/equipment-categories/${id}/children`)
  },

  /**
   * 创建分类
   * @param {Object} data - 分类数据
   * @param {string} data.category_name - 分类名称
   * @param {string} data.parent_id - 父分类ID（可选，null表示主分类）
   * @param {string} data.icon - 图标（可选）
   * @param {string} data.description - 描述（可选）
   */
  createEquipmentCategory(data) {
    return request.post('/equipment-categories', data)
  },

  /**
   * 更新分类
   * @param {string} id - 分类ID
   * @param {Object} data - 分类数据
   */
  updateEquipmentCategory(id, data) {
    return request.put(`/equipment-categories/${id}`, data)
  },

  /**
   * 删除分类
   * @param {string} id - 分类ID
   */
  deleteEquipmentCategory(id) {
    return request.delete(`/equipment-categories/${id}`)
  }
}

// 导出单独的方法，保持向后兼容性
export const getEquipmentCategories = () => equipmentCategoryAPI.getEquipmentCategories()
export const getEquipmentCategory = (id) => equipmentCategoryAPI.getEquipmentCategory(id)
export const getSubCategories = (id) => equipmentCategoryAPI.getSubCategories(id)
export const createEquipmentCategory = (data) => equipmentCategoryAPI.createEquipmentCategory(data)
export const updateEquipmentCategory = (id, data) => equipmentCategoryAPI.updateEquipmentCategory(id, data)
export const deleteEquipmentCategory = (id) => equipmentCategoryAPI.deleteEquipmentCategory(id)

export default equipmentCategoryAPI