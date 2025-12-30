import request from '../utils/request.js'

// 菜单管理API
export const menuAPI = {
  // 获取菜单列表（分页）
  getMenuList(params = {}) {
    return request.get('/menus/list', params)
  },

  // 获取菜单详情
  getMenuDetail(id) {
    return request.get(`/menus/${id}`)
  },

  // 创建菜单
  createMenu(data) {
    return request.post('/menus', data)
  },

  // 更新菜单
  updateMenu(id, data) {
    return request.put(`/menus/${id}`, data)
  },

  // 删除菜单
  deleteMenu(id) {
    return request.delete(`/menus/${id}`)
  },

  // 批量删除菜单
  batchDeleteMenus(ids) {
    return request.delete('/menus/batch', { data: { ids } })
  },

  // 获取菜单树
  getMenuTree() {
    return request.get('/menus/tree')
  },


}

// 导出单独的方法，保持向后兼容性
export const getMenuList = (params) => menuAPI.getMenuList(params)
export const getMenuDetail = (id) => menuAPI.getMenuDetail(id)
export const createMenu = (data) => menuAPI.createMenu(data)
export const updateMenu = (id, data) => menuAPI.updateMenu(id, data)
export const deleteMenu = (id) => menuAPI.deleteMenu(id)
export const batchDeleteMenus = (ids) => menuAPI.batchDeleteMenus(ids)
export const getMenuTree = () => menuAPI.getMenuTree()

export default menuAPI