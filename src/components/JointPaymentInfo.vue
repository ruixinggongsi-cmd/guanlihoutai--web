<template>
  <div v-if="jointPayment && jointPayment.expenses?.length" class="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-4">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="flex items-center text-emerald-300 font-semibold text-sm">
        <i class="fas fa-link mr-2"></i>
        联合付款
        <span class="ml-2 text-emerald-200/90 font-normal">
          共 {{ jointPayment.count || jointPayment.expenses.length }} 笔，合计
          <span class="font-bold text-white">¥{{ formatMoney(jointPayment.totalAmount) }}</span>
        </span>
      </div>
      <div v-if="jointPayment.paidAt" class="text-xs text-emerald-200/70">
        付款时间：{{ formatDateTime(jointPayment.paidAt) }}
      </div>
    </div>

    <div class="text-xs text-emerald-200/80 mb-3">
      {{ jointPayment.paymentMethod || '-' }}
      <span v-if="jointPayment.accountType"> · {{ jointPayment.accountType }}</span>
      <span v-if="jointPayment.payeeNames?.length"> · 收款人：{{ jointPayment.payeeNames.join(' / ') }}</span>
    </div>

    <div class="overflow-x-auto rounded-lg border border-emerald-400/20">
      <table class="w-full text-sm">
        <thead class="bg-black/20 text-emerald-200/80">
          <tr>
            <th class="px-3 py-2 text-left font-medium">费用名称</th>
            <th class="px-3 py-2 text-left font-medium">金额</th>
            <th class="px-3 py-2 text-left font-medium">申请人</th>
            <th class="px-3 py-2 text-left font-medium">日期</th>
            <th class="px-3 py-2 text-left font-medium">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr
            v-for="item in jointPayment.expenses"
            :key="item.id"
            :class="item.isCurrent || item.id === currentExpenseId ? 'bg-emerald-500/15' : 'bg-transparent'"
          >
            <td class="px-3 py-2 text-white">
              {{ item.name }}
              <span
                v-if="item.isCurrent || item.id === currentExpenseId"
                class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200"
              >当前</span>
            </td>
            <td class="px-3 py-2 text-white">¥{{ formatMoney(item.amount) }}</td>
            <td class="px-3 py-2 text-gray-300">{{ item.applicantName || item.applicant_name || '-' }}</td>
            <td class="px-3 py-2 text-gray-400">{{ formatDate(item.date) }}</td>
            <td class="px-3 py-2 text-gray-300">{{ statusText(item.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div
    v-else-if="summaryOnly && summary"
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
  >
    <i class="fas fa-link mr-1"></i>
    联合付款 ¥{{ formatMoney(summary.totalAmount) }}（{{ summary.count }}笔）
  </div>
</template>

<script setup>
const props = defineProps({
  jointPayment: {
    type: Object,
    default: null
  },
  summary: {
    type: Object,
    default: null
  },
  summaryOnly: {
    type: Boolean,
    default: false
  },
  currentExpenseId: {
    type: String,
    default: ''
  }
})

const formatMoney = (amount) => {
  const num = parseFloat(amount)
  if (Number.isNaN(num)) return '0.00'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return String(dateStr)
  return d.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return String(dateStr)
  return d.toLocaleString('zh-CN')
}

const statusText = (status) => {
  const map = {
    pending: '待审批',
    approving: '审批中',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消',
    payment_pending: '待付款'
  }
  return map[status] || status || '-'
}
</script>
