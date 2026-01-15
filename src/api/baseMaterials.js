import request from '../utils/request.js'

// 底料数据管理API
export const baseMaterialAPI = {
  // 获取底料列表（分页）
  getBaseMaterialList(params = {}) {
    return request.get('/base-materials/list', params)
  },

  // 获取单个底料详情
  getBaseMaterial(id) {
    return request.get(`/base-materials/details/${id}`)
  },

  // 检查底料是否重复
  checkDuplicate(data) {
    return request.post('/base-materials/check-duplicate', data)
  },

  // 创建底料
  createBaseMaterial(data) {
    return request.post('/base-materials', data)
  },

  // 更新底料
  updateBaseMaterial(id, data) {
    return request.put(`/base-materials/${id}`, data)
  },

  // 删除底料
  deleteBaseMaterial(id) {
    return request.delete(`/base-materials/${id}`)
  },

  // 批量删除底料
  batchDeleteBaseMaterials(ids) {
    return request.delete('/base-materials/batch', { ids })
  },
}

// 导出单独的方法，保持向后兼容性
export const getBaseMaterialList = (params) => baseMaterialAPI.getBaseMaterialList(params)
export const getBaseMaterial = (id) => baseMaterialAPI.getBaseMaterial(id)
export const checkDuplicate = (data) => baseMaterialAPI.checkDuplicate(data)
export const createBaseMaterial = (data) => baseMaterialAPI.createBaseMaterial(data)
export const updateBaseMaterial = (id, data) => baseMaterialAPI.updateBaseMaterial(id, data)
export const deleteBaseMaterial = (id) => baseMaterialAPI.deleteBaseMaterial(id)
export const batchDeleteBaseMaterials = (ids) => baseMaterialAPI.batchDeleteBaseMaterials(ids)

export default baseMaterialAPI

