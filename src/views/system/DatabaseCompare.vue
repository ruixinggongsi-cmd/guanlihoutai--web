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
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white mb-2">底料数据库</h2>
            <p class="text-gray-400">当前数据库中的客户记录总数</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-blue-400">{{ databaseStats.totalCustomers || 0 }}</div>
            <div class="text-sm text-gray-400">条客户记录</div>
          </div>
        </div>
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
                对比规则：通过电话号码与底料数据库进行对比
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
                :disabled="customerList.length === 0 || comparing"
                class="px-8 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg"
              >
                <i v-if="comparing" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-search"></i>
                <span>{{ comparing ? '对比中...' : `开始对比 (${customerList.length}条)` }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 数据列表 / 对比结果切换 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-4">
              <h3 class="text-lg font-semibold text-white">
                <span v-if="!compareResults">数据列表</span>
                <span v-else>对比结果</span>
              </h3>
              <div class="flex items-center space-x-2">
                <button 
                  @click="showInputData = true"
                  :class="showInputData ? 'bg-blue-500/30 text-blue-400' : 'bg-white/5 text-gray-400'"
                  class="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300 text-sm"
                >
                  <i class="fas fa-table mr-2"></i>
                  数据列表
                </button>
                <button 
                  @click="showInputData = false"
                  :disabled="!compareResults"
                  :class="!showInputData && compareResults ? 'bg-green-500/30 text-green-400' : 'bg-white/5 text-gray-400'"
                  class="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-check-circle mr-2"></i>
                  对比结果
                  <span v-if="compareResults" class="ml-2 text-xs">({{ compareResults.summary?.duplicate || 0 }}重复 / {{ compareResults.summary?.unique || 0 }}新增)</span>
                </button>
              </div>
            </div>
            <div v-if="showInputData" class="flex items-center space-x-3">
              <span class="text-sm text-gray-400">共 {{ customerList.length }} 条</span>
              <select 
                v-model="pageSize"
                @change="currentPage = 1"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option :value="50" class="bg-slate-800">每页 50 条</option>
                <option :value="100" class="bg-slate-800">每页 100 条</option>
                <option :value="500" class="bg-slate-800">每页 500 条</option>
                <option :value="1000" class="bg-slate-800">每页 1000 条</option>
              </select>
              <button 
                @click="addNewRow"
                class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <i class="fas fa-plus"></i>
                <span>添加行</span>
              </button>
            </div>
            <div v-else-if="compareResults" class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                重复: {{ compareResults.summary?.duplicate || 0 }}
              </span>
              <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                新增: {{ compareResults.summary?.unique || 0 }}
              </span>
              <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                重复率: {{ compareResults.summary?.duplicateRate || '0%' }}
              </span>
              <button 
                @click="downloadNewCustomers"
                :disabled="!compareResults || compareResults.summary?.unique === 0"
                class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载新增数据</span>
              </button>
              <button 
                @click="downloadDuplicates"
                :disabled="!compareResults || compareResults.summary?.duplicate === 0"
                class="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载重复数据</span>
              </button>
              <button 
                @click="downloadAllResults"
                :disabled="!compareResults"
                class="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-download"></i>
                <span>下载全部结果</span>
              </button>
              <button 
                @click="saveNewCustomersToDatabase"
                :disabled="!compareResults || !compareResults.summary || Number(compareResults.summary?.unique || 0) === 0 || saving"
                class="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-upload" v-if="!saving"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ saving ? '上传中...' : '上传新增数据到数据库' }}</span>
              </button>
            </div>
          </div>
          
          <!-- 数据输入表格 -->
          <div v-if="showInputData" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">电话</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">公司</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">地址</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr 
                  v-for="(customer, index) in paginatedCustomerList" 
                  :key="getCustomerKey(customer, index)"
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
                    <button 
                      @click="removeRowByIndex((currentPage - 1) * pageSize + index)"
                      class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="customerList.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                    <i class="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                    <p>暂无数据，请上传文件或手动输入</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 对比结果表格 -->
          <div v-else-if="compareResults" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/5 border-b border-white/20">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">电话</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">公司</th>
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
                    <div v-if="result.isDuplicate && result.matchedCustomers.length > 0" class="space-y-2">
                      <div 
                        v-for="(match, idx) in result.matchedCustomers.slice(0, 3)" 
                        :key="idx"
                        class="text-xs"
                      >
                        <div class="text-yellow-400 mb-1">
                          <i class="fas fa-link mr-1"></i>
                          {{ match.name }} ({{ match.phone }}) 
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
          <div v-if="(showInputData && customerList.length > 0) || (!showInputData && compareResults && compareResults.results.length > 0)" class="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
            <div class="text-sm text-gray-400">
              显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, showInputData ? customerList.length : (compareResults?.results?.length || 0)) }} 条，共 {{ showInputData ? customerList.length : (compareResults?.results?.length || 0) }} 条
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
                第 {{ currentPage }} / {{ showInputData ? totalPages : totalResultPages }} 页
              </span>
              <button 
                @click="currentPage++"
                :disabled="currentPage >= (showInputData ? totalPages : totalResultPages)"
                class="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-angle-right"></i>
              </button>
              <button 
                @click="currentPage = (showInputData ? totalPages : totalResultPages)"
                :disabled="currentPage >= (showInputData ? totalPages : totalResultPages)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

// 响应式数据
const customerList = ref([])
const comparing = ref(false)
const compareResults = ref(null)
const databaseStats = ref({ totalCustomers: 0 })
const saving = ref(false)
const uploadedFileName = ref('')
const currentPage = ref(1)
const pageSize = ref(100)
const showInputData = ref(true) // 控制显示数据输入还是对比结果

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

const downloadTemplate = () => {
  // 创建模板数据
  const templateData = [
    ['姓名', '电话', '邮箱', '公司', '地址', '备注'],
    ['张三', '13800138000', 'zhangsan@example.com', '示例公司', '北京市朝阳区', '示例备注'],
    ['李四', '13900139000', 'lisi@example.com', '测试公司', '上海市浦东新区', ''],
    ['王五', '13700137000', '', '演示公司', '广州市天河区', '无邮箱']
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
  
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate)
  
  if (newCustomers.length === 0) {
    ElMessage.warning({message: '没有新增客户数据', duration: 2000})
    return
  }
  
  // 准备数据
  const data = [
    ['姓名', '电话', '邮箱', '公司', '状态', '备注']
  ]
  
  newCustomers.forEach(customer => {
    data.push([
      customer.name || '',
      customer.phone || '',
      customer.email || '',
      customer.company || '',
      '新增',
      customer.duplicateReason || ''
    ])
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
    { wch: 10 }, // 状态
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
    for (let col = 0; col < 6; col++) {
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
  
  ElMessage.success({message: `成功下载 ${newCustomers.length} 条新增客户数据`, duration: 2000})
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
    ['姓名', '电话', '邮箱', '公司', '状态', '匹配信息', '匹配客户姓名', '匹配客户电话', '匹配客户邮箱', '创建者', '创建时间']
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
          '', // 状态留空
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
    { wch: 10 }, // 状态
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
      for (let col = 0; col < 11; col++) {
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
          for (let col = 0; col < 11; col++) {
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
  
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate)
  const duplicates = compareResults.value.results.filter(r => r.isDuplicate)
  
  const wb = XLSX.utils.book_new()
  
  // 新增客户工作表
  if (newCustomers.length > 0) {
    const newData = [
      ['姓名', '电话', '邮箱', '公司', '状态', '备注']
    ]
    
    newCustomers.forEach(customer => {
      newData.push([
        customer.name || '',
        customer.phone || '',
        customer.email || '',
        customer.company || '',
        '新增',
        customer.duplicateReason || ''
      ])
    })
    
    const wsNew = XLSX.utils.aoa_to_sheet(newData)
    wsNew['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 30 }
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
      ['姓名', '电话', '邮箱', '公司', '状态', '匹配信息', '匹配客户姓名', '匹配客户电话', '匹配客户邮箱', '创建者', '创建时间']
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
            '', '', '', '', '', `匹配记录 ${i + 1}`,
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
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, 
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
    const jsonData = XLSX.utils.sheet_to_json(firstSheet)
    
    // 转换为客户数据格式（支持中英文列名）
    customerList.value = jsonData.map(row => ({
      name: row['姓名'] || row['name'] || row['Name'] || '',
      phone: String(row['电话'] || row['phone'] || row['Phone'] || ''),
      email: row['邮箱'] || row['email'] || row['Email'] || '',
      company: row['公司'] || row['company'] || row['Company'] || '',
      address: row['地址'] || row['address'] || row['Address'] || '',
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
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
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
  
  // 过滤有效数据（至少要有电话号码）
  const validCustomers = customerList.value.filter(c => c.phone && String(c.phone).trim())
  
  if (validCustomers.length === 0) {
    ElMessage.warning({message: '没有有效的客户数据（需要电话号码）', duration: 2000})
    return
  }
  
  comparing.value = true
  
  try {
    console.log('开始分批对比，总数据量:', validCustomers.length)
    
    // 只发送必要的字段，减少请求体大小
    const customerDataToSend = validCustomers.map(c => ({
      name: c.name || '',
      phone: String(c.phone).trim(),
      email: c.email || '',
      company: c.company || ''
    }))
    
    // 如果数据量小于5万条，直接一次性对比
    if (customerDataToSend.length <= 50000) {
      console.log('数据量较小，直接对比')
      const response = await customerDataCompareAPI.batchCheck(customerDataToSend)
      
      if (response && response.success) {
        compareResults.value = response.data
        showInputData.value = false
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
        
        const response = await customerDataCompareAPI.batchCheck(batch)
        
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
    
    // 合并所有结果
    compareResults.value = {
      results: allResults,
      summary: {
        total: allResults.length,
        duplicate: totalDuplicate,
        unique: totalUnique,
        duplicateRate: allResults.length > 0 ? ((totalDuplicate / allResults.length) * 100).toFixed(2) + '%' : '0%',
        duration: '分批处理',
        comparisonMethod: 'batch_compare'
      }
    }
    
    // 自动切换到对比结果视图
    showInputData.value = false
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
  const newCustomers = compareResults.value.results.filter(r => !r.isDuplicate)
  
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
      const phone = String(c.phone || '').trim()
      if (phone) {
        phoneToOriginalMap.set(phone, c)
      }
    })
    
    // 优化：快速准备数据，使用Map查找而不是数组find（O(1) vs O(n)）
    const customersToSave = []
    for (const customer of newCustomers) {
      const phone = String(customer.phone || '').trim()
      if (!phone) continue
      
      const originalCustomer = phoneToOriginalMap.get(phone)
      
      customersToSave.push({
        name: customer.name || originalCustomer?.name || '', // 可以为空，后端会处理
        phone: phone, // 必填
        email: customer.email || originalCustomer?.email || '', // 可以为空
        company: customer.company || originalCustomer?.company || '', // 可以为空
        address: originalCustomer?.address || '', // 可以为空
        notes: originalCustomer?.notes || '' // 可以为空
      })
    }
    
    console.log('准备保存客户数据:', customersToSave.length, '条')
    
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
        
        const response = await customerDataCompareAPI.saveNewCustomers(batch)
        
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
      ElMessage.success({ message, duration: 5000 })
    } else {
      ElMessage.warning({ message, duration: 5000 })
    }
    
    // 刷新数据库统计信息
    await loadDatabaseStats()
    
    // 可选：标记已保存的数据
    newCustomers.forEach(customer => {
      customer.saved = true
    })
    
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

const getCustomerKey = (customer, index) => {
  // 使用唯一标识作为key，避免分页时的问题
  return customer.phone || customer.email || customer.name || `row-${(currentPage.value - 1) * pageSize.value + index}`
}

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

// 监听数据变化，重置到第一页
watch(() => customerList.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// 监听视图切换，重置到第一页
watch(() => showInputData.value, () => {
  currentPage.value = 1
})

onMounted(() => {
  loadDatabaseStats()
  // 添加一行空数据供用户输入
  addNewRow()
})
</script>
