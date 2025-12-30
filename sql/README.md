# 费用管理系统数据库脚本

## 文件说明

### 1. create_expense_tables.sql
费用管理系统核心表结构创建脚本，包含以下表：

#### 主要数据表
- `expense_main_categories` - 费用主分类表
- `expense_sub_categories` - 费用子分类表  
- `expense_applications` - 费用申请表
- `expense_approval_nodes` - 审批节点表
- `expense_approval_history` - 审批历史记录表

#### 视图
- `expense_application_detail` - 费用申请详情视图
- `pending_expenses` - 待审批费用视图

#### 功能特性
- 自动创建审批节点触发器
- 状态更新同步机制
- 索引优化查询性能

### 2. init_expense_data.sql
数据库初始化脚本，包含：

#### 新增表结构
- `expense_approval_flows` - 审批流程配置表
- `expense_approval_flow_nodes` - 审批流程节点配置表

#### 枚举类型
- `expense_status` - 费用状态枚举
- `approval_node_status` - 审批节点状态枚举

#### 自动化功能
- 自动创建审批节点函数
- 审批进度查询函数
- 批量状态更新函数
- 审批效率统计视图

## 使用方法

### 第一步：创建数据库
```sql
CREATE DATABASE expense_management;
USE expense_management;
```

### 第二步：执行表结构脚本
```sql
-- 执行核心表结构创建
\i create_expense_tables.sql
```

### 第三步：执行初始化脚本
```sql
-- 执行初始化配置和数据
\i init_expense_data.sql
```

## 数据结构说明

### 费用申请表 (expense_applications)
```sql
CREATE TABLE expense_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,           -- 费用名称
    main_category_id INTEGER NOT NULL,    -- 主分类ID
    sub_category_id INTEGER NOT NULL,     -- 子分类ID
    amount DECIMAL(10,2) NOT NULL,       -- 金额
    date DATE NOT NULL,                   -- 费用日期
    description TEXT,                     -- 费用描述
    status expense_status DEFAULT 'pending', -- 状态
    applicant_id INTEGER,                  -- 申请人ID
    applicant_name VARCHAR(100),           -- 申请人姓名
    applicant_department VARCHAR(100),     -- 申请人部门
    approver_id INTEGER,                   -- 审批人ID
    approver_name VARCHAR(100),            -- 审批人姓名
    approval_date DATE,                    -- 审批日期
    approval_comment TEXT,                 -- 审批意见
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 审批节点表 (expense_approval_nodes)
```sql
CREATE TABLE expense_approval_nodes (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER NOT NULL,           -- 费用申请ID
    node_name VARCHAR(100) NOT NULL,       -- 节点名称
    user_id INTEGER,                       -- 用户ID
    user_name VARCHAR(100),                  -- 用户姓名
    role_name VARCHAR(100),                -- 角色名称
    status approval_node_status DEFAULT 'pending', -- 状态
    comment TEXT,                            -- 审批意见
    sort_order INTEGER DEFAULT 0,            -- 节点顺序
    is_current_node BOOLEAN DEFAULT false,   -- 是否为当前审批节点
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 状态说明

### 费用状态 (expense_status)
- `pending` - 待审批
- `approving` - 审批中
- `approved` - 已通过
- `rejected` - 已拒绝
- `cancelled` - 已取消

### 审批节点状态 (approval_node_status)
- `pending` - 待审批
- `approving` - 审批中
- `approved` - 已通过
- `rejected` - 已拒绝
- `auto_approved` - 自动审批

## 常用查询示例

### 查询待审批费用
```sql
SELECT * FROM pending_expenses WHERE current_approver = '当前用户';
```

### 获取费用审批进度
```sql
SELECT * FROM get_expense_approval_progress(费用ID);
```

### 查询费用统计信息
```sql
SELECT * FROM expense_statistics WHERE month = '2024-01';
```

### 查询审批效率统计
```sql
SELECT * FROM approval_efficiency_statistics;
```

## 自动化功能

### 自动创建审批节点
当创建新的费用申请时，系统会根据费用金额和分类自动创建对应的审批节点。

### 自动更新审批流程
当审批节点状态变更时，系统会自动更新下一个审批节点为当前节点。

### 批量更新费用状态
支持批量更新多个费用申请的状态：
```sql
SELECT batch_update_expense_status(
    ARRAY[1,2,3],           -- 费用ID数组
    'approved',             -- 新状态
    1,                      -- 审批人ID
    '审批人姓名',            -- 审批人姓名
    '批量审批通过'          -- 审批意见
);
```

## 注意事项

1. **外键约束**：所有表都有适当的外键约束，删除费用申请时会级联删除相关审批节点和历史记录。

2. **触发器**：系统使用触发器自动维护审批流程和状态同步，请勿手动修改触发器逻辑。

3. **索引优化**：已为常用查询字段创建索引，如需优化特定查询可添加额外索引。

4. **数据一致性**：系统通过事务和触发器保证数据一致性，建议在应用层也进行相应的数据验证。

## 扩展功能

如需扩展功能，可以考虑：

1. 添加费用预算控制表
2. 添加审批权限配置表
3. 添加费用报销关联表
4. 添加费用发票管理表
5. 添加移动端推送通知配置