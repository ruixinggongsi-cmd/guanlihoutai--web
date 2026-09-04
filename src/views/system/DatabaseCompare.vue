<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
    </div>
    
    <!-- 导航栏组件 -->
    <NavigationBar />

    <!-- 主内容区 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  客户数据对比
                </h1>
                <p class="text-gray-400 text-lg">批量对比新客户数据与底料数据库，快速识别重复数据</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                v-if="canDeleteAllDatabase"
                @click="deleteAllDatabaseCustomers"
                class="px-6 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-trash-alt group-hover:scale-110 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">删除全部数据</span>
              </button>
              <button 
                @click="loadDatabaseStats"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">刷新统计</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底料数据库统计 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-white mb-2">底料数据库</h2>
            <p class="text-gray-400">当前数据库中的客户记录总数</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-blue-400">{{ databaseStats.totalCustomers || 0 }}</div>
            <div class="text-sm text-gray-400">条客户记录</div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div
            v-for="option in compareScopeOptions"
            :key="option.value"
            class="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <span class="text-gray-300">{{ option.label }}</span>
            <span :class="option.countClass" class="text-lg font-bold">{{ getStatusCount(option.value) }}</span>
          </div>
        </div>
        <p v-if="canDeleteAllDatabase || canViewAllDatabase || canViewUploaderStats" class="text-sm text-purple-300 mt-4">
          <i class="fas fa-shield-alt mr-1"></i>
          高级权限：可按上传人统计、查看全部数据或删除全部客户
        </p>
      </div>

      <!-- 数据输入区域 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <h2 class="text-xl font-bold text-white mb-6">新客户数据</h2>
        
        <!-- 文件上传 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">上传Excel/CSV文件</label>
          <div class="flex items-center space-x-4 flex-wrap">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileUpload"
              accept=".xlsx,.xls,.csv"
              class="hidden"
            >
            <button 
              @click="$refs.fileInput.click()"
              class="px-6 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
            >
              <i class="fas fa-upload"></i>
              <span>选择文件</span>
            </button>
            <button 
              @click="downloadTemplate"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
            >
              <i class="fas fa-download"></i>
              <span>下载模板</span>
            </button>
            <span v-if="uploadedFileName" class="text-gray-300">{{ uploadedFileName }}</span>
            <span v-if="customerList.length > 0" class="text-green-400">
              <i class="fas fa-check-circle mr-1"></i>
              已加载 {{ customerList.length }} 条数据
            </span>
          </div>
        </div>

        <!-- 对比范围选择 -->
        <div class="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <label class="block text-sm font-medium text-gray-300 mb-3">
            <i class="fas fa-filter mr-1"></i>
            对比范围（选择与哪些客户数据进行对比）
          </label>
          <div class="flex flex-wrap gap-4">
            <label
              v-for="option in compareScopeOptions"
              :key="option.value"
              class="flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border transition-all"
              :class="selectedCompareScopes.includes(option.value)
                ? option.selectedClass
                : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10'"
            >
              <input
                type="checkbox"
                :value="option.value"
                v-model="selectedCompareScopes"
                class="rounded border-white/30 bg-white/10 text-primary focus:ring-primary"
              >
              <span>{{ option.label }}</span>
              <span class="text-xs opacity-70">({{ getStatusCount(option.value) }})</span>
            </label>
          </div>
          <p v-if="selectedCompareScopes.length === 0" class="text-yellow-400 text-sm mt-2">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            请至少选择一种客户类型进行对比
          </p>
        </div>

        <!-- 默认导入状态 -->
        <div class="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <label class="block text-sm font-medium text-gray-300 mb-3">
            <i class="fas fa-tags mr-1"></i>
            导入客户状态（上传后可批量修改）
          </label>
          <div class="flex flex-wrap items-center gap-3">
            <select
              v-model="defaultImportStatus"
              class="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="option in importStatusOptions" :key="option" :value="option" class="bg-slate-800">
                {{ option }}
              </option>
            </select>
            <button
              @click="applyDefaultStatusToAll"
              :disabled="customerList.length === 0"
              class="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-check-double mr-1"></i>
              应用到全部
            </button>
            <button
              v-if="compareResults"
              @click="applyDefaultStatusToNewResults"
              :disabled="Number(compareResults.summary?.unique || 0) === 0"
              class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-user-plus mr-1"></i>
              应用到全部新增
            </button>
          </div>
        </div>

        <!-- 对比进度显示 -->
        <div v-if="comparing && compareProgress.totalBatches > 0" class="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <i class="fas fa-spinner fa-spin text-blue-400"></i>
              <span class="text-blue-400 font-semibold">
                正在对比数据... ({{ compareProgress.currentBatch }}/{{ compareProgress.totalBatches }} 批)
              </span>
            </div>
            <span class="text-blue-300 text-sm">
              {{ Math.round((compareProgress.currentBatch / compareProgress.totalBatches) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div 
              class="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${(compareProgress.currentBatch / compareProgress.totalBatches) * 100}%` }"
            ></div>
          </div>
          <div class="text-xs text-gray-400">
            当前批次: {{ compareProgress.currentBatchSize }} 条 | 
            已处理: {{ (compareProgress.currentBatch - 1) * 50000 + compareProgress.currentBatchSize }} / {{ compareProgress.totalRecords }} 条
          </div>
        </div>

        <!-- 上传进度显示 -->
        <div v-if="saving && uploadProgress.totalBatches > 0" class="mb-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <i class="fas fa-spinner fa-spin text-purple-400"></i>
              <span class="text-purple-400 font-semibold">
                正在上传数据... ({{ uploadProgress.currentBatch }}/{{ uploadProgress.totalBatches }} 批)
              </span>
            </div>
            <span class="text-purple-300 text-sm">
              {{ Math.round((uploadProgress.currentBatch / uploadProgress.totalBatches) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div 
              class="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${(uploadProgress.currentBatch / uploadProgress.totalBatches) * 100}%` }"
            ></div>
          </div>
          <div class="text-xs text-gray-400">
            当前批次: {{ uploadProgress.currentBatchSize }} 条 | 
            已上传: {{ (uploadProgress.currentBatch - 1) * 50000 + uploadProgress.currentBatchSize }} / {{ uploadProgress.totalRecords }} 条 |
            成功: {{ uploadProgress.totalSuccess }} 条 | 失败: {{ uploadProgress.totalFailed }} 条
          </div>
        </div>

        <!-- 开始对比按钮 -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex-1">
              <div class="text-sm text-gray-400 mb-2">
                <i class="fas fa-info-circle mr-1"></i>
                对比规则：通过电话号码与所选范围的客户数据进行对比
                <span v-if="selectedCompareScopes.length > 0" class="text-blue-300">
                  （{{ selectedCompareScopeLabels.join('、') }}）
                </span>
              </div>
              <div v-if="customerList.length > 0 && !comparing" class="text-sm text-green-400">
                <i class="fas fa-check-circle mr-1"></i>
                已准备 {{ customerList.length }} 条数据，将通过电话号码进行对比
              </div>
              <div v-else-if="!comparing" class="text-sm text-yellow-400">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                请先上传文件或输入数据
              </div>
            </div>
            <div class="flex items-end">
              <button 
                @click="startCompare"
                :disabled="customerList.length === 0 || comparing || selectedCompareScopes.length === 0 || !canCompareDatabase"
                class="px-8 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg"
              >
                <i v-if="comparing" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-search"></i>
                <span>{{ comparing ? '对比中...' : `开始对比 (${customerList.length}条)` }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 数据列表 / 对比结果 / 按上传人统计 -->
        <div class="mb-6">
          <!-- 标题行 + 右侧工具栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <h3 class="text-lg font-semibold text-white">
                <span v-if="listDataMode === 'uploaderSummary'">按上传人统计</span>
                <span v-else-if="listDataMode === 'uploaderDetail'">{{ selectedUploader?.uploader_name }} 的上传明细</span>
                <span v-else-if="listDataMode === 'database'">数据库全部数据</span>
                <span v-else-if="listDataMode === 'compare'">对比结果</span>
                <span v-else>上传数据</span>
              </h3>
              <p v-if="listDataMode === 'uploaderSummary' || listDataMode === 'uploaderDetail'" class="text-sm text-gray-400 mt-1">
                统计范围：{{ uploaderDateScopeLabel }}
                <span v-if="listDataMode === 'uploaderDetail' && uploaderDetailStatusLabel">
                  · 数据状态：{{ uploaderDetailStatusLabel }}
                </span>
                <span v-if="listDataMode === 'uploaderSummary'">
                  · 按对比上传时写入的「上传人 + 上传时间」汇总
                </span>
              </p>
              <div
                v-if="canViewUploaderStats && listDataMode === 'uploaderSummary' && uploaderSummaryMeta.missingCount > 0"
                class="mt-2 flex flex-wrap items-center gap-2 text-sm"
              >
                <span class="text-yellow-300">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  有 {{ uploaderSummaryMeta.missingCount }} 条数据缺少上传人记录（历史导入未写入）
                </span>
                <select
                  v-model="backfillUserId"
                  class="h-9 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" class="bg-slate-800">选择上传人</option>
                  <option v-for="user in backfillUserOptions" :key="user.id" :value="user.id" class="bg-slate-800">
                    {{ user.name || user.username }}
                  </option>
                </select>
                <button
                  @click="runBackfillCreatedBy"
                  :disabled="!backfillUserId || backfillLoading"
                  class="inline-flex items-center justify-center h-9 px-3 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-lg hover:bg-yellow-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-user-check mr-1" v-if="!backfillLoading"></i>
                  <i class="fas fa-spinner fa-spin mr-1" v-else></i>
                  补全当前范围内缺失的上传人
                </button>
              </div>
            </div>

            <!-- 按上传人统计：日期筛选 -->
            <div v-if="listDataMode === 'uploaderSummary'" class="flex flex-wrap items-center gap-2 shrink-0">
              <select
                v-model="uploaderDateScope"
                @change="loadUploaderSummary"
                class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option v-for="opt in uploaderDateScopeOptions" :key="opt.value" :value="opt.value" class="bg-slate-800">
                  {{ opt.label }}
                </option>
              </select>
              <span class="text-sm text-gray-400 whitespace-nowrap">共 {{ uploaderSummary.length }} 人</span>
              <button
                @click="loadUploaderSummary"
                class="inline-flex items-center justify-center h-10 px-4 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all text-sm"
              >
                <i class="fas fa-sync-alt mr-1"></i>刷新
              </button>
            </div>

            <!-- 上传人明细：返回 -->
            <div v-else-if="listDataMode === 'uploaderDetail'" class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                @click="backToUploaderSummary"
                class="inline-flex items-center justify-center h-10 px-4 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all text-sm"
              >
                <i class="fas fa-arrow-left mr-1"></i>返回统计
              </button>
            </div>

            <!-- 上传数据工具栏 -->
            <div v-else-if="listDataMode === 'upload'" class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-400">共 {{ customerList.length }} 条</span>
              <select
                v-model="pageSize"
                @change="currentPage = 1"
                class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option :value="50" class="bg-slate-800">每页 50 条</option>
                <option :value="100" class="bg-slate-800">每页 100 条</option>
                <option :value="500" class="bg-slate-800">每页 500 条</option>
                <option :value="1000" class="bg-slate-800">每页 1000 条</option>
              </select>
              <button
                @click="addNewRow"
                class="inline-flex items-center justify-center h-10 px-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all duration-300 gap-2"
              >
                <i class="fas fa-plus"></i>
                <span>添加行</span>
              </button>
            </div>

            <!-- 对比结果工具栏 -->
            <div v-else-if="listDataMode === 'compare' && compareResults" class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center h-10 px-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                重复: {{ compareResults.summary?.duplicate || 0 }}
              </span>
              <span class="inline-flex items-center h-10 px-3 bg-green-500/20 text-green-400 rounded-lg text-sm">
                新增: {{ compareResults.summary?.unique || 0 }}
              </span>
              <span class="inline-flex items-center h-10 px-3 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                重复率: {{ compareResults.summary?.duplicateRate || '0%' }}
              </span>
              <select
                v-model="duplicateStatusTarget"
                :disabled="updatingDuplicateStatus || compareResults.summary?.duplicate === 0"
                class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option v-for="option in importStatusOptions" :key="option" :value="option" class="bg-slate-800">
                  改为{{ option }}
                </option>
              </select>
              <button
                @click="bulkUpdateDuplicateStatus()"
                :disabled="!compareResults || compareResults.summary?.duplicate === 0 || updatingDuplicateStatus"
                class="inline-flex items-center justify-center h-10 px-4 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-edit" v-if="!updatingDuplicateStatus"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ updatingDuplicateStatus ? '修改中...' : '批量修改重复状态' }}</span>
              </button>
              <button
                @click="downloadNewCustomers"
                :disabled="!compareResults || compareResults.summary?.unique === 0"
                class="inline-flex items-center justify-center h-10 px-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载新增数据</span>
              </button>
              <button
                @click="downloadDuplicates"
                :disabled="!compareResults || compareResults.summary?.duplicate === 0"
                class="inline-flex items-center justify-center h-10 px-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载重复数据</span>
              </button>
              <button
                @click="downloadAllResults"
                :disabled="!compareResults"
                class="inline-flex items-center justify-center h-10 px-4 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载全部结果</span>
              </button>
              <button
                v-if="canImportDatabase"
                @click="saveNewCustomersToDatabase"
                :disabled="!compareResults || !compareResults.summary || Number(compareResults.summary?.unique || 0) === 0 || saving"
                class="inline-flex items-center justify-center h-10 px-4 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-upload" v-if="!saving"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ saving ? '上传中...' : '上传新增数据到数据库' }}</span>
              </button>
            </div>

            <!-- 数据库全部数据工具栏 -->
            <div v-else-if="listDataMode === 'database'" class="flex flex-wrap items-center gap-2">
              <input
                v-model="databaseKeyword"
                @keyup.enter="loadDatabaseList"
                type="text"
                placeholder="搜索姓名/电话/邮箱/公司"
                class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary w-56"
              >
              <button
                @click="loadDatabaseList"
                class="inline-flex items-center justify-center h-10 px-4 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all text-sm"
              >
                <i class="fas fa-search mr-1"></i>搜索
              </button>
            </div>
          </div>

          <!-- 导航 Tab 行（独立一行，统一高度对齐） -->
          <div class="flex flex-wrap items-center gap-2 pb-4 mb-4 border-b border-white/10">
            <template v-if="canViewUploaderStats || canViewAllDatabase">
              <button
                v-if="canViewUploaderStats"
                @click="switchListMode('uploaderSummary')"
                :class="listDataMode === 'uploaderSummary' || listDataMode === 'uploaderDetail' ? 'bg-purple-500/30 text-purple-300 border-purple-500/50' : 'bg-white/5 text-gray-400 border-white/20'"
                class="inline-flex items-center justify-center h-10 px-4 rounded-lg border hover:bg-white/10 transition-all duration-300 text-sm whitespace-nowrap"
              >
                <i class="fas fa-users mr-2"></i>
                按上传人
              </button>
              <button
                v-if="canViewAllDatabase"
                @click="switchListMode('database')"
                :class="listDataMode === 'database' ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50' : 'bg-white/5 text-gray-400 border-white/20'"
                class="inline-flex items-center justify-center h-10 px-4 rounded-lg border hover:bg-white/10 transition-all duration-300 text-sm whitespace-nowrap"
              >
                <i class="fas fa-database mr-2"></i>
                数据库全部数据 ({{ databaseStats.totalCustomers || 0 }})
              </button>
            </template>
            <button
              @click="switchListMode('upload')"
              :class="listDataMode === 'upload' ? 'bg-blue-500/30 text-blue-400 border-blue-500/50' : 'bg-white/5 text-gray-400 border-white/20'"
              class="inline-flex items-center justify-center h-10 px-4 rounded-lg border hover:bg-white/10 transition-all duration-300 text-sm whitespace-nowrap"
            >
              <i class="fas fa-table mr-2"></i>
              上传数据
            </button>
            <button
              @click="switchListMode('compare')"
              :disabled="!compareResults"
              :class="listDataMode === 'compare' && compareResults ? 'bg-green-500/30 text-green-400 border-green-500/50' : 'bg-white/5 text-gray-400 border-white/20'"
              class="inline-flex items-center justify-center h-10 px-4 rounded-lg border hover:bg-white/10 transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-check-circle mr-2"></i>
              对比结果
              <span v-if="compareResults" class="ml-1 text-xs">({{ compareResults.summary?.duplicate || 0 }}重复 / {{ compareResults.summary?.unique || 0 }}新增)</span>
            </button>
          </div>

          <!-- 筛选栏：上传人明细 / 数据库全部 -->
          <div
            v-if="listDataMode === 'uploaderDetail' || listDataMode === 'database'"
            class="mb-4 rounded-xl border border-white/15 bg-white/[0.03] p-4"
          >
            <div class="flex flex-wrap items-start gap-x-8 gap-y-4">
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-gray-300 pt-2 whitespace-nowrap w-20 shrink-0">时间范围</span>
                <select
                  v-if="listDataMode === 'uploaderDetail'"
                  v-model="uploaderDateScope"
                  @change="onUploaderDateScopeChange"
                  class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[7rem]"
                >
                  <option v-for="opt in uploaderDateScopeOptions" :key="opt.value" :value="opt.value" class="bg-slate-800">
                    {{ opt.label }}
                  </option>
                </select>
                <select
                  v-else
                  v-model="databaseDateScope"
                  @change="onDatabaseDateScopeChange"
                  class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[7rem]"
                >
                  <option v-for="opt in uploaderDateScopeOptions" :key="opt.value" :value="opt.value" class="bg-slate-800">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="flex items-start gap-3 flex-1 min-w-[280px]">
                <span class="text-sm font-medium text-gray-300 pt-2 whitespace-nowrap w-20 shrink-0">数据状态</span>
                <div class="flex flex-wrap items-center gap-2">
                  <template v-if="listDataMode === 'uploaderDetail'">
                    <button
                      v-for="tab in uploaderDetailStatusTabs"
                      :key="tab.value"
                      @click="setUploaderDetailStatus(tab.value)"
                      :disabled="uploaderDetailCountsLoading"
                      :class="uploaderDetailStatus === tab.value ? tab.activeClass : 'bg-white/5 text-gray-400 border-white/20'"
                      class="inline-flex items-center justify-center h-10 px-3 rounded-lg border text-sm transition-all disabled:opacity-60"
                    >
                      {{ tab.label }}
                      <span v-if="tab.count !== null" class="ml-1 opacity-80 tabular-nums">({{ tab.count }})</span>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      v-for="tab in databaseStatusTabs"
                      :key="tab.value"
                      @click="setDatabaseStatusFilter(tab.value)"
                      :class="databaseStatusFilter === tab.value ? tab.activeClass : 'bg-white/5 text-gray-400 border-white/20'"
                      class="inline-flex items-center justify-center h-10 px-3 rounded-lg border text-sm transition-all"
                    >
                      {{ tab.label }}
                    </button>
                  </template>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 ml-auto">
                <span class="text-sm text-gray-400 whitespace-nowrap">
                  匹配 <span class="text-white font-semibold tabular-nums">{{ databaseTotal }}</span> 条
                </span>
                <select
                  v-model="pageSize"
                  @change="currentPage = 1; loadDatabaseList()"
                  class="h-10 px-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option :value="50" class="bg-slate-800">每页 50 条</option>
                  <option :value="100" class="bg-slate-800">每页 100 条</option>
                  <option :value="500" class="bg-slate-800">每页 500 条</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 按上传人统计表格 -->
          <div v-if="listDataMode === 'uploaderSummary'" class="overflow-x-auto">
            <div v-if="uploaderSummaryLoading" class="py-12 text-center text-gray-400">
              <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <p>加载中...</p>
              <p v-if="uploaderDateScope === 'all'" class="text-xs text-gray-500 mt-2">
                全量统计约 54 万条，可能需要 5–15 秒
              </p>
            </div>
            <table v-else class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width: 180px">
                <col style="width: 100px">
                <col style="width: 100px">
                <col style="width: 110px">
                <col style="width: 110px">
                <col style="width: 100px">
              </colgroup>
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">上传人</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">合计</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">数据</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">意向客户</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">进群客户</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300 align-middle">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr
                  v-for="row in uploaderSummary"
                  :key="row.uploader_id || '__unknown__'"
                  class="hover:bg-white/5 transition-colors"
                >
                  <td class="px-4 py-3 text-left align-middle text-white font-medium whitespace-nowrap">
                    {{ row.uploader_name }}
                  </td>
                  <td class="px-4 py-3 text-left align-middle">
                    <button
                      @click="viewUploaderDetail(row)"
                      class="text-purple-400 hover:text-purple-300 font-bold underline-offset-2 hover:underline tabular-nums"
                    >
                      {{ row.total_count }}
                    </button>
                  </td>
                  <td class="px-4 py-3 text-left align-middle tabular-nums">
                    <button
                      v-if="row.active_count > 0"
                      @click="viewUploaderDetail(row, 'active')"
                      class="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {{ row.active_count }}
                    </button>
                    <span v-else class="text-gray-500">0</span>
                  </td>
                  <td class="px-4 py-3 text-left align-middle tabular-nums">
                    <button
                      v-if="row.inactive_count > 0"
                      @click="viewUploaderDetail(row, 'inactive')"
                      class="text-yellow-400 hover:text-yellow-300 hover:underline"
                    >
                      {{ row.inactive_count }}
                    </button>
                    <span v-else class="text-gray-500">0</span>
                  </td>
                  <td class="px-4 py-3 text-left align-middle tabular-nums">
                    <button
                      v-if="row.vip_count > 0"
                      @click="viewUploaderDetail(row, 'vip')"
                      class="text-green-400 hover:text-green-300 hover:underline"
                    >
                      {{ row.vip_count }}
                    </button>
                    <span v-else class="text-gray-500">0</span>
                  </td>
                  <td class="px-4 py-3 text-left align-middle">
                    <button
                      @click="viewUploaderDetail(row)"
                      class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      查看
                    </button>
                  </td>
                </tr>
                <tr v-if="uploaderSummary.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                    <p>暂无上传记录</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 对比上传批次记录 -->
            <div v-if="uploadSessions.length > 0" class="mt-6 pt-6 border-t border-white/10">
              <h4 class="text-sm font-semibold text-gray-300 mb-3">
                <i class="fas fa-history mr-2"></i>对比上传记录（谁在什么时候上传了多少）
              </h4>
              <div class="overflow-x-auto">
                <table class="w-full table-fixed border-collapse">
                  <thead class="bg-white/5 border-b border-white/20">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-400">上传时间</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-400">上传人</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-400">文件名</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-400">成功</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-400">重复/失败</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr v-for="session in uploadSessions" :key="session.id" class="hover:bg-white/5">
                      <td class="px-4 py-2 text-sm text-gray-300">{{ formatDate(session.uploaded_at) }}</td>
                      <td class="px-4 py-2 text-sm text-white">{{ session.uploader_name }}</td>
                      <td class="px-4 py-2 text-sm text-gray-400 truncate">{{ session.file_name || '-' }}</td>
                      <td class="px-4 py-2 text-sm text-green-400">{{ session.success_count || 0 }}</td>
                      <td class="px-4 py-2 text-sm text-gray-400">
                        重复 {{ session.duplicate_count || 0 }} / 失败 {{ session.failed_count || 0 }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 上传人明细 / 数据库列表 -->
          <div v-else-if="listDataMode === 'uploaderDetail' || listDataMode === 'database'" class="overflow-x-auto">
            <div v-if="databaseListLoading" class="py-12 text-center text-gray-400">
              <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <p>加载中...</p>
            </div>
            <table v-else class="w-full">
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">电话</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">公司</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th v-if="listDataMode === 'database'" class="px-4 py-3 text-left text-sm font-semibold text-gray-300">上传人</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">上传时间</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr
                  v-for="item in databaseList"
                  :key="item.id"
                  class="hover:bg-white/5 transition-colors"
                >
                  <td class="px-4 py-3 text-white">{{ item.name || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ item.phone || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ item.email || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ item.company || '-' }}</td>
                  <td class="px-4 py-3">
                    <span :class="getCustomerStatusClass(item.status)" class="px-2 py-1 rounded text-xs">
                      {{ getCustomerStatusText(item.status) }}
                    </span>
                  </td>
                  <td v-if="listDataMode === 'database'" class="px-4 py-3 text-gray-300">{{ item.creator_name || '-' }}</td>
                  <td class="px-4 py-3 text-gray-400 text-sm">{{ formatDate(item.created_at) }}</td>
                </tr>
                <tr v-if="databaseList.length === 0">
                  <td :colspan="listDataMode === 'database' ? 7 : 6" class="px-4 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                    <p>暂无数据</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 数据输入表格 -->
          <div v-else-if="listDataMode === 'upload'" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">电话</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">公司</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">地址</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr 
                  v-for="(customer, index) in paginatedCustomerList" 
                  :key="customer._rowId"
                  class="hover:bg-white/5 transition-colors"
                >
                  <td class="px-4 py-3">
                    <input 
                      v-model="customer.name"
                      type="text"
                      placeholder="姓名"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="customer.phone"
                      type="text"
                      placeholder="电话"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="customer.email"
                      type="email"
                      placeholder="邮箱"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="customer.company"
                      type="text"
                      placeholder="公司"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="customer.address"
                      type="text"
                      placeholder="地址"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                  </td>
                  <td class="px-4 py-3">
                    <select 
                      v-model="customer.status"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="数据" class="bg-slate-800">数据</option>
                      <option value="意向客户" class="bg-slate-800">意向客户</option>
                      <option value="进群客户" class="bg-slate-800">进群客户</option>
                    </select>
                  </td>
                  <td class="px-4 py-3">
                    <button 
                      @click="removeRowByIndex((currentPage - 1) * pageSize + index)"
                      class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="customerList.length === 0">
                  <td colspan="7" class="px-4 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                    <p>暂无数据，请上传文件或手动输入</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 对比结果表格 -->
          <div v-else-if="listDataMode === 'compare' && compareResults" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">对比状态</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">电话</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">公司</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">客户状态</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">匹配信息</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr 
                  v-for="(result, index) in paginatedCompareResults" 
                  :key="index"
                  :class="{
                    'bg-red-500/10 border-l-4 border-red-500': result.isDuplicate,
                    'bg-green-500/10': !result.isDuplicate,
                    'hover:bg-white/5': true
                  }"
                  class="transition-colors"
                >
                  <td class="px-4 py-3">
                    <span 
                      v-if="result.isDuplicate"
                      class="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold"
                    >
                      <i class="fas fa-exclamation-triangle mr-1"></i>
                      重复
                    </span>
                    <span 
                      v-else
                      class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold"
                    >
                      <i class="fas fa-check-circle mr-1"></i>
                      新增
                    </span>
                  </td>
                  <td class="px-4 py-3 text-white font-medium">{{ result.name || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ result.phone || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ result.email || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ result.company || '-' }}</td>
                  <td class="px-4 py-3">
                    <select
                      v-if="!result.isDuplicate"
                      v-model="result.status"
                      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option v-for="option in importStatusOptions" :key="option" :value="option" class="bg-slate-800">
                        {{ option }}
                      </option>
                    </select>
                    <span
                      v-else
                      :class="getCustomerStatusClass(result.status)"
                      class="px-2 py-1 rounded text-xs font-semibold"
                    >
                      {{ getCustomerStatusText(result.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div v-if="result.isDuplicate && result.matchedCustomers.length > 0" class="space-y-2">
                      <div 
                        v-for="(match, idx) in result.matchedCustomers.slice(0, 3)" 
                        :key="idx"
                        class="text-xs"
                      >
                        <div class="text-yellow-400 mb-1">
                          <i class="fas fa-link mr-1"></i>
                          {{ match.name }} ({{ match.phone }})
                          <span
                            :class="getCustomerStatusClass(match.status)"
                            class="ml-2 px-2 py-0.5 rounded text-xs"
                          >
                            {{ getCustomerStatusText(match.status) }}
                          </span>
                          <button
                            @click="bulkUpdateDuplicateStatus([match.id], result.phone)"
                            :disabled="updatingDuplicateStatus || getCustomerStatusText(match.status) === duplicateStatusTarget"
                            class="ml-2 px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            改为{{ duplicateStatusTarget }}
                          </button>
                          <span v-if="match.email" class="text-gray-500">- {{ match.email }}</span>
                        </div>
                        <div class="text-gray-400 ml-4 space-x-3">
                          <span v-if="match.created_by_user">
                            <i class="fas fa-user mr-1"></i>
                            创建者: {{ match.created_by_user.name }}
                          </span>
                          <span v-if="match.created_at">
                            <i class="fas fa-clock mr-1"></i>
                            创建时间: {{ formatDate(match.created_at) }}
                          </span>
                          <span v-if="match.created_status || match.status">
                            <i class="fas fa-tag mr-1"></i>
                            创建状态:
                            <span :class="getCustomerStatusClass(match.created_status || match.status)" class="px-2 py-0.5 rounded text-xs">
                              {{ getCustomerStatusText(match.created_status || match.status) }}
                            </span>
                          </span>
                        </div>
                        <div v-if="match.latest_status_change" class="text-gray-400 ml-4 mt-1">
                          <i class="fas fa-history mr-1"></i>
                          最近修改:
                          {{ match.latest_status_change.changed_by_user?.name || '未知用户' }}
                          于 {{ formatDate(match.latest_status_change.changed_at) }}
                          将 {{ getCustomerStatusText(match.latest_status_change.old_status) }}
                          改为 {{ getCustomerStatusText(match.latest_status_change.new_status) }}
                        </div>
                        <div v-if="match.status_change_logs && match.status_change_logs.length > 1" class="text-gray-500 ml-4 mt-1">
                          历史记录:
                          <span
                            v-for="log in match.status_change_logs.slice(1, 3)"
                            :key="log.id"
                            class="mr-3"
                          >
                            {{ log.changed_by_user?.name || '未知用户' }} {{ formatDate(log.changed_at) }}
                            {{ getCustomerStatusText(log.old_status) }}→{{ getCustomerStatusText(log.new_status) }}
                          </span>
                        </div>
                      </div>
                      <div v-if="result.matchedCustomers.length > 3" class="text-xs text-gray-500">
                        ...还有 {{ result.matchedCustomers.length - 3 }} 条匹配记录
                      </div>
                    </div>
                    <div v-else class="text-gray-500 text-sm">
                      {{ result.duplicateReason }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 分页控件 -->
          <div v-if="showListPagination" class="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
            <div class="text-sm text-gray-400">
              显示第 {{ paginationStart }} - {{ paginationEnd }} 条，共 {{ paginationTotal }} 条
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-angle-double-left"></i>
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-angle-left"></i>
              </button>
              <span class="px-4 py-2 text-white">
                第 {{ currentPage }} / {{ activeTotalPages }} 页
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage >= activeTotalPages"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-angle-right"></i>
              </button>
              <button
                @click="currentPage = activeTotalPages"
                :disabled="currentPage >= activeTotalPages"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-angle-double-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { customerDataCompareAPI } from '../../api/customerDataCompare.js'
import { customerAPI } from '../../api/customers.js'
import { userAPI } from '../../api/users.js'
import { permissionUtils } from '../../utils/permission.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

const formatPhoneNumber = (phoneValue) => {
  if (!phoneValue && phoneValue !== 0) return ''

  let phoneStr = String(phoneValue)

  if (phoneStr.includes('e+') || phoneStr.includes('E+')) {
    const asNumber = Number(phoneStr)
    if (Number.isFinite(asNumber)) {
      phoneStr = asNumber.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 0 })
    } else {
      phoneStr = parseFloat(phoneStr).toString()
    }
  }

  phoneStr = phoneStr.replace(/\D/g, '')
  phoneStr = phoneStr.replace(/^0+/, '') || '0'

  return phoneStr.trim()
}

const setWorksheetPhoneCell = (ws, row, col, phone) => {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
  ws[cellAddress] = { t: 's', v: String(phone || '') }
}

// 响应式数据
const customerList = ref([])
const comparing = ref(false)
const compareResults = ref(null)
const databaseStats = ref({ totalCustomers: 0 })
const saving = ref(false)
const updatingDuplicateStatus = ref(false)
const duplicateStatusTarget = ref('进群客户')
const uploadedFileName = ref('')
const currentPage = ref(1)
const pageSize = ref(100)
const listDataMode = ref('upload') // upload | compare | uploaderSummary | uploaderDetail | database

const uploaderSummary = ref([])
const uploaderSummaryMeta = ref({ totalRecords: 0, trackedCount: 0, missingCount: 0, uploaderCount: 0 })
const uploaderSummaryLoading = ref(false)
const backfillUserId = ref('')
const backfillUserOptions = ref([])
const backfillLoading = ref(false)
const uploadSessions = ref([])
const uploaderDateScope = ref('last7')
const uploaderDateScopeOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'day_before', label: '前天' },
  { value: 'last7', label: '近7天' },
  { value: 'all', label: '全部' }
]
const selectedUploader = ref(null)
const uploaderDetailStatus = ref('')
const databaseList = ref([])
const databaseListLoading = ref(false)
const databaseTotal = ref(0)
const databaseKeyword = ref('')
const databaseStatusFilter = ref('')
const databaseDateScope = ref('all')
const uploaderDetailCountsLoading = ref(false)

const compareScopeOptions = [
  { label: '数据', value: 'active', countClass: 'text-blue-400', selectedClass: 'bg-blue-500/20 border-blue-500/50 text-blue-300' },
  { label: '意向客户', value: 'inactive', countClass: 'text-yellow-400', selectedClass: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' },
  { label: '进群客户', value: 'vip', countClass: 'text-green-400', selectedClass: 'bg-green-500/20 border-green-500/50 text-green-300' }
]
const importStatusOptions = ['数据', '意向客户', '进群客户']
const selectedCompareScopes = ref(['active', 'inactive', 'vip'])
const defaultImportStatus = ref('数据')
const canCompareDatabase = computed(() => permissionUtils.hasPermission('database_compare:compare'))
const canImportDatabase = computed(() => permissionUtils.hasPermission('database_compare:import'))
const canViewUploaderStats = computed(() => permissionUtils.hasPermission('database_compare:uploader_stats'))
const canViewAllDatabase = computed(() => permissionUtils.hasPermission('database_compare:database_view'))
const canDeleteAllDatabase = computed(() => permissionUtils.hasPermission('database_compare:delete_all'))
const canManageDatabaseList = computed(() => canViewUploaderStats.value || canViewAllDatabase.value)

// 进度状态
const compareProgress = ref({
  currentBatch: 0,
  totalBatches: 0,
  currentBatchSize: 0,
  totalRecords: 0
})

const uploadProgress = ref({
  currentBatch: 0,
  totalBatches: 0,
  currentBatchSize: 0,
  totalRecords: 0,
  totalSuccess: 0,
  totalFailed: 0
})

// 方法
const loadDatabaseStats = async () => {
  try {
    const response = await customerDataCompareAPI.getDatabaseStats()
    if (response.success) {
      databaseStats.value = response.data
    } else {
      ElMessage.error({message: response.message || '获取统计信息失败', duration: 2000})
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
    ElMessage.error({message: '获取统计信息失败', duration: 2000})
  }
}

const switchListMode = (mode) => {
  if (mode === 'compare' && !compareResults.value) return
  listDataMode.value = mode
  currentPage.value = 1
  if (mode === 'uploaderSummary') {
    loadUploaderSummary()
  } else if (mode === 'database') {
    loadDatabaseList()
  }
}

const loadUploaderSummary = async () => {
  if (!canViewUploaderStats.value) return
  uploaderSummaryLoading.value = true
  try {
    const response = await customerDataCompareAPI.getUploaderSummary({
      dateScope: uploaderDateScope.value
    })
    if (response.success) {
      uploaderSummary.value = response.data || []
      uploaderSummaryMeta.value = response.meta || {
        totalRecords: (response.data || []).reduce((sum, row) => sum + (row.total_count || 0), 0),
        trackedCount: (response.data || []).reduce((sum, row) => sum + (row.total_count || 0), 0),
        missingCount: 0,
        uploaderCount: (response.data || []).length
      }
      loadUploadSessions()
    } else {
      ElMessage.error({ message: response.message || '获取上传人统计失败', duration: 3000 })
    }
  } catch (error) {
    console.error('获取上传人统计失败:', error)
    const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || '获取上传人统计失败'
    ElMessage.error({ message: msg, duration: 4000 })
  } finally {
    uploaderSummaryLoading.value = false
  }
}

const uploaderDateScopeLabel = computed(() => {
  return uploaderDateScopeOptions.find(opt => opt.value === uploaderDateScope.value)?.label || '今天'
})

const uploaderDetailStatusLabel = computed(() => {
  const map = { '': '', active: '数据', inactive: '意向客户', vip: '进群客户' }
  return map[uploaderDetailStatus.value] || ''
})

const refreshSelectedUploaderCounts = async () => {
  if (!selectedUploader.value) return
  uploaderDetailCountsLoading.value = true
  try {
    const response = await customerDataCompareAPI.getUploaderSummary({
      dateScope: uploaderDateScope.value
    })
    if (response.success) {
      uploaderSummary.value = response.data || []
      const updated = uploaderSummary.value.find(
        row => row.uploader_id === selectedUploader.value.uploader_id
      )
      if (updated) {
        selectedUploader.value = updated
      } else {
        selectedUploader.value = {
          ...selectedUploader.value,
          total_count: 0,
          active_count: 0,
          inactive_count: 0,
          vip_count: 0
        }
      }
    }
  } catch (error) {
    console.error('刷新上传人统计失败:', error)
  } finally {
    uploaderDetailCountsLoading.value = false
  }
}

const onUploaderDateScopeChange = async () => {
  if (listDataMode.value === 'uploaderDetail') {
    await refreshSelectedUploaderCounts()
    currentPage.value = 1
    loadDatabaseList()
  } else {
    loadUploaderSummary()
  }
}

const loadUploadSessions = async () => {
  try {
    const response = await customerDataCompareAPI.getUploadSessions({
      page: 1,
      pageSize: 20,
      dateScope: uploaderDateScope.value
    })
    if (response.success) {
      uploadSessions.value = response.data || []
    }
  } catch (error) {
    console.error('获取上传记录失败:', error)
  }
}

const loadBackfillUserOptions = async () => {
  if (!canViewUploaderStats.value) return
  try {
    const response = await userAPI.getUserList({ page: 1, pageSize: 500 })
    backfillUserOptions.value = response.data || response.list || []
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

const runBackfillCreatedBy = async () => {
  if (!backfillUserId.value) {
    ElMessage.warning({ message: '请先选择上传人', duration: 2000 })
    return
  }

  const selectedUser = backfillUserOptions.value.find(user => user.id === backfillUserId.value)
  const userLabel = selectedUser?.name || selectedUser?.username || '所选用户'

  try {
    await ElMessageBox.confirm(
      `将把当前统计范围（${uploaderDateScopeLabel.value}）内缺少上传人的 ${uploaderSummaryMeta.value.missingCount} 条数据，补全为「${userLabel}」。\n\n如果不同日期是不同人上传的，请切换日期范围后分批补全。`,
      '补全上传人',
      {
        confirmButtonText: '确认补全',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  backfillLoading.value = true
  try {
    const response = await customerDataCompareAPI.backfillCreatedBy({
      userId: backfillUserId.value,
      dateScope: uploaderDateScope.value
    })
    if (response.success) {
      ElMessage.success({ message: response.message || '补全成功', duration: 3000 })
      await loadUploaderSummary()
      await loadDatabaseStats()
    } else {
      ElMessage.error({ message: response.message || '补全失败', duration: 3000 })
    }
  } catch (error) {
    ElMessage.error({ message: error?.response?.data?.message || '补全失败', duration: 3000 })
  } finally {
    backfillLoading.value = false
  }
}

const viewUploaderDetail = async (row, status = '') => {
  selectedUploader.value = row
  uploaderDetailStatus.value = status
  listDataMode.value = 'uploaderDetail'
  currentPage.value = 1
  await refreshSelectedUploaderCounts()
  loadDatabaseList()
}

const backToUploaderSummary = () => {
  selectedUploader.value = null
  uploaderDetailStatus.value = ''
  listDataMode.value = 'uploaderSummary'
  currentPage.value = 1
}

const setUploaderDetailStatus = (status) => {
  uploaderDetailStatus.value = status
  currentPage.value = 1
  loadDatabaseList()
}

const setDatabaseStatusFilter = (status) => {
  databaseStatusFilter.value = status
  currentPage.value = 1
  loadDatabaseList()
}

const onDatabaseDateScopeChange = () => {
  currentPage.value = 1
  loadDatabaseList()
}

const loadDatabaseList = async () => {
  if (listDataMode.value === 'database' && !canViewAllDatabase.value) return
  if (listDataMode.value === 'uploaderDetail' && !canViewUploaderStats.value) return
  if (!canManageDatabaseList.value) return
  databaseListLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: databaseKeyword.value.trim()
    }
    if (listDataMode.value === 'uploaderDetail' && selectedUploader.value) {
      params.createdBy = selectedUploader.value.uploader_id
      params.dateScope = uploaderDateScope.value
      if (uploaderDetailStatus.value) {
        params.status = uploaderDetailStatus.value
      }
    } else if (listDataMode.value === 'database') {
      if (databaseStatusFilter.value) {
        params.status = databaseStatusFilter.value
      }
      if (databaseDateScope.value) {
        params.dateScope = databaseDateScope.value
      }
    }

    const response = await customerDataCompareAPI.getDatabaseList(params)
    if (response.success) {
      databaseList.value = response.data || []
      databaseTotal.value = response.pagination?.total || 0
    } else {
      ElMessage.error({ message: response.message || '获取数据列表失败', duration: 2000 })
    }
  } catch (error) {
    console.error('获取数据列表失败:', error)
    ElMessage.error({ message: '获取数据列表失败', duration: 2000 })
  } finally {
    databaseListLoading.value = false
  }
}

const uploaderDetailStatusTabs = computed(() => {
  const row = selectedUploader.value
  if (!row) return []
  return [
    { label: '全部', value: '', count: row.total_count, activeClass: 'bg-purple-500/30 text-purple-300 border-purple-500/50' },
    { label: '数据', value: 'active', count: row.active_count, activeClass: 'bg-blue-500/30 text-blue-300 border-blue-500/50' },
    { label: '意向客户', value: 'inactive', count: row.inactive_count, activeClass: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' },
    { label: '进群客户', value: 'vip', count: row.vip_count, activeClass: 'bg-green-500/30 text-green-300 border-green-500/50' }
  ]
})

const databaseStatusTabs = [
  { label: '全部', value: '', activeClass: 'bg-purple-500/30 text-purple-300 border-purple-500/50' },
  { label: '数据', value: 'active', activeClass: 'bg-blue-500/30 text-blue-300 border-blue-500/50' },
  { label: '意向客户', value: 'inactive', activeClass: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' },
  { label: '进群客户', value: 'vip', activeClass: 'bg-green-500/30 text-green-300 border-green-500/50' }
]

const activeTotalPages = computed(() => {
  if (listDataMode.value === 'upload') return totalPages.value
  if (listDataMode.value === 'compare') return totalResultPages.value
  if (listDataMode.value === 'uploaderDetail' || listDataMode.value === 'database') {
    return Math.max(1, Math.ceil(databaseTotal.value / pageSize.value))
  }
  return 1
})

const paginationTotal = computed(() => {
  if (listDataMode.value === 'upload') return customerList.value.length
  if (listDataMode.value === 'compare') return compareResults.value?.results?.length || 0
  if (listDataMode.value === 'uploaderDetail' || listDataMode.value === 'database') return databaseTotal.value
  return 0
})

const paginationStart = computed(() => {
  if (paginationTotal.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, paginationTotal.value)
})

const showListPagination = computed(() => {
  if (listDataMode.value === 'uploaderSummary') return false
  return paginationTotal.value > 0
})

const getStatusCount = (status) => {
  return databaseStats.value.statusCounts?.[status] ?? 0
}

const selectedCompareScopeLabels = computed(() => {
  return compareScopeOptions
    .filter(option => selectedCompareScopes.value.includes(option.value))
    .map(option => option.label)
})

const normalizeImportStatus = (status) => {
  const normalized = getCustomerStatusText(status)
  return importStatusOptions.includes(normalized) ? normalized : '数据'
}

const applyDefaultStatusToAll = () => {
  if (customerList.value.length === 0) {
    ElMessage.warning({ message: '没有可修改的数据', duration: 2000 })
    return
  }
  customerList.value.forEach(customer => {
    customer.status = defaultImportStatus.value
  })
  ElMessage.success({ message: `已将 ${customerList.value.length} 条数据状态设为「${defaultImportStatus.value}」`, duration: 2000 })
}

const applyDefaultStatusToNewResults = () => {
  if (!compareResults.value?.results) {
    ElMessage.warning({ message: '没有对比结果', duration: 2000 })
    return
  }
  let count = 0
  compareResults.value.results.forEach(result => {
    if (!result.isDuplicate) {
      result.status = defaultImportStatus.value
      count++
    }
  })
  ElMessage.success({ message: `已将 ${count} 条新增数据状态设为「${defaultImportStatus.value}」`, duration: 2000 })
}

const collectDuplicateMatchedCustomers = () => {
  const customerMap = new Map()
  const comparePhoneMap = {}

  if (!compareResults.value?.results) {
    return { ids: [], comparePhoneMap }
  }

  compareResults.value.results.forEach(result => {
    if (!result.isDuplicate || !Array.isArray(result.matchedCustomers)) return
    result.matchedCustomers.forEach(match => {
      if (!match?.id) return
      if (!customerMap.has(match.id)) {
        customerMap.set(match.id, match)
        comparePhoneMap[match.id] = result.phone || match.phone || ''
      }
    })
  })

  return {
    ids: Array.from(customerMap.keys()),
    comparePhoneMap
  }
}

const mergeUpdatedMatchedCustomers = (updatedCustomers = []) => {
  if (!compareResults.value?.results || updatedCustomers.length === 0) return

  const updatedMap = new Map(updatedCustomers.map(customer => [customer.id, customer]))
  compareResults.value.results.forEach(result => {
    if (!Array.isArray(result.matchedCustomers)) return
    let firstUpdatedStatus = ''

    result.matchedCustomers = result.matchedCustomers.map(match => {
      const updated = updatedMap.get(match.id)
      if (!updated) return match
      if (!firstUpdatedStatus) firstUpdatedStatus = updated.status
      return {
        ...match,
        ...updated,
        created_by_user: match.created_by_user || updated.created_by_user
      }
    })

    if (firstUpdatedStatus) {
      result.status = firstUpdatedStatus
      result.duplicateReason = `数据库已有相同号码，状态已改为：${getCustomerStatusText(firstUpdatedStatus)}`
    }
  })
}

const bulkUpdateDuplicateStatus = async (customerIds = null, comparePhone = '') => {
  if (!compareResults.value?.results) {
    ElMessage.warning({ message: '没有对比结果', duration: 2000 })
    return
  }

  let ids = []
  let comparePhoneMap = {}

  if (Array.isArray(customerIds) && customerIds.length > 0) {
    ids = [...new Set(customerIds.filter(Boolean))]
    ids.forEach(id => {
      comparePhoneMap[id] = comparePhone || ''
    })
  } else {
    const collected = collectDuplicateMatchedCustomers()
    ids = collected.ids
    comparePhoneMap = collected.comparePhoneMap
  }

  if (ids.length === 0) {
    ElMessage.warning({ message: '没有可修改的重复客户', duration: 2000 })
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要将 ${ids.length} 条重复客户状态批量修改为「${duplicateStatusTarget.value}」吗？\n\n系统会记录本次修改人和修改时间。`,
      '批量修改重复客户状态',
      {
        confirmButtonText: '确认修改',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  updatingDuplicateStatus.value = true
  try {
    const response = await customerDataCompareAPI.bulkUpdateDuplicateStatus({
      customerIds: ids,
      status: duplicateStatusTarget.value,
      comparePhoneMap,
      note: '数据库对比页面修改重复客户状态'
    })

    if (response.success) {
      mergeUpdatedMatchedCustomers(response.data?.customers || [])
      await loadDatabaseStats()
      ElMessage.success({ message: response.message || '状态修改成功', duration: 3000 })
      if (response.data?.historySkipped) {
        ElMessage.warning({ message: '状态已修改，但修改人记录写入失败（请检查后端 SUPABASE_SERVICE_KEY / RLS）', duration: 5000 })
      }
    } else {
      ElMessage.error({ message: response.message || '状态修改失败', duration: 3000 })
    }
  } catch (error) {
    ElMessage.error({ message: error?.response?.data?.message || error.message || '状态修改失败', duration: 3000 })
  } finally {
    updatingDuplicateStatus.value = false
  }
}

const deleteAllDatabaseCustomers = async () => {
  const scopeLabels = selectedCompareScopeLabels.value
  const scopeStatuses = selectedCompareScopes.value.length > 0
    ? [...selectedCompareScopes.value]
    : null
  const scopeText = scopeStatuses
    ? `所选范围：${scopeLabels.join('、')}`
    : '全部客户数据'

  try {
    await ElMessageBox.confirm(
      `此操作将永久删除数据库中的客户数据（${scopeText}），且不可恢复。\n\n当前数据库共 ${databaseStats.value.totalCustomers || 0} 条记录。\n\n确定要继续吗？`,
      '危险操作：删除客户数据',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await ElMessageBox.prompt(
      '请输入「删除全部」以确认此操作',
      '二次确认',
      {
        confirmButtonText: '执行删除',
        cancelButtonText: '取消',
        inputPattern: /^删除全部$/,
        inputErrorMessage: '请输入「删除全部」'
      }
    )

    const response = await customerAPI.deleteAllCustomers(scopeStatuses)
    if (response.success) {
      ElMessage.success({ message: response.message || '客户数据已删除', duration: 3000 })
      compareResults.value = null
      listDataMode.value = canViewUploaderStats.value ? 'uploaderSummary' : 'upload'
      if (canViewUploaderStats.value) {
        await loadUploaderSummary()
      }
      await loadDatabaseStats()
    } else {
      ElMessage.error({ message: response.message || '删除失败', duration: 3000 })
    }
  } catch (error) {
    if (error !== 'cancel' && error?.action !== 'cancel') {
      ElMessage.error({ message: error?.response?.data?.message || '删除失败', duration: 3000 })
    }
  }
}

const refreshCompareSummary = () => {
  if (!compareResults.value?.results) return
  const results = compareResults.value.results
  const duplicate = results.filter(r => r.isDuplicate).length
  const unique = results.length - duplicate
  compareResults.value.summary = {
    ...compareResults.value.summary,
    total: results.length,
    duplicate,
    unique,
    duplicateRate: results.length > 0 ? `${((duplicate / results.length) * 100).toFixed(2)}%` : '0%'
  }
}

const markImportedCustomersAsDuplicate = (importedCustomers) => {
  importedCustomers.forEach(customer => {
    customer.saved = true
    customer.isDuplicate = true
    customer.duplicateReason = '已导入数据库（刚刚上传）'
    customer.matchedCustomers = customer.matchedCustomers || []
  })
  refreshCompareSummary()
}

const normalizeCompareResultStatuses = (results = []) => {
  results.forEach(result => {
    if (!result.isDuplicate) {
      result.status = normalizeImportStatus(result.status)
    }
  })
}

const downloadTemplate = () => {
  // 创建模板数据
  const templateData = [
    ['姓名', '电话', '邮箱', '公司', '地址', '状态', '备注'],
    ['张三', '13800138000', 'zhangsan@example.com', '示例公司', '北京市朝阳区', '数据', '示例备注'],
    ['李四', '13900139000', 'lisi@example.com', '测试公司', '上海市浦东新区', '意向客户', ''],
    ['王五', '13700137000', '', '演示公司', '广州市天河区', '进群客户', '无邮箱']
  ]
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(templateData)
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // 姓名
    { wch: 15 }, // 电话
    { wch: 25 }, // 邮箱
    { wch: 20 }, // 公司
    { wch: 25 }, // 地址
    { wch: 12 }, // 状态
    { wch: 20 }  // 备注
  ]
  
  // 设置第一行样式（表头）
  const headerRange = XLSX.utils.decode_range(ws['!ref'])
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!ws[cellAddress]) continue
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  }
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '客户数据')
  
  // 下载文件
  XLSX.writeFile(wb, '客户数据导入模板.xlsx')
  
  ElMessage.success({message: '模板下载成功', duration: 2000})
}

// 下载新增客户数据
const downloadNewCustomers = () => {
  if (!compareResults.value || !compareResults.value.results) {
    ElMessage.warning({message: '没有可下载的数据', duration: 2000})
    return
  }
  
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate && formatPhoneNumber(r.phone))
  
  if (newCustomers.length === 0) {
    ElMessage.warning({message: '没有新增客户数据', duration: 2000})
    return
  }
  
  // 准备数据
  const data = [
    ['姓名', '电话', '邮箱', '公司', '地址', '客户状态', '对比状态', '备注']
  ]
  
  newCustomers.forEach((customer) => {
    data.push([
      customer.name || '',
      '',
      customer.email || '',
      customer.company || '',
      customer.address || '',
      getCustomerStatusText(customer.status) || '数据',
      '新增',
      customer.duplicateReason || ''
    ])
  })
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(data)

  newCustomers.forEach((customer, index) => {
    setWorksheetPhoneCell(ws, index + 1, 1, formatPhoneNumber(customer.phone))
  })
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // 姓名
    { wch: 15 }, // 电话
    { wch: 25 }, // 邮箱
    { wch: 20 }, // 公司
    { wch: 25 }, // 地址
    { wch: 12 }, // 客户状态
    { wch: 10 }, // 对比状态
    { wch: 30 }  // 备注
  ]
  
  // 设置表头样式
  const headerRange = XLSX.utils.decode_range(ws['!ref'])
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!ws[cellAddress]) continue
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '70AD47' } }, // 绿色表头
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  }
  
  // 设置数据行样式（新增数据用浅绿色背景）
  for (let row = 1; row <= newCustomers.length; row++) {
    for (let col = 0; col < 8; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
      if (ws[cellAddress]) {
        if (!ws[cellAddress].s) ws[cellAddress].s = {}
        ws[cellAddress].s.fill = { fgColor: { rgb: 'E2EFDA' } } // 浅绿色背景
      }
    }
  }
  
  XLSX.utils.book_append_sheet(wb, ws, '新增客户')
  
  // 生成文件名（包含时间戳）
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
  XLSX.writeFile(wb, `新增客户数据_${timestamp}.xlsx`)
  
  ElMessage.success({
    message: `成功下载 ${newCustomers.length} 条新增数据。这些数据尚未入库；若已点击「导入到数据库」，请勿再对比同一批号码。`,
    duration: 5000
  })
}

// 下载重复客户数据
const downloadDuplicates = () => {
  if (!compareResults.value || !compareResults.value.results) {
    ElMessage.warning({message: '没有可下载的数据', duration: 2000})
    return
  }
  
  const duplicates = compareResults.value.results.filter(r => r.isDuplicate)
  
  if (duplicates.length === 0) {
    ElMessage.warning({message: '没有重复客户数据', duration: 2000})
    return
  }
  
  // 准备数据
  const data = [
    ['姓名', '电话', '邮箱', '公司', '地址', '客户状态', '对比状态', '匹配信息', '匹配客户姓名', '匹配客户电话', '匹配客户邮箱', '创建者', '创建时间']
  ]
  
  duplicates.forEach(customer => {
    const firstMatch = customer.matchedCustomers && customer.matchedCustomers.length > 0 
      ? customer.matchedCustomers[0] 
      : null
    
    data.push([
      customer.name || '',
      customer.phone || '',
      customer.email || '',
      customer.company || '',
      customer.address || '',
      customer.status || '数据',
      '重复',
      customer.duplicateReason || '',
      firstMatch ? (firstMatch.name || '') : '',
      firstMatch ? (firstMatch.phone || '') : '',
      firstMatch ? (firstMatch.email || '') : '',
      firstMatch && firstMatch.created_by_user ? (firstMatch.created_by_user.name || '') : '',
      firstMatch && firstMatch.created_at ? formatDate(firstMatch.created_at) : ''
    ])
    
    // 如果有多个匹配，添加额外的行显示其他匹配
    if (customer.matchedCustomers && customer.matchedCustomers.length > 1) {
      for (let i = 1; i < customer.matchedCustomers.length; i++) {
        const match = customer.matchedCustomers[i]
        data.push([
          '', // 姓名留空
          '', // 电话留空
          '', // 邮箱留空
          '', // 公司留空
          '', // 地址留空
          '', // 客户状态留空
          '', // 对比状态留空
          `匹配记录 ${i + 1}`, // 匹配信息
          match.name || '',
          match.phone || '',
          match.email || '',
          match.created_by_user ? (match.created_by_user.name || '') : '',
          match.created_at ? formatDate(match.created_at) : ''
        ])
      }
    }
  })
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(data)
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // 姓名
    { wch: 15 }, // 电话
    { wch: 25 }, // 邮箱
    { wch: 20 }, // 公司
    { wch: 25 }, // 地址
    { wch: 12 }, // 客户状态
    { wch: 10 }, // 对比状态
    { wch: 30 }, // 匹配信息
    { wch: 15 }, // 匹配客户姓名
    { wch: 15 }, // 匹配客户电话
    { wch: 25 }, // 匹配客户邮箱
    { wch: 15 }, // 创建者
    { wch: 20 }  // 创建时间
  ]
  
  // 设置表头样式
  const headerRange = XLSX.utils.decode_range(ws['!ref'])
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!ws[cellAddress]) continue
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'C00000' } }, // 红色表头
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  }
  
    // 设置数据行样式（重复数据用浅红色背景）
    let currentRow = 1
    duplicates.forEach(customer => {
      for (let col = 0; col < 13; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: currentRow, c: col })
        if (ws[cellAddress]) {
          if (!ws[cellAddress].s) ws[cellAddress].s = {}
          ws[cellAddress].s.fill = { fgColor: { rgb: 'FFE6E6' } } // 浅红色背景
        }
      }
      currentRow++
      
      // 如果有多个匹配，其他匹配行用更浅的背景
      if (customer.matchedCustomers && customer.matchedCustomers.length > 1) {
        for (let i = 1; i < customer.matchedCustomers.length; i++) {
          for (let col = 0; col < 13; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: currentRow, c: col })
            if (ws[cellAddress]) {
              if (!ws[cellAddress].s) ws[cellAddress].s = {}
              ws[cellAddress].s.fill = { fgColor: { rgb: 'FFF2F2' } } // 更浅的红色背景
            }
          }
          currentRow++
        }
      }
    })
  
  XLSX.utils.book_append_sheet(wb, ws, '重复客户')
  
  // 生成文件名（包含时间戳）
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
  XLSX.writeFile(wb, `重复客户数据_${timestamp}.xlsx`)
  
  ElMessage.success({message: `成功下载 ${duplicates.length} 条重复客户数据`, duration: 2000})
}

// 下载全部结果（包含新增和重复两个工作表）
const downloadAllResults = () => {
  if (!compareResults.value || !compareResults.value.results) {
    ElMessage.warning({message: '没有可下载的数据', duration: 2000})
    return
  }
  
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate && formatPhoneNumber(r.phone))
  const duplicates = compareResults.value.results.filter(r => r.isDuplicate)
  
  const wb = XLSX.utils.book_new()
  
  // 新增客户工作表
  if (newCustomers.length > 0) {
    const newData = [
      ['姓名', '电话', '邮箱', '公司', '地址', '客户状态', '对比状态', '备注']
    ]
    
    newCustomers.forEach((customer) => {
      newData.push([
        customer.name || '',
        '',
        customer.email || '',
        customer.company || '',
        customer.address || '',
        customer.status || '数据',
        '新增',
        customer.duplicateReason || ''
      ])
    })
    
    const wsNew = XLSX.utils.aoa_to_sheet(newData)

    newCustomers.forEach((customer, index) => {
      setWorksheetPhoneCell(wsNew, index + 1, 1, formatPhoneNumber(customer.phone))
    })
    wsNew['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 30 }
    ]
    
    // 设置表头样式
    const headerRange = XLSX.utils.decode_range(wsNew['!ref'])
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (wsNew[cellAddress]) {
        wsNew[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '70AD47' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      }
    }
    
    XLSX.utils.book_append_sheet(wb, wsNew, '新增客户')
  }
  
  // 重复客户工作表
  if (duplicates.length > 0) {
    const dupData = [
      ['姓名', '电话', '邮箱', '公司', '地址', '客户状态', '对比状态', '匹配信息', '匹配客户姓名', '匹配客户电话', '匹配客户邮箱', '创建者', '创建时间']
    ]
    
    duplicates.forEach(customer => {
      const firstMatch = customer.matchedCustomers && customer.matchedCustomers.length > 0 
        ? customer.matchedCustomers[0] 
        : null
      
      dupData.push([
        customer.name || '',
        customer.phone || '',
        customer.email || '',
        customer.company || '',
        customer.address || '',
        customer.status || '数据',
        '重复',
        customer.duplicateReason || '',
        firstMatch ? (firstMatch.name || '') : '',
        firstMatch ? (firstMatch.phone || '') : '',
        firstMatch ? (firstMatch.email || '') : '',
        firstMatch && firstMatch.created_by_user ? (firstMatch.created_by_user.name || '') : '',
        firstMatch && firstMatch.created_at ? formatDate(firstMatch.created_at) : ''
      ])
      
      // 如果有多个匹配，添加额外的行
      if (customer.matchedCustomers && customer.matchedCustomers.length > 1) {
        for (let i = 1; i < customer.matchedCustomers.length; i++) {
          const match = customer.matchedCustomers[i]
          dupData.push([
            '', '', '', '', '', '', '', `匹配记录 ${i + 1}`,
            match.name || '',
            match.phone || '',
            match.email || '',
            match.created_by_user ? (match.created_by_user.name || '') : '',
            match.created_at ? formatDate(match.created_at) : ''
          ])
        }
      }
    })
    
    const wsDup = XLSX.utils.aoa_to_sheet(dupData)
    wsDup['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 10 }, 
      { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }
    ]
    
    // 设置表头样式
    const headerRange = XLSX.utils.decode_range(wsDup['!ref'])
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (wsDup[cellAddress]) {
        wsDup[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: 'C00000' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      }
    }
    
    XLSX.utils.book_append_sheet(wb, wsDup, '重复客户')
  }
  
  // 生成文件名（包含时间戳）
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
  XLSX.writeFile(wb, `客户数据对比结果_${timestamp}.xlsx`)
  
  ElMessage.success({
    message: `成功下载全部结果：${newCustomers.length} 条新增，${duplicates.length} 条重复`, 
    duration: 3000
  })
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadedFileName.value = file.name
  
  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { raw: false, defval: '' })
    
    customerList.value = jsonData.map(row => ({
      _rowId: createRowId(),
      name: row['姓名'] || row['name'] || row['Name'] || '',
      phone: formatPhoneNumber(row['电话'] || row['phone'] || row['Phone'] || ''),
      email: row['邮箱'] || row['email'] || row['Email'] || '',
      company: row['公司'] || row['company'] || row['Company'] || '',
      address: row['地址'] || row['address'] || row['Address'] || '',
      status: normalizeImportStatus(row['客户状态'] || row['状态'] || row['status'] || row['Status'] || defaultImportStatus.value),
      notes: row['备注'] || row['notes'] || row['Notes'] || ''
    })).filter(c => c.name || c.phone || c.email) // 过滤空行
    
    ElMessage.success({message: `成功加载 ${customerList.value.length} 条数据`, duration: 2000})
  } catch (error) {
    console.error('文件解析失败:', error)
    ElMessage.error({message: '文件解析失败，请检查文件格式', duration: 2000})
  }
}

const addNewRow = () => {
  customerList.value.push({
    _rowId: createRowId(),
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    status: defaultImportStatus.value,
    notes: ''
  })
}

const removeRow = (index) => {
  customerList.value.splice(index, 1)
  // 如果删除后当前页没有数据，回到上一页
  if (paginatedCustomerList.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
}

const removeRowByIndex = (index) => {
  removeRow(index)
}

// 分批对比，避免一次性发送大量数据导致超时
const startCompare = async () => {
  if (customerList.value.length === 0) {
    ElMessage.warning({message: '请先输入或上传客户数据', duration: 2000})
    return
  }

  if (selectedCompareScopes.value.length === 0) {
    ElMessage.warning({message: '请至少选择一种客户类型进行对比', duration: 2000})
    return
  }
  
  // 过滤有效数据（至少要有电话号码），并统一格式化电话号码
  const validCustomers = customerList.value
    .map(c => ({
      ...c,
      phone: formatPhoneNumber(c.phone)
    }))
    .filter(c => c.phone && c.phone.length > 0)
  
  if (validCustomers.length === 0) {
    ElMessage.warning({message: '没有有效的客户数据（需要电话号码）', duration: 2000})
    return
  }
  
  comparing.value = true
  const compareStatuses = [...selectedCompareScopes.value]
  
  try {
    console.log('开始分批对比，总数据量:', validCustomers.length)
    console.log('对比范围:', compareStatuses)
    console.log('前3条电话号码示例:', validCustomers.slice(0, 3).map(c => ({原始: c.phone, 格式化后: c.phone})))
    
    // 只发送必要的字段，减少请求体大小
    const customerDataToSend = validCustomers.map(c => ({
      name: c.name || '',
      phone: c.phone, // 已经格式化过的电话号码
      email: c.email || '',
      company: c.company || '',
      status: normalizeImportStatus(c.status || defaultImportStatus.value)
    }))
    
    // 如果数据量小于5万条，直接一次性对比
    if (customerDataToSend.length <= 50000) {
      console.log('数据量较小，直接对比')
      const response = await customerDataCompareAPI.batchCheck(customerDataToSend, compareStatuses)
      
      if (response && response.success) {
        normalizeCompareResultStatuses(response.data.results)
        compareResults.value = response.data
        compareResults.value.compareStatuses = compareStatuses
        listDataMode.value = 'compare'
        currentPage.value = 1
        ElMessage.success({message: `对比完成：发现 ${response.data.summary.duplicate} 条重复，${response.data.summary.unique} 条新客户`, duration: 3000})
      } else {
        const errorMsg = response?.message || response?.error || '对比失败'
        ElMessage.error({message: errorMsg, duration: 3000})
      }
      return
    }
    
    // 大数据量：分批对比
    const batchSize = 50000 // 每批5万条
    const totalBatches = Math.ceil(customerDataToSend.length / batchSize)
    const allResults = []
    let totalDuplicate = 0
    let totalUnique = 0
    
    // 初始化进度状态
    compareProgress.value = {
      currentBatch: 0,
      totalBatches: totalBatches,
      currentBatchSize: 0,
      totalRecords: customerDataToSend.length
    }
    
    console.log(`开始分批对比，共 ${totalBatches} 批，每批 ${batchSize} 条`)
    
    // 分批处理
    for (let i = 0; i < customerDataToSend.length; i += batchSize) {
      const batch = customerDataToSend.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      
      try {
        // 更新进度状态（响应式更新）
        compareProgress.value.currentBatch = batchNum
        compareProgress.value.currentBatchSize = batch.length
        
        console.log(`对比第 ${batchNum}/${totalBatches} 批，${batch.length} 条数据`)
        
        const response = await customerDataCompareAPI.batchCheck(batch, compareStatuses)
        
        if (response && response.success) {
          // 合并结果
          allResults.push(...response.data.results)
          totalDuplicate += response.data.summary.duplicate || 0
          totalUnique += response.data.summary.unique || 0
          
          console.log(`第 ${batchNum} 批完成: 重复 ${response.data.summary.duplicate}，新增 ${response.data.summary.unique}`)
        } else {
          const errorMsg = response?.message || response?.error || '对比失败'
          console.error(`第 ${batchNum} 批失败:`, errorMsg)
          // 即使某批失败，也继续处理其他批次
          // 为失败的批次创建占位结果
          batch.forEach(customer => {
            allResults.push({
              ...customer,
              isDuplicate: false,
              duplicateReason: '对比失败',
              matchedCustomers: []
            })
          })
        }
      } catch (error) {
        console.error(`第 ${batchNum} 批异常:`, error)
        // 为失败的批次创建占位结果
        batch.forEach(customer => {
          allResults.push({
            ...customer,
            isDuplicate: false,
            duplicateReason: '对比失败: ' + (error.message || '网络错误'),
            matchedCustomers: []
          })
        })
      }
      
      // 每批之间稍作延迟，避免服务器压力过大
      if (i + batchSize < customerDataToSend.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    // 重置进度状态
    compareProgress.value = {
      currentBatch: 0,
      totalBatches: 0,
      currentBatchSize: 0,
      totalRecords: 0
    }
    
    normalizeCompareResultStatuses(allResults)
    
    // 合并所有结果
    compareResults.value = {
      results: allResults,
      compareStatuses,
      summary: {
        total: allResults.length,
        duplicate: totalDuplicate,
        unique: totalUnique,
        duplicateRate: allResults.length > 0 ? ((totalDuplicate / allResults.length) * 100).toFixed(2) + '%' : '0%',
        compareStatuses,
        duration: '分批处理',
        comparisonMethod: 'batch_compare'
      }
    }
    
    // 自动切换到对比结果视图
    listDataMode.value = 'compare'
    currentPage.value = 1
    
    ElMessage.success({
      message: `对比完成：发现 ${totalDuplicate} 条重复，${totalUnique} 条新客户（共 ${totalBatches} 批）`,
      duration: 5000
    })
    
  } catch (error) {
    console.error('对比失败，异常:', error)
    console.error('错误详情:', error.response?.data || error.message)
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || '对比失败'
    ElMessage.error({message: `对比失败: ${errorMsg}`, duration: 5000})
  } finally {
    comparing.value = false
  }
}

// 保存新增客户数据到数据库（分批处理，避免卡死）
const saveNewCustomersToDatabase = async () => {
  if (!compareResults.value || !compareResults.value.results) {
    ElMessage.warning({message: '没有可保存的数据', duration: 2000})
    return
  }
  
  // 获取所有新增（不重复）的客户数据
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate && formatPhoneNumber(r.phone))
  
  if (newCustomers.length === 0) {
    ElMessage.warning({message: '没有新增客户数据可保存', duration: 2000})
    return
  }
  
  // 确认操作
  try {
    await ElMessageBox.confirm(
      `确定要将 ${newCustomers.length} 条新增客户数据保存到数据库中吗？\n\n数据将分批上传，请耐心等待。`,
      '确认上传',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    // 用户取消
    return
  }
  
  saving.value = true
  
  try {
    // 优化：创建电话号码到原始数据的映射（一次性构建，避免重复查找）
    const phoneToOriginalMap = new Map()
    customerList.value.forEach(c => {
      const phone = formatPhoneNumber(c.phone)
      if (phone) {
        phoneToOriginalMap.set(phone, c)
      }
    })
    
    // 优化：快速准备数据，使用Map查找而不是数组find（O(1) vs O(n)）
    const customersToSave = []
    for (const customer of newCustomers) {
      const phone = formatPhoneNumber(customer.phone)
      if (!phone) continue
      
      const originalCustomer = phoneToOriginalMap.get(phone)
      
      customersToSave.push({
        name: customer.name || originalCustomer?.name || '', // 可以为空，后端会处理
        phone: phone, // 必填
        email: customer.email || originalCustomer?.email || '', // 可以为空
        company: customer.company || originalCustomer?.company || '', // 可以为空
        address: originalCustomer?.address || '', // 可以为空
        status: normalizeImportStatus(customer.status || originalCustomer?.status || defaultImportStatus.value),
        notes: originalCustomer?.notes || '' // 可以为空
      })
    }
    
    const compareStatuses = compareResults.value.compareStatuses
      || compareResults.value.summary?.compareStatuses
      || [...selectedCompareScopes.value]
    
    console.log('准备保存客户数据:', customersToSave.length, '条')
    console.log('保存时对比范围:', compareStatuses)
    
    // 分批上传，每批5万条，避免一次性发送导致卡死
    const batchSize = 50000
    const totalBatches = Math.ceil(customersToSave.length / batchSize)
    let totalSuccess = 0
    let totalFailed = 0
    let totalDuplicate = 0
    let totalInvalid = 0
    const allErrors = []
    
    // 初始化进度状态
    uploadProgress.value = {
      currentBatch: 0,
      totalBatches: totalBatches,
      currentBatchSize: 0,
      totalRecords: customersToSave.length,
      totalSuccess: 0,
      totalFailed: 0
    }
    
    // 分批处理
    for (let i = 0; i < customersToSave.length; i += batchSize) {
      const batch = customersToSave.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      
      try {
        // 更新进度状态（响应式更新）
        uploadProgress.value.currentBatch = batchNum
        uploadProgress.value.currentBatchSize = batch.length
        
        console.log(`上传第 ${batchNum}/${totalBatches} 批，${batch.length} 条数据`)
        
        const response = await customerDataCompareAPI.saveNewCustomers(batch, compareStatuses)
        
        if (response && response.success) {
          const { success, failed, duplicate, invalid, errors } = response.data
          totalSuccess += success || 0
          totalFailed += failed || 0
          totalDuplicate += duplicate || 0
          totalInvalid += invalid || 0
          
          // 更新进度统计
          uploadProgress.value.totalSuccess = totalSuccess
          uploadProgress.value.totalFailed = totalFailed
          
          if (errors && errors.length > 0) {
            allErrors.push(...errors)
          }
          
          console.log(`第 ${batchNum} 批完成: 成功 ${success}，失败 ${failed}，重复 ${duplicate}，无效 ${invalid}`)
        } else {
          const errorMsg = response?.message || response?.error || '保存失败'
          console.error(`第 ${batchNum} 批失败:`, errorMsg)
          totalFailed += batch.length
          allErrors.push({
            batch: batchNum,
            error: errorMsg,
            count: batch.length
          })
        }
      } catch (error) {
        console.error(`第 ${batchNum} 批异常:`, error)
        totalFailed += batch.length
        allErrors.push({
          batch: batchNum,
          error: error.message || String(error),
          count: batch.length
        })
      }
      
      // 每批之间稍作延迟，避免服务器压力过大
      if (i + batchSize < customersToSave.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    // 重置进度状态
    uploadProgress.value = {
      currentBatch: 0,
      totalBatches: 0,
      currentBatchSize: 0,
      totalRecords: 0,
      totalSuccess: 0,
      totalFailed: 0
    }
    
    // 显示最终结果
    let message = `批量上传完成：成功 ${totalSuccess} 条`
    if (totalFailed > 0) {
      message += `，失败 ${totalFailed} 条`
      if (allErrors.length > 0) {
        const firstError = allErrors[0]
        const errorText = firstError.error || firstError.errorDetails || '未知错误'
        message += `\n第一个错误: ${errorText}`
      }
    }
    if (totalDuplicate > 0) {
      message += `，重复 ${totalDuplicate} 条`
    }
    if (totalInvalid > 0) {
      message += `，无效 ${totalInvalid} 条`
    }
    
    if (totalSuccess > 0) {
      ElMessage.success({
        message: `${message}\n\n数据已写入数据库。若再次上传相同号码对比，会显示为「重复」，这是正常现象。`,
        duration: 6000
      })
      try {
        await customerDataCompareAPI.recordUploadSession({
          fileName: uploadedFileName.value,
          totalSubmitted: customersToSave.length,
          successCount: totalSuccess,
          failedCount: totalFailed,
          duplicateCount: totalDuplicate,
          invalidCount: totalInvalid,
          compareStatuses,
          defaultStatus: defaultImportStatus.value
        })
      } catch (logError) {
        console.warn('保存上传批次记录失败:', logError)
      }

      markImportedCustomersAsDuplicate(newCustomers)
    } else {
      ElMessage.warning({ message, duration: 5000 })
    }
    
    // 刷新数据库统计信息
    await loadDatabaseStats()
    if (canViewUploaderStats.value && listDataMode.value === 'uploaderSummary') {
      await loadUploaderSummary()
    }
    
  } catch (error) {
    console.error('保存失败，异常:', error)
    console.error('错误响应:', error.response?.data)
    console.error('错误堆栈:', error.stack)
    
    let errorMsg = '保存失败'
    if (error.response?.data) {
      errorMsg = error.response.data.error || error.response.data.message || errorMsg
      if (error.response.data.errors && error.response.data.errors.length > 0) {
        const firstError = error.response.data.errors[0]
        errorMsg += `: ${firstError.error || firstError.errorDetails || ''}`
      }
    } else if (error.message) {
      errorMsg = error.message
    }
    
    ElMessage.error({message: `保存失败: ${errorMsg}`, duration: 5000})
  } finally {
    saving.value = false
  }
}

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(customerList.value.length / pageSize.value)
})

const paginatedCustomerList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return customerList.value.slice(start, end)
})

const paginatedCompareResults = computed(() => {
  if (!compareResults.value || !compareResults.value.results) {
    return []
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return compareResults.value.results.slice(start, end)
})

const totalResultPages = computed(() => {
  if (!compareResults.value || !compareResults.value.results) {
    return 1
  }
  return Math.ceil(compareResults.value.results.length / pageSize.value)
})

let rowIdSeq = 0
const createRowId = () => `row-${Date.now()}-${++rowIdSeq}`

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (error) {
    return dateString
  }
}

// 将数据库状态值转换为中文显示
const getCustomerStatusText = (status) => {
  const statusMap = {
    active: '数据',
    inactive: '意向客户',
    vip: '进群客户',
    // 兼容旧数据和中文状态值
    data: '数据',
    group: '进群客户',
    '数据': '数据',
    '意向客户': '意向客户',
    '进群客户': '进群客户'
  }
  return statusMap[status] || '数据'
}

// 获取状态样式类
const getCustomerStatusClass = (status) => {
  const statusMap = {
    active: 'bg-blue-500/20 text-blue-400',
    inactive: 'bg-yellow-500/20 text-yellow-400',
    vip: 'bg-green-500/20 text-green-400',
    // 兼容旧数据和中文状态值
    data: 'bg-blue-500/20 text-blue-400',
    group: 'bg-green-500/20 text-green-400',
    '数据': 'bg-blue-500/20 text-blue-400',
    '意向客户': 'bg-yellow-500/20 text-yellow-400',
    '进群客户': 'bg-green-500/20 text-green-400'
  }
  return statusMap[status] || 'bg-blue-500/20 text-blue-400'
}

// 监听数据变化，重置到第一页
watch(() => customerList.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// 监听视图切换，重置到第一页
watch(() => listDataMode.value, () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  if (listDataMode.value === 'uploaderDetail' || listDataMode.value === 'database') {
    loadDatabaseList()
  }
})

onMounted(() => {
  loadDatabaseStats()
  if (canViewUploaderStats.value) {
    listDataMode.value = 'uploaderSummary'
    loadUploaderSummary()
    loadBackfillUserOptions()
  } else {
    addNewRow()
  }
})
</script>
