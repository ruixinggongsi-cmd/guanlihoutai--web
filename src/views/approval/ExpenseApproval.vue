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
                <i class="fas fa-money-check-alt text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  费用审批
                </h1>
                <p class="text-gray-400 text-lg">管理和审批费用申请流程</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <!-- 预留操作按钮区域 -->
            </div>
          </div>
        </div>
      </div>




      <!-- 搜索和筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div class="lg:col-span-2 space-y-3">
            <label class="block text-sm font-semibold text-gray-300">搜索关键词</label>
            <div class="relative">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索申请人、费用类型或部门..."
                class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">主分类</label>
            <select 
              v-model="selectedMainCategory"
              @change="onMainCategoryChange"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
              <option value="" class="bg-slate-800">所有主分类</option>
              <option v-for="category in mainCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">子分类</label>
            <select 
              v-model="selectedSubCategory"
              :disabled="!selectedMainCategory"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" class="bg-slate-800">所有子分类</option>
              <option v-for="subCategory in availableSubCategories" :key="subCategory.id" :value="subCategory.id" class="bg-slate-800">
                {{ subCategory.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">状态</label>
            <select 
              v-model="statusFilter"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
              <option value="" class="bg-slate-800">所有状态</option>
              <option value="pending" class="bg-slate-800">待审批</option>
              <option value="approved" class="bg-slate-800">已批准</option>
              <option value="rejected" class="bg-slate-800">已拒绝</option>
            </select>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">费用类型</label>
            <select 
              v-model="typeFilter"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
              <option value="" class="bg-slate-800">所有类型</option>
              <option value="travel" class="bg-slate-800">差旅费</option>
              <option value="office" class="bg-slate-800">办公费</option>
              <option value="entertainment" class="bg-slate-800">招待费</option>
              <option value="other" class="bg-slate-800">其他</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 mt-6">
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">开始日期</label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300">结束日期</label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15"
            >
          </div>
          
          <div class="lg:col-span-4 flex items-end justify-end space-x-4">
            <button 
              v-permission="'expense:view'"
              @click="resetFilter"
              class="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group border border-gray-500/30"
            >
              <i class="fas fa-redo group-hover:rotate-180 transition-transform duration-500"></i>
              <span class="text-sm">重置</span>
            </button>
            <button 
              v-permission="'expense:view'"
              @click="searchApprovals"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
            >
              <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
              <span class="text-sm">搜索</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 审批列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-white/20">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white">费用审批列表</h3>
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
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">费用名称</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">金额</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">日期</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请人</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="approval in filteredApprovals" :key="approval.id" class="hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ approval.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ getMainCategoryName(approval.mainCategoryId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-400">{{ getSubCategoryName(approval.subCategoryId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ approval.amount.toLocaleString() }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(approval.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                    <i :class="getStatusIcon(approval.status)" class="mr-1"></i>
                    {{ getStatusText(approval.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ formatDate(approval.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ approval.applicant.name }}</div>
                  <div class="text-xs text-gray-500">{{ approval.applicant.department }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      v-permission="'expense:view'"
                      @click="viewApproval(approval)"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      查看
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
              {{ currentPage }} / {{ Math.ceil(totalCount / pageSize) }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage * pageSize >= totalCount"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-2"></i>
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
              :disabled="isUploading"
              class="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
              
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="请输入审批理由..."
              maxlength="500"
            ></textarea>
            <div class="text-right text-xs text-gray-400 mt-2">
              {{ approvalComment.length }}/500
            </div>
          </div>

          <!-- 附件上传区域 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <label class="text-gray-300 text-sm">
                附件上传（可选）：
              </label>
              <span class="text-xs text-gray-400">
                支持 {{ allowedFileTypes.join('、') }} 格式，单个文件最大 {{ formatFileSize(maxFileSize) }}
              </span>
            </div>
            
            <!-- 文件上传区域 - 只在没有任何文件时显示 -->
            <div 
              v-if="uploadedAttachments.length === 0 && !isUploading"
              @click="!isUploading && $refs.fileInput.click()"
              @drop.prevent="!isUploading && handleFileDrop"
              @dragover.prevent="!isUploading && (isDragging = true)"
              @dragleave.prevent="!isUploading && (isDragging = false)"
              :class="[
                'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300',
                isUploading ? 'border-gray-500 bg-white/5 cursor-not-allowed opacity-50' : (isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50 hover:bg-white/5 cursor-pointer')
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                class="hidden"
                :accept="allowedFileTypes.map(type => '.' + type).join(',')"
              >
              <div class="text-gray-400">
                <i class="fas fa-cloud-upload-alt text-3xl mb-3"></i>
                <p class="text-sm mb-1">点击或拖拽文件到此处上传</p>
                <p class="text-xs text-gray-500">支持图片、文档、压缩包等格式</p>
              </div>
            </div>

            <!-- 已选择的文件列表 - 隐藏，因为选择后立即上传 -->
            <div v-if="false && selectedFiles.length > 0" class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-300">待上传文件</span>
                <button 
                  @click="clearSelectedFiles"
                  :disabled="isUploading"
                  class="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-trash mr-1"></i>清空
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(file, index) in selectedFiles" :key="index" 
                     class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div class="flex items-center space-x-3 flex-1">
                    <i class="fas fa-file text-primary-light"></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white font-medium truncate">{{ file.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <button 
                @click="removeFile(index)"
                :disabled="isUploading"
                class="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 上传进度 -->
            <div v-if="isUploading" class="mt-4">
              <div class="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>上传进度</span>
                <span class="text-primary">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- 已上传的附件列表 -->
            <div v-if="uploadedAttachments.length > 0" class="mt-4">
              <div class="flex items-center mb-2">
                <span class="text-sm text-gray-300">已上传附件</span>
              </div>
              <div class="space-y-2">
                <div v-for="(attachment, index) in uploadedAttachments" :key="index" 
                     class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div class="flex items-center space-x-3 flex-1">
                    <i class="fas fa-paperclip text-success-light"></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white font-medium truncate">{{ attachment.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(attachment.size) }}</p>
                    </div>
                  </div>
                  <button 
                    @click="removeUploadedFile(index)"
                    :disabled="isUploading"
                    class="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end items-center">
            <!-- 上传按钮已隐藏，因为选择文件后立即上传 -->
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="closeApprovalCommentModal"
                :disabled="isUploading"
                class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 group"
              >
                <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
                <span>取消</span>
              </button>
              <button 
                type="submit"
                @click="executeApproval"
                :disabled="isUploading"
                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center space-x-2 group"
              >
                <i :class="isUploading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'" class="group-hover:scale-110 transition-transform duration-300"></i>
                <span>{{ isUploading ? '上传中...' : '确认' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 费用详情模态框 -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
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
            <div class="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
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
                      {{ viewingExpense ? getMainCategoryName(viewingExpense.mainCategoryId) : '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-folder mr-2 text-cyan-400"></i>
                      子分类
                    </label>
                    <div class="text-cyan-300 font-medium max-w-xs text-right">
                      {{ viewingExpense ? getSubCategoryName(viewingExpense.subCategoryId) : '-' }}
                    </div>
                  </div>
                  
                  <!-- 金额和日期并排显示 -->
                  <div class="grid grid-cols-2 gap-4 py-3 border-b border-white/10">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-yen-sign mr-2 text-emerald-400"></i>
                        金额
                      </label>
                      <div class="text-emerald-300 font-bold text-xl">
                        {{ viewingExpense?.amount?.toLocaleString() || '0' }}
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-calendar mr-2 text-warning-light"></i>
                        日期
                      </label>
                      <div class="text-white font-medium">
                        {{ viewingExpense ? formatDate(viewingExpense.date) : '-' }}
                      </div>
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
                      <i class="fas fa-user mr-2 text-gray-400"></i>
                      申请人
                    </label>
                    <div class="text-white font-medium max-w-xs text-right">
                      <div>{{ viewingExpense?.applicant?.name || '-' }}</div>
                      <div class="text-xs text-gray-500">{{ viewingExpense?.applicant?.department || '-' }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-calendar mr-2 text-gray-400"></i>
                      申请时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ viewingExpense?.createdAt || formatDate(viewingExpense?.date) }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
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
                        {{ viewingExpense?.paymentMethod || viewingExpense?.payment_method || '-' }}
                      </div>
                    </div>
                    
                    <div class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-user mr-2 text-purple-400"></i>
                        收款人姓名
                      </label>
                      <div class="text-purple-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.payeeName || viewingExpense?.payee_name || '-' }}
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
                        {{ viewingExpense?.accountName || viewingExpense?.account_name || '-' }}
                      </div>
                    </div>
                    
                    <div class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-hashtag mr-2 text-orange-400"></i>
                        账号
                      </label>
                      <div class="text-orange-300 font-medium max-w-xs text-right">
                        {{ viewingExpense?.accountType || viewingExpense?.account_type || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 附件信息 -->
          <div class="mb-8">
            <div class="flex items-center mb-6">
              <div class="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-paperclip text-white text-sm"></i>
              </div>
              <h3 class="text-xl font-semibold text-white">附件信息</h3>
            </div>
            
            <div class="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
              <div v-if="viewingExpense?.attachments?.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-for="(file, index) in viewingExpense.attachments" :key="index" 
                     class="flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-lg border border-white/20 transition-all duration-200 cursor-pointer"
                     @click="downloadAttachment(file)">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                      <i class="fas fa-file text-white text-sm"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-white font-medium text-sm truncate max-w-48" :title="file.name">{{ file.name }}</div>
                      <div class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</div>
                    </div>
                  </div>
                  <button class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center hover:from-success-light hover:to-success transition-all duration-200 flex-shrink-0">
                    <i class="fas fa-download text-white text-xs"></i>
                  </button>
                </div>
              </div>
              <div v-else class="text-gray-400 text-center py-6">
                <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10">
                  <i class="fas fa-paperclip text-xl"></i>
                </div>
                <p class="text-sm">暂无附件</p>
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
                     class="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 px-3">
                  <div class="flex items-center space-x-4">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getApprovalNodeStatusClass(node.status)">
                      <i :class="getApprovalNodeIcon(node.status)" class="text-white text-xs"></i>
                    </div>
                    <div>
                      <div class="text-white font-medium text-sm">{{ node.nodeName || node.node_name }}</div>
                      <div class="text-gray-400 text-xs">{{ node.user_info?.name || '' }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-sm" :class="getApprovalNodeTextColor(node.status)" v-if="!node.is_current_node">
                      <span v-if="node.status === 'pending'">待审批</span>
                      <span v-else-if="node.status === 'approving'">审批中</span>
                      <span v-else-if="node.status === 'approved'">已通过</span>
                      <span v-else-if="node.status === 'rejected'">已拒绝</span>
                      <span v-else-if="node.status === 'auto_approved'">自动审批</span>
                      <span v-else>待审批</span>
                    </div>
                     <div class="font-medium text-sm" :class="getApprovalNodeTextColor(node.status)" v-else>
                      <span>审批中……</span>
                    </div>
                    <div class="text-gray-400 text-xs">{{ formatDateTime(node.createdAt) }}</div>
                    <div v-if="node.comment" class="text-gray-300 text-xs mt-1 italic max-w-xs">{{ node.comment }}</div>
                    <!-- 审批节点附件显示 -->
                    <div v-if="getAttachments(node).length > 0" class="mt-2">
                      <div class="flex flex-wrap gap-2 justify-end">
                        <div v-for="(attachment, index) in getAttachments(node)" :key="index" 
                             class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 border border-white/20 transition-all duration-200 cursor-pointer"
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
              <div v-else class="text-gray-400 text-center py-6">
                <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10">
                  <i class="fas fa-clipboard-list text-xl"></i>
                </div>
                <p class="text-sm">暂无审批记录</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 - 固定在底部 -->
        <div class="p-6 border-t border-white/10 flex-shrink-0">
          <div class="flex justify-end space-x-4">
            <!-- 只有在"待我审批"标签页才显示审批操作按钮 -->
            <template v-if="activeTab === 'pending'">
              <button 
                @click="rejectExpense(viewingExpense)"
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <i class="fas fa-times"></i>
                <span>审批拒绝</span>
              </button>
              <button 
                @click="approveExpense(viewingExpense)"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <i class="fas fa-check"></i>
                <span>审批通过</span>
              </button>
            </template>
            <button 
              @click="closeViewModal"
              class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <i class="fas fa-times"></i>
              <span>关闭</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { ElMessage } from 'element-plus'
import { expenseApplicationsAPI } from '@/api/expenseApplications'
import { expenseCategoryAPI } from '@/api/expenseCategory'
import request from '@/utils/request'

// 响应式数据
const searchKeyword = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const startDate = ref('')
const endDate = ref('')
const activeTab = ref('pending')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const selectedMainCategory = ref('')
const selectedSubCategory = ref('')

const pendingApprovals = ref([])
const processedApprovals = ref([])
const mainCategories = ref([])
const subCategories = ref([])

// 模态框状态
const showViewModal = ref(false)
const viewingExpense = ref(null)
const mockApprovalNodes = ref([])

// 审批理由弹窗状态
const showApprovalCommentModal = ref(false)
const approvalComment = ref('')
const pendingApprovalAction = ref('')
const pendingApprovalExpense = ref(null)

// 附件上传相关状态
const selectedFiles = ref([])
const uploadedAttachments = ref([])
const uploadProgress = ref(0)
const isUploading = ref(false)
const isDragging = ref(false)
const fileInput = ref(null) // 文件输入框引用
const maxFileSize = 100 * 1024 * 1024 // 100MB
const allowedFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip', 'rar']

// 计算属性
const availableSubCategories = computed(() => {
  if (!selectedMainCategory.value) return []
  return subCategories.value.filter(sub => sub.parentId === selectedMainCategory.value)
})

const filteredApprovals = computed(() => {
  const list = activeTab.value === 'pending' ? pendingApprovals.value : processedApprovals.value
  return list.filter(item => {
    const matchesSearch = !searchKeyword.value || 
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.applicant.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.applicant.department.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || item.status === statusFilter.value
    const matchesType = !typeFilter.value || item.type === typeFilter.value
    const matchesMainCategory = !selectedMainCategory.value || item.mainCategoryId === selectedMainCategory.value
    const matchesSubCategory = !selectedSubCategory.value || item.subCategoryId === selectedSubCategory.value
    
    // 日期范围过滤
    let matchesDateRange = true
    if (startDate.value || endDate.value) {
      const itemDate = new Date(item.date)
      if (startDate.value) {
        const start = new Date(startDate.value)
        matchesDateRange = matchesDateRange && itemDate >= start
      }
      if (endDate.value) {
        const end = new Date(endDate.value)
        end.setHours(23, 59, 59, 999) // 包含结束日期的整天
        matchesDateRange = matchesDateRange && itemDate <= end
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesMainCategory && matchesSubCategory && matchesDateRange
  })
})

const pendingCount = computed(() => pendingApprovals.value.length)
const processedCount = computed(() => processedApprovals.value.length)

// 方法
const loadData = async () => {
  try {
    await Promise.all([
      loadCategories(),
      loadPendingApprovals(),
      loadMyApprovals()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

const loadCategories = async () => {
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

const loadPendingApprovals = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      start_date: startDate.value,
      end_date: endDate.value,
      main_category_id: selectedMainCategory.value,
      sub_category_id: selectedSubCategory.value
    }
    const response = await expenseApplicationsAPI.getPendingApprovals(params)
    if (response.success && response.data) {
      // 处理分页数据格式 - 后端返回格式: { success: true, data: [...], pagination: {...} }
      const rawData = Array.isArray(response.data) ? response.data : (response.data.data || response.data.items || [])
     
      pendingApprovals.value = rawData.map(item => ({
        ...item,
        attachments: JSON.parse(item.attachments || '[]')
      }))
      
      // 处理分页信息
      if (response.data.pagination) {
        totalCount.value = response.data.pagination.total || 0
      } else if (response.pagination) {
        totalCount.value = response.pagination.total || 0
      } else if (response.data.total !== undefined) {
        totalCount.value = response.data.total
      } else {
        totalCount.value = rawData.length
      }
    }
  } catch (error) {
    console.error('加载待审批列表失败:', error)
    pendingApprovals.value = []
    totalCount.value = 0
  }
}

const loadMyApprovals = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      start_date: startDate.value,
      end_date: endDate.value,
      main_category_id: selectedMainCategory.value,
      sub_category_id: selectedSubCategory.value
    }
    const response = await expenseApplicationsAPI.getMyApprovals(params)
    if (response.success && response.data) {
      // 处理分页数据格式 - 后端返回格式: { success: true, data: [...], pagination: {...} }
      const rawData = Array.isArray(response.data) ? response.data : (response.data.data || response.data.items || [])
      
      processedApprovals.value = rawData.map(item => ({
        ...item,
        attachments: typeof item.attachments === 'string' ? JSON.parse(item.attachments || '[]') : (item.attachments || [])
      }))
      
      // 处理分页信息
      if (response.data.pagination) {
        totalCount.value = response.data.pagination.total || 0
      } else if (response.pagination) {
        totalCount.value = response.pagination.total || 0
      } else if (response.data.total !== undefined) {
        totalCount.value = response.data.total
      } else {
        totalCount.value = rawData.length
      }
    }
  } catch (error) {
    console.error('加载已审批列表失败:', error)
    processedApprovals.value = []
    totalCount.value = 0
  }
}

const searchApprovals = () => {
  currentPage.value = 1
  loadData()
}

const resetFilter = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  selectedMainCategory.value = ''
  selectedSubCategory.value = ''
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
  if (currentPage.value * pageSize.value < totalCount.value) {
    currentPage.value++
    loadData()
  }
}

const viewApproval = async (approval) => {
  try {
    // 获取审批节点信息
    const nodesResponse = await expenseApplicationsAPI.getExpenseApplicationApprovalNodes(approval.id)
    if (nodesResponse.success && nodesResponse.data) {
      mockApprovalNodes.value = nodesResponse.data
    }
    
    // 获取完整的费用申请详情（包含支付信息等完整字段）
    try {
      const detailResponse = await expenseApplicationsAPI.getExpenseApplicationDetail(approval.id)
      if (detailResponse.success && detailResponse.data) {
        // 使用详情数据，合并审批节点信息
        viewingExpense.value = {
          ...detailResponse.data,
          ...approval, // 保留列表中的审批节点信息
          // 确保字段名统一为驼峰命名
          paymentMethod: detailResponse.data.paymentMethod || detailResponse.data.payment_method,
          payeeName: detailResponse.data.payeeName || detailResponse.data.payee_name,
          accountName: detailResponse.data.accountName || detailResponse.data.account_name,
          accountType: detailResponse.data.accountType || detailResponse.data.account_type
        }
      } else {
        // 如果详情接口失败，使用列表数据
        viewingExpense.value = { ...approval }
      }
    } catch (detailError) {
      console.error('加载费用详情失败:', detailError)
      // 如果详情接口失败，使用列表数据
      viewingExpense.value = { ...approval }
    }
    
    showViewModal.value = true
  } catch (error) {
    console.error('加载审批节点失败:', error)
    // 如果API调用失败，仍然显示基本信息
    viewingExpense.value = { ...approval }
    showViewModal.value = true
  }
}

const approveExpense = (expense) => {
  pendingApprovalExpense.value = expense
  pendingApprovalAction.value = 'approve'
  approvalComment.value = ''
  showApprovalCommentModal.value = true
}

const rejectExpense = (expense) => {
  pendingApprovalExpense.value = expense
  pendingApprovalAction.value = 'reject'
  approvalComment.value = ''
  showApprovalCommentModal.value = true
}

// 执行审批操作
const executeApproval = async () => {
  if (!approvalComment.value.trim()) {
    ElMessage.error({message: '请输入审批理由', duration: 1000})
    return
  }

  if (!pendingApprovalExpense.value) {
    ElMessage.error({message: '未选择要审批的费用申请', duration: 1000})
    return
  }

  // 检查是否正在上传文件
  if (isUploading.value) {
    ElMessage.warning({message: '请等待文件上传完成', duration: 1000})
    return
  }

  try {
    // 构建审批数据，包含附件信息
    const approvalData = {
      action: pendingApprovalAction.value,
      comment: approvalComment.value.trim()
    }

    // 如果有上传的附件，添加到审批数据中
    if (uploadedAttachments.value.length > 0) {
      approvalData.attachments = uploadedAttachments.value.map(attachment => ({
        id: attachment.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size
      }))
    }
    else{
      approvalData.attachments = []
    }

    const response = await expenseApplicationsAPI.approveExpenseApplication(pendingApprovalExpense.value.id, approvalData)
    
    if (response.success) {
      ElMessage.success({message: pendingApprovalAction.value === 'approve' ? '费用申请已批准' : '费用申请已拒绝', duration: 1000})
      closeApprovalCommentModal()
      closeViewModal()
      // 重新加载数据
      await loadData()
    } else {
      ElMessage.error({message: '审批失败：' + (response.message || '未知错误'), duration: 1000})
    }
  } catch (error) {
    console.error('审批失败:', error)
    ElMessage.error({message: '审批失败，请稍后重试', duration: 1000})
  }
}

// 关闭审批理由弹窗
const closeApprovalCommentModal = () => {
  showApprovalCommentModal.value = false
  approvalComment.value = ''
  pendingApprovalAction.value = ''
  pendingApprovalExpense.value = null
  // 清空附件上传状态
  selectedFiles.value = []
  uploadedAttachments.value = []
  uploadProgress.value = 0
  isUploading.value = false
  isDragging.value = false
}

// 附件上传相关方法
const handleFileSelect = (event) => {
  // 检查是否已有上传文件
  if (uploadedAttachments.value.length > 0) {
    ElMessage.warning('只能上传一个附件，请先删除现有附件')
    event.target.value = ''
    return
  }
  
  const files = Array.from(event.target.files)
  addFiles(files)
  // 清空input值，允许重复选择相同文件
  event.target.value = ''
}

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
  isDragging.value = false
}

const addFiles = (files) => {
  // 检查文件数量限制 - 只支持单个文件
  if (files.length > 1) {
    ElMessage.warning('只能上传一个文件')
    return
  }
  
  if (selectedFiles.value.length > 0) {
    ElMessage.warning('只能上传一个文件')
    return
  }
  
  files.forEach(file => {
    // 检查文件类型
    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!allowedFileTypes.includes(fileExtension)) {
      ElMessage.warning(`文件 ${file.name} 格式不支持`)
      return
    }
    
    // 检查文件大小
    if (file.size > maxFileSize) {
      ElMessage.warning(`文件 ${file.name} 超过最大限制 ${formatFileSize(maxFileSize)}`)
      return
    }
    
    selectedFiles.value.push(file)
  })
  
  // 选择文件后立即上传
  if (selectedFiles.value.length > 0) {
    uploadSingleFile(selectedFiles.value[0])
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const removeUploadedFile = (index) => {
  uploadedAttachments.value.splice(index, 1)
  // 重置文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  ElMessage.success('附件已删除')
}

const clearSelectedFiles = () => {
  selectedFiles.value = []
}

const clearUploadedAttachments = () => {
  uploadedAttachments.value = []
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }
  
  isUploading.value = true
  
  try {
    // 目前只支持单文件上传，取第一个文件
    const file = selectedFiles.value[0]
    
    // 设置上传进度为50%，表示开始上传
    uploadProgress.value = 50
    
    // 使用真实的API上传接口
    const response = await request.upload('/upload/attachments', file)
    
    if (response.success) {
      // 设置上传进度为100%，表示上传完成
      uploadProgress.value = 100
      
      // 将上传成功的文件添加到已上传附件列表
      uploadedAttachments.value.push({
        id: response.data.id || Date.now() + Math.random(),
        name: response.data.originalName || file.name,
        size: response.data.size || file.size,
        url: response.data.url,
        type: response.data.mimeType || file.type,
        uploadTime: new Date().toISOString()
      })
      
      // 清空已选择的文件
      selectedFiles.value = []
      ElMessage.success('文件上传成功')
      
      // 上传完成后触发文件输入重置
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } else {
      ElMessage.error(`文件 ${file.name} 上传失败：${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败，请稍后重试')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const downloadAttachment = (attachment) => {
  if (attachment.url) {
    // 创建临时链接下载文件
    const link = document.createElement('a')
    link.href = attachment.url
    link.target = '_blank'
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ElMessage.warning('文件下载链接无效')
  }
}

const uploadSingleFile = async (file) => {
  if (!file) {
    ElMessage.warning('请选择要上传的文件')
    return
  }
  
  isUploading.value = true
  
  try {
    // 设置上传进度为50%，表示开始上传
    uploadProgress.value = 50
    
    // 使用真实的API上传接口
    const response = await request.upload('/upload/attachments', file)
    
    if (response.success) {
      // 设置上传进度为100%，表示上传完成
      uploadProgress.value = 100
      
      // 将上传成功的文件添加到已上传附件列表
      uploadedAttachments.value.push({
        id: response.data.id || Date.now() + Math.random(),
        name: response.data.originalName || file.name,
        size: response.data.size || file.size,
        url: response.data.url,
        type: response.data.mimeType || file.type,
        uploadTime: new Date().toISOString()
      })
      
      // 清空已选择的文件
      selectedFiles.value = []
      ElMessage.success('文件上传成功')
      
      // 上传完成后触发文件输入重置
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } else {
      ElMessage.error(`文件 ${file.name} 上传失败：${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败，请稍后重试')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}



const closeModal = () => {
  showViewModal.value = false
  viewingExpense.value = null
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingExpense.value = null
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    approving: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝',
    approving: '审批中'
  }
  return texts[status] || status
}

const getStatusIcon = (status) => {
  const iconMap = {
    pending: 'fas fa-clock',
    approved: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle',
    approving: 'fas fa-spinner fa-spin'
  }
  return iconMap[status] || 'fas fa-question-circle'
}

const getExpenseTypeText = (type) => {
  const texts = {
    travel: '差旅费用',
    entertainment: '招待费用',
    office: '办公费用',
    other: '其他费用'
  }
  return texts[type] || type
}

// 提供默认分类数据（当接口失败时）
const provideDefaultCategories = () => {
  mainCategories.value = [
  ]
  
  subCategories.value = [
  ]
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

const onMainCategoryChange = () => {
  selectedSubCategory.value = ''
  // 可选：当主分类改变时动态加载子分类
  if (selectedMainCategory.value) {
    // loadSubCategories(selectedMainCategory.value) // 如需动态加载可取消注释
  }
}

const getApprovalNodeTextColor = (status) => {
  const colorMap = {
    pending: 'text-yellow-600',
    approved: 'text-green-600',
    rejected: 'text-red-600',
    auto_approved: 'text-blue-600'
  }
  return colorMap[status] || 'text-gray-600'
}

const getApprovalNodeStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
    auto_approved: 'bg-blue-100 text-blue-600'
  }
  return classMap[status] || 'bg-gray-100 text-gray-600'
}

const getApprovalNodeIcon = (status) => {
  const iconMap = {
    pending: 'fas fa-clock',
    approved: 'fas fa-check',
    rejected: 'fas fa-times',
    auto_approved: 'fas fa-robot'
  }
  return iconMap[status] || 'fas fa-question'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// 格式化日期（带时分秒）
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}



// 获取附件列表（处理JSON字符串或数组格式）
const getAttachments = (node) => {
  
  console.log('原始附件数据:', node)
  // 如果是字符串，尝试解析JSON
  if (typeof node.attachments === 'string') {
    try {
      const parsed = JSON.parse(node.attachments)
      console.log('解析后的附件数据:', parsed)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('解析附件数据失败:', e)
      return []
    }
  }
  
  return []
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>