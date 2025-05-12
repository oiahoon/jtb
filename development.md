# JTB (Jira Tool Box) Chrome Extension 开发文档

## 1. 项目概述

JTB 是一个 Chrome 扩展，用于快速访问和管理 Jira 任务。主要功能包括：
- 快速跳转到 Jira 任务
- 查看个人任务列表
- 自定义项目配置
- 任务状态跟踪

## 2. 系统架构

### 2.1 核心组件
- Background Service Worker
  - 处理扩展安装/更新事件
  - 管理项目名称显示
  - 处理存储变化
- Content Script
  - 页面信息获取
  - 与页面交互
- Popup UI
  - 快速任务访问
  - 任务列表显示
  - 项目配置
- Options Page
  - 扩展设置
  - Jira 服务器配置

### 2.2 数据流
1. 用户输入任务号/项目缩写
2. Popup 组件处理输入
3. 通过 Chrome API 打开新标签页
4. Background Service 更新状态
5. Content Script 获取页面信息

## 3. 功能模块

### 3.1 快速任务访问
- 支持项目缩写 + 任务号快速跳转
  - 格式：`[项目缩写]-[任务号]`
  - 示例：`VEB-123`
- 支持直接输入任务号跳转
  - 使用最近使用的项目缩写
- 自动保存最近使用的项目缩写
  - 存储在 chrome.storage.local
  - 键名：`jtb__project`

### 3.2 任务列表
- 显示个人任务列表
  - 默认显示 50 条记录
  - 支持分页加载
- 支持自定义 JQL 查询
  - 默认 JQL：`project = veb AND issuetype in standardIssueTypes() AND status in (Open, 'In Progress', Test, Review, Design, Coding, 'Review Queue', 'Code Review') AND assignee in (currentUser()) ORDER BY created DESC`
- 显示任务关键信息：
  - 任务类型 (issuetype)
  - 标题 (summary)
  - 状态 (status)
  - 经办人 (assignee)
  - 开发截止日期 (customfield_12551)
  - Sprint 信息 (customfield_11150)

### 3.3 配置管理
- Jira 服务器配置
  - 服务器地址
  - 认证信息
- 项目配置
  - 项目缩写
  - 项目名称
- JQL 查询配置
  - 默认查询
  - 自定义查询

## 4. API 接口

### 4.1 Jira REST API

#### 4.1.1 会话验证
```http
GET /rest/auth/1/session
```
响应示例：
```json
{
  "name": "username",
  "loginInfo": {
    "failedLoginCount": 0,
    "loginCount": 1,
    "lastFailedLoginTime": "2024-01-01T00:00:00.000+0000",
    "previousLoginTime": "2024-01-01T00:00:00.000+0000"
  }
}
```

#### 4.1.2 任务搜索
```http
POST /rest/api/2/search
```
请求体：
```json
{
  "jql": "project = VEB",
  "startAt": 0,
  "maxResults": 50,
  "fields": [
    "id",
    "key",
    "duedate",
    "summary",
    "progress",
    "timespent",
    "status",
    "customfield_12551",
    "assignee",
    "customfield_11150",
    "issuetype"
  ]
}
```
响应示例：
```json
{
  "expand": "names,schema",
  "startAt": 0,
  "maxResults": 50,
  "total": 100,
  "issues": [
    {
      "id": "12345",
      "key": "VEB-123",
      "fields": {
        "summary": "Task Title",
        "status": {
          "name": "In Progress"
        },
        "assignee": {
          "displayName": "John Doe"
        },
        "customfield_12551": "2024-03-01",
        "customfield_11150": ["com.atlassian.greenhopper.service.sprint.Sprint@1afd67c1[id=4227,rapidViewId=705,state=FUTURE,name=VEB-Sprint 37]"],
        "issuetype": {
          "name": "Task"
        }
      }
    }
  ]
}
```

### 4.2 Chrome Extension API

#### 4.2.1 存储 API
```javascript
// 本地存储
chrome.storage.local.set({ key: value });
chrome.storage.local.get(['key'], callback);

// 同步存储
chrome.storage.sync.set({ key: value });
chrome.storage.sync.get(['key'], callback);
```

#### 4.2.2 标签页 API
```javascript
// 创建新标签页
chrome.tabs.create({
  url: 'https://jira.example.com/browse/PROJ-123',
  active: false
});
```

#### 4.2.3 运行时 API
```javascript
// 监听安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装
  } else if (details.reason === 'update') {
    // 更新
  }
});
```

## 5. 数据模型

### 5.1 任务模型 (Ticket)
```typescript
interface Ticket {
  // 任务ID
  id: string;

  // 任务键值（如 VEB-123）
  key: string;

  // 任务类型
  issuetype: string;

  // 任务标题
  summary: string;

  // 经办人
  assignee: string;

  // 开发截止日期
  dev_duedate: string;

  // 任务状态
  status: {
    name: string;
    id: string;
  };

  // Sprint 信息
  sprint: string;

  // 任务URL
  url: string;
}
```

### 5.2 配置模型
```typescript
interface Config {
  // Jira 服务器地址
  jiraLink: string;

  // 项目缩写
  project: string;

  // JQL 查询
  jql: string;
}
```

## 6. Jira 字段映射

### 6.1 自定义字段
```typescript
const JiraFields = {
  // 开发截止日期
  dev_duedate: 'customfield_12551',

  // Sprint 信息
  sprint: 'customfield_11150',

  // 标准字段
  standard: {
    id: 'id',
    key: 'key',
    summary: 'summary',
    status: 'status',
    assignee: 'assignee',
    issuetype: 'issuetype',
    duedate: 'duedate',
    progress: 'progress',
    timespent: 'timespent'
  }
}
```

### 6.2 状态映射
```typescript
const StatusTypes = [
  'Open',
  'In Progress',
  'Test',
  'Review',
  'Design',
  'Coding',
  'Review Queue',
  'Code Review'
]

const StatusColors = {
  'Open': '#4A6785',
  'In Progress': '#14892C',
  'Test': '#FFD700',
  'Review': '#FFA500',
  'Design': '#9932CC',
  'Coding': '#1E90FF',
  'Review Queue': '#FF6347',
  'Code Review': '#FF4500'
}
```

### 6.3 任务类型映射
```typescript
const IssueTypes = {
  'Bug': {
    icon: '🐛',
    color: '#FF0000'
  },
  'Task': {
    icon: '📋',
    color: '#1E90FF'
  },
  'Story': {
    icon: '📚',
    color: '#32CD32'
  },
  'Epic': {
    icon: '📑',
    color: '#9932CC'
  }
}
```

## 7. 存储结构

### 7.1 Chrome Storage
```typescript
interface Storage {
  // Jira 服务器地址
  'jtb__jiraLink': string;

  // 项目缩写
  'jtb__project': string;

  // JQL 查询
  'jtb__jql': string;

  // 用户配置
  'jtb__config': {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };

  // 缓存数据
  'jtb__cache': {
    lastUpdate: number;
    tickets: Ticket[];
  };
}
```

### 7.2 缓存策略
- 缓存有效期：5分钟
- 缓存键：`jtb__cache`
- 缓存内容：
  - 最后更新时间
  - 任务列表
  - 项目信息

## 8. 错误处理

### 8.1 错误类型
```typescript
enum ErrorType {
  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',

  // 认证错误
  AUTH_ERROR = 'AUTH_ERROR',

  // 配置错误
  CONFIG_ERROR = 'CONFIG_ERROR',

  // 数据错误
  DATA_ERROR = 'DATA_ERROR'
}
```

### 8.2 错误处理策略
1. 网络错误
   - 自动重试（最多3次）
   - 显示错误提示
   - 记录错误日志

2. 认证错误
   - 清除认证信息
   - 跳转到登录页面
   - 显示错误提示

3. 配置错误
   - 使用默认配置
   - 显示配置错误提示
   - 跳转到配置页面

4. 数据错误
   - 使用缓存数据
   - 显示数据错误提示
   - 记录错误日志

## 9. 性能优化

### 9.1 缓存策略
- 本地缓存任务列表
- 缓存项目配置
- 缓存用户信息

### 9.2 请求优化
- 批量获取任务
- 按需加载数据
- 请求去重

### 9.3 渲染优化
- 虚拟滚动
- 延迟加载
- 预加载数据

## 10. 安全考虑

### 10.1 数据安全
- 敏感数据加密
- 安全的存储机制
- 数据备份策略

### 10.2 认证安全
- 安全的认证机制
- 会话管理
- 权限控制

### 10.3 通信安全
- HTTPS 通信
- 数据验证
- 请求签名

## 11. 测试策略

### 11.1 单元测试
- 组件测试
- 工具函数测试
- API 测试

### 11.2 集成测试
- 功能测试
- 流程测试
- 性能测试

### 11.3 E2E 测试
- 用户场景测试
- 跨组件测试
- 兼容性测试

## 12. 部署流程

### 12.1 开发环境
- 本地开发
- 代码审查
- 单元测试

### 12.2 测试环境
- 功能测试
- 性能测试
- 兼容性测试

### 12.3 生产环境
- 版本发布
- 监控告警
- 错误追踪