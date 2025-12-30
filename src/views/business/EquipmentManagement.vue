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
                <i class="fas fa-laptop text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  设备申请
                </h1>
                <p class="text-gray-400 text-lg">管理设备申请和审批流程，支持分类管理和状态跟踪</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-permission="'equipment:add'"
                @click="showAddEquipmentModal"
                class="px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-plus group-hover:rotate-90 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">申请设备</span>
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
            v-permission="'equipment:view'"
            @click="resetFilters"
            class="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group border border-gray-500/30"
          >
            <i class="fas fa-undo group-hover:rotate-180 transition-transform duration-500"></i>
            <span class="text-sm">重置</span>
          </button>
          <button 
            v-permission="'equipment:view'"
            @click="applyFilters"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
          >
            <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
            <span class="text-sm">查询</span>
          </button>
        </div>
      </div>

      <!-- 设备列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center py-12 text-gray-400">
            <div class="flex flex-col items-center space-y-4">
              <i class="fas fa-spinner fa-spin text-2xl"></i>
              <div class="text-sm">数据加载中...</div>
            </div>
          </div>
          
          <!-- 数据表格 -->
          <table v-if="!loading" class="w-full text-sm text-left">
              <thead class="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请项目</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请日期</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">描述</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="equipment in paginatedEquipment" :key="equipment.id" 
                    class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                  <td class="px-6 py-4">
                    <span class="text-white font-semibold text-sm bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      {{ equipment.name }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                      <i class="fas fa-tag mr-1 text-purple-400"></i>
                      {{ getMainCategoryName(equipment.mainCategoryId) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                      <i class="fas fa-folder mr-1 text-cyan-400"></i>
                      {{ getSubCategoryName(equipment.subCategoryId) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                      <i class="fas fa-calculator mr-1 text-emerald-400"></i>
                      {{ equipment.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(equipment.status)" class="inline-flex items-center gap-1.5">
                      <i :class="getStatusIcon(equipment.status)"></i>
                      {{ getStatusText(equipment.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-400">{{ formatDate(equipment.applicationDate) }}</td>
                  <td class="px-6 py-4 text-gray-400 max-w-32 truncate" :title="equipment.description || '-'">{{ equipment.description || '-' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      <button 
                        v-permission="'equipment:view'"
                        @click="viewEquipment(equipment)"
                        class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                        title="查看详情"
                      >
                        <i class="fas fa-eye group-hover:scale-110 transition-transform duration-300"></i>
                      </button>
                      <!-- 编辑和删除功能已移除 -->
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedEquipment.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <div class="text-lg font-medium mb-2">暂无设备申请</div>
                    <div class="text-sm">点击"申请设备"按钮开始申请</div>
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
      </div>
    </div>

    <!-- 添加/编辑设备模态框 -->
    <div v-if="showEquipmentModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[80vh] flex flex-col">
        <!-- 标题区域 -->
        <div class="p-6 border-b border-white/20">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-white">
              {{ editingEquipment ? '编辑申请' : '设备申请' }}
            </h3>
            <button 
              @click="closeEquipmentModal"
              class="text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 transform group"
            >
              <i class="fas fa-times text-xl group-hover:scale-110 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="saveEquipment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">申请项目 <span class="text-danger">*</span></label>
              <input 
                v-model="equipmentForm.name"
                type="text" 
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="请输入设备名称"
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">申请数量 <span class="text-danger">*</span></label>
                <input 
                  v-model="equipmentForm.quantity"
                  type="number" 
                  min="1"
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="请输入申请数量"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">申请日期 <span class="text-danger">*</span></label>
                <input 
                  v-model="equipmentForm.applicationDate"
                  type="date"
                  required
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
              </div>
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
                    equipmentForm.mainCategoryId === category.id 
                      ? 'bg-green-500/20 border-green-400/50 ring-1 ring-green-400/30 scale-105' 
                      : 'hover:bg-white/10'
                  ]"
                >
                  <div class="flex flex-col items-center text-center space-y-1">
                    <div :class="[
                      'w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300',
                      equipmentForm.mainCategoryId === category.id 
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

            <div v-if="equipmentForm.mainCategoryId">
              <label class="block text-sm font-medium text-gray-400 mb-3">子分类 <span class="text-danger">*</span></label>
              <div class="grid grid-cols-6 gap-2">
                <div 
                  v-for="category in availableEquipmentSubCategories" 
                  :key="category.id"
                  @click="selectSubCategory(category.id)"
                  :class="[
                    'backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-2 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20',
                    equipmentForm.subCategoryId === category.id 
                      ? 'bg-green-500/20 border-green-400/50 ring-1 ring-green-400/30 scale-105' 
                      : 'hover:bg-white/10'
                  ]"
                >
                  <div class="flex flex-col items-center text-center space-y-1">
                    <div :class="[
                      'w-5 h-5 rounded-sm flex items-center justify-center transition-all duration-300',
                      equipmentForm.subCategoryId === category.id 
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



            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">描述</label>
              <textarea 
                v-model="equipmentForm.description"
                rows="3"
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                placeholder="请输入申请描述"
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
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full bg-white/10 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                  <p class="text-gray-400 text-xs mt-1 text-center">{{ uploadProgress }}% 已上传</p>
                </div>
                <!-- 文件上传区域 -->
                <div  class="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-white/30 transition-all duration-300">
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    @change="handleFileSelect"
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
            @click="closeEquipmentModal"
            class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group"
          >
            <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
            <span>取消</span>
          </button>
          <button 
            type="submit"
            @click="saveEquipment"
            :disabled="isSaving || isUploading"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center space-x-2 group"
          >
            <i v-if="isSaving || isUploading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save group-hover:scale-110 transition-transform duration-300"></i>
            <span>{{ isSaving || isUploading ? (isUploading ? '上传中...' : '保存中...') : '保存' }}</span>
          </button>
        </div>
      </div>
    </div>

 <!-- 设备详情模态框 -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
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
              @click="closeDetailsModal"
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
            
            <!-- 简洁的左右结构布局 - 参考ExpenseManagement.vue的样式 -->
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

              <!-- 附件信息 - 参考ExpenseManagement.vue的样式 -->
              <div v-if="selectedEquipment?.attachments && selectedEquipment.attachments.length > 0" class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3 flex items-center">
                  <i class="fas fa-paperclip mr-2 text-primary-light"></i>
                  附件
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(attachment, index) in selectedEquipment.attachments" :key="index" 
                       class="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center space-x-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                       @click="downloadAttachment(attachment)">
                    <div class="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-file text-white text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-white text-sm font-medium truncate">{{ attachment.name }}</div>
                      <div class="text-gray-400 text-xs">{{ formatFileSize(attachment.size) }}</div>
                    </div>
                    <div class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center text-white hover:from-success-light hover:to-success transition-all duration-200">
                      <i class="fas fa-download text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 审批记录 - 参考ExpenseManagement.vue的样式 -->
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
                      <div class="text-white font-medium text-sm">{{ node.nodeName || node.node_name }}-{{node.user_info?.name || node.userName || node.user_name || '未知用户'}}</div>
                      
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
                     <div class="font-medium text-sm"  :class="getApprovalNodeTextColor(node.status)"  v-else>
                       <span>审批中……</span>
                    </div>
                    
                    <div class="text-gray-400 text-xs">{{ formatDate(node.createTime || node.created_at || node.create_time) }}</div>
                    <div v-if="node.comment" class="text-gray-300 text-xs mt-1 italic max-w-xs">{{ node.comment }}</div>
                    <!-- 审批节点附件显示 - 参考ExpenseManagement.vue的样式 -->
                    <div v-if="getAttachments(node).length > 0" class="mt-2">
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(attachment, attIndex) in getAttachments(node)" :key="attIndex" 
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

        <!-- 底部操作按钮 - 固定在底部 -->
        <div class="px-6 py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <div class="flex justify-end space-x-3">
            <!-- 取消申请按钮 - 参考ExpenseManagement.vue的实现 -->
            <button 
              v-if="selectedEquipment?.status === 'pending' || selectedEquipment?.status === 'approving'"
              @click="cancelEquipmentApplication"
              :disabled="isCancelling"
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400/30 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 group text-sm font-medium"
            >
              <i v-if="isCancelling" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-ban group-hover:scale-110 transition-transform duration-300"></i>
              <span>{{ isCancelling ? '取消中...' : '取消申请' }}</span>
            </button>
            
            <button 
              @click="closeDetailsModal"
              class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-500/30 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group text-sm font-medium"
            >
              <i class="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
              <span>关闭</span>
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { ElMessage } from 'element-plus'
import { equipmentApplicationsAPI } from '../../api/equipmentApplications'
import { equipmentCategoryAPI } from '../../api/equipmentCategory'
import request from '../../utils/request'

// 响应式数据
const equipment = ref([])
const mainCategories = ref([])
const subCategories = ref([])
const showEquipmentModal = ref(false)
const editingEquipment = ref(null)
const isSaving = ref(false)
const showDetailsModal = ref(false)
const selectedEquipment = ref(null)
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
  {
    id: 1,
    nodeName: '部门主管审批',
    userName: '张经理',
    roleName: '部门主管',
    status: 'auto_approved',
    comment: '系统自动审批通过',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    nodeName: '设备管理员审批',
    userName: '李管理员',
    roleName: '设备管理员',
    status: 'approved',
    comment: '设备库存充足，可以批准',
    createTime: '2024-01-16 09:15:00'
  },
  {
    id: 3,
    nodeName: '财务审批',
    userName: '王会计',
    roleName: '财务专员',
    status: 'approving',
    comment: '正在审批中...',
    createTime: '2024-01-16 14:20:00'
  },
  {
    id: 4,
    nodeName: '总经理审批',
    userName: '陈总',
    roleName: '总经理',
    status: 'pending',
    comment: '',
    createTime: '2024-01-17 10:00:00'
  }
])

// 筛选条件
const filters = ref({
  mainCategory: '',
  subCategory: '',
  status: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 设备申请表单
const equipmentForm = ref({
  name: '',
  quantity: 1,
  mainCategoryId: '',
  subCategoryId: '',
  status: 'pending',
  applicationDate: new Date().toISOString().split('T')[0],
  description: '',
  createdAt: '',
  attachments: []
})

// 计算属性

const availableSubCategories = computed(() => {
  if (!filters.value.mainCategory) return []
  return subCategories.value.filter(sub => sub.parentId === filters.value.mainCategory)
})

const availableEquipmentSubCategories = computed(() => {
  if (!equipmentForm.value.mainCategoryId) return []
  return subCategories.value.filter(sub => sub.parentId === equipmentForm.value.mainCategoryId)
})

const filteredEquipment = computed(() => {
  let result = equipment.value

  if (filters.value.mainCategory) {
    result = result.filter(item => item.mainCategoryId === filters.value.mainCategory)
  }

  if (filters.value.subCategory) {
    result = result.filter(item => item.subCategoryId === filters.value.subCategory)
  }

  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }

  if (filters.value.startDate) {
    result = result.filter(item => item.applicationDate >= filters.value.startDate)
  }

  if (filters.value.endDate) {
    result = result.filter(item => item.applicationDate <= filters.value.endDate)
  }

  // 排序
  result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  return result
})

// 分页计算属性 - 使用后端分页，直接返回当前页数据
const paginatedEquipment = computed(() => {
  return equipment.value
})

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / pageSize.value)
})

// 监听筛选条件变化，仅重置页码，不自动加载数据
watch([() => filters.value.status, () => filters.value.startDate, () => filters.value.endDate, () => filters.value.mainCategory, () => filters.value.subCategory, () => filters.value.keyword], () => {
  // 仅重置页码，不自动触发查询，等待用户点击查询按钮
  currentPage.value = 1
})

// 监听分页变化，重新加载数据
watch(currentPage, () => {
  // 页码变化时自动加载数据
  loadData()
})

// 方法
// 动态加载子分类（可选优化）
const loadSubCategories = async (parentId) => {
  try {
    const response = await equipmentCategoryAPI.getSubCategories(parentId)
    if (response.success) {
      const newSubCategories = response.data.map(subCategory => ({
        id: subCategory.id,
        name: subCategory.category_name,
        parentId: subCategory.parent_id,
        icon: subCategory.icon || 'fas fa-cog'
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

const loadData = async () => {
  try {
    loading.value = true
    // 获取设备分类数据 - 使用递归处理树形结构数据
    const categoryResponse = await equipmentCategoryAPI.getEquipmentCategories()
    if (categoryResponse.success) {
      const categories = categoryResponse.data || []
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
              icon: category.icon || 'fas fa-cog',
              children: category.children || []
            })
          } else {
            // 子分类
            subCats.push({
              id: category.id,
              name: category.category_name,
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
      
      mainCategories.value = mainCats
      subCategories.value = subCats
      
      console.log('设备分类数据加载成功:', {
        主分类数量: mainCats.length,
        子分类数量: subCats.length
      })
    } else {
      console.error('获取设备分类失败:', categoryResponse.message)
      // 失败时提供默认分类数据
      provideDefaultCategories()
    }

    // 获取设备申请列表 - 添加重试机制确保数据准确性
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: filters.value.keyword || undefined,
      status: filters.value.status || undefined,
      start_date: filters.value.startDate || undefined,
      end_date: filters.value.endDate || undefined,
      mainCategoryId: filters.value.mainCategory || undefined,
      subCategoryId: filters.value.subCategory || undefined
    }
    
    const response = await equipmentApplicationsAPI.getEquipmentApplicationsList(params)
    console.log('API响应数据:', response)
    if (response.success) {
      const newEquipmentData = response.data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        mainCategoryId: item.main_category_id,
        subCategoryId: item.sub_category_id,
        status: item.status,
        applicationDate: item.application_date,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        applicantId: item.applicant_id,
        applicantName: item.applicant_name,
        applicantDepartment: item.applicant_department,
        attachments: JSON.parse(item.attachments || '[]')
      }))
      
      // 对比新旧数据，确保状态变化能够正确反映
      if (equipment.value.length > 0) {
        const changedItems = newEquipmentData.filter((newItem, index) => {
          const oldItem = equipment.value.find(item => item.id === newItem.id)
          return oldItem && oldItem.status !== newItem.status
        })
        
        if (changedItems.length > 0) {
          console.log('检测到状态变化的项目:', changedItems.map(item => ({id: item.id, status: item.status})))
        }
      }
      
      equipment.value = newEquipmentData
      totalCount.value = response.pagination?.total || response.total || response.data.length
      
      console.log('设备申请数据加载成功:', {
        总数量: totalCount.value,
        当前页数量: equipment.value.length,
        状态分布: equipment.value.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1
          return acc
        }, {})
      })
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    // 如果API调用失败，使用模拟数据作为后备
    provideDefaultCategories()
    useMockData()
  } finally {
    loading.value = false
  }
}

const getMainCategoryName = (id) => {
  const category = mainCategories.value.find(cat => cat.id === id)
  return category ? category.name : '-'
}

const getSubCategoryName = (id) => {
  const category = subCategories.value.find(cat => cat.id === id)
  return category ? category.name : '-'
}

const getSubCategoryIcon = (id) => {
  const category = subCategories.value.find(cat => cat.id === id)
  return category ? category.icon : 'fas fa-cog'
}

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
    'pending': 'px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-200 border border-yellow-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
    'approving': 'px-3 py-1.5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-200 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
    'approved': 'px-3 py-1.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-200 border border-green-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
    'rejected': 'px-3 py-1.5 bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-200 border border-red-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5',
    'cancelled': 'px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5'
  }
  return classMap[status] || 'px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm inline-flex items-center gap-1.5'
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

const getWarrantyClass = (warrantyEndDate) => {
  if (!warrantyEndDate) return 'text-gray-400'
  const today = new Date()
  const warrantyDate = new Date(warrantyEndDate)
  const daysDiff = Math.ceil((warrantyDate - today) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 0) return 'text-red-400 font-medium'
  if (daysDiff < 30) return 'text-orange-400 font-medium'
  return 'text-green-400 font-medium'
}

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount)
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取审批节点附件 - 参考ExpenseApproval.vue的实现
const getAttachments = (node) => {
  // 处理JSON字符串或数组格式的附件数据
  if (typeof node.attachments === 'string') {
    try {
      const attachments = JSON.parse(node.attachments)
      return Array.isArray(attachments) ? attachments.filter(att => att && att.name) : []
    } catch (error) {
      console.warn('解析附件数据失败:', error)
      return []
    }
  }
  
  return Array.isArray(node.attachments) ? node.attachments.filter(att => att && att.name) : []
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

// 文件上传相关函数
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

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const removeUploadedFile = (index) => {
  uploadedAttachments.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    // 模拟上传进度
    uploadProgress.value = 20
    
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

// 模拟数据后备方法 - 已清空默认数据
const useMockData = () => {
  // 不再提供默认模拟数据，确保从API获取真实数据
  console.warn('使用模拟数据模式，但数据已清空')
}

// 提供默认分类数据（当接口失败时）
const provideDefaultCategories = () => {
  mainCategories.value = [
  
  ]
  
  subCategories.value = [
   
  ]
}

const onMainCategoryChange = () => {
  filters.value.subCategory = ''
  // 可选：当主分类改变时动态加载子分类
  if (filters.value.mainCategory) {
    // loadSubCategories(filters.value.mainCategory) // 如需动态加载可取消注释
  }
}

const onEquipmentMainCategoryChange = () => {
  equipmentForm.value.subCategoryId = ''
  // 可选：当设备主分类改变时动态加载子分类
  if (equipmentForm.value.mainCategoryId) {
    // loadSubCategories(equipmentForm.value.mainCategoryId) // 如需动态加载可取消注释
  }
}

const selectMainCategory = (categoryId) => {
  equipmentForm.value.mainCategoryId = categoryId
  equipmentForm.value.subCategoryId = ''
  // 自动选择第一个子分类
  const firstSubCategory = availableEquipmentSubCategories.value[0]
  if (firstSubCategory) {
    equipmentForm.value.subCategoryId = firstSubCategory.id
  }
  // 动态加载子分类（可选优化）
  // loadSubCategories(categoryId) // 如需动态加载可取消注释
}

const selectSubCategory = (categoryId) => {
  equipmentForm.value.subCategoryId = categoryId
}

const showAddEquipmentModal = () => {
  editingEquipment.value = null
  equipmentForm.value = {
    name: '',
    quantity: 1,
    mainCategoryId: '',
    subCategoryId: '',
    status: 'pending',
    applicationDate: new Date().toISOString().split('T')[0],
    description: '',
    createdAt: new Date().toISOString()
  }
  // 重置分类选择状态，保持与ExpenseManagement.vue一致
  selectedMainCategory.value = null
  selectedSubCategory.value = null
  showEquipmentModal.value = true
}

const editEquipment = (equipment) => {
  editingEquipment.value = equipment
  equipmentForm.value = {
    name: equipment.name,
    quantity: equipment.quantity,
    mainCategoryId: equipment.mainCategoryId,
    subCategoryId: equipment.subCategoryId,
    status: equipment.status,
    applicationDate: equipment.applicationDate,
    description: equipment.description,
    createdAt: equipment.createdAt,
    attachments: equipment.attachments
  }
  // 设置当前选中的分类状态，保持与ExpenseManagement.vue一致
  selectedMainCategory.value = equipment.mainCategoryId
  selectedSubCategory.value = equipment.subCategoryId
  // 加载现有附件
  uploadedAttachments.value = equipment.attachments
  showEquipmentModal.value = true
}

const viewEquipment = async (equipment) => {
  try {
    console.log('查看设备详情:', equipment)
    loading.value = true
    // 直接使用列表中的现有数据作为基础信息，参考ExpenseManagement.vue的实现
    selectedEquipment.value = equipment
    showDetailsModal.value = true
    
    // 仅获取审批节点信息（点击查看时获取）
    try {
      const response = await equipmentApplicationsAPI.getEquipmentApplicationApprovalNodes(equipment.id)
      if (response.success && response.data) {
        // 处理API返回的数据格式，确保兼容性
        mockApprovalNodes.value = response.data.map(node => ({
          id: node.id,
          nodeName: node.node_name || node.nodeName,
          userName: node.user_name || node.userName || (node.user_info && node.user_info.name) || '未知用户',
          roleName: node.role_name || node.roleName || '未知角色',
          status: node.status,
          comment: node.comment || '',
          createTime: node.created_at || node.create_time || node.createTime || new Date().toISOString()
        })) || []
        
        console.log('成功获取审批节点数据:', mockApprovalNodes.value.length, '条记录')
      } else {
        console.warn('获取审批节点信息失败:', response.message)
        // 如果API调用失败，保留默认的模拟数据以便用户能看到界面效果
        console.log('使用默认模拟数据展示界面')
      }
    } catch (error) {
      console.error('获取审批节点信息错误:', error)
      // API调用出错时，保留默认模拟数据以便用户能看到界面
      console.log('API调用出错，使用默认模拟数据展示界面')
    }
  } catch (error) {
    console.error('查看设备详情错误:', error)
  } finally {
    loading.value = false
  }
}

const deleteEquipment = async (equipment) => {
  if (confirm(`确定要删除申请 "${equipment.name}" 吗？`)) {
    try {
      const response = await equipmentApplicationsAPI.deleteEquipmentApplication(equipment.id)
      if (response.success) {
        // 重新加载数据
        await loadData()
      } else {
        ElMessage.error({message: response.message || '删除失败', duration: 1000})
      }
    } catch (error) {
      console.error('删除设备申请失败:', error)
      ElMessage.error({message: '删除失败: ' + error.message, duration: 1000})
    }
  }
}

const saveEquipment = async () => {
  // 表单验证 - 参考ExpenseManagement.vue的实现
  if (!equipmentForm.value.name.trim() || !equipmentForm.value.quantity || 
      !equipmentForm.value.mainCategoryId || !equipmentForm.value.subCategoryId || 
      !equipmentForm.value.applicationDate) {
    ElMessage.warning({message: '请填写完整信息', duration: 1000})
    return
  }

  // 数量验证
  if (equipmentForm.value.quantity < 1) {
    ElMessage.warning({message: '申请数量必须大于0', duration: 1000})
    return
  }

  // 检查是否正在上传文件
  if (isUploading.value) {
    ElMessage.warning({message: '请等待文件上传完成', duration: 1000})
    return
  }

  isSaving.value = true
  
  try {
    const equipmentData = {
      name: equipmentForm.value.name,
      main_category_id: equipmentForm.value.mainCategoryId,
      sub_category_id: equipmentForm.value.subCategoryId,
      quantity: equipmentForm.value.quantity,
      description: equipmentForm.value.description || '',
      application_date: equipmentForm.value.applicationDate,
      attachments: uploadedAttachments.value
    }

    let response
    if (editingEquipment.value) {
      // 编辑现有申请
      response = await equipmentApplicationsAPI.updateEquipmentApplication(editingEquipment.value.id, equipmentData)
    } else {
      // 添加新申请
      response = await equipmentApplicationsAPI.createEquipmentApplication(equipmentData)
    }

    if (response.success) {
      // 重新加载数据
      await loadData()
      closeEquipmentModal()
      // 添加成功提示，参考ExpenseManagement.vue的实现
      ElMessage.success({message: editingEquipment.value ? '设备申请更新成功！' : '设备申请创建成功！', duration: 1000})
    } else {
      ElMessage.error({message: response.message || '保存失败', duration: 1000})
    }
  } catch (error) {
    console.error('保存设备申请失败:', error)
    ElMessage.error({message: '保存失败: ' + error.message, duration: 1000})
  } finally {
    isSaving.value = false
  }
}

const closeEquipmentModal = () => {
  showEquipmentModal.value = false
  editingEquipment.value = null
  equipmentForm.value = {
    name: '',
    quantity: 1,
    mainCategoryId: '',
    subCategoryId: '',
    status: 'pending',
    applicationDate: new Date().toISOString().split('T')[0],
    description: '',
    createdAt: '',
    attachments: []
  }
  // 重置文件上传相关数据
  selectedFiles.value = []
  uploadProgress.value = 0
  isUploading.value = false
  uploadedAttachments.value = []
  // 重置分类选择状态，保持与ExpenseManagement.vue一致
  selectedMainCategory.value = null
  selectedSubCategory.value = null
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedEquipment.value = null
}

// 取消设备申请 - 参考ExpenseManagement.vue的实现
const cancelEquipmentApplication = async () => {
  if (!selectedEquipment.value) return
  
  if (!confirm(`确定要取消设备申请 "${selectedEquipment.value.name}" 吗？`)) {
    return
  }
  
  isCancelling.value = true
  
  try {
    // 调用取消申请的API
    const response = await equipmentApplicationsAPI.cancelEquipmentApplication(selectedEquipment.value.id)
    
    if (response.success) {
      ElMessage.success({message: '设备申请已取消', duration: 1000})
      
      // 立即更新本地数据，避免重新加载导致的数据不同步问题
      const cancelledEquipmentId = selectedEquipment.value.id
      
      // 更新equipment数组中的对应项目状态
      const equipmentIndex = equipment.value.findIndex(item => item.id === cancelledEquipmentId)
      if (equipmentIndex !== -1) {
        equipment.value[equipmentIndex] = {
          ...equipment.value[equipmentIndex],
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        }
      }
      
      // 更新selectedEquipment以反映最新状态
      selectedEquipment.value = {
        ...selectedEquipment.value,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      }
      
      closeDetailsModal()
      
      // 使用强制刷新确保数据同步
      setTimeout(async () => {
        await forceRefreshData()
      }, 500)
      
    } else {
      ElMessage.error({message: '取消申请失败：' + (response.message || '未知错误'), duration: 1000})
    }
  } catch (error) {
    console.error('取消设备申请错误:', error)
    ElMessage.error({message: '取消申请失败，请稍后重试', duration: 1000})
  } finally {
    isCancelling.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    mainCategory: '',
    subCategory: '',
    status: '',
    startDate: '',
    endDate: ''
  }
  // 重置筛选条件后立即重新加载数据
  loadData()
}

const applyFilters = () => {
  // 点击查询按钮时重置到第一页并重新加载数据
  currentPage.value = 1
  loadData()
  console.log('应用筛选条件:', filters.value)
  console.log('当前分页状态:', { currentPage: currentPage.value, pageSize: pageSize.value, totalCount: totalCount.value })
}

// 强制刷新数据 - 用于确保数据同步
const forceRefreshData = async () => {
  try {
    console.log('强制刷新设备申请数据...')
    loading.value = true
    
    // 重置页码到第一页
    currentPage.value = 1
    
    // 重新加载数据
    await loadData()
    
    console.log('数据刷新完成')
  } catch (error) {
    console.error('数据刷新失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadData()
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

/* 原生select下拉框样式修复 - 按照ExpenseManagement.vue样式调整 */
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