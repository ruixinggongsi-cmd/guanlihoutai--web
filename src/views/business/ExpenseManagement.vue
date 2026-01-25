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
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-coins text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  费用管理
                </h1>
                <p class="text-gray-400 text-lg">管理费用类型和支出记录，支持主类和子类层级结构</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'expense:add'"
                @click="showAddExpenseModal"
                class="px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">申请费用</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2">主分类</label>
            <select 
              v-model="filters.mainCategory" 
              @change="onMainCategoryChange"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
              <option value="" class="bg-slate-800">全部分类</option>
              <option v-for="category in mainCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2">子分类</label>
            <select 
              v-model="filters.subCategory" 
              :disabled="!filters.mainCategory"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" class="bg-slate-800">全部子类</option>
              <option v-for="category in availableSubCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2">状态</label>
            <select 
              v-model="filters.status"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
              <option value="" class="bg-slate-800">全部状态</option>
              <option value="pending" class="bg-slate-800">待审批</option>
              <option value="approving" class="bg-slate-800">审批中</option>
              <option value="approved" class="bg-slate-800">已通过</option>
              <option value="rejected" class="bg-slate-800">已拒绝</option>
              <option value="cancelled" class="bg-slate-800">已取消</option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2">开始日期</label>
            <input 
              v-model="filters.startDate"
              type="date"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2">结束日期</label>
            <input 
              v-model="filters.endDate"
              type="date"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
          </div>
        </div>
        
        <div class="flex justify-end mt-8 space-x-4">
          <button 
            v-permission="'expense:view'"
            @click="resetFilters"
            class="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group border border-gray-500/30"
          >
            <i class="fas fa-undo group-hover:rotate-180 transition-transform duration-500"></i>
            <span class="text-sm">重置</span>
          </button>
          <button 
            v-permission="'expense:view'"
            @click="applyFilters"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
          >
            <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
            <span class="text-sm">查询</span>
          </button>
        </div>
      </div>

      <!-- 费用列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">费用项目</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">金额</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">日期</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">描述</th>
                <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in paginatedExpenses" :key="expense.id" 
                  class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4">
                  <span class="text-white font-semibold text-sm bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {{ expense.name }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                    <i class="fas fa-tag mr-1 text-purple-400"></i>
                    {{ getMainCategoryName(expense.main_category_id) }}
                  </span>
                </td>
             
                <td class="px-6 py-4">
                  <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                    <i class="fas fa-folder mr-1 text-cyan-400"></i>
                    {{ getSubCategoryName(expense.sub_category_id) }}
                  </span>
                </td>
               
                <td class="px-6 py-4">
                  <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                    <i class="fas fa-yen-sign mr-1 text-emerald-400"></i>
                    {{ expense.amount.toLocaleString() }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(expense.status)" class="inline-flex items-center gap-1.5">
                    <i :class="getStatusIcon(expense.status)"></i>
                    {{ getStatusText(expense.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400">{{ formatDate(expense.date) }}</td>
                <td class="px-6 py-4 text-gray-400 max-w-xs truncate">{{ expense.description || '-' }}</td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button 
                      v-permission="'expense:view'"
                      @click="viewExpense(expense)"
                      class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                      title="查看详情"
                    >
                      <i class="fas fa-eye group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                  <!-- 编辑和删除功能已移除 -->
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedExpenses.length === 0">
                <td colspan="10" class="px-6 py-8 text-center text-gray-400">
                  <i class="fas fa-inbox text-4xl mb-4"></i>
                  <div class="text-lg font-medium mb-2">暂无费用记录</div>
                  <div class="text-sm">点击"添加费用"按钮开始记录</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/20">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCount) }} 条，共 {{ totalCount }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-chevron-left mr-2"></i>
              上一页
            </button>
            <span class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

    <!-- 查看费用详情模态框 -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[80vh] flex flex-col">
        
        <!-- 标题栏 - 固定在顶部 -->
        <div class="p-6 border-b border-white/10 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-info to-info-light rounded-xl flex items-center justify-center">
                <i class="fas fa-file-invoice text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">费用详情</h2>
                <p class="text-gray-400 text-sm">查看费用单据的完整信息</p>
              </div>
            </div>
            <button 
              @click="closeViewModal"
              class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 hover:shadow-lg"
            >
              <i class="fas fa-times text-lg group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- 内容区域 - 可滚动 -->
        <div class="p-6 overflow-y-auto flex-1">
          
          <!-- 单据详细信息 -->
          <div class="mb-8">
            
            <!-- 简洁的左右结构布局 -->
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左侧：基础信息 -->
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-file-signature mr-2 text-primary-light"></i>
                      费用名称
                    </label>
                    <div class="text-white font-medium text-lg max-w-xs text-right">
                      {{ viewingExpense?.name || '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-tag mr-2 text-purple-400"></i>
                      主分类
                    </label>
                    <div class="text-purple-300 font-medium max-w-xs text-right">
                      <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                        <i class="fas fa-tag mr-1 text-purple-400"></i>
                        {{ viewingExpense ? getMainCategoryName(viewingExpense.main_category_id) : '-' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-folder mr-2 text-cyan-400"></i>
                      子分类
                    </label>
                    <div class="text-cyan-300 font-medium max-w-xs text-right">
                      <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                        <i class="fas fa-folder mr-1 text-cyan-400"></i>
                        {{ viewingExpense ? getSubCategoryName(viewingExpense.sub_category_id) : '-' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-yen-sign mr-2 text-emerald-400"></i>
                      金额
                    </label>
                    <div class="text-emerald-300 font-bold text-xl">
                      {{ viewingExpense?.amount?.toLocaleString() || '0' }}
                    </div>
                  </div>
                </div>

                <!-- 右侧：状态和时间信息 -->
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-info-circle mr-2 text-info-light"></i>
                      状态
                    </label>
                    <div class="max-w-xs text-right">
                      <span :class="viewingExpense ? getStatusClass(viewingExpense.status) : ''" class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium">
                        <i v-if="viewingExpense" :class="getStatusIcon(viewingExpense.status)"></i>
                        {{ viewingExpense ? getStatusText(viewingExpense.status) : '-' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-calendar mr-2 text-warning-light"></i>
                      日期
                    </label>
                    <div class="text-white font-medium max-w-xs text-right">
                      {{ viewingExpense ? formatDate(viewingExpense.date) : '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-clock mr-2 text-gray-400"></i>
                      创建时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ viewingExpense?.createdAt || formatDate(viewingExpense?.date) }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-sync mr-2 text-gray-400"></i>
                      更新时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ viewingExpense?.updatedAt || formatDate(viewingExpense?.date) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 描述信息 - 简洁显示 -->
              <div class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3 flex items-center">
                  <i class="fas fa-align-left mr-2 text-primary-light"></i>
                  描述
                </label>
                <div class="text-gray-300 leading-relaxed min-h-[60px]">
                  {{ viewingExpense?.description || '暂无描述信息' }}
                </div>
              </div>

              <!-- 付款信息 -->
              <div class="mt-6 pt-6 border-t border-white/10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- 左侧：付款方式 -->
                  <div class="space-y-4">
                    <div class="flex items-start justify-between py-3 border-b border-white/10">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-credit-card mr-2 text-blue-400"></i>
                        付款方式
                      </label>
                      <div class="text-blue-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.payment_method || '-' }}
                      </div>
                    </div>
                    
                    <div class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-user mr-2 text-purple-400"></i>
                        收款人姓名
                      </label>
                      <div class="text-purple-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.payee_name || '-' }}
                      </div>
                    </div>
                  </div>

                  <!-- 右侧：账户信息 -->
                  <div class="space-y-4">
                    <div class="flex items-start justify-between py-3 border-b border-white/10">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-university mr-2 text-green-400"></i>
                        账户名称
                      </label>
                      <div class="text-green-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.account_name || '-' }}
                      </div>
                    </div>
                    
                    <div class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-hashtag mr-2 text-orange-400"></i>
                        账号
                      </label>
                      <div class="text-orange-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.account_type || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 附件信息 -->
              <div v-if="viewingExpense?.attachments && viewingExpense.attachments.length > 0" class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3 flex items-center">
                  <i class="fas fa-paperclip mr-2 text-primary-light"></i>
                  附件
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(attachment, index) in viewingExpense.attachments" :key="index" 
                       class="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center space-x-3 hover:bg-white/10 transition-all duration-200">
                    <div class="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-file text-white text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-white text-sm font-medium truncate">{{ attachment.name }}</div>
                      <div class="text-gray-400 text-xs">{{ formatFileSize(attachment.size) }}</div>
                    </div>
                    <a :href="attachment.url" target="_blank" 
                       class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center text-white hover:from-success-light hover:to-success transition-all duration-200">
                      <i class="fas fa-download text-sm"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 审批记录 -->
          <div class="mb-8">
            <div class="flex items-center mb-6">
              <div class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-route text-white text-sm"></i>
              </div>
              <h3 class="text-xl font-semibold text-white">审批记录</h3>
            </div>
            
            <div class="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
              <div v-if="mockApprovalNodes.length > 0" class="space-y-1">
                <div v-for="(node, index) in mockApprovalNodes" :key="index" 
                     class="flex items-start justify-between py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 px-3">
                  <div class="flex items-start space-x-4 flex-1">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" :class="getApprovalNodeStatusClass(node.status)">
                      <i :class="getApprovalNodeIcon(node.status)" class="text-white text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-3 mb-1">
                        <div class="text-white font-medium text-sm">{{ node.nodeName || node.node_name || '审批节点' }}</div>
                        <div class="font-medium text-xs px-2 py-0.5 rounded" :class="getApprovalNodeTextColor(node.status)">
                          <span v-if="node.status === 'pending'">待审批</span>
                          <span v-else-if="node.status === 'approving'">审批中</span>
                          <span v-else-if="node.status === 'approved'">已通过</span>
                          <span v-else-if="node.status === 'rejected'">已拒绝</span>
                          <span v-else-if="node.status === 'auto_approved'">自动审批</span>
                          <span v-else-if="node.is_current_node">审批中……</span>
                          <span v-else>待审批</span>
                        </div>
                      </div>
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-2">
                        <div class="flex items-center space-x-1">
                          <i class="fas fa-user text-gray-500"></i>
                          <span class="font-medium text-gray-300">审批人：</span>
                          <span class="text-white font-semibold">
                            {{ 
                              node.user_info?.name || 
                              node.user_info?.username || 
                              node.userName || 
                              node.user_name || 
                              node.approver_name || 
                              (node.user_id ? `用户ID: ${node.user_id}` : '未指定') 
                            }}
                          </span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <i class="fas fa-clock text-gray-500"></i>
                          <span class="font-medium text-gray-300">审批时间：</span>
                          <span class="text-white">{{ formatDateTime(node.createdAt || node.create_time || node.createTime || node.approvedAt || node.approved_at || node.approval_start_time || node.approval_end_time || node.updatedAt || node.update_time || node.updateTime) }}</span>
                        </div>
                      </div>
                      <div v-if="node.comment" class="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                        <div class="flex items-start space-x-2">
                          <i class="fas fa-comment text-gray-400 text-xs mt-0.5"></i>
                          <div class="text-gray-300 text-xs leading-relaxed flex-1">{{ node.comment }}</div>
                        </div>
                      </div>
                      <!-- 审批节点附件显示 -->
                      <div v-if="getAttachments(node).length > 0" class="mt-2">
                        <div class="flex flex-wrap gap-2">
                          <div v-for="(attachment, attIndex) in getAttachments(node)" :key="attIndex" 
                               class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 border border-white/20 transition-all duration-200 cursor-pointer"
                               @click="downloadAttachment(attachment)">
                            <i class="fas fa-paperclip text-gray-300 text-xs"></i>
                            <span class="text-gray-200 text-xs truncate max-w-32">{{ attachment.name }}</span>
                            <span class="text-gray-400 text-xs">({{ formatFileSize(attachment.size) }})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-400 text-center py-6">
                <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10">
                  <i class="fas fa-clipboard-list text-xl"></i>
                </div>
                <p class="text-sm">暂无审批记录</p>
                <p class="text-xs text-gray-500 mt-2">如果应该有审批记录，请检查后端API是否正确返回数据</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 - 固定在底部 -->
        <div class="px-6 py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeViewModal"
              class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group text-sm font-medium"
            >
              <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
              <span>关闭</span>
            </button>
            <!-- 取消申请功能 - 仅在特定状态下显示 -->
            <button 
              v-if="viewingExpense && ['pending', 'approving'].includes(viewingExpense.status)"
              @click="cancelExpenseApplication"
              :disabled="isCancelling"
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="isCancelling" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-ban group-hover:rotate-12 transition-transform duration-300"></i>
              <span>{{ isCancelling ? '取消中...' : '取消申请' }}</span>
            </button>
            <!-- 编辑功能已移除 -->
            <!--
            <button 
              v-if="viewingExpense?.status === 'pending'"
              @click="editExpense(viewingExpense)"
              class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 text-sm group"
            >
              <i class="fas fa-edit group-hover:rotate-12 transition-transform duration-300"></i>
              <span>编辑</span>
            </button>
            -->
          </div>
        </div>
      </div>
    </div>

    <!-- 添加费用模态框 -->
    <div v-if="showExpenseModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[80vh] flex flex-col">
        <!-- 标题区域 -->
        <div class="p-6 border-b border-white/20">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-white">
              添加费用
            </h3>
            <button 
              @click="closeExpenseModal"
              class="text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 transform group"
            >
              <i class="fas fa-times text-xl group-hover:scale-110 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="saveExpense" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">费用名称 <span class="text-danger">*</span></label>
              <input 
                v-model="expenseForm.name"
                type="text" 
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入费用名称"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-3">主分类 <span class="text-danger">*</span></label>
              <div class="grid grid-cols-4 gap-2 mb-4">
                <div 
                  v-for="category in mainCategories" 
                  :key="category.id"
                  @click="selectMainCategory(category.id)"
                  :class="[
                    'backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-2 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20',
                    expenseForm.mainCategoryId === category.id 
                      ? 'bg-green-500/20 border-green-400/50 ring-1 ring-green-400/30 scale-105' 
                      : 'hover:bg-white/10'
                  ]"
                >
                  <div class="flex flex-col items-center text-center space-y-1">
                    <div :class="[
                      'w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300',
                      expenseForm.mainCategoryId === category.id 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-primary to-primary-light'
                    ]">
                      <i :class="category.icon" class="text-white text-xs"></i>
                    </div>
                    <span class="text-white text-xs font-medium">{{ category.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="expenseForm.mainCategoryId">
              <label class="block text-sm font-medium text-gray-400 mb-3">子分类 <span class="text-danger">*</span></label>
              <div class="grid grid-cols-6 gap-2">
                <div 
                  v-for="category in availableExpenseSubCategories" 
                  :key="category.id"
                  @click="selectSubCategory(category.id)"
                  :class="[
                    'backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-2 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20',
                    expenseForm.subCategoryId === category.id 
                      ? 'bg-green-500/20 border-green-400/50 ring-1 ring-green-400/30 scale-105' 
                      : 'hover:bg-white/10'
                  ]"
                >
                  <div class="flex flex-col items-center text-center space-y-1">
                    <div :class="[
                      'w-5 h-5 rounded-sm flex items-center justify-center transition-all duration-300',
                      expenseForm.subCategoryId === category.id 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-success to-success-light'
                    ]">
                      <i :class="category.icon" class="text-white text-xs"></i>
                    </div>
                    <span class="text-white text-xs font-medium leading-tight">{{ category.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-400">
              <i class="fas fa-hand-pointer text-base mb-1"></i>
              <p class="text-xs">请先选择主分类</p>
            </div>
             <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">金额 <span class="text-danger">*</span></label>
              <input 
                v-model.number="expenseForm.amount"
                type="number" 
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入金额"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">日期 <span class="text-danger">*</span></label>
              <input 
                v-model="expenseForm.date"
                type="date"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">付款方式 <span class="text-danger">*</span></label>
              <select name="paymentMethod" v-model="expenseForm.paymentMethod" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300">
                <option value="支付宝">支付宝</option>
                <option value="微信">微信</option>
                <option value="银行卡">银行卡</option>
                <option value="USDT">USDT</option>
                <option value="其他">其他</option>
              </select>
            </div>
            </div>
             <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">收款人名称 <span class="text-danger">*</span></label>
              <input 
                v-model="expenseForm.payeeName"
                type="text" 
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入收款人名称"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">账户名称 <span class="text-danger">*</span></label>
              <input 
                v-model="expenseForm.accountName"
                type="text"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">收款人账号 <span class="text-danger">*</span></label>
              <input 
                v-model="expenseForm.accountType"
                type="text"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
             
            </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">描述</label>
              <textarea 
                v-model="expenseForm.description"
                rows="3"
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                placeholder="请输入描述（可选）"
              ></textarea>
            </div>

            <!-- 附件上传 -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">附件</label>
              <div class="space-y-3">
               

                <!-- 已选文件列表 -->
                <div v-if="selectedFiles.length > 0 || uploadedAttachments.length > 0" class="space-y-2">
                  <div v-for="(file, index) in selectedFiles" :key="'selected-' + index" class="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                    <div class="flex items-center space-x-3">
                      <i class="fas fa-file text-primary-light"></i>
                      <div>
                        <p class="text-white text-sm font-medium">{{ file.name }}</p>
                        <p class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      @click="removeFile(index)"
                      class="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div v-for="(file, index) in uploadedAttachments" :key="'uploaded-' + index" class="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                    <div class="flex items-center space-x-3">
                      <i class="fas fa-file text-primary-light"></i>
                      <div>
                        <p class="text-white text-sm font-medium">{{ file.name }}</p>
                        <p class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      @click="removeUploadedFile(index)"
                      class="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                 <!-- 上传进度 -->
                <div v-if="isUploading" class="w-full bg-white/10 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                  <p class="text-gray-400 text-xs mt-1 text-center">{{ uploadProgress }}% 已上传</p>
                </div>
                <!-- 文件上传区域 -->
                <div class="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-white/30 transition-all duration-300">
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    class="hidden"
                  >
                  <div @click="fileInput?.click()" class="cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                    <p class="text-gray-400 text-sm">点击上传附件或拖拽文件到此处</p>
                    <p class="text-gray-500 text-xs mt-1">支持图片、PDF、Word、Excel文件</p>
                  </div>
                </div>

                
              </div>
            </div>
          </form>
        </div>

        <!-- 底部按钮区域 -->
        <div class="px-6 py-4 border-t border-white/20 flex justify-end space-x-3">
          <button 
            type="button"
            @click="closeExpenseModal"
            class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group"
          >
            <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
            <span>取消</span>
          </button>
          <button 
            type="submit"
            @click="saveExpense"
            :disabled="isSaving || isUploading"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center space-x-2 group"
          >
            <i v-if="isSaving || isUploading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save group-hover:scale-110 transition-transform duration-300"></i>
            <span>{{ isSaving || isUploading ? (isUploading ? '上传中...' : '保存中...') : '保存费用' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template><script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { expenseApplicationsAPI } from '../../api/expenseApplications'
import { expenseCategoryAPI } from '../../api/expenseCategory'
import { useUserStore } from '../../stores/user'// 用户存储
import { ElMessage } from 'element-plus'
const userStore = useUserStore()

// 响应式数据
const expenses = ref([])
const mainCategories = ref([])
const subCategories = ref([])
const showExpenseModal = ref(false)
const editingExpense = ref(null)
const isSaving = ref(false)
const showViewModal = ref(false)
const viewingExpense = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const loading = ref(false)
const selectedMainCategory = ref(null)
const selectedSubCategory = ref(null)
const isCancelling = ref(false)

// 文件上传相关数据
const selectedFiles = ref([])
const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadedAttachments = ref([]) // 附件数组
const fileInput = ref(null) // 文件输入框引用

    // 模拟审批节点数据
    const mockApprovalNodes = ref([
     
    ])

    // 筛选条件
const filters = ref({
  mainCategory: '',
  subCategory: '',
  startDate: '',
  endDate: '',
  status: ''
})

// 费用表单
const expenseForm = ref({
  name: '',
  mainCategoryId: '',
  subCategoryId: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  paymentMethod: '',
  payeeName: '',
  accountName: '',
  accountType: ''
})

// 计算属性
const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
})

// 获取子分类（计算属性）- 使用expense_categories.js接口的子分类获取功能
const availableSubCategories = computed(() => {
  if (!filters.value.mainCategory) return []
  return subCategories.value.filter(sub => sub.parentId === filters.value.mainCategory)
})

// 获取费用子分类（计算属性）
const availableExpenseSubCategories = computed(() => {
  if (!expenseForm.value.mainCategoryId) return []
  return subCategories.value.filter(sub => sub.parentId === expenseForm.value.mainCategoryId)
})

// 动态加载子分类（可选优化）
const loadSubCategories = async (parentId) => {
  try {
    const response = await expenseCategoryAPI.getSubCategories(parentId)
    if (response.success) {
      const newSubCategories = response.data.map(subCategory => ({
        id: subCategory.id,
        name: subCategory.category_name,
        parentId: subCategory.parent_id,
        icon: subCategory.icon || 'fas fa-folder-open'
      }))
      
      // 更新子分类列表，避免重复
      const existingSubCategoryIds = new Set(subCategories.value.map(cat => cat.id))
      const uniqueNewSubCategories = newSubCategories.filter(cat => !existingSubCategoryIds.has(cat.id))
      
      if (uniqueNewSubCategories.length > 0) {
        subCategories.value.push(...uniqueNewSubCategories)
        console.log(`动态加载了 ${uniqueNewSubCategories.length} 个子分类`)
      }
    }
  } catch (error) {
    console.error('加载子分类失败:', error)
  }
}



const filteredExpenses = computed(() => {
  let result = expenses.value

  if (filters.value.mainCategory) {
    result = result.filter(expense => expense.mainCategoryId === filters.value.mainCategory)
  }

  if (filters.value.subCategory) {
    result = result.filter(expense => expense.subCategoryId === filters.value.subCategory)
  }

  if (filters.value.status) {
    result = result.filter(expense => expense.status === filters.value.status)
  }

  if (filters.value.startDate) {
    result = result.filter(expense => expense.date >= filters.value.startDate)
  }

  if (filters.value.endDate) {
    result = result.filter(expense => expense.date <= filters.value.endDate)
  }

  result = result.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return result
})

// 分页计算属性
const paginatedExpenses = computed(() => {
  return expenses.value
})

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / pageSize.value)
})

// 监听筛选条件变化，重置页码并重新加载数据
watch([() => filters.value.status, () => filters.value.startDate, () => filters.value.endDate, () => filters.value.mainCategory, () => filters.value.subCategory], () => {
  currentPage.value = 1
  loadExpenseApplications()
})

// 监听分页变化，重新加载数据
watch(currentPage, () => {
  loadExpenseApplications()
})

// 方法
// 加载费用申请列表
const loadExpenseApplications = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: filters.value.status || undefined,
      start_date: filters.value.startDate || undefined,
      end_date: filters.value.endDate || undefined,
      applicant_id: filters.value.applicant_id || undefined
    }
    
    const response = await expenseApplicationsAPI.getExpenseApplicationsList(params)
    if (response.success) {
      expenses.value = (response.data || []).map(item => ({
        ...item,
        attachments: JSON.parse(item.attachments || '[]')
      }))
      totalCount.value = response.pagination?.total || 0
    } else {
      console.error('获取费用申请列表失败:', response.message)
      expenses.value = []
      totalCount.value = 0
    }
  } catch (error) {
    console.error('获取费用申请列表错误:', error)
    expenses.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 加载费用分类数据 - 使用expense_categories.js接口优化处理
const loadExpenseCategories = async () => {
  try {
    const response = await expenseCategoryAPI.getExpenseCategories()
    if (response.success) {
      // 直接使用后端返回的树形结构数据，提高数据处理效率
      const categories = response.data || []
      const mainCats = []
      const subCats = []
      
      // 递归处理树形结构，提取主分类和子分类
      const processCategories = (categoryList, parentId = null) => {
        categoryList.forEach(category => {
          if (!category.parent_id) {
            // 主分类
            mainCats.push({
              id: category.id,
              name: category.category_name,
              icon: category.icon || 'fas fa-folder',
              children: category.children || []
            })
          } else {
            // 子分类
            subCats.push({
              id: category.id,
              name: category.category_name,
              parentId: category.parent_id,
              icon: category.icon || 'fas fa-folder-open'
            })
          }
          
          // 递归处理子分类
          if (category.children && category.children.length > 0) {
            processCategories(category.children, category.id)
          }
        })
      }
      
      processCategories(categories)
      
      mainCategories.value = mainCats
      subCategories.value = subCats
      
      console.log('费用分类数据加载成功:', {
        主分类数量: mainCats.length,
        子分类数量: subCats.length
      })
    } else {
      console.error('获取费用分类失败:', response.message)
      // 失败时提供默认分类数据
      provideDefaultCategories()
    }
  } catch (error) {
    console.error('获取费用分类错误:', error)
    // 异常时提供默认分类数据
    provideDefaultCategories()
  }
}

// 提供默认分类数据（当接口失败时）
const provideDefaultCategories = () => {
  mainCategories.value = [
  ]
  
  subCategories.value = [
  
  ]
}

const loadData = () => {
  loadExpenseCategories()
  loadExpenseApplications()
}

const getMainCategoryName = (id) => {
  // 使用expense_categories.js接口的数据格式
  const category = mainCategories.value.find(cat => cat.id === id)
  return category ? category.name : '-'
}

const getSubCategoryName = (id) => {
  // 使用expense_categories.js接口的数据格式
  const category = subCategories.value.find(cat => cat.id === id)
  return category ? category.name : '-'
}

// 获取主分类ID（根据分类数据转换为中文名称）
const getMainCategoryId = (id) => {
  // 使用expense_categories.js接口的数据格式
  console.log('getMainCategoryId - 输入ID:', id, '主分类数据:', mainCategories.value)
  const category = mainCategories.value.find(cat => cat.id === id)
  console.log('getMainCategoryId - 找到的分类:', category)
  return category ? category.name : String(id)
}

// 获取子分类ID（根据分类数据转换为中文名称）
const getSubCategoryId = (id) => {
  // 使用expense_categories.js接口的数据格式
  console.log('getSubCategoryId - 输入ID:', id, '子分类数据:', subCategories.value)
  const category = subCategories.value.find(cat => cat.id === id)
  console.log('getSubCategoryId - 找到的分类:', category)
  return category ? category.name : String(id)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return dateStr
  }
}

// 获取审批节点附件 - 参考ExpenseApproval.vue的实现
const getAttachments = (node) => {
 
  // 处理JSON字符串或数组格式的附件数据
  if (typeof node.attachments === 'string') {
    try {
      let js=JSON.parse(node.attachments)
      console.log('解析后的附件数据:', js)
      return js
    } catch (error) {
      console.warn('解析附件数据失败:', error)
      return []
    }
  }
  
  return Array.isArray(node.attachments) ? node.attachments : []
}

// 下载附件函数
const downloadAttachment = (attachment) => {
  if (!attachment.url) {
    ElMessage.warning('附件链接无效')
    return
  }
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.name || 'attachment'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 文件处理相关函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  
  if (files.length === 0) return
  
  // 验证文件类型
  const allowedTypes = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
  const validFiles = files.filter(file => {
    const fileType = file.type.toLowerCase()
    const fileExtension = file.name.toLowerCase().split('.').pop()
    
    return allowedTypes.some(type => {
      if (type.startsWith('image/')) {
        return fileType.startsWith('image/')
      } else {
        return file.name.toLowerCase().endsWith(type)
      }
    })
  })
  
  if (validFiles.length !== files.length) {
    ElMessage.warning('部分文件类型不支持，已过滤')
  }
  
  if (validFiles.length > 0) {
    selectedFiles.value.push(...validFiles)
    uploadFiles()
  }
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    // 模拟上传进度
    uploadProgress.value = 20
    
    // 这里需要导入request工具
    const { default: request } = await import('../../utils/request')
    
    // 逐个上传文件
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      
      uploadProgress.value = 30 + (i * 60 / selectedFiles.value.length)
      
      const response = await request.upload('/upload/attachments', file)
      
      if (response.success) {
        const uploadedFile = {
          name: response.data.originalName,
          url: response.data.url,
          size: response.data.size,
          type: response.data.mimeType
        }
        
        uploadedAttachments.value.push(uploadedFile)
        ElMessage.success(`文件 ${file.name} 上传成功`)
      } else {
        ElMessage.error(`文件 ${file.name} 上传失败`)
      }
    }
    
    uploadProgress.value = 100
    selectedFiles.value = []
   
    
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
    // 重置文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const removeUploadedFile = (index) => {
  uploadedAttachments.value.splice(index, 1)
}

// 状态相关方法
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待审批',
    'approving': '审批中',
    'approved': '已通过',
    'rejected': '已拒绝',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 获取审批节点状态文本颜色
const getApprovalNodeTextColor = (status) => {
  const colorMap = {
    pending: 'text-yellow-300',
    approving: 'text-blue-300',
    approved: 'text-green-300',
    rejected: 'text-red-300',
    auto_approved: 'text-purple-300'
  }
  return colorMap[status] || 'text-gray-300'
}

// 获取审批节点状态样式
const getApprovalNodeStatusClass = (status) => {
  const statusMap = {
    pending: 'bg-gradient-to-r from-yellow-400/80 to-orange-400/80',
    approving: 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80',
    approved: 'bg-gradient-to-r from-emerald-500/80 to-green-500/80',
    rejected: 'bg-gradient-to-r from-red-500/80 to-rose-500/80',
    auto_approved: 'bg-gradient-to-r from-purple-500/80 to-indigo-500/80'
  }
  return statusMap[status] || 'bg-gradient-to-r from-gray-500/80 to-gray-600/80'
}

// 获取审批节点图标
const getApprovalNodeIcon = (status) => {
  const iconMap = {
    pending: 'fas fa-clock',
    approving: 'fas fa-spinner',
    approved: 'fas fa-check',
    rejected: 'fas fa-times',
    auto_approved: 'fas fa-robot'
  }
  return iconMap[status] || 'fas fa-question'
}

const getStatusIcon = (status) => {
  const iconMap = {
    'pending': 'fas fa-clock',
    'approving': 'fas fa-spinner',
    'approved': 'fas fa-check-circle',
    'rejected': 'fas fa-times-circle',
    'cancelled': 'fas fa-ban'
  }
  return iconMap[status] || 'fas fa-question-circle'
}

const getStatusClass = (status) => {
  const classMap = {
    'pending': 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-200 border border-yellow-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
    'approving': 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-200 border border-blue-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
    'approved': 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-200 border border-green-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
    'rejected': 'bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-200 border border-red-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
    'cancelled': 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm'
  }
  return classMap[status] || 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm'
}

const onMainCategoryChange = () => {
  filters.value.subCategory = ''
  // 可选：当主分类改变时动态加载子分类
  if (filters.value.mainCategory) {
    // loadSubCategories(filters.value.mainCategory) // 如需动态加载可取消注释
  }
}

const onExpenseMainCategoryChange = () => {
  expenseForm.value.subCategoryId = ''
  // 可选：当费用主分类改变时动态加载子分类
  if (expenseForm.value.mainCategoryId) {
    // loadSubCategories(expenseForm.value.mainCategoryId) // 如需动态加载可取消注释
  }
}

const selectMainCategory = (categoryId) => {
  expenseForm.value.mainCategoryId = categoryId
  expenseForm.value.subCategoryId = ''
  // 自动选择第一个子分类
  const firstSubCategory = availableExpenseSubCategories.value[0]
  if (firstSubCategory) {
    expenseForm.value.subCategoryId = firstSubCategory.id
  }
}

const selectSubCategory = (categoryId) => {
  expenseForm.value.subCategoryId = categoryId
}

const showAddExpenseModal = () => {
  editingExpense.value = null
  expenseForm.value = {
    name: '',
    mainCategoryId: '',
    subCategoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'pending'
  }
  // 重置分类选择
  selectedMainCategory.value = null
  selectedSubCategory.value = null
  showExpenseModal.value = true
}

const viewExpense = async (expense) => {
  try {
    loading.value = true
    // 直接使用列表中的现有数据作为基础信息
    viewingExpense.value = expense
    showViewModal.value = true
    
    // 仅获取审批节点信息（点击查看时获取）
    try {
      console.log('开始获取审批节点信息，费用ID:', expense.id)
      const nodesResponse = await expenseApplicationsAPI.getExpenseApplicationApprovalNodes(expense.id)
      console.log('审批节点API响应:', nodesResponse)
      
      if (nodesResponse.success) {
        mockApprovalNodes.value = nodesResponse.data || []
        console.log('审批节点数据:', mockApprovalNodes.value)
        console.log('审批节点数量:', mockApprovalNodes.value.length)
        
        // 打印每个节点的详细信息
        if (mockApprovalNodes.value.length > 0) {
          mockApprovalNodes.value.forEach((node, index) => {
            console.log(`审批节点 ${index + 1}:`, {
              nodeName: node.nodeName || node.node_name,
              status: node.status,
              user_id: node.user_id,
              user_info: node.user_info,
              user_info_name: node.user_info?.name,
              user_info_username: node.user_info?.username,
              userName: node.userName || node.user_name,
              createdAt: node.createdAt || node.create_time,
              comment: node.comment,
              fullNode: node // 打印完整节点数据以便调试
            })
          })
        } else {
          console.warn('审批节点数据为空')
        }
      } else {
        console.warn('获取审批节点信息失败:', nodesResponse.message)
        mockApprovalNodes.value = []
      }
    } catch (nodesError) {
      console.error('获取审批节点信息错误:', nodesError)
      console.error('错误详情:', nodesError.response?.data || nodesError.message)
      mockApprovalNodes.value = []
    }
  } catch (error) {
    console.error('查看费用详情错误:', error)
  } finally {
    loading.value = false
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingExpense.value = null
}

// 取消费用申请
const cancelExpenseApplication = async () => {
  if (!viewingExpense.value) return
  
  if (!confirm(`确定要取消费用申请 "${viewingExpense.value.name}" 吗？`)) {
    return
  }
  
  isCancelling.value = true
  
  try {
    const response = await expenseApplicationsAPI.cancelExpenseApplication(viewingExpense.value.id)
    
    if (response.success) {
      ElMessage.success({
        message: '费用申请已取消',
        duration: 1000
      })
      closeViewModal()
      // 刷新列表数据
      await loadExpenseApplications()
    } else {
      ElMessage.error({
        message: '取消申请失败：' + response.message,
        duration: 1000
      })
    }
  } catch (error) {
    console.error('取消费用申请错误:', error)
    ElMessage.error({
      message: '取消申请失败，请稍后重试',
      duration: 1000
    })
  } finally {
    isCancelling.value = false
  }
}

// 移除编辑功能
// const editExpense = (expense) => {
//   editingExpense.value = expense
//   expenseForm.value = {
//     name: expense.name,
//     mainCategoryId: expense.mainCategoryId,
//     subCategoryId: expense.subCategoryId,
//     amount: expense.amount,
//     date: expense.date,
//     description: expense.description,
//     status: expense.status
//   }
//   showExpenseModal.value = true
// }

// 移除删除功能
// const deleteExpense = (expense) => {
//   if (confirm(`确定要删除费用 "${expense.name}" 吗？`)) {
//     const index = expenses.value.findIndex(item => item.id === expense.id)
//     if (index > -1) {
//       expenses.value.splice(index, 1)
//     }
//   }
// }

const saveExpense = async () => {
  if (!expenseForm.value.name.trim() || !expenseForm.value.mainCategoryId || !expenseForm.value.subCategoryId || !expenseForm.value.amount) {
    ElMessage.error({
      message: '请填写完整信息',
      duration: 1000
    })
    return
  }

  // 检查是否正在上传文件
  if (isUploading.value) {
    ElMessage.warning({
      message: '请等待文件上传完成',
      duration: 1000
    })
    return
  }

  isSaving.value = true
  
  try {
    const expenseData = {
      name: expenseForm.value.name,
      main_category_id: expenseForm.value.mainCategoryId,
      sub_category_id: expenseForm.value.subCategoryId,
      amount: parseFloat(expenseForm.value.amount),
      date: expenseForm.value.date,
      description: expenseForm.value.description || '',
      applicant_id: userStore.userInfo?.id,
      applicant_name: userStore.userInfo?.name,
      applicant_department_id: userStore.userInfo?.department_id,
      attachments: uploadedAttachments.value,
      payment_method: expenseForm.value.paymentMethod || '',
      payee_name: expenseForm.value.payeeName || '',
      account_name: expenseForm.value.accountName || '',
      account_type: expenseForm.value.accountType || ''
    }

    const response = await expenseApplicationsAPI.createExpenseApplication(expenseData)
    
    if (response.success) {
      // 创建成功后刷新列表
      await loadExpenseApplications()
      closeExpenseModal()
      ElMessage.success({
        message: '费用申请创建成功！',
        duration: 1000
      })
    } else {
      ElMessage.error({
        message: '创建费用申请失败：' + response.message,
        duration: 1000
      })
    }
  } catch (error) {
    console.error('创建费用申请错误:', error)
    ElMessage.error({
      message: '创建费用申请失败，请稍后重试',
      duration: 1000
    })
  } finally {
    isSaving.value = false
  }
}

const closeExpenseModal = () => {
  showExpenseModal.value = false
  editingExpense.value = null
  expenseForm.value = {
    name: '',
    mainCategoryId: '',
    subCategoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: '',
    payeeName: '',
    accountName: '',
    accountType: ''
  }
  // 重置分类选择
  selectedMainCategory.value = null
  selectedSubCategory.value = null
  // 重置文件上传相关数据
  selectedFiles.value = []
  uploadedAttachments.value = []
  uploadProgress.value = 0
  isUploading.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}



const resetFilters = () => {
  filters.value = {
    mainCategory: '',
    subCategory: '',
    startDate: '',
    endDate: '',
    status: ''
  }
  currentPage.value = 1
  loadExpenseApplications()
}

const applyFilters = () => {
  currentPage.value = 1
  loadExpenseApplications()
}

// 生命周期
onMounted(() => {
  loadData()
  // 监听用户存储变化，确保用户信息可用
  watch(() => userStore.userInfo, (newVal) => {
    if (newVal) {
      loadExpenseApplications()
    }
  }, { immediate: true })
})
</script>

<style scoped>
/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* 表格样式 */
table th,
table td {
  border-color: rgba(255, 255, 255, 0.1);
}

table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Element Plus select下拉框样式 - 修复背景问题 */
:deep(.el-select-dropdown) {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

:deep(.el-select-dropdown__item) {
  color: #e2e8f0 !important;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(99, 102, 241, 0.2) !important;
  color: #ffffff !important;
}

:deep(.el-select-dropdown__item.selected) {
  background: rgba(99, 102, 241, 0.3) !important;
  color: #ffffff !important;
  font-weight: 500;
}

:deep(.el-select-dropdown__item.hover) {
  background: rgba(99, 102, 241, 0.15) !important;
}

/* Element Plus select输入框样式 */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: none !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(99, 102, 241, 0.5) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: rgba(99, 102, 241, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}

:deep(.el-input__inner) {
  color: #ffffff !important;
  caret-color: #ffffff !important;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Element Plus select箭头图标 */
:deep(.el-select__caret) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.el-select__caret:hover) {
  color: #ffffff !important;
}

/* 原生select下拉框样式修复 */
select {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

select option {
  background-color: rgba(15, 23, 42, 0.95) !important;
  color: #ffffff !important;
  padding: 8px 12px;
}

select option:hover {
  background-color: rgba(99, 102, 241, 0.3) !important;
}

/* 针对Webkit浏览器的select样式 */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Firefox的select样式 */
select::-moz-focus-inner {
  border: 0;
}

/* IE和Edge的select样式 */
select::-ms-expand {
  display: none;
}

select:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}
</style>