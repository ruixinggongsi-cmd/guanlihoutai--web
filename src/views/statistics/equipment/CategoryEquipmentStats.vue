<!-- 分类设备统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表区域 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-pie mr-3 text-primary"></i>
          分类设备统计
        </h3>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-spinner fa-spin text-4xl"></i>
          <p>图表加载中...</p>
        </div>
      </div>
      
      <div v-else-if="chartError" class="flex items-center justify-center h-96 text-red-400">
        <div class="text-center space-y-4">
          <i class="fas fa-exclamation-triangle text-4xl"></i>
          <p>{{ chartError }}</p>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg transition-all duration-300"
          >
            重试
          </button>
        </div>
      </div>
      
      <div v-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-inbox text-4xl opacity-50"></i>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm text-gray-500">请调整查询条件后重试</p>
        </div>
      </div>
      
      <div v-if="!loading" ref="chartRef" class="chart-container">
          
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">设备申请统计明细</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请次数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">最大数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">最小数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="`${item.main_category_name}-${item.sub_category_name}`" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-tag mr-1 text-purple-400"></i>
                  {{ item.main_category_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-folder mr-1 text-cyan-400"></i>
                  {{ item.sub_category_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  <i class="fas fa-boxes mr-1 text-blue-400"></i>
                  {{ formatAmount(item.total_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.application_count }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-chart-line mr-1 text-emerald-400"></i>
                  {{ formatAmount(item.avg_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-arrow-up mr-1 text-orange-400"></i>
                  {{ formatAmount(item.max_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-arrow-down mr-1 text-gray-400"></i>
                  {{ formatAmount(item.min_quantity) }}
                </span>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">
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
      
      <!-- 分页 -->
      <div v-if="tableData.length > 0" class="mt-6 flex justify-between items-center">
        <div class="text-sm text-gray-400">
          共 {{ total }} 条记录
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage > 1 && (currentPage--)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors duration-150 text-sm"
          >
            上一页
          </button>
          <button 
            @click="currentPage < totalPages && (currentPage++)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors duration-150 text-sm"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getEquipmentCategoryStats } from '@/api/equipmentStatistics'

// Props
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
  mainCategory: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['loading', 'error'])

// 响应式数据
const tableData = ref([])
const loading = ref(false)
const chartError = ref('')
const chartRef = ref(null)
let chartInstance = null
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const chartData = ref([])

// 计算分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value)
})

// 格式化数量
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0'
  
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化使用率
const formatUsageRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return '0%'
  
  const num = parseFloat(rate)
  if (isNaN(num)) return '0%'
  
  return `${num.toFixed(1)}%`
}

// 初始化图表
const initChart = async () => {
  console.log('initChart chartRef.value:', chartRef.value)
  
  // 检查主容器是否可用，添加重试机制
  let container = null
  let retryCount = 0
  const maxRetries = 3
  
  while (!container && retryCount < maxRetries) {
    if (chartRef.value) {
      container = chartRef.value
      break
    }
    
    retryCount++
    console.warn(`图表容器未找到，第${retryCount}次尝试等待DOM更新后重试`)
    
    // 使用setTimeout增加等待时间，让DOM有足够时间更新
    await new Promise(resolve => setTimeout(resolve, 100 * retryCount))
    await nextTick()
  }
  
  if (!container) {
    console.error('多次重试后仍未找到图表容器')
    chartError.value = '图表容器未找到，请刷新页面重试'
    emit('error', chartError.value)
    return false
  }
  
  // 如果已有实例，先销毁
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  try {
    chartInstance = echarts.init(container)
    
    const option = getChartOption()
    chartInstance.setOption(option)
    
    // 响应式处理
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }
    
    window.addEventListener('resize', resizeChart)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('resize', resizeChart)
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
    }
  } catch (error) {
    console.error('图表初始化失败:', error)
    chartError.value = '图表初始化失败，请稍后重试'
    emit('error', chartError.value)
    return false
  }
}

// 获取图表配置
const getChartOption = () => {
  if (!chartData.value || chartData.value.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#9CA3AF',
          fontSize: 16
        }
      },
      backgroundColor: 'transparent'
    }
  }
  
  // 准备数据 - 按总数量排序，取前8个
  const sortedData = [...chartData.value].sort((a, b) => b.total_quantity - a.total_quantity).slice(0, 8)
  
  // 计算总数量用于百分比计算
  const totalQuantity = sortedData.reduce((sum, item) => sum + item.total_quantity, 0)
  
  // 渐变色配置
  const gradients = [
    ['#3B82F6', '#1D4ED8'], // 蓝色渐变
    ['#10B981', '#047857'], // 绿色渐变
    ['#F59E0B', '#D97706'], // 黄色渐变
    ['#EF4444', '#DC2626'], // 红色渐变
    ['#8B5CF6', '#7C3AED'], // 紫色渐变
    ['#06B6D4', '#0891B2'], // 青色渐变
    ['#84CC16', '#65A30D'], // 柠檬绿渐变
    ['#F97316', '#EA580C'], // 橙色渐变
    ['#EC4899', '#DB2777'], // 粉色渐变
    ['#6366F1', '#4F46E5']  // 靛蓝渐变
  ]
  
  return {
    backgroundColor: 'transparent',
    animationType: 'scale',
    animationTypeUpdate: 'scale',
    animationBegin: 200,
    animationEnd: 1000,
    title: {
      text: '设备分类申请统计',
      left: 'center',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(99, 102, 241, 0.5)',
      borderWidth: 1,
      textStyle: { 
        color: '#e2e8f0',
        fontSize: 13,
        fontWeight: '500'
      },
      padding: 12,
      formatter: function(params) {
        // 计算百分比
        const percentage = totalQuantity > 0 ? ((params.value / totalQuantity) * 100).toFixed(1) : 0
        
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${params.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${params.color}"></div>
              <span>总数量: ${formatAmount(params.value)}</span>
            </div>
            <div class="text-sm text-gray-400">占比: ${percentage}%</div>
            <div class="text-xs text-gray-500">申请次数: ${params.data.applicationCount || 0}</div>
          </div>
        `
      },
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.5)',
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    legend: {
      orient: 'vertical',
      left: '5%',
      top: 'center',
      textStyle: { 
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500'
      },
      itemWidth: 14,
      itemHeight: 14,
      padding: [0, 20],
      itemGap: 12,
      // 图例显示过多时的处理
      formatter: function(name) {
        let percentage = 0
        let value = 0
        let applicationCount = 0
        
        sortedData.forEach(item => {
          const itemName = item.sub_category_name
          if (itemName === name) {
            value = parseFloat(item.total_quantity || 0)
            applicationCount = parseInt(item.application_count || 0)
          }
        })
        
        if (totalQuantity > 0) {
          percentage = ((value / totalQuantity) * 100).toFixed(1)
        }
        
        // 限制名称长度
        const displayName = name.length > 12 ? name.substring(0, 12) + '...' : name
        return `${displayName} ${percentage}%`
      },
      // 图例过多时的布局调整
      type: 'scroll',
      pageButtonItemGap: 5,
      pageButtonGap: 10,
      pageButtonPosition: 'end',
      pageIcons: {
        vertical: ['up', 'down']
      },
      // 图例选中样式
      emphasis: {
        textStyle: {
          color: '#ffffff',
          fontWeight: 'bold'
        }
      },
      // 图例滚动条样式
      scrollDataIndex: 0,
      pageIconColor: '#94a3b8',
      pageIconInactiveColor: '#475569',
      pageTextStyle: {
        color: '#94a3b8'
      }
    },
    series: [
      {
        name: '设备分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        // 自动计算扇区角度范围，防止过小的扇区
        avoidLabelOverlap: false,
        minAngle: 5,
        // 饼图扇区数据
        data: sortedData.map((item, index) => {
          const value = parseFloat(item.total_quantity || 0)
          return {
            name: item.sub_category_name,
            value: value,
            applicationCount: parseInt(item.application_count || 0),
            itemStyle: {
              // 使用渐变色
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: gradients[index % gradients.length][0] },
                { offset: 1, color: gradients[index % gradients.length][1] }
              ]),
              // 小扇区特殊处理
              borderWidth: value / totalQuantity < 0.05 ? 2 : 0,
              borderColor: value / totalQuantity < 0.05 ? '#1e293b' : 'transparent',
              // 添加阴影效果
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 2
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowColor: 'rgba(99, 102, 241, 0.6)',
                // 高亮时调整渐变
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: gradients[index % gradients.length][0] + 'FF' },
                  { offset: 1, color: gradients[index % gradients.length][1] + 'FF' }
                ])
              },
              // 高亮时放大比例
              scale: 1.15,
              // 高亮动画
              animationDuration: 300,
              animationEasing: 'cubicOut'
            }
          }
        }),
        // 饼图标签设置
        label: {
          show: true,
          position: 'outside',
          color: '#e2e8f0',
          fontSize: 12,
          fontWeight: '500',
          formatter: function(params) {
            return `${params.name}: ${params.percent}%`
          },
          // 标签背景
          backgroundColor: 'rgba(15, 223, 142, 0.7)',
          padding: [4, 8],
          borderRadius: 4,
          borderColor: 'rgba(99, 102, 241, 0.3)',
          borderWidth: 1,
          // 标签动画
          animation: true,
          animationDuration: 500,
          animationEasing: 'elasticOut'
        },
        // 连接线样式
        labelLine: {
          show: true,
          length: 25,
          length2: 40,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.7)',
            width: 1.5,
            type: 'solid'
          },
          // 平滑处理
          smooth: true,
          curveness: 0.8
        }
      }
    ]
  }
}

// 加载数据
const loadData = async () => {
  if (loading.value) return
  
  if (!props.startDate || !props.endDate) {
    return
  }
  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    // 构建查询参数
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null
    }
    
    console.log('查询参数:', params)
    
    // 调用API
    const response = await getEquipmentCategoryStats(params)
    
    if (response.success && response.data) {
      loading.value = false
      // 直接使用API返回的数据
      tableData.value = response.data
      chartData.value = response.data
      total.value = response.data.length || 0
      
      // 初始化图表
      await nextTick()
      await initChart()
      
    } else {
      tableData.value = []
      chartData.value = []
      total.value = 0
      ElMessage.warning('未获取到数据')
    }
  } catch (error) {
    console.error('加载分类设备统计数据失败:', error)
    tableData.value = []
    chartData.value = []
    total.value = 0
    chartError.value = '数据加载失败，请稍后重试'
    emit('error', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// 刷新数据
const refreshData = () => {
  currentPage.value = 1
  loadData()
}

// 导出数据
const exportData = async () => {
  if (loading.value) {
    ElMessage.warning('数据加载中，请稍候再试')
    return
  }
  
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  try {
    // 构建查询参数
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null
    }
    
    ElMessage.info('正在准备导出数据，请稍候...')
    
    // 调用API获取全部数据
    const response = await getEquipmentCategoryStats(params)
    
    if (response.success && response.data && Array.isArray(response.data)) {
      // 构建CSV数据
      const headers = ['主分类', '子分类', '总数量', '申请次数', '平均数量', '最大数量', '最小数量']
      const csvContent = [
        headers.join(','),
        ...response.data.map(item => [
          item.main_category_name,
          item.sub_category_name,
          item.total_quantity,
          item.application_count,
          item.avg_quantity,
          item.max_quantity,
          item.min_quantity
        ].join(','))
      ].join('\n')
      
      // 创建下载链接
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `分类设备统计_${new Date().toLocaleDateString('zh-CN')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      ElMessage.success('数据导出成功')
    } else {
      ElMessage.warning('获取导出数据失败')
    }
  } catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('导出数据失败，请稍后重试')
  }
}

// 监听props变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  currentPage.value = 1
  loadData()
})

// 暴露方法给父组件
defineExpose({
  refreshData,
  exportData
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>