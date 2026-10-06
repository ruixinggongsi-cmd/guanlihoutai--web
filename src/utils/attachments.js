/** 解析费用/审批附件字段（字符串或数组） */
export function normalizeAttachments(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : []
    } catch {
      return []
    }
  }
  return []
}

/** 过滤掉联合付款元数据，只保留可展示附件 */
export function filterDisplayAttachments(list = []) {
  return normalizeAttachments(list).filter(
    (item) => item && item.type !== 'joint_payment_meta' && item.url
  )
}

export function isImageAttachment(file) {
  if (!file) return false
  const type = String(file.type || file.mimeType || '').toLowerCase()
  const name = String(file.name || file.originalName || '').toLowerCase()
  if (type.startsWith('image/')) return true
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/.test(name)
}
