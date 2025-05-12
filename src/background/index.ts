import { JiraAPI } from '../shared/api';
import type { Storage } from '../shared/types';
import { refreshService } from '../shared/refresh';
import { cacheService } from '../shared/cache';
import { errorHandler } from '../shared/error';

// 初始化 API
let jiraApi: JiraAPI | null = null;

// 获取配置
async function getConfig(): Promise<Storage> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (result) => {
      resolve(result as Storage);
    });
  });
}

// 更新项目名称显示
async function updateProjectBadge(project: string) {
  chrome.action.setBadgeText({ text: project });
}

// 监听安装事件
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // 初始化配置
    const config = cacheService.getConfig();
    if (config.jql) {
      // 启动自动刷新
      await refreshService.startRefresh();
    }
  } catch (error) {
    errorHandler.handleError(error);
  }
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.jtb__project) {
      updateProjectBadge(changes.jtb__project.newValue);
    }
    if (changes.jtb__jiraLink) {
      jiraApi = new JiraAPI(changes.jtb__jiraLink.newValue);
    }
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_REFRESH') {
    refreshService.startRefresh();
    sendResponse({ success: true });
  } else if (message.type === 'STOP_REFRESH') {
    refreshService.stopRefresh();
    sendResponse({ success: true });
  } else if (message.type === 'SET_REFRESH_INTERVAL') {
    refreshService.setRefreshInterval(message.interval);
    sendResponse({ success: true });
  }
  return true;
});

// 初始化
async function initialize() {
  const config = await getConfig();
  if (config.jtb__jiraLink) {
    jiraApi = new JiraAPI(config.jtb__jiraLink);
  }
  if (config.jtb__project) {
    updateProjectBadge(config.jtb__project);
  }
}

initialize();