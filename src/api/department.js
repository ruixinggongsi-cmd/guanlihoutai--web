import request from '../utils/request.js'
// 部门管理API - 根据后端RESTful标准调整
export const departmentAPI = {
  // 获取部门树结构
  getDepartmentTree() {
    return request.get('/departments/tree')
  },

  // 获取部门列表（分页）
  getDepartmentList(params = {}) {
     return request.get('/departments/list', params)
  },

  // 获取单个部门详情
  getDepartmentDetail(id) {
    return request.get(`/departments/${id}`)
  },

  // 创建部门 - 调整为RESTful标准路径
  createDepartment(data) {
    return request.post('/departments/', {
      department_name: data.name,
      department_code: data.code,
      parent_id: data.parentId,
      remarks: data.description
    })
  },

  // 更新部门 - 调整为RESTful标准路径
  updateDepartment(id, data) {
    return request.put(`/departments/${id}`, {
      department_name: data.name,
      department_code: data.code,
      parent_id: data.parentId,
      remarks: data.description
    })
  },

  // 删除部门 - 调整为RESTful标准路径
  deleteDepartment(id) {
    return request.delete(`/departments/${id}`)
  },

  // 获取部门统计信息
  getDepartmentStats() {
    return request.get('/departments/stats/overview')
  },

  // 获取部门下拉列表（用于选择）
  getDepartmentOptions() {
    return request.get('/departments/options')
  }
}

// 导出单独的方法，保持向后兼容性
export const getDepartmentTree = () => departmentAPI.getDepartmentTree()
export const getDepartmentList = (params) => departmentAPI.getDepartmentList(params)
export const getDepartmentDetail = (id) => departmentAPI.getDepartmentDetail(id)
export const createDepartment = (data) => departmentAPI.createDepartment(data)
export const updateDepartment = (id, data) => departmentAPI.updateDepartment(id, data)
export const deleteDepartment = (id) => departmentAPI.deleteDepartment(id)
export const getDepartmentStats = () => departmentAPI.getDepartmentStats()
export const getDepartmentOptions = () => departmentAPI.getDepartmentOptions()

export default departmentAPI