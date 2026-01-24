<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full filter blur-2xl animate-pulse"></div>
    </div>
    
    <!-- 导航栏组件 -->
    <NavigationBar />

    <!-- 主内容区 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  客户管理
                </h1>
                <p class="text-gray-400 text-lg">管理和维护客户信息，跟踪客户状态和交易记录</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'customer:add'"
                @click="showAddModal = true"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">新增客户</span>
              </button>
            </div>
          </div>
        </div>
      </div>

     

      <!-- 搜索和筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <div class="relative">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索客户名称、手机号或邮箱..."
                class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <select 
              v-model="statusFilter"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">所有状态</option>
              <option value="active" class="bg-slate-800">数据</option>
              <option value="inactive" class="bg-slate-800">意向客户</option>
              <option value="vip" class="bg-slate-800">进群客户</option>
            </select>
            <input
              v-model="startDate"
              type="date"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
            <button 
              v-permission="'customer:view'"
              @click="searchCustomers"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-search mr-2"></i>
              搜索
            </button>
            <button 
              v-permission="'customer:view'"
              @click="resetFilter"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-redo mr-2"></i>
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 客户列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">客户</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">联系方式</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">注册时间</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                      {{ customer.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">{{ customer.name }}</div>
                      <div class="text-sm text-gray-400">{{ customer.company || '个人客户' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ customer.phone }}</div>
                  <div class="text-sm text-gray-400">{{ customer.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(customer.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(customer.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ formatDate(customer.createdAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      v-permission="'customer:view'"
                      @click="viewCustomer(customer)"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      查看
                    </button>
                    <button 
                      v-permission="'customer:edit'"
                      @click="editCustomer(customer)"
                      class="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <i class="fas fa-edit mr-1"></i>
                      编辑
                    </button>
                    <button 
                      v-permission="'customer:assign'"
                      @click="assignServiceStaff(customer)"
                      class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      <i class="fas fa-user-tie mr-1"></i>
                      分配客服
                    </button>
                    <button 
                      v-permission="'customer:delete'"
                      @click="deleteCustomer(customer)"
                      class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <i class="fas fa-trash mr-1"></i>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/20">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCustomers) }} 条，共 {{ totalCustomers }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-chevron-left mr-2"></i>
              上一页
            </button>
            <span class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl">
              {{ currentPage }} / {{ Math.ceil(totalCustomers / pageSize) }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage * pageSize >= totalCustomers"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑客户模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative w-full max-w-2xl mx-4 bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-white/20">
          <h3 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {{ showEditModal ? '编辑客户' : '新增客户' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="saveCustomer" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">客户名称 *</label>
              <input 
                v-model="currentCustomer.name" 
                type="text" 
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">公司名称</label>
              <input 
                v-model="currentCustomer.company" 
                type="text" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">手机号 *</label>
              <input 
                v-model="currentCustomer.phone" 
                type="tel" 
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
              <input 
                v-model="currentCustomer.email" 
                type="email" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">状态 *</label>
              <select 
                v-model="currentCustomer.status" 
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="active" class="bg-slate-800">数据</option>
                <option value="inactive" class="bg-slate-800">意向客户</option>
                <option value="vip" class="bg-slate-800">进群客户</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">客户来源</label>
              <select 
                v-model="currentCustomer.source" 
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="" class="bg-slate-800">请选择</option>
                <option value="online" class="bg-slate-800">线上推广</option>
                <option value="offline" class="bg-slate-800">线下活动</option>
                <option value="referral" class="bg-slate-800">客户推荐</option>
                <option value="direct" class="bg-slate-800">直接访问</option>
                <option value="other" class="bg-slate-800">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">备注</label>
              <textarea 
                v-model="currentCustomer.notes" 
                rows="3"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-4 pt-6 border-t border-white/20">
            <button 
              type="button" 
              @click="closeModal"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-times mr-2"></i>
              取消
            </button>
            <button 
              type="submit"
              class="px-8 py-3 bg-gradient-to-r from-success to-success-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-success-light hover:to-success transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50"
            >
              <i class="fas fa-save mr-2"></i>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 查看客户详情模态框 -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative w-full max-w-4xl mx-4 bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl max-h-[90vh]">
        <div class="flex justify-between items-center p-4 border-b border-white/20">
          <h3 class="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            客户详情
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- 客户资料 -->
          <div class="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mr-3">
                {{ currentCustomer.name.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">{{ currentCustomer.name }}</h2>
                <p class="text-gray-400 text-sm">{{ currentCustomer.company || '个人客户' }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between py-1 border-b border-white/10">
                  <span class="text-sm text-gray-400">联系电话:</span> 
                  <span class="text-white text-sm">{{ currentCustomer.phone }}</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-white/10">
                  <span class="text-sm text-gray-400">邮箱地址:</span> 
                  <span class="text-white text-sm">{{ currentCustomer.email || '未填写' }}</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-white/10">
                  <span class="text-sm text-gray-400">客户状态:</span> 
                  <span :class="getStatusClass(currentCustomer.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(currentCustomer.status) }}
                  </span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-1 border-b border-white/10">
                  <span class="text-sm text-gray-400">注册时间:</span> 
                  <span class="text-white text-sm">{{ formatDate(currentCustomer.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-white/10" v-if="currentCustomer.address">
                  <span class="text-sm text-gray-400">地址信息:</span> 
                  <span class="text-white text-sm text-right">{{ currentCustomer.address }}</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-white/10">
                  <span class="text-sm text-gray-400">客户来源:</span> 
                  <span class="text-white text-sm">{{ getSourceText(currentCustomer.source) }}</span>
                </div>
              </div>
            </div>
            
            <div class="mt-4" v-if="currentCustomer.notes">
              <h3 class="font-semibold text-gray-300 mb-2 text-base border-b border-white/10 pb-1">备注信息</h3>
              <div class="text-white text-sm leading-relaxed bg-white/5 rounded-lg p-3">{{ currentCustomer.notes }}</div>
            </div>
          </div>

          <!-- 联系记录 -->
          <div class="bg-white/5 rounded-xl p-4 border border-white/10">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center space-x-3">
                <h3 class="text-base font-semibold text-gray-300">联系记录</h3>
                <span class="px-2 py-1 bg-primary/20 text-primary-light text-xs rounded-full font-medium">
                  {{ contactRecords.length }} 条记录
                </span>
              </div>
              <button 
                @click="showAddContactModal = true"
                class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <i class="fas fa-plus"></i>
                <span>添加记录</span>
              </button>
            </div>
            
            <!-- 加载状态 -->
            <div v-if="contactRecordsLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <div class="text-gray-400">正在加载联系记录...</div>
            </div>
            
            <!-- 空状态 -->
            <div v-else-if="!contactRecords.length" class="text-center text-gray-400 py-8">
              <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-comments text-2xl opacity-50"></i>
              </div>
              <p class="text-sm font-medium">暂无联系记录</p>
              <p class="text-xs text-gray-500 mt-1">点击上方"添加记录"按钮添加第一条联系记录</p>
            </div>
            
            <!-- 联系记录列表 -->
            <div v-else class="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
              <div v-for="record in contactRecords.slice(0, 5)" :key="record.id" 
                   class="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <!-- 头部信息区域 -->
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {{ record.staffName ? record.staffName.charAt(0) : '?' }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-white">{{ record.staffName || '未记录员工' }}</div>
                      <div class="text-xs text-gray-400">{{ record.date }} {{ record.time }}</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    <i class="fas fa-clock mr-1"></i>
                    {{ record.time }}
                  </div>
                </div>
                
                <!-- 内容区域 -->
                <div class="bg-white/5 rounded-lg p-3 border-l-4 border-primary">
                  <div class="text-white text-sm leading-relaxed">{{ record.content }}</div>
                </div>
              </div>
              
              <div class="text-center text-xs text-gray-400 mt-4 pt-3 border-t border-white/10">
                <i class="fas fa-info-circle mr-1"></i>
                <span v-if="contactRecords.length > 5">显示最新5条，共{{ contactRecords.length }}条记录</span>
                <span v-else>显示全部{{ contactRecords.length }}条记录</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end p-6 border-t border-white/20">
          <button
            @click="closeModal"
            class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <i class="fas fa-times mr-2"></i>
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 导入模态框 -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative w-full max-w-md mx-4 bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-white/20">
          <h3 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            导入客户
          </h3>
          <button @click="closeAddContactModal" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-3">选择文件</label>
            <div class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
              <input 
                type="file" 
                accept=".csv,.xlsx"
                @change="handleFileUpload"
                class="hidden"
                id="file-upload"
              >
              <label for="file-upload" class="cursor-pointer">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-400 mb-2">点击上传文件或拖拽文件到此处</p>
                <p class="text-sm text-gray-500">支持 CSV、Excel 格式</p>
              </label>
            </div>
            <div v-if="importFile" class="mt-3 p-3 bg-white/5 rounded-lg">
              <p class="text-sm text-gray-300">
                <i class="fas fa-file-excel mr-2"></i>
                {{ importFile.name }}
              </p>
            </div>
          </div>
          <div class="bg-white/5 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">文件格式要求：</h4>
            <ul class="text-sm text-gray-400 space-y-1">
              <li>• 客户名称（必填）</li>
              <li>• 手机号（必填）</li>
              <li>• 邮箱（选填）</li>
              <li>• 状态（选填：活跃/未活跃/VIP）</li>
            </ul>
          </div>
          <div class="flex justify-end space-x-4">
            <button 
              @click="closeModal"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-times mr-2"></i>
              取消
            </button>
            <button 
              @click="importCustomers"
              :disabled="!importFile"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-upload mr-2"></i>
              导入
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加联系记录模态框 -->
    <div v-if="showAddContactModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative w-full max-w-md mx-4 bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-white/20">
          <h3 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            添加联系记录
          </h3>
          <button @click="closeAddContactModal" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="addContactRecord" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">联系员工</label>
            <input 
              v-model="newContactRecord.staffName"
              type="text"
              placeholder="请输入员工姓名..."
              class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
              :readonly="!newContactRecord.staffName"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">沟通日期</label>
            <input 
              v-model="newContactRecord.date"
              type="date"
              class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">沟通时间</label>
            <input 
              v-model="newContactRecord.time"
              type="time"
              class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">沟通内容</label>
            <textarea 
              v-model="newContactRecord.content"
              rows="4"
              placeholder="请输入沟通内容..."
              class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              required
            ></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="closeAddContactModal"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-times mr-2"></i>
              取消
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-save mr-2"></i>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 用户选择模态框 -->
    <UserSelectorModal
      :visible="showUserSelectorModal"
      @update:visible="showUserSelectorModal = $event"
      @select="handleUserSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { customerAPI } from '../../api/customers.js'
import { contactRecordAPI } from '../../api/contactRecords.js'
import { ElMessage } from 'element-plus'
import UserSelectorModal from '../../components/UserSelectorModal.vue'

// 响应式数据
const customers = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const startDate = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showAddContactModal = ref(false)
const showUserSelectorModal = ref(false)

const currentCustomer = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  status: 'active',
  source: 'online',
  address: '',
  notes: '',
  createdAt: new Date()
})

// 当前要分配客服的客户
const customerToAssign = ref(null)

// 联系记录数据
const contactRecords = ref([])
const newContactRecord = ref({
  content: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  staffName: ''
})
const contactRecordsLoading = ref(false)

// 响应式数据 - 总记录数
const totalCustomers = ref(0)

// 计算属性
const activeCustomers = computed(() => 
  customers.value.filter(customer => customer.status === 'active').length
)

const vipCustomers = computed(() => 
  customers.value.filter(customer => customer.status === 'vip').length
)

const newCustomersThisMonth = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return customers.value.filter(customer => {
    const createdAt = new Date(customer.createdAt)
    return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear
  }).length
})

// 直接使用API返回的数据，不需要再次筛选和分页（筛选和分页已在后端完成）
const filteredCustomers = computed(() => {
  return customers.value
})

// 方法
const loadData = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      startDate: startDate.value
    }
    
    const response = await customerAPI.getCustomerList(params)
    
    if (response.success) {
      customers.value = response.data.map(customer => ({
        ...customer,
        createdAt: customer.created_at
      }))
      // 从API返回的分页信息中获取总数
      if (response.pagination && response.pagination.total !== undefined) {
        totalCustomers.value = response.pagination.total
      } else {
        totalCustomers.value = customers.value.length
      }
    } else {
      ElMessage.error({message: response.message || '获取客户列表失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '加载客户数据失败', duration: 1000})
  }
}

const searchCustomers = () => {
  currentPage.value = 1
  loadData()
}

const resetFilter = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  startDate.value = ''
  currentPage.value = 1
  loadData()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadData()
  }
}

const nextPage = () => {
  const totalPages = Math.ceil(totalCustomers.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadData()
  }
}

const viewCustomer = (customer) => {
  currentCustomer.value = { ...customer }
  loadContactRecords(customer.id)
  showViewModal.value = true
}

const editCustomer = (customer) => {
  currentCustomer.value = { ...customer }
  showEditModal.value = true
}

const deleteCustomer = async (customer) => {
  if (confirm(`确定要删除客户 "${customer.name}" 吗？此操作不可恢复。`)) {
    try {
      const response = await customerAPI.deleteCustomer(customer.id)
      
      if (response.success) {
        ElMessage.success({message: '客户删除成功', duration: 1000})
        loadData() // 重新加载数据
      } else {
        ElMessage.error({message: response.message || '删除客户失败', duration: 1000})
      }
    } catch (error) {
    ElMessage.error({message: '删除客户失败', duration: 1000})
  }
  }
}

const saveCustomer = async () => {
  if (!currentCustomer.value.name.trim()) {
    ElMessage.error({message: '客户名称不能为空', duration: 1000})
    return
  }
  
  try {
    let response
    
    if (showEditModal.value) {
      // 编辑模式
      response = await customerAPI.updateCustomer(currentCustomer.value.id, currentCustomer.value)
    } else {
      // 新增模式
      response = await customerAPI.createCustomer(currentCustomer.value)
    }
    
    if (response.success) {
      ElMessage.success({message: showEditModal.value ? '客户更新成功' : '客户创建成功', duration: 1000})
      closeModal()
      loadData() // 重新加载数据
    } else {
      ElMessage.error({message: response.message || '保存客户失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '保存客户失败', duration: 1000})
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  showAddContactModal.value = false
  showUserSelectorModal.value = false
  currentCustomer.value = {
    name: '',
    company: '',
    phone: '',
    email: '',
    status: 'active',
    source: 'online',
    address: '',
    notes: '',
    createdAt: new Date()
  }
  customerToAssign.value = null
}

// 仅关闭添加联系记录模态框
const closeAddContactModal = () => {
  showAddContactModal.value = false
}

// 加载联系记录
const loadContactRecords = async (customerId) => {
  try {
    contactRecordsLoading.value = true
    const response = await contactRecordAPI.getContactRecordsByCustomer(customerId)
    
    if (response.success) {
      contactRecords.value = response.data.map(record => ({
        id: record.id,
        customerId: record.customer_id,
        content: record.content,
        date: record.contact_time.split('T')[0],
        time: record.contact_time.split('T')[1]?.slice(0, 5) || '',
        staffName: record.staff_name
      }))
    } else {
      ElMessage.error({message: response.message || '获取联系记录失败', duration: 1000})
      contactRecords.value = []
    }
  } catch (error) {
    ElMessage.error({message: '加载联系记录失败', duration: 1000})
    contactRecords.value = []
  } finally {
    contactRecordsLoading.value = false
  }
}

// 添加联系记录
const addContactRecord = async () => {
  if (!newContactRecord.value.content.trim()) {
    ElMessage.error({message: '沟通内容不能为空', duration: 1000})
    return
  }
  
  if (!newContactRecord.value.staffName.trim()) {
    ElMessage.error({message: '员工姓名不能为空', duration: 1000})
    return
  }
  
  try {
    const contactTime = `${newContactRecord.value.date}T${newContactRecord.value.time}:00`
    
    const response = await contactRecordAPI.createContactRecord({
      customerId: currentCustomer.value.id,
      content: newContactRecord.value.content.trim(),
      staffName: newContactRecord.value.staffName.trim(),
      contactTime: contactTime
    })
    
    if (response.success) {
      // 重新加载联系记录列表
      await loadContactRecords(currentCustomer.value.id)
      
      // 重置表单
      newContactRecord.value = {
        content: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5)
      }
      
      showAddContactModal.value = false
      ElMessage.success({message: '联系记录添加成功', duration: 1000})
    } else {
      ElMessage.error({message: response.message || '添加联系记录失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '添加联系记录失败', duration: 1000})
  } finally {
    // 可以在这里添加清理逻辑
  }
}




const getStatusClass = (status) => {
  const classes = {
    active: 'bg-blue-500/20 text-blue-400',
    inactive: 'bg-yellow-500/20 text-yellow-400',
    vip: 'bg-green-500/20 text-green-400',
    // 兼容旧数据的状态值
    data: 'bg-blue-500/20 text-blue-400',
    group: 'bg-green-500/20 text-green-400',
    '意向客户': 'bg-yellow-500/20 text-yellow-400',
    '进群客户': 'bg-green-500/20 text-green-400',
    '数据': 'bg-blue-500/20 text-blue-400'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    active: '数据',
    inactive: '意向客户',
    vip: '进群客户',
    // 兼容旧数据的状态值
    data: '数据',
    group: '进群客户',
    '意向客户': '意向客户',
    '进群客户': '进群客户',
    '数据': '数据'
  }
  return texts[status] || status
}

const getSourceText = (source) => {
  const texts = {
    online: '线上',
    offline: '线下',
    referral: '推荐',
    other: '其他'
  }
  return texts[source] || source
}

// 分配客服
const assignServiceStaff = (customer) => {
  customerToAssign.value = customer
  showUserSelectorModal.value = true
}

// 处理用户选择
const handleUserSelect = async (selectedUser) => {
  if (!customerToAssign.value || !selectedUser) {
    ElMessage.error({message: '参数错误', duration: 1000})
    return
  }
  
  try {
    const response = await customerAPI.changeCustomerCreator(customerToAssign.value.id, selectedUser.id)
    
    if (response.success) {
      ElMessage.success({message: '分配客服成功', duration: 1000})
      // 更新本地客户数据
      const index = customers.value.findIndex(c => c.id === customerToAssign.value.id)
      if (index !== -1) {
        customers.value[index].created_by = selectedUser.id
      }
      closeModal()
    } else {
      ElMessage.error({message: response.message || '分配客服失败', duration: 1000})
    }
  } catch (error) {
    ElMessage.error({message: '分配客服失败', duration: 1000})
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期钩子
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>