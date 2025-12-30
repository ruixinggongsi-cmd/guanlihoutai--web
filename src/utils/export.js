import * as XLSX from 'xlsx'

/**
 * 导出数据到Excel文件
 * @param {Array} data - 要导出的数据数组
 * @param {Array} columns - 列定义数组，格式：[{prop: '字段名', label: '显示名称', formatter: 可选的格式化函数}]
 * @param {string} fileName - 文件名（不包含扩展名）
 */
export const exportToExcel = (data, columns, fileName = '导出数据') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('没有数据可导出')
  }

  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    throw new Error('没有定义列信息')
  }

  try {
    // 处理数据，应用格式化函数
    const processedData = data.map(row => {
      const newRow = {}
      columns.forEach(column => {
        let value = row[column.prop]
        
        // 如果有格式化函数，应用格式化
        if (column.formatter && typeof column.formatter === 'function') {
          value = column.formatter(row)
        }
        
        // 处理null/undefined值
        if (value === null || value === undefined) {
          value = ''
        } else {
          value = String(value)
        }
        
        newRow[column.label] = value
      })
      return newRow
    })

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(processedData)
    
    // 设置列宽
    const columnWidths = columns.map(column => ({
      wch: Math.max(column.label.length * 2, 10) // 最小宽度10，标签长度*2
    }))
    worksheet['!cols'] = columnWidths
    
    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据')
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    
    // 创建Blob对象
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // 下载文件
    downloadFile(blob, `${fileName}.xlsx`)
    
  } catch (error) {
    console.error('导出Excel失败:', error)
    throw new Error('导出Excel失败: ' + error.message)
  }
}

/**
 * 下载文件
 * @param {Blob} blob - Blob对象
 * @param {string} fileName - 文件名
 */
const downloadFile = (blob, fileName) => {
  // 创建下载链接
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  
  // 触发下载
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 导出表格数据到Excel（兼容Element Plus表格）
 * @param {Array} tableData - 表格数据
 * @param {Array} columns - 列定义
 * @param {string} fileName - 文件名
 */
export const exportTableToExcel = (tableData, columns, fileName = '表格数据') => {
  return exportToExcel(tableData, columns, fileName)
}

/**
 * 批量导出多个工作表
 * @param {Object} sheets - 工作表数据，格式：{ '工作表名称': { data: [...], columns: [...] } }
 * @param {string} fileName - 文件名
 */
export const exportMultipleSheets = (sheets, fileName = '多工作表数据') => {
  if (!sheets || typeof sheets !== 'object') {
    throw new Error('工作表数据格式错误')
  }

  try {
    const workbook = XLSX.utils.book_new()
    
    Object.keys(sheets).forEach(sheetName => {
      const sheetData = sheets[sheetName]
      if (!sheetData.data || !sheetData.columns) {
        console.warn(`工作表 "${sheetName}" 数据不完整，跳过`)
        return
      }
      
      // 处理数据
      const processedData = sheetData.data.map(row => {
        const newRow = {}
        sheetData.columns.forEach(column => {
          let value = row[column.prop]
          
          if (column.formatter && typeof column.formatter === 'function') {
            value = column.formatter(row)
          }
          
          if (value === null || value === undefined) {
            value = ''
          } else {
            value = String(value)
          }
          
          newRow[column.label] = value
        })
        return newRow
      })
      
      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(processedData)
      
      // 设置列宽
      const columnWidths = sheetData.columns.map(column => ({
        wch: Math.max(column.label.length * 2, 10)
      }))
      worksheet['!cols'] = columnWidths
      
      // 添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    })
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // 下载文件
    downloadFile(blob, `${fileName}.xlsx`)
    
  } catch (error) {
    console.error('导出多工作表失败:', error)
    throw new Error('导出多工作表失败: ' + error.message)
  }
}