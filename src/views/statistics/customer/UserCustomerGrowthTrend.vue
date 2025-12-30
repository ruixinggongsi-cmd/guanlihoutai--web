<!-- 用户客户增长趋势组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center">
            <i class="fas fa-user-trending-up mr-2 text-primary"></i>
            用户增长趋势
          </h3>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select
              v-model="selectedUser"
              class="px-3 py-1.5 bg-gray-800 border border-gray-600 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer min-w-32"
            >
              <option value="" class="bg-gray-800 text-white hover:bg-gray-700">全部用户</option>
              <option v-for="user in uniqueUsers" :key="user" :value="user" class="bg-gray-800 text-white hover:bg-gray-700">
                {{ user }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="refreshData"
              class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              <span>刷新</span>
            </button>
            <button
              @click="exportData"
              class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-md transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-download"></i>
              <span>导出</span>
            </button>
          </div>
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
      
      <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-inbox text-4xl opacity-50"></i>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm text-gray-500">请调整查询条件后重试</p>
        </div>
      </div>
      
      <div v-if="!loading" ref="chartRef" class="w-full h-80 bg-white/5 rounded-lg border border-white/10"></div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">用户姓名</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">部门名称</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">时间</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">新增客户数量</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">累计客户数量</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="item in filteredTableData" :key="`${item.creatorName}-${item.date}`" class="hover:bg-white/5">
              <td class="px-4 py-3 text-white">{{ item.creatorName }}</td>
              <td class="px-4 py-3 text-gray-300">{{ item.creatorDepartment }}</td>
              <td class="px-4 py-3 text-gray-300">{{ item.period_date_formatted || formatDate(item.date) }}</td>
              <td class="px-4 py-3 text-blue-300">{{ item.newCustomers }}</td>
              <td class="px-4 py-3 text-emerald-300">{{ item.totalCustomers }}</td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { getUserCustomerGrowthTrend } from '@/api/customerStatistics'
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
  timeDimension: {
    type: String,
    default: 'month'
  },
  creatorName: {
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
const selectedUser = ref('')

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 计算唯一用户列表
const uniqueUsers = computed(() => {
  const users = new Set()
  chartData.value.forEach(item => {
    if (item.creatorName) {
      users.add(item.creatorName)
    }
  })
  return Array.from(users).sort()
})

// 表格数据（支持用户筛选）
const filteredTableData = computed(() => {
  if (!selectedUser.value) {
    return tableData.value
  }
  return tableData.value.filter(item => item.creatorName === selectedUser.value)
})



// 初始化图表
const initChart = async () => {
  if (!chartRef.value) {
    chartError.value = '图表容器未找到'
    emit('error', chartError.value)
    return false
  }
  


  // 销毁旧图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)
  
  // 启用鼠标滚轮缩放
  chartInstance.setOption({
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false,
        preventDefaultMouseMove: false,
        filterMode: 'filter',
        throttle: 0
      }
    ]
  })
  
  // 获取筛选后的数据
  const filteredData = selectedUser.value 
    ? chartData.value.filter(item => item.creatorName === selectedUser.value)
    : chartData.value
  
  // 按日期排序
  const sortedDates = [...new Set(filteredData.map(item => item.date).filter(Boolean))].sort()
  
  // 创建日期格式化映射
  const dateFormattedMap = {}
  filteredData.forEach(item => {
    if (item.date && item.period_date_formatted) {
      dateFormattedMap[item.date] = item.period_date_formatted
    }
  })
  
  // 如果选择了特定用户，显示该用户的趋势；否则显示所有用户的汇总
  let series = []
  let legendData = []
  
  if (selectedUser.value) {
    // 单个用户的趋势
    const userData = filteredData.filter(item => item.creatorName === selectedUser.value)
    series = [{
      name: selectedUser.value,
      type: 'line',
      data: sortedDates.map(date => {
        const item = userData.find(d => d.date === date)
        return item ? item.newCustomers : 0
      }),
      smooth: true,
      itemStyle: {
        color: '#3b82f6'
      },
      lineStyle: {
        width: 3
      }
    }]
    legendData = [selectedUser.value]
  } else {
    // 所有用户的汇总趋势
    const userGroups = {}
    filteredData.forEach(item => {
      if (!userGroups[item.creatorName]) {
        userGroups[item.creatorName] = {
          name: item.creatorName,
          data: []
        }
      }
    })
    
    // 为每个用户创建系列
    Object.values(userGroups).forEach((user, index) => {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
      series.push({
        name: user.name,
        type: 'line',
        data: sortedDates.map(date => {
          const item = filteredData.find(d => d.date === date && d.creatorName === user.name)
          return item ? item.newCustomers : 0
        }),
        smooth: true,
        itemStyle: {
          color: colors[index % colors.length]
        },
        lineStyle: {
          width: 2
        }
      })
      legendData.push(user.name)
    })
  }
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: selectedUser.value ? `${selectedUser.value} 新增客户趋势` : '用户新增客户趋势',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value} 人<br/>`
        })
        return result
      }
    },
    legend: {
      data: legendData,
      textStyle: {
        color: '#fff'
      },
      top: 30,
      type: 'scroll'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sortedDates.map(date => dateFormattedMap[date] || formatDate(date)),
      axisLabel: {
        color: '#fff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '新增客户数量',
      nameTextStyle: {
        color: '#fff'
      },
      axisLabel: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: series
  }
  
  chartInstance.setOption(option, true)

  
  return true
}

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) {
    return
  }

  loading.value = true
  emit('loading', true)
  chartError.value = ''

  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      creatorName: props.creatorName,
      timeDimension: props.timeDimension
    }

    const res = await getUserCustomerGrowthTrend(params)
    
    if (res.success) {
      loading.value = false
      
      // 转换数据格式以适配组件需求
      const rawData = res.data || []
      
      const transformedData = rawData.map(item => ({
        date: item.period_date,
        period_date_formatted: item.period_date_formatted,
        creatorId: item.creator_id,
        creatorName: item.creator_name,
        creatorDepartment: item.creator_department,
        newCustomers: item.new_customers,
        totalCustomers: item.cumulative_customers,
        activeCustomers: item.active_customers,
        timeDimension: item.time_dimension,
        // 计算环比增长率（需要对比上期数据）
        growthRate: 0 // 暂时设为0，后续可以计算
      }))
      
      // 按日期排序（升序）
      transformedData.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      // 计算环比增长率
      for (let i = 1; i < transformedData.length; i++) {
        const current = transformedData[i]
        const previous = transformedData[i - 1]
        if (previous.totalCustomers > 0) {
          current.growthRate = ((current.totalCustomers - previous.totalCustomers) / previous.totalCustomers * 100)
        }
      }
      
          // 保留原始时间序列数据用于图表显示
      chartData.value = transformedData
      
      // 表格显示原始数据
      tableData.value = transformedData
      total.value = transformedData.length
      
      if (chartData.value.length > 0) {
        await nextTick()
        await initChart()
      } else {
        // 清空图表
        if (chartInstance) {
          chartInstance.clear()
        }
      }
    } else {
      chartData.value = []
      tableData.value = []
      total.value = 0
      chartError.value = res.message || '暂无数据'
    }
  } catch (error) {
    chartError.value = error.message || '加载数据失败'
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

// 导出数据
const exportData = () => {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = ['用户姓名', '部门名称', '时间', '新增客户数量', '累计客户数量']
    const data = filteredTableData.value.map(item => [
      item.creatorName,
      item.creatorDepartment,
      item.period_date_formatted || formatDate(item.date),
      item.newCustomers,
      item.totalCustomers
    ])

  const csvContent = [headers, ...data]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `用户客户增长趋势_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()

  ElMessage.success('数据导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.timeDimension], () => {
  loadData()
}, { immediate: true })

// 监听用户选择变化，重新渲染图表
watch(selectedUser, () => {
  if (chartData.value.length > 0) {
    nextTick(() => {
      initChart()
    })
  }
})

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

onMounted(() => {
  // 组件挂载时加载数据
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
  min-height: 400px;
}

.text-primary { color: #3b82f6; }
</style>