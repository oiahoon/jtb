// Jira 字段映射
export const JiraFields = {
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
} as const;

// 状态类型
export const StatusTypes = [
  'Open',
  'In Progress',
  'Test',
  'Review',
  'Design',
  'Coding',
  'Review Queue',
  'Code Review'
] as const;

// 状态颜色
export const StatusColors = {
  'Open': '#4A6785',
  'In Progress': '#14892C',
  'Test': '#FFD700',
  'Review': '#FFA500',
  'Design': '#9932CC',
  'Coding': '#1E90FF',
  'Review Queue': '#FF6347',
  'Code Review': '#FF4500'
} as const;

// 任务类型
export const IssueTypes = {
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
} as const;

export type StatusType = keyof typeof StatusTypes;
export type IssueType = keyof typeof IssueTypes;

export interface Ticket {
  key: string;
  summary: string;
  status: StatusType;
  assignee: string;
  type: IssueType;
  lastModified: number;
}

// 配置接口
export interface Config {
  jiraUrl: string;
  projectKey: string;
  jql: string;
}

// 存储接口
export interface Storage {
  'jtb__jiraLink': string;
  'jtb__project': string;
  'jtb__jql': string;
  'jtb__config': {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };
  'jtb__cache': {
    lastUpdate: number;
    tickets: Ticket[];
  };
}

// 错误类型
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  DATA_ERROR = 'DATA_ERROR'
}