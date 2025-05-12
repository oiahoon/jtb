import { jiraAPI } from './api';
import { cacheService } from './cache';
import { errorHandler } from './error';

export class RefreshService {
  private static instance: RefreshService;
  private refreshInterval: number = 5 * 60 * 1000; // 默认 5 分钟
  private timer: number | null = null;
  private isRefreshing: boolean = false;

  private constructor() {
    // 从存储中加载刷新间隔
    this.loadRefreshInterval();
  }

  public static getInstance(): RefreshService {
    if (!RefreshService.instance) {
      RefreshService.instance = new RefreshService();
    }
    return RefreshService.instance;
  }

  private async loadRefreshInterval() {
    try {
      const data = await chrome.storage.local.get(['refreshInterval']);
      if (data.refreshInterval) {
        this.refreshInterval = data.refreshInterval;
      }
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  public async setRefreshInterval(interval: number) {
    this.refreshInterval = interval;
    try {
      await chrome.storage.local.set({ refreshInterval: interval });
      this.restartRefresh();
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  public getRefreshInterval(): number {
    return this.refreshInterval;
  }

  public async startRefresh() {
    if (this.timer !== null) return;

    const config = cacheService.getConfig();
    if (!config.jql) return;

    const refresh = async () => {
      if (this.isRefreshing) return;
      this.isRefreshing = true;

      try {
        await jiraAPI.getTickets(config.jql);
      } catch (error) {
        errorHandler.handleError(error);
      } finally {
        this.isRefreshing = false;
      }
    };

    // 立即执行一次刷新
    await refresh();

    // 设置定时刷新
    this.timer = window.setInterval(refresh, this.refreshInterval);
  }

  public stopRefresh() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  public restartRefresh() {
    this.stopRefresh();
    this.startRefresh();
  }
}

export const refreshService = RefreshService.getInstance();