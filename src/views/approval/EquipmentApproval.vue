<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full filter blur-2xl animate-pulse"></div>
    </div>
    
    <NavigationBar />
    
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-cogs text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  设备申请审批
                </h1>
                <p class="text-gray-400 text-lg">管理和审批设备申请流程</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <!-- 预留操作按钮区域 -->
            </div>
          </div>
        </div>
      </div>





      <!-- 搜索和筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">申请项目</label>
            <input 
              v-model="searchForm.name" 
              type="text" 
              class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="输入申请项目名称"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">主分类</label>
            <select 
              v-model="searchForm.mainCategoryId" 
              @change="selectMainCategory(searchForm.mainCategoryId)"
              class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option :value="null" class="bg-slate-800">全部分类</option>
              <option v-for="category in mainCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">子分类</label>
            <select 
              v-model="searchForm.subCategoryId" 
              @change="selectSubCategory(searchForm.subCategoryId)"
              class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option :value="null" class="bg-slate-800">全部子分类</option>
              <option v-for="category in availableSubCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
            <select 
              v-model="searchForm.status" 
              class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">全部状态</option>
              <option value="pending" class="bg-slate-800">待审批</option>
              <option value="approved" class="bg-slate-800">已通过</option>
              <option value="rejected" class="bg-slate-800">已拒绝</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">申请日期</label>
            <input 
              v-model="searchForm.dateRange" 
              type="date" 
              class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
          </div>
        </div>
        
        <div class="flex justify-end mt-4 space-x-3">
          <button 
            v-permission="'equipment:view'"
            @click="resetSearch" 
            class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            重置
          </button>
          <button 
            v-permission="'equipment:view'"
            @click="searchApplications" 
            class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            搜索
          </button>
        </div>
      </div>

      <!-- 申请列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-white/20">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white">设备申请列表</h3>
            <!-- 选项卡 -->
            <div class="flex bg-white/5 rounded-lg p-1">
              <button 
                @click="activeTab = 'pending'" 
                :class="activeTab === 'pending' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'"
                class="px-4 py-2 rounded-md font-medium transition-all duration-300"
              >
                <i class="fas fa-clock mr-2"></i>
                待我审批
                <span class="ml-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">{{ pendingCount }}</span>
              </button>
              <button 
                @click="activeTab = 'processed'" 
                :class="activeTab === 'processed' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'"
                class="px-4 py-2 rounded-md font-medium transition-all duration-300"
              >
                <i class="fas fa-history mr-2"></i>
                我审批的
                <span class="ml-2 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">{{ processedCount }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请项目</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请日期</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请人</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">描述</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="application in filteredApplications" :key="application.id" 
                    class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                  <td class="px-6 py-4">
                    <span class="text-white font-semibold text-sm bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      {{ application.equipmentName || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                      <i class="fas fa-tag mr-1 text-purple-400"></i>
                      {{ getMainCategoryName(application.mainCategoryId) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                      <i class="fas fa-folder mr-1 text-cyan-400"></i>
                      {{ getSubCategoryName(application.subCategoryId) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                      <i class="fas fa-calculator mr-1 text-emerald-400"></i>
                      {{ application.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(application.status)" class="inline-flex items-center gap-1.5">
                      <i :class="getStatusIcon(application.status)"></i>
                      {{ getStatusText(application.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-400">{{ formatDate(application.createdAt) }}</td>
                  <td class="px-6 py-4 text-gray-300">
                    {{ application.applicant?.name || '-' }}
                   
                  </td>
                  <td class="px-6 py-4 text-gray-400 max-w-32 truncate" :title="application.applicationReason">{{ application.applicationReason || '-' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      <button 
                        v-permission="'equipment:view'"
                        @click="viewApplication(application)"
                        class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                        title="查看详情"
                      >
                        <i class="fas fa-eye group-hover:scale-110 transition-transform duration-300"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredApplications.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <div class="text-lg font-medium mb-2">暂无设备申请</div>
                    <div class="text-sm">{{ activeTab === 'pending' ? '暂无待审批的申请' : '暂无已审批的申请' }}</div>
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
                @click="prevPage" 
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
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
              >
                下一页
                <i class="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
      </div>
    </div>

    <!-- 申请详情模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[80vh] flex flex-col">
        
        <!-- 标题栏 - 固定在顶部 -->
        <div class="p-6 border-b border-white/10 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-info to-info-light rounded-xl flex items-center justify-center">
                <i class="fas fa-file-invoice text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">申请详情</h2>
                <p class="text-gray-400 text-sm">查看设备申请的完整信息</p>
              </div>
            </div>
            <button 
              @click="closeModal"
              class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 hover:shadow-lg"
            >
              <i class="fas fa-times text-lg group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- 内容区域 - 可滚动 -->
        <div class="p-6 overflow-y-auto flex-1">
          
          <!-- 申请详细信息 -->
          <div class="mb-8">
            
            <!-- 简洁的左右结构布局 -->
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左侧：基础信息 -->
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-file-signature mr-2 text-primary-light"></i>
                      申请项目
                    </label>
                    <div class="text-white font-medium text-lg max-w-xs text-right">
                    {{ selectedApplication?.equipmentName || selectedApplication?.name || '-' }}
                  </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-tag mr-2 text-purple-400"></i>
                      分类
                    </label>
                    <div class="text-purple-300 font-medium max-w-xs text-right">
                      {{ selectedApplication ? getCategoryName(selectedApplication.mainCategoryId, selectedApplication.subCategoryId) : '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-calculator mr-2 text-emerald-400"></i>
                      申请数量
                    </label>
                    <div class="text-emerald-300 font-bold text-xl">
                      {{ selectedApplication?.quantity || '0' }}
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
                      <span :class="selectedApplication ? getStatusClass(selectedApplication.status) : ''" class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium">
                        <i v-if="selectedApplication" :class="getStatusIcon(selectedApplication.status)"></i>
                        {{ selectedApplication ? getStatusText(selectedApplication.status) : '-' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-calendar mr-2 text-warning-light"></i>
                      申请日期
                    </label>
                    <div class="text-white font-medium max-w-xs text-right">
                    {{ selectedApplication ? formatDate(selectedApplication.createdAt || selectedApplication.applicationDate) : '-' }}
                  </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-clock mr-2 text-gray-400"></i>
                      创建时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                    {{ selectedApplication?.createdAt || formatDate(selectedApplication?.applicationDate) }}
                  </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-sync mr-2 text-gray-400"></i>
                      更新时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ selectedApplication?.updatedAt || formatDate(selectedApplication?.applicationDate) }}
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
                  {{ selectedApplication?.applicationReason || selectedApplication?.description || '暂无描述信息' }}
                </div>
              </div>

              <!-- 附件信息 -->
              <div class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3 flex items-center">
                  <i class="fas fa-paperclip mr-2 text-primary-light"></i>
                  附件
                </label>
                <div class="space-y-2">
                  <div v-if="selectedApplication?.attachments && selectedApplication.attachments.length > 0" class="space-y-2">
                    <div v-for="(file, index) in getAttachments(selectedApplication)" :key="index" class="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <div class="flex items-center space-x-3">
                        <i class="fas fa-file text-primary-light"></i>
                        <div>
                          <p class="text-white text-sm font-medium">{{ file.name }}</p>
                          <p class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button
                        @click="downloadAttachment(file)"
                        class="text-primary-light hover:text-primary transition-colors duration-200"
                        title="下载附件"
                      >
                        <i class="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                  <div v-else class="text-gray-400 text-sm">
                    暂无附件
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 审批记录 -->
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-route text-white text-sm"></i>
              </div>
              <h3 class="text-xl font-semibold text-white">审批记录</h3>
            </div>
            
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div v-if="mockApprovalNodes.length > 0" class="space-y-1">
                <div v-for="(node, index) in mockApprovalNodes" :key="index" 
                     class="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 px-2">
                  <div class="flex items-center space-x-4">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getApprovalNodeStatusClass(node.status)">
                      <i :class="getApprovalNodeIcon(node.status)" class="text-white text-xs"></i>
                    </div>
                    <div>
                      <div class="text-white font-medium text-sm">{{ node.nodeName || node.node_name }}-{{node.user_info?.name || ''}}</div>
                      <div v-if="node.userName || node.roleName" class="text-gray-400 text-xs">{{ node.userName || node.user_name }} - {{ node.roleName || node.role_name }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-sm" :class="getApprovalNodeTextColor(node.status)" v-if="!node.is_current_node">
                      <span v-if="node.status === '2_pending'">待审批</span>
                      <span v-else-if="node.status === 'approving'">审批中</span>
                      <span v-else-if="node.status === 'approved'">已通过</span>
                      <span v-else-if="node.status === 'rejected'">已拒绝</span>
                      <span v-else-if="node.status === 'auto_approved'">自动审批</span>
                      <span v-else>待审批</span>
                    </div>
                     <div class="font-medium text-sm" :class="getApprovalNodeTextColor(node.status)" v-else>
                      <span>审批中……</span>
                    </div>
                  
                    <div v-if="node.comment" class="text-gray-300 text-xs mt-1 italic max-w-xs">{{ node.comment }}</div>
                    <!-- 显示附件 -->
                    <div v-if="getAttachments(node).length > 0" class="mt-2">
                      <div class="flex flex-wrap gap-2 justify-end">
                        <div v-for="(attachment, index) in getAttachments(node)" :key="index" 
                             class="flex items-center space-x-1 bg-white/10 rounded-lg px-2 py-1 border border-white/20 hover:bg-white/20 transition-all duration-200">
                          <i class="fas fa-paperclip text-xs text-gray-300"></i>
                          <a :href="attachment.url" 
                             :download="attachment.name" 
                             target="_blank"
                             class="text-xs text-blue-300 hover:text-blue-200 underline truncate max-w-32"
                             :title="attachment.name">
                            {{ attachment.name }}
                          </a>
                          <span class="text-xs text-gray-400">({{ formatFileSize(attachment.size) }})</span>
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
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 - 固定在底部 -->
        <div class="px-6 py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <div class="flex justify-end space-x-3">
            <template v-if="activeTab === 'pending'">
            <button 
             
              @click="rejectApplication(selectedApplication)" 
              class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500/30 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium"
            >
              <i class="fas fa-times"></i>
              <span>审批拒绝</span>
            </button>
            <button 
              
              @click="approveApplication(selectedApplication)" 
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border border-green-500/30 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium"
            >
              <i class="fas fa-check"></i>
              <span>审批通过</span>
            </button>
            </template>
            <button 
              @click="closeModal"
              class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group text-sm font-medium"
            >
              <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
              <span>关闭</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 审批理由输入弹窗 -->
    <div v-if="showApprovalCommentModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 animate-fade-in p-4">
      <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="pendingApprovalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-red-600 to-red-700'">
                <i :class="pendingApprovalAction === 'approve' ? 'fas fa-check' : 'fas fa-times'" class="text-white text-lg"></i>
              </div>
              <h3 class="text-xl font-bold text-white">
                {{ pendingApprovalAction === 'approve' ? '审批通过' : '审批拒绝' }}
              </h3>
            </div>
            <button 
              @click="closeApprovalCommentModal"
              class="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30"
            >
              <i class="fas fa-times text-sm group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>

          <div class="mb-6">
            <p class="text-gray-300 text-sm mb-4">
              请填写审批理由（必填）：
            </p>
            <textarea 
              v-model="approvalComment"
              rows="4"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
              placeholder="请输入审批理由..."
              maxlength="500"
            ></textarea>
            <div class="text-right text-xs text-gray-400 mt-2">
              {{ approvalComment.length }}/500
            </div>
          </div>

          <!-- 附件上传区域 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-2">附件</label>
            <div class="space-y-3">
              <!-- 文件上传区域 - 只在没有任何文件时显示 -->
              <div 
                v-if="uploadedAttachments.length === 0 && !isUploading"
                @click="$refs.fileInput.click()"
                @drop.prevent="handleFileDrop"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                :class="[
                  'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer',
                  isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  class="hidden"
                >
                <div class="text-gray-400">
                  <i class="fas fa-cloud-upload-alt text-3xl mb-3"></i>
                  <p class="text-sm mb-1">点击或拖拽文件到此处上传</p>
                  <p class="text-xs text-gray-500">支持图片、PDF、Word、Excel文件</p>
                </div>
              </div>

              <!-- 已上传文件列表 - 只显示已上传的文件 -->
              <div v-if="uploadedAttachments.length > 0" class="space-y-2">
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
                    :disabled="isUploading"
                    class="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </div>

          <div class="flex justify-end items-center">
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="closeApprovalCommentModal"
                class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group"
              >
                <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
                <span>取消</span>
              </button>
              <button 
                type="submit"
                @click="executeApproval"
                :disabled="loading || isUploading"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center space-x-2 group"
              >
                <i v-if="loading || isUploading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane group-hover:scale-110 transition-transform duration-300"></i>
                <span>{{ loading || isUploading ? (isUploading ? '上传中...' : '处理中...') : '确认' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '../../components/NavigationBar.vue'
import { equipmentApplicationsAPI } from '../../api/equipmentApplications'
import { equipmentCategoryAPI } from '../../api/equipmentCategory'
import request from '@/utils/request'

import { ElMessage } from 'element-plus'

export default {
  name: 'EquipmentApproval',
  components: {
    NavigationBar
  },
  data() {
    return {
      activeTab: 'pending', // 'pending' 或 'processed'
      searchForm: {
        name: '',
        mainCategoryId: null,
        subCategoryId: null,
        status: '',
        dateRange: ''
      },
      pendingApplications: [],
      processedApplications: [],
      applications: [],
      filteredApplications: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      showModal: false,
      selectedApplication: null,
      currentUser: 'admin', // 当前登录用户
      mainCategories: [],
      subCategories: [],
      mockApprovalNodes: [],
      // 审批相关状态
      showApprovalCommentModal: false,
      pendingApprovalExpense: null,
      pendingApprovalAction: '',
      approvalComment: '',
      loading: false,
      // 附件上传相关数据
      selectedFiles: [],
      uploadedAttachments: [],
      uploadProgress: 0,
      isUploading: false,
      isDragging: false, // 是否正在拖拽
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
      fileInput: null, // 文件输入框引用
    }
  },
  computed: {
    pendingCount() {
      return this.pendingApplications.length
    },
    approvedCount() {
      return this.pendingApplications.filter(app => app.status === 'approved').length
    },
    rejectedCount() {
      return this.pendingApplications.filter(app => app.status === 'rejected').length
    },
    monthlyCount() {
      const currentMonth = new Date().getMonth()
      const allApplications = [...this.pendingApplications, ...this.processedApplications]
      return allApplications.filter(app => {
        const appMonth = new Date(app.applicationDate).getMonth()
        return appMonth === currentMonth
      }).length
    },
    processedCount() {
      return this.processedApplications.length
    },
    availableSubCategories() {
      if (!this.searchForm.mainCategoryId) {
        return []
      }
      return this.subCategories.filter(sub => sub.parentId === this.searchForm.mainCategoryId)
    }
  },
  async mounted() {
    await this.loadData()
    await this.loadAllApplications()
  },
  watch: {
    activeTab() {
      this.currentPage = 1
      this.searchForm = {
        name: '',
        mainCategoryId: null,
        subCategoryId: null,
        status: '',
        dateRange: ''
      }
      // 切换标签页时，显示对应的数据
      if (this.activeTab === 'pending') {
        this.applications = this.pendingApplications
        this.filteredApplications = this.pendingApplications
        this.totalCount = this.pendingApplications.length
      } else {
        this.applications = this.processedApplications
        this.filteredApplications = this.processedApplications
        this.totalCount = this.processedApplications.length
      }
      this.totalPages = Math.ceil(this.totalCount / this.pageSize)
      
      // 如果对应标签页的数据为空，则重新加载
      if ((this.activeTab === 'pending' && this.pendingApplications.length === 0) ||
          (this.activeTab === 'processed' && this.processedApplications.length === 0)) {
        this.loadApplications()
      }
    }
  },
  methods: {
    // 同时加载两个标签页的数据（初始化时使用）
    async loadAllApplications() {
      try {
        this.loading = true
        
        // 构建查询参数（默认第一页）
        const params = {
          page: 1,
          pageSize: this.pageSize
        }
        
        // 并行加载待审批和我审批的数据
        const [pendingResponse, processedResponse] = await Promise.all([
          equipmentApplicationsAPI.getPendingApprovals(params),
          equipmentApplicationsAPI.getMyApprovals(params)
        ])
        
        // 处理待审批数据
        if (pendingResponse && pendingResponse.data) {
          const pendingRawData = Array.isArray(pendingResponse.data) ? pendingResponse.data : pendingResponse.data.data || pendingResponse.data.items || []
          this.pendingApplications = pendingRawData
          // pendingCount 是计算属性，会自动根据 pendingApplications.length 更新
        }
        
        // 处理我审批的数据
        if (processedResponse && processedResponse.data) {
          const processedRawData = Array.isArray(processedResponse.data) ? processedResponse.data : processedResponse.data.data || processedResponse.data.items || []
          this.processedApplications = processedRawData
          // processedCount 是计算属性，会自动根据 processedApplications.length 更新
        }
        
        // 根据当前激活的标签页设置显示的数据
        if (this.activeTab === 'pending') {
          this.applications = this.pendingApplications
          this.filteredApplications = this.pendingApplications
          this.totalCount = this.pendingApplications.length
        } else {
          this.applications = this.processedApplications
          this.filteredApplications = this.processedApplications
          this.totalCount = this.processedApplications.length
        }
        
        this.totalPages = Math.ceil(this.totalCount / this.pageSize)
        
        console.log('初始化加载完成:', {
          待审批数量: this.pendingApplications.length,
          已审批数量: this.processedApplications.length,
          当前标签: this.activeTab
        })
        
      } catch (error) {
        console.error('初始化加载设备申请列表失败:', error)
        ElMessage.error({message: '加载设备申请列表失败，请稍后重试', duration: 1000})
        
        // 出错时清空数据
        this.pendingApplications = []
        this.processedApplications = []
        this.applications = []
        this.filteredApplications = []
        this.totalCount = 0
        this.totalPages = 0
        // pendingCount 和 processedCount 是计算属性，会自动更新为 0
      } finally {
        this.loading = false
      }
    },

    async loadApplications() {
      try {
        this.loading = true
        let response
        
        // 构建查询参数
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.searchForm.name,
          mainCategoryId: this.searchForm.mainCategoryId,
          subCategoryId: this.searchForm.subCategoryId,
          status: this.searchForm.status,
          dateRange: this.searchForm.dateRange
        }
        
        if (this.activeTab === 'pending') {
          response = await equipmentApplicationsAPI.getPendingApprovals(params)
        } else {
          response = await equipmentApplicationsAPI.getMyApprovals(params)
        }
        
        if (response && response.data) {
          // 处理分页数据格式 - 支持直接数组或分页对象格式
          const rawData = Array.isArray(response.data) ? response.data : response.data.data || response.data.items || []
          
          // 后端接口已返回统一的驼峰命名字段，直接使用原始数据
          const data = rawData
          
          // 根据当前标签页分别存储数据
          if (this.activeTab === 'pending') {
            this.pendingApplications = data
            this.applications = data
            this.filteredApplications = data
          } else {
            this.processedApplications = data
            this.applications = data
            this.filteredApplications = data
          }
          
          // 处理分页信息
          if (response.data.pagination) {
            this.totalCount = response.data.pagination.total || data.length
            this.totalPages = response.data.pagination.totalPages || Math.ceil(this.totalCount / this.pageSize)
          } else if (response.data.total !== undefined) {
            this.totalCount = response.data.total
            this.totalPages = Math.ceil(this.totalCount / this.pageSize)
          } else {
            this.totalCount = data.length
            this.totalPages = Math.ceil(this.totalCount / this.pageSize)
          }
        }
      } catch (error) {
        console.error('加载设备申请列表失败:', error)
        ElMessage.error({message: '加载设备申请列表失败，请稍后重试', duration: 1000})
        // 根据当前标签页清空对应的数据
        if (this.activeTab === 'pending') {
          this.pendingApplications = []
        } else {
          this.processedApplications = []
        }
        this.applications = []
        this.filteredApplications = []
        this.totalCount = 0
        this.totalPages = 0
      } finally {
        this.loading = false
      }
    },
    async searchApplications() {
      try {
        this.loading = true
        
        // 构建查询参数
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.searchForm.name,
          mainCategoryId: this.searchForm.mainCategoryId,
          subCategoryId: this.searchForm.subCategoryId,
          status: this.searchForm.status,
          dateRange: this.searchForm.dateRange
        }
        
        let response
        if (this.activeTab === 'pending') {
          response = await equipmentApplicationsAPI.getPendingApprovals(params)
        } else {
          response = await equipmentApplicationsAPI.getMyApprovals(params)
        }
        
        if (response && response.data) {
          // 处理分页数据格式 - 支持直接数组或分页对象格式
          const rawData = Array.isArray(response.data) ? response.data : response.data.data || response.data.items || []
          
          // 直接使用后端返回的数据，后端已统一字段格式
          const data = rawData
          
          // 根据当前标签页分别存储数据
          if (this.activeTab === 'pending') {
            this.pendingApplications = data
            this.applications = data
            this.filteredApplications = data
          } else {
            this.processedApplications = data
            this.applications = data
            this.filteredApplications = data
          }
          
          // 处理分页信息
          if (response.data.pagination) {
            this.totalCount = response.data.pagination.total || data.length
            this.totalPages = response.data.pagination.totalPages || Math.ceil(this.totalCount / this.pageSize)
          } else if (response.data.total !== undefined) {
            this.totalCount = response.data.total
            this.totalPages = Math.ceil(this.totalCount / this.pageSize)
          } else {
            this.totalCount = data.length
            this.totalPages = Math.ceil(this.totalCount / this.pageSize)
          }
        }
      } catch (error) {
        console.error('搜索设备申请失败:', error)
        ElMessage.error({message: '搜索失败，请稍后重试', duration: 1000})
        // 根据当前标签页清空对应的数据
        if (this.activeTab === 'pending') {
          this.pendingApplications = []
        } else {
          this.processedApplications = []
        }
        this.applications = []
        this.filteredApplications = []
        this.totalCount = 0
        this.totalPages = 0
      } finally {
        this.loading = false
      }
    },
    onMainCategoryChange() {
      this.searchForm.subCategoryId = ''
    },
    async resetSearch() {
      this.searchForm = {
        name: '',
        mainCategoryId: null,
        subCategoryId: null,
        status: '',
        dateRange: ''
      }
      // 重置搜索时清空对应的数据数组
      if (this.activeTab === 'pending') {
        this.pendingApplications = []
      } else {
        this.processedApplications = []
      }
      await this.loadApplications()
    },
    async viewApplication(application) {
      try {
        this.loading = true
        const response = await equipmentApplicationsAPI.getEquipmentApplicationApprovalNodes(application.id)
        if (response && response.data) {
          this.mockApprovalNodes = response.data
        }
        this.selectedApplication = application
        this.showModal = true
      } catch (error) {
        console.error('获取审批节点失败:', error)
        ElMessage.error({message: '获取审批节点失败，请稍后重试', duration: 1000})
        this.mockApprovalNodes = []
        this.selectedApplication = application
        this.showModal = true
      } finally {
        this.loading = false
      }
    },
    closeModal() {
      this.showModal = false
      this.selectedApplication = null
    },
    approveApplication(application) {
      this.pendingApprovalExpense = application
      this.pendingApprovalAction = 'approve'
      this.approvalComment = ''
      this.showApprovalCommentModal = true
    },
    rejectApplication(application) {
      this.pendingApprovalExpense = application
      this.pendingApprovalAction = 'reject'
      this.approvalComment = ''
      this.showApprovalCommentModal = true
    },
    
    // 执行审批操作
    async executeApproval() {
      if (!this.approvalComment.trim()) {
        ElMessage.error({message: '请输入审批理由', duration: 1000})
        return
      }

      if (!this.pendingApprovalExpense) {
        ElMessage.error({message: '未选择要审批的设备申请', duration: 1000})
        return
      }

      // 检查是否正在上传文件
      if (this.isUploading) {
        ElMessage.warning({message: '请等待文件上传完成', duration: 1000})
        return
      }

      try {
        // 构建审批数据，包含附件信息
        const approvalData = {
          action: this.pendingApprovalAction,
          comment: this.approvalComment.trim()
        }

        // 如果有上传的附件，添加到审批数据中
        if (this.uploadedAttachments && this.uploadedAttachments.length > 0) {
          approvalData.attachments = this.uploadedAttachments.map(file => ({
            id: file.id || Date.now() + Math.random(), // 如果没有id，生成一个临时id
            name: file.name,
            url: file.url,
            type: file.type,
            size: file.size
          }))
        } else {
          approvalData.attachments = []
        }

        const response = await equipmentApplicationsAPI.approveEquipmentApplication(this.pendingApprovalExpense.id, approvalData)
        
        if (response && response.success) {
          ElMessage.success({message: this.pendingApprovalAction === 'approve' ? '设备申请已批准' : '设备申请已拒绝', duration: 1000})
          this.closeApprovalCommentModal()
          this.closeModal()
          // 重新加载数据
          await this.loadApplications()
        } else {
          ElMessage.error({message: '审批失败：' + (response.message || '未知错误'), duration: 1000})
        }
      } catch (error) {
        console.error('审批失败:', error)
        ElMessage.error({message: '审批失败，请稍后重试', duration: 1000})
      }
    },
    
    // 关闭审批理由弹窗
    closeApprovalCommentModal() {
      this.showApprovalCommentModal = false
      this.approvalComment = ''
      this.pendingApprovalAction = ''
      this.pendingApprovalExpense = null
      // 重置附件上传状态
      this.uploadedAttachments = []
      this.selectedFiles = []
      this.isUploading = false
      this.uploadProgress = 0
      // 重置文件输入
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    getStatusClass(status) {
      const classMap = {
        'pending': 'px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-200 border border-yellow-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
        'approving': 'px-3 py-1.5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-200 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
        'approved': 'px-3 py-1.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-200 border border-green-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
        'rejected': 'px-3 py-1.5 bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-200 border border-red-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
        'cancelled': 'px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5'
      }
      return classMap[status] || 'px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5'
    },
    getStatusText(status) {
      switch (status) {
        case 'pending':
          return '待审批'
        case 'approved':
          return '已通过'
        case 'rejected':
          return '已拒绝'
        case 'approving':
          return '审批中'
        case 'cancelled':
          return '已取消'
        default:
          return '未知'
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    },
    async loadData() {
      try {
        // 获取设备分类数据 - 使用递归处理树形结构数据（与EquipmentManagement.vue保持一致）
        const categoryResponse = await equipmentCategoryAPI.getEquipmentCategories()
        if (categoryResponse.success) {
          const categories = categoryResponse.data || []
          const mainCats = []
          const subCats = []
          
          // 递归处理树形结构，提取主分类和子分类（与EquipmentManagement.vue保持一致）
          const processCategories = (categoryList, parentId = null) => {
            categoryList.forEach(category => {
              if (!category.parent_id) {
                // 主分类
                mainCats.push({
                  id: category.id,
                  name: category.category_name || category.name,
                  icon: category.icon || 'fas fa-cog',
                  children: category.children || []
                })
              } else {
                // 子分类
                subCats.push({
                  id: category.id,
                  name: category.category_name || category.name,
                  parentId: category.parent_id,
                  icon: category.icon || 'fas fa-cog'
                })
              }
              
              // 递归处理子分类
              if (category.children && category.children.length > 0) {
                processCategories(category.children, category.id)
              }
            })
          }
          
          processCategories(categories)
          
          this.mainCategories = mainCats
          this.subCategories = subCats
          
          console.log('设备分类数据加载成功:', {
            主分类数量: mainCats.length,
            子分类数量: subCats.length
          })
        } else {
          console.error('获取设备分类失败:', categoryResponse.message)
         
        }
      } catch (error) {
        console.error('加载分类数据失败:', error)
      
      }
    },
    getMainCategoryName(id) {
      const category = this.mainCategories.find(cat => cat.id === id)
      return category ? category.name : '-'
    },
    getSubCategoryName(id) {
      const category = this.subCategories.find(cat => cat.id === id)
      return category ? category.name : '-'
    },
    getCategoryName(mainId, subId) {
      const mainCategory = this.getMainCategoryName(mainId)
      const subCategory = this.getSubCategoryName(subId)
      return subCategory !== '-' ? `${mainCategory} - ${subCategory}` : mainCategory
    },
    onMainCategoryChange() {
      // 主分类改变时，重置子分类选择
      this.searchForm.subCategoryId = null
      // 可选：当主分类改变时动态加载子分类
      if (this.searchForm.mainCategoryId) {
        // this.loadSubCategories(this.searchForm.mainCategoryId) // 如需动态加载可取消注释
      }
    },
    selectMainCategory(categoryId) {
      this.searchForm.mainCategoryId = categoryId
      this.searchForm.subCategoryId = null
      // 自动选择第一个子分类
      const firstSubCategory = this.availableSubCategories[0]
      if (firstSubCategory) {
        this.searchForm.subCategoryId = firstSubCategory.id
      }
      // 动态加载子分类（可选优化）
      // this.loadSubCategories(categoryId) // 如需动态加载可取消注释
    },
    selectSubCategory(categoryId) {
      this.searchForm.subCategoryId = categoryId
    },
    async loadSubCategories(parentId) {
      try {
        const response = await equipmentCategoryAPI.getSubCategories(parentId)
        if (response.success && response.data) {
          const newSubCategories = response.data.map(subCategory => ({
            id: subCategory.id,
            name: subCategory.category_name || subCategory.name,
            parentId: subCategory.parent_id || subCategory.parentId,
            icon: subCategory.icon || 'fas fa-cog'
          }))
          
          // 去重处理，避免重复添加相同的子分类
          const existingSubCategoryIds = new Set(this.subCategories.map(cat => cat.id))
          const uniqueNewSubCategories = newSubCategories.filter(cat => !existingSubCategoryIds.has(cat.id))
          
          if (uniqueNewSubCategories.length > 0) {
            this.subCategories.push(...uniqueNewSubCategories)
            console.log(`动态加载了 ${uniqueNewSubCategories.length} 个子分类`)
          }
        }
      } catch (error) {
        console.error('动态加载子分类失败:', error)
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.searchApplications()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.searchApplications()
      }
    },
    getStatusIcon(status) {
      switch (status) {
        case 'pending':
          return 'fas fa-clock text-yellow-400'
        case 'approved':
          return 'fas fa-check-circle text-green-400'
        case 'rejected':
          return 'fas fa-times-circle text-red-400'
        case 'approving':
          return 'fas fa-spinner text-blue-400'
        case 'cancelled':
          return 'fas fa-ban text-gray-400'
        default:
          return 'fas fa-question-circle text-gray-400'
      }
    },
    getApprovalNodeStatusClass(status) {
      switch (status) {
        case 'pending':
          return 'bg-yellow-500/20 border border-yellow-500/30'
        case 'approving':
          return 'bg-blue-500/20 border border-blue-500/30'
        case 'approved':
        case 'auto_approved':
          return 'bg-green-500/20 border border-green-500/30'
        case 'rejected':
          return 'bg-red-500/20 border border-red-500/30'
        default:
          return 'bg-gray-500/20 border border-gray-500/30'
      }
    },
    getApprovalNodeIcon(status) {
      switch (status) {
        case 'pending':
          return 'fas fa-clock'
        case 'approving':
          return 'fas fa-spinner fa-pulse'
        case 'approved':
        case 'auto_approved':
          return 'fas fa-check'
        case 'rejected':
          return 'fas fa-times'
        default:
          return 'fas fa-question'
      }
    },
    getApprovalNodeTextColor(status) {
      switch (status) {
        case 'pending':
          return 'text-yellow-300'
        case 'approving':
          return 'text-blue-300'
        case 'approved':
        case 'auto_approved':
          return 'text-green-300'
        case 'rejected':
          return 'text-red-300'
        default:
          return 'text-gray-300'
      }
    },

    // 附件上传相关方法
    handleFileDrop(event) {
      event.preventDefault()
      event.stopPropagation()
      
      const files = Array.from(event.dataTransfer.files)
      if (files.length > 0) {
        this.addFiles(files)
      }
    },
    
    addFiles(files) {
      // 只允许上传一个文件
      if (this.uploadedAttachments.length > 0) {
        ElMessage.warning('只能上传一个附件，请先删除现有附件')
        return
      }
      
      if (files.length > 0) {
        const file = files[0]
        
        // 检查文件大小
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
          ElMessage.warning(`文件 ${file.name} 超过100MB限制`)
          return
        }
        
        // 检查文件类型
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/zip', 'application/x-rar-compressed'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          ElMessage.warning(`文件 ${file.name} 类型不支持`)
          return
        }
        
        // 立即上传文件
        this.uploadSingleFile(file)
      }
    },
    
    handleFileSelect(event) {
        const files = Array.from(event.target.files)
        
        // 只允许上传一个文件
        if (files.length === 0) return
        
        // 如果已有上传的文件，不允许再上传
        if (this.uploadedAttachments.length > 0) {
          ElMessage.warning('只能上传一个附件，请先删除现有附件')
          return
        }
        
        const file = files[0]
        
        // 检查文件大小
        const maxSize = 100 * 1024 * 1024 // 100MB
        
        if (file.size > maxSize) {
          ElMessage.warning(`文件 ${file.name} 超过100MB限制`)
          return
        }
        
        // 检查文件类型
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/zip', 'application/x-rar-compressed'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          ElMessage.warning(`文件 ${file.name} 类型不支持`)
          return
        }
        
        // 立即上传文件
        this.uploadSingleFile(file)
      },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    
    removeUploadedFile(index) {
      this.uploadedAttachments.splice(index, 1)
      // 重置文件输入
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
      ElMessage.success('附件已删除')
    },
    
    // 单文件上传方法
    async uploadSingleFile(file) {
      this.isUploading = true
      this.uploadProgress = 0
      
      try {
        // 显示上传进度
        this.uploadProgress = 30
        
        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.uploadProgress = 70
        
        // 上传文件
        const response = await request.upload('/upload/attachments', file)
        
        if (response.success) {
          const uploadedFile = {
            id: response.data.id || Date.now() + Math.random(),
            name: response.data.originalName,
            url: response.data.url,
            size: response.data.size,
            type: response.data.mimeType
          }
          
          this.uploadProgress = 100
          this.uploadedAttachments.push(uploadedFile)
          ElMessage.success('文件上传成功')
          
          // 上传完成后重置文件输入
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = ''
          }
          
          // 延迟后隐藏进度条
          setTimeout(() => {
            this.isUploading = false
            this.uploadProgress = 0
          }, 1000)
        } else {
          ElMessage.error(`文件 ${file.name} 上传失败`)
          this.isUploading = false
          this.uploadProgress = 0
        }
      } catch (error) {
        console.error('文件上传失败:', error)
        ElMessage.error('文件上传失败')
        this.isUploading = false
        this.uploadProgress = 0
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    getAttachments(node) {
      // 处理附件数据，可能是数组或JSON字符串
      if (!node.attachments) return []
      
      if (Array.isArray(node.attachments)) {
        return node.attachments
      } else if (typeof node.attachments === 'string') {
        try {
          console.log(JSON.parse(node.attachments))
          return JSON.parse(node.attachments)
        } catch (error) {
          console.error('解析附件数据失败:', error)
          return []
        }
      }
      
      return []
    },
    
    async uploadFiles() {
      if (this.selectedFiles.length === 0) {
        ElMessage.warning('请先选择要上传的文件')
        return
      }
      
      this.isUploading = true
      this.uploadProgress = 0
      
      try {
        const file = this.selectedFiles[0]
        
        // 上传文件
        this.uploadProgress = 50
        const response = await request.upload('/upload/attachments', file)
        
        if (response.success) {
          const uploadedFile = {
            id: response.data.id || Date.now() + Math.random(),
            name: response.data.originalName,
            url: response.data.url,
            size: response.data.size,
            type: response.data.mimeType
          }
          
          this.uploadProgress = 100
          this.uploadedAttachments.push(uploadedFile)
          this.selectedFiles = []
          ElMessage.success('文件上传成功')
          
          // 上传完成后触发文件输入重置
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = ''
          }
        } else {
          ElMessage.error(`文件 ${file.name} 上传失败`)
        }
      } catch (error) {
        console.error('文件上传失败:', error)
        ElMessage.error('文件上传失败')
      } finally {
        this.isUploading = false
        this.uploadProgress = 0
      }
    },
    
    downloadAttachment(attachment) {
      // 模拟下载功能
      if (attachment.url) {
        const link = document.createElement('a')
        link.href = attachment.url
        link.target = '_blank'
        link.download = attachment.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        ElMessage.warning('文件下载链接不存在')
      }
    },


  }
}
</script>

<style scoped>
.equipment-approval {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>