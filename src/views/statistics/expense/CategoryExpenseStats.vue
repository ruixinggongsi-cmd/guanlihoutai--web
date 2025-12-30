<!-- 分类费用统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-500 hover:shadow-primary/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-pie mr-3 text-primary"></i>
          分类费用统计
        </h3>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
            :disabled="loading"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2"
            :disabled="tableData.length === 0"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
        </div>
      </div>
      
      
      
      <div class="chart-container-wrapper fade-in">
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
        
        <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
            <div class="text-center space-y-4">
            <i class="fas fa-inbox text-4xl opacity-50"></i>
            <p class="text-lg">暂无数据</p>
            <p class="text-sm text-gray-500">请调整查询条件后重试</p>
            </div>
        </div>
        <div v-show="!loading && !chartError && chartData && chartData.length > 0" ref="chartRef" style="width: 100%; height: 500px;"></div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-500 hover:shadow-primary/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">最大金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">最小金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-tag mr-1 text-purple-400"></i>
                  {{ item.mainCategoryName }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-folder mr-1 text-cyan-400"></i>
                  {{ item.subCategoryName }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ formatAmount(item.totalAmount) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.applicationCount }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatAmount(item.avgAmount) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatAmount(item.maxAmount) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatAmount(item.minAmount) }}
                </span>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getCategoryExpenseStats } from '@/api/expenseStatistics'
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
  mainCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['error', 'loading'])

const loading = ref(false)
const chartError = ref('')
const chartRef = ref(null)
let chartInstance = null

const chartData = ref([])
const tableData = ref([])
const total = ref(0)

// 格式化金额
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0.00'
  
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00'
  
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 初始化图表
const initChart = async () => {
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
  
  // 确保容器有实际尺寸
  const rect = container.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) {
    console.warn('图表容器尺寸无效，可能被隐藏或样式未正确应用')
    // 尝试设置最小尺寸
    container.style.minWidth = '400px'
    container.style.minHeight = '400px'
    
    // 再次检查尺寸
    const newRect = container.getBoundingClientRect()
    if (newRect.width <= 0 || newRect.height <= 0) {
      console.error('图表容器尺寸仍然无效')
      chartError.value = '图表容器尺寸无效'
      emit('error', chartError.value)
      return false
    }
  }
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  try {
    chartInstance = echarts.init(container)
    console.log('图表初始化成功')
    return true
  } catch (error) {
    console.error('图表初始化失败:', error)
    chartError.value = '图表初始化失败'
    emit('error', chartError.value)
    return false
  }
}

// 获取图表配置
const getChartOption = (data) => {
  // 预定义的渐变色列表 - 用于饼图各个扇区
  const gradients = [
    ['#6366f1', '#8b5cf6'], // 靛蓝-紫
    ['#ec4899', '#f472b6'], // 粉色-淡粉
    ['#f59e0b', '#fbbf24'], // 琥珀-黄
    ['#10b981', '#34d399'], // 绿-浅绿
    ['#06b6d4', '#22d3ee'], // 青-浅青
    ['#3b82f6', '#60a5fa'], // 蓝-浅蓝
    ['#8b5cf6', '#a78bfa'], // 紫-淡紫
    ['#84cc16', '#a3e635'], // 绿黄-浅绿黄
    ['#f97316', '#fb923c'], // 橙-浅橙
    ['#ef4444', '#f87171'], // 红-浅红
    ['#06b6d4', '#22d3ee'], // 青-浅青
    ['#8b5cf6', '#a78bfa']  // 紫-淡紫
  ]
  
  // 按金额排序，确保图表展示更加清晰
  const sortedData = [...data].sort((a, b) => {
    const valueA = parseFloat(a.totalAmount || a.total_amount || a.amount || 0)
    const valueB = parseFloat(b.totalAmount || b.total_amount || b.amount || 0)
    return valueB - valueA
  })
  
  // 计算总金额
  const totalAmount = sortedData.reduce((sum, item) => {
    return sum + parseFloat(item.totalAmount || item.total_amount || item.amount || 0)
  }, 0)
  
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    // 添加动画配置
    animation: true,
    animationDuration: 1500, // 增加动画时长
    animationEasing: 'cubicOut',
    animationDelay: function (idx) {
      return idx * 50;
    },
    animationType: 'scale',
    animationTypeUpdate: 'scale',
    animationBegin: 200,
    animationEnd: 1000,
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
        const percentage = totalAmount > 0 ? ((params.value / totalAmount) * 100).toFixed(1) : 0
        
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${params.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${params.color}"></div>
              <span>金额: ${formatAmount(params.value)}</span>
            </div>
            <div class="text-sm text-gray-400">占比: ${percentage}%</div>
            <div class="text-xs text-gray-500">申请数量: ${params.data.applicationCount || 0}</div>
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
        let percentage = 0;
        let value = 0;
        let applicationCount = 0;
        
        sortedData.forEach(item => {
          const itemName = item.sub_category_name;
          if (itemName === name) {
            value = parseFloat(item.totalAmount || item.total_amount || item.amount || 0);
            applicationCount = parseInt(item.application_count || item.applicationCount || 0);
          }
        });
        
        if (totalAmount > 0) {
          percentage = ((value / totalAmount) * 100).toFixed(1);
        }
        
        // 限制名称长度
        const displayName = name.length > 12 ? name.substring(0, 12) + '...' : name;
        return `${displayName} ${percentage}%`;
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
    series: [{
      name: '分类费用',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      // 自动计算扇区角度范围，防止过小的扇区
      avoidLabelOverlap: false,
      minAngle: 5,
      // 饼图扇区数据
      data: sortedData.map((item, index) => {
        const value = parseFloat(item.totalAmount || item.total_amount || item.amount || 0)
        return {
          name: item.sub_category_name,
          value: value,
          applicationCount: parseInt(item.application_count || item.applicationCount || 0),
          itemStyle: {
            // 使用渐变色
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: gradients[index % gradients.length][0] },
              { offset: 1, color: gradients[index % gradients.length][1] }
            ]),
            // 小扇区特殊处理
            borderWidth: value / totalAmount < 0.05 ? 2 : 0,
            borderColor: value / totalAmount < 0.05 ? '#1e293b' : 'transparent',
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
         
          return `${params.name}: ${params.percent}%`;
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
      },
      // 中心圆文字和背景
      graphic: [
        // 中心圆背景
        {
          type: 'circle',
          left: '60%',
          top: '50%',
          shape: {
            r: 50
          },
          style: {
            fill: 'rgba(15, 23, 42, 0.7)',
            stroke: 'rgba(99, 102, 241, 0.3)',
            lineWidth: 1,
            shadowBlur: 15,
            shadowColor: 'rgba(99, 102, 241, 0.2)'
          },
          z: 90
        },
        // 中心圆标题
        {
          type: 'text',
          left: '60%',
          top: '45%',
          style: {
            text: '总金额',
            fill: '#94a3b8',
            fontSize: 14,
            fontWeight: '500'
          },
          z: 100
        },
        // 中心圆金额
        {
          type: 'text',
          left: '60%',
          top: '55%',
          style: {
            text: totalAmount >= 10000 ? 
              `${(totalAmount / 10000).toFixed(1)}万` : 
              `${totalAmount.toLocaleString('zh-CN')}`,
            fill: '#ffffff',
            fontSize: 22,
            fontWeight: 'bold',
            textShadowBlur: 10,
            textShadowColor: 'rgba(99, 102, 241, 0.5)'
          },
          z: 100
        },
        // 中心圆申请数量
        {
          type: 'text',
          left: '60%',
          top: '65%',
          style: {
            text: `申请 ${sortedData.reduce((sum, item) => sum + parseInt(item.application_count || item.applicationCount || 0), 0)} 笔`,
            fill: '#94a3b8',
            fontSize: 12
          },
          z: 100
        }
      ]
    }]
  }
  
  return baseOption
}

// 更新图表
const updateChart = async (data) => {
  // 确保DOM已经更新
  await nextTick()
  
  // 等待一小段时间确保容器完全渲染
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 检查并初始化图表实例
  if (!chartInstance) {
    const initialized = await initChart()
    if (!initialized) {
      console.error('图表初始化失败，无法更新图表')
      chartError.value = '图表初始化失败'
      return false
    }
  }
  
  if (!chartInstance) return false
  
  try {
    if (!data || data.length === 0) {
      chartInstance.setOption(getEmptyChartOption(), true)
    } else {
      chartInstance.setOption(getChartOption(data), true)
    }
    console.log('图表更新成功')
    return true
  } catch (error) {
    console.error('图表更新失败:', error)
    chartError.value = '图表更新失败'
    emit('error', chartError.value)
    return false
  }
}

// 空数据图表配置
const getEmptyChartOption = () => {
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    legend: {
      show: false
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: [],
      label: {
        show: false
      },
      itemStyle: {
        color: '#1e293b'
      }
    }]
  }
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
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null
    }
    
    console.log('分类费用统计查询参数:', params)
    const res = await getCategoryExpenseStats(params)
    
    if (res.success) {
      const data = res.data || []
      chartData.value = data
      
      // 处理表格数据并按金额降序排序
      tableData.value = data.map((item, index) => ({
        id: `${item.category_id || item.categoryName || 'unknown'}_${Date.now()}_${index}`,
        mainCategoryName: item.main_category_name,
        subCategoryName: item.sub_category_name,
        totalAmount: parseFloat(item.total_amount || item.totalAmount || item.amount || 0),
        applicationCount: parseInt(item.application_count || item.applicationCount || 0),
        avgAmount: parseFloat(item.avg_amount || item.avgAmount || 0),
        maxAmount: parseFloat(item.max_amount || item.maxAmount || 0),
        minAmount: parseFloat(item.min_amount || item.minAmount || 0)
      })).sort((a, b) => b.totalAmount - a.totalAmount) // 按金额降序排序
      
      total.value = data.length
      
      // 先设置loading为false，再更新图表
      loading.value = false
      await nextTick()
      
      // 使用增强的更新逻辑，包含重试机制
      let updateSuccess = false
      let retryCount = 0
      const maxRetries = 2
      
      updateSuccess = await updateChart(data)
      
      if (!updateSuccess) {
        console.error('多次尝试后仍无法更新图表')
        chartError.value = '图表更新失败，请刷新页面重试'
        emit('error', chartError.value)
      }
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    console.error('分类费用统计查询失败:', error)
    chartError.value = error.message || '查询失败'
    emit('error', chartError.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// 刷新数据
const refreshData = () => {
  // 清理图表实例
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  loadData()
}

// 导出数据
const exportData = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const exportData = tableData.value.map((item, index) => ({
    '序号': index + 1,
    '主分类': item.mainCategoryName,
    '子分类': item.subCategoryName,
    '总金额': item.totalAmount,
    '申请数量': item.applicationCount,
    '平均金额': item.avgAmount,
    '最大金额': item.maxAmount,
    '最小金额': item.minAmount
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
  link.download = `分类费用统计_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  loadData()
})

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  // 延迟加载数据，确保DOM完全渲染
  setTimeout(() => {
    loadData()
  }, 300)
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
  width: 100%;
  height: 500px;
  position: relative;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-container-wrapper {
    height: 400px;
  }
  
  .space-y-6 {
    gap: 1.5rem;
  }
  
  h3 {
    font-size: 1rem !important;
  }
  
  .px-6 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  button {
    padding: 0.5rem 1rem !important;
    font-size: 0.75rem !important;
  }
  
  button i {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .chart-container-wrapper {
    height: 350px;
  }
  
  .px-4 {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
  
  .py-2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}

/* 滚动条样式 */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.2);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
</style>