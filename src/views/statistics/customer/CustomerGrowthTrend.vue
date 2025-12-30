<!-- 客户增长趋势统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-line mr-3 text-primary"></i>
          客户增长趋势统计
        </h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-400">分组方式:</label>
            <select
              :value="props.groupBy"
              @change="$emit('update:groupBy', $event.target.value)"
              class="px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            >
              <option value="day">按日</option>
              <option value="week">按周</option>
              <option value="month">按月</option>
              <option value="year">按年</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              <span>刷新</span>
            </button>
            <button
              @click="exportData"
              :disabled="!tableData || tableData.length === 0"
              class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-download"></i>
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="chart-container-wrapper">
        <!-- 图表加载状态 -->
        <div v-if="loading" class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center space-y-4">
            <div class="inline-block p-3 rounded-full bg-white/5 animate-pulse">
              <i class="fas fa-spinner fa-spin text-4xl"></i>
            </div>
            <p>图表加载中...</p>
          </div>
        </div>
        
        <!-- 图表错误状态 -->
        <div v-else-if="chartError" class="flex items-center justify-center h-full text-red-400">
          <div class="text-center space-y-4">
            <div class="inline-block p-3 rounded-full bg-red-500/10">
              <i class="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <p>{{ chartError }}</p>
            <button
              @click="refreshData"
              class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg transition-all duration-300"
            >
              重试
            </button>
          </div>
        </div>
        
        <!-- 空数据状态 -->
        <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center space-y-4">
            <div class="inline-block p-3 rounded-full bg-white/5">
              <i class="fas fa-inbox text-4xl opacity-50"></i>
            </div>
            <p class="text-lg">暂无数据</p>
            <p class="text-sm text-gray-500">请调整查询条件后重试</p>
          </div>
        </div>
        
        <!-- 图表容器 -->
        <div v-if="!loading" ref="chartRef" class="chart-container w-full h-full"></div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto data-table-wrapper">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">时间段</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">新增客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">累计客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">增长率</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">活跃客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">创建者</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  <i class="fas fa-calendar-alt mr-2 text-blue-400"></i>
                  {{ formatPeriod(item.period, item.timeDimension) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.newCustomers }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.totalCustomers }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm',
                  item.growthRate > 0 
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-400/30'
                    : item.growthRate < 0
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-400/30'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-400/30'
                ]">
                  <i :class="[
                    'mr-1',
                    item.growthRate > 0 ? 'fas fa-arrow-up text-red-400' : 
                    item.growthRate < 0 ? 'fas fa-arrow-down text-green-400' : 
                    'fas fa-minus text-gray-400'
                  ]"></i>
                  {{ item.growthRate > 0 ? '+' : '' }}{{ item.growthRate.toFixed(1) }}%
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ item.activeCustomers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-white font-medium text-sm">{{ item.creatorName }}</span>
                  <span class="text-gray-400 text-xs">{{ item.creatorDepartment }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <i class="fas fa-inbox text-4xl text-gray-500 opacity-50"></i>
                  <p class="text-lg">暂无数据</p>
                  <p class="text-sm text-gray-500">请调整查询条件后重试</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { getCustomerGrowthBySource } from '@/api/customerStatistics'
import { ElMessage } from 'element-plus'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  groupBy: {
    type: String,
    default: 'day'
  }
})

const emit = defineEmits(['error', 'loading', 'update:groupBy'])

const loading = ref(false)
const chartError = ref('')
const chartRef = ref(null)
let chartInstance = null

const chartData = ref([])
const tableData = ref([])
const total = ref(0)

// 初始化图表
const initChart = async () => {
  // 安全检查 - 只有当chartRef和DOM都可用时才初始化
  if (!chartRef.value) {
    console.error('图表容器未找到')
    return false
  }
  
  try {
    // 先处理已存在的实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    
    // 确保容器有实际尺寸
    const container = chartRef.value
    const rect = container.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      // 强制设置尺寸，确保图表能正确渲染
      container.style.width = '100%'
      container.style.height = '100%'
    }
    
    chartInstance = echarts.init(container)
    console.log('图表初始化成功')
    return true
  } catch (error) {
    console.error('图表初始化失败:', error)
    // 发生错误时清理实例
    if (chartInstance) {
      try { chartInstance.dispose(); } catch (e) {}
      chartInstance = null
    }
    return false
  }
}

// 获取图表配置
const getChartOption = (data) => {
  const trendData = Array.isArray(data) ? data : (data.data || [])
  
  // 按时间排序，适配新的数据格式
  const sortedData = trendData
    .map(item => ({
      period: item.period_date || item.period || item.time_period || item.timePeriod || '未知',
      newCustomers: parseInt(item.new_customers || item.newCustomers || 0),
      totalCustomers: parseInt(item.cumulative_customers || item.total_customers || item.totalCustomers || 0),
      activeCustomers: parseInt(item.active_customers || item.activeCustomers || 0),
      creatorName: item.creator_name || item.userName || '',
      creatorDepartment: item.creator_department || item.department || '',
      timeDimension: item.time_dimension || item.groupBy || 'month'
    }))
    .sort((a, b) => new Date(a.period) - new Date(b.period))
  
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0' },
      padding: 15,
      borderRadius: 8,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      formatter: function(params) {
        const item = params[0]
        const dataItem = sortedData[item.dataIndex]
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${item.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
              <span>新增客户: ${dataItem.newCustomers}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span>累计客户: ${dataItem.totalCustomers}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span>活跃客户: ${dataItem.activeCustomers}</span>
            </div>
          </div>
        `
      }
    },
    legend: {
      data: ['新增客户', '累计客户', '活跃客户'],
      textStyle: { 
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 500
      },
      top: 10,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      icon: 'circle'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
      backgroundColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => formatPeriod(item.period, item.timeDimension)),
      axisLine: { 
        lineStyle: { 
          color: 'rgba(148, 163, 184, 0.3)',
          width: 1
        } 
      },
      axisTick: {
        show: false
      },
      axisLabel: { 
        color: '#94a3b8', 
        fontSize: 11,
        rotate: sortedData.length > 12 ? 45 : 0,
        padding: [10, 0, 0, 0],
        interval: 0,
        formatter: function(value) {
          // 根据数据量调整显示内容
          if (props.groupBy === 'day' && sortedData.length > 30) {
            // 大数据量时只显示部分标签
            return value.slice(5)
          }
          return value
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '客户数量',
      nameTextStyle: { 
        color: '#94a3b8',
        fontSize: 11,
        padding: [0, 0, 0, 20]
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(148, 163, 184, 0.1)',
          type: 'dashed'
        } 
      },
      axisLabel: { 
        color: '#94a3b8', 
        fontSize: 11
      }
    },
    series: [
      {
        name: '新增客户',
        type: 'line',
        data: sortedData.map(item => item.newCustomers),
        smooth: true,
        lineStyle: {
          color: '#10b981',
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(16, 185, 129, 0.3)'
        },
        itemStyle: {
          color: '#10b981',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
            ]
          }
        }
      },
      {
        name: '累计客户',
        type: 'line',
        data: sortedData.map(item => item.totalCustomers),
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(59, 130, 246, 0.3)'
        },
        itemStyle: {
          color: '#3b82f6',
          borderWidth: 2,
          borderColor: '#fff'
        }
      },
      {
        name: '活跃客户',
        type: 'line',
        data: sortedData.map(item => item.activeCustomers),
        smooth: true,
        lineStyle: {
          color: '#8b5cf6',
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(139, 92, 246, 0.3)'
        },
        itemStyle: {
          color: '#8b5cf6',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }
    ]
  }
  
  return baseOption
}

// 更新图表
const updateChart = async (data) => {
  if (!chartInstance) {
    const initSuccess = await initChart()
    if (!initSuccess) {
      return false
    }
  }
  
  try {
    const option = getChartOption(data)
    chartInstance.setOption(option, true)
    console.log('图表更新成功')
    return true
  } catch (error) {
    console.error('图表更新失败:', error)
    return false
  }
}

// 计算环比增长率，使用累计客户数
const calculateGrowthRate = (data, index) => {
  if (index === 0) return 0
  
  const currentTotal = data[index].totalCustomers
  const previousTotal = data[index - 1].totalCustomers
  
  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0
  
  return ((currentTotal - previousTotal) / previousTotal) * 100
}

// 格式化时间段显示
const formatPeriod = (period, timeDimension) => {
  if (!period) return '未知'
  
  // 如果是月度数据且是完整日期格式，转换为年月显示
  if (timeDimension === 'month' && period.includes('-01') && period.length === 10) {
    return period.slice(0, 7) // 2025-06-01 -> 2025-06
  }
  
  return period
}

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) {
    return
  }
  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate
    }
    
    if (props.userName) {
      params.creatorName = props.userName // 使用creatorName匹配新的数据格式
    }
    
    console.log('客户增长趋势查询参数:', params)
    
    const res = await getCustomerGrowthBySource(params)
    
    console.log('API响应数据:', res)
    
    if (res.success) {
      const data = res.data || []
      console.log('获取到的原始数据:', data)
      console.log('数据长度:', data.length)
      
      // 如果没有数据，显示提示信息
      if (data.length === 0) {
        console.log('没有获取到任何数据！')
        loading.value = false
        return
      }
      
      chartData.value = data
      
      // 处理表格数据，适配新的数据格式
      console.log('开始处理表格数据，原始数据长度:', data.length)
      console.log('第一条数据示例:', data[0])
      
      tableData.value = Array.isArray(data) ? data.map((item, index) => {
        console.log(`处理第${index}条数据:`, item)
        return {
          id: `growth_${index}`,
          period: item.period_date || item.period || item.time_period || item.timePeriod || '未知',
          newCustomers: parseInt(item.new_customers || item.newCustomers || 0),
          totalCustomers: parseInt(item.cumulative_customers || item.total_customers || item.totalCustomers || 0),
          activeCustomers: parseInt(item.active_customers || item.activeCustomers || 0),
          creatorName: item.creator_name || item.userName || '',
          creatorDepartment: item.creator_department || item.department || '',
          timeDimension: item.time_dimension || item.groupBy || 'month',
          growthRate: 0 // 将在后续计算
        }
      }).sort((a, b) => new Date(b.period) - new Date(a.period)) : [] // 直接按日期降序排序（从新到旧）
      
      // 计算环比增长率
      tableData.value.forEach((item, index) => {
        item.growthRate = calculateGrowthRate(tableData.value, index)
      })
      console.log('排序后的表格数据:', tableData.value)
      console.log('表格数据处理完成，共', tableData.value.length, '条记录')

      // 使用增强的更新逻辑，包含重试机制
      await nextTick()
      let updateSuccess = false
      let retryCount = 0
      const maxRetries = 2
      
      while (!updateSuccess && retryCount < maxRetries) {
        retryCount++
        console.log(`尝试更新图表（第${retryCount}次）`)
        
        // 每次尝试前先等待DOM更新
        if (retryCount > 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
          await nextTick()
          
          // 如果是重试，先销毁现有实例
          if (chartInstance) {
            chartInstance.dispose()
            chartInstance = null
          }
        }
        
        updateSuccess = await updateChart(chartData.value)
        if (updateSuccess) break
      }
      
      if (!updateSuccess) {
        console.error('多次尝试后仍无法更新图表')
        chartError.value = '图表更新失败，请刷新页面重试'
        emit('error', chartError.value)
      }

      // 更新总数
      total.value = tableData.value.length
      
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    console.error('客户增长趋势查询失败:', error)
    chartError.value = error.message || '查询失败'
    emit('error', chartError.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 导出数据，适配新的数据格式
const exportData = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const exportData = tableData.value.map((item, index) => ({
    '序号': index + 1,
    '时间段': formatPeriod(item.period, item.timeDimension),
    '新增客户': item.newCustomers,
    '累计客户': item.totalCustomers,
    '活跃客户': item.activeCustomers,
    '环比增长率': `${item.growthRate > 0 ? '+' : ''}${item.growthRate.toFixed(1)}%`,
    '创建者': item.creatorName,
    '创建部门': item.creatorDepartment
  }))
  
  const headers = Object.keys(exportData[0])
  const csvContent = [
    headers.join(','),
    ...exportData.map(row => 
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `客户增长趋势统计_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.groupBy], () => {
  loadData()
})

// 监听props.groupBy变化（当父组件更新时）
watch(() => props.groupBy, (newVal) => {
  loadData()
})

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  console.log('客户增长趋势组件挂载完成')
  console.log('组件props:', {
    startDate: props.startDate,
    endDate: props.endDate,
    userName: props.userName,
    groupBy: props.groupBy
  })
  initChart()
  loadData()
  window.addEventListener('resize', handleResize)
})

// 清理
const cleanup = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
}

// 暴露方法
defineExpose({
  refreshData,
  exportData,
  cleanup
})
</script>

<style scoped>
.chart-container-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  height: 500px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.data-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-container-wrapper {
    height: 350px;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .space-x-4 {
    margin-top: 1rem;
  }
}

/* 暗色主题表格样式 */
:deep(.el-table) {
  background: transparent !important;
  color: #e2e8f0 !important;
}

:deep(.el-table th) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #94a3b8 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-table td) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>