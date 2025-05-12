import { errorHandler } from './error';
import type { ErrorType } from './types';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
  position?: NotificationPosition;
  icon?: string;
  actions?: {
    label: string;
    callback: () => void;
  }[];
}

export class NotificationService {
  private static instance: NotificationService;
  private readonly NOTIFICATION_KEY = 'jtb_notifications';
  private readonly MAX_NOTIFICATIONS = 50;
  private readonly DEFAULT_DURATION = 5000; // 5秒

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async showNotification(
    type: NotificationType,
    title: string,
    message: string,
    options: {
      duration?: number;
      position?: NotificationPosition;
      icon?: string;
      actions?: { label: string; callback: () => void }[];
    } = {}
  ): Promise<void> {
    try {
      const notification: Notification = {
        id: this.generateId(),
        type,
        title,
        message,
        timestamp: Date.now(),
        duration: options.duration || this.DEFAULT_DURATION,
        position: options.position || 'top-right',
        icon: options.icon,
        actions: options.actions
      };

      // 保存通知
      await this.saveNotification(notification);

      // 显示通知
      await this.displayNotification(notification);

      // 如果是错误通知，同时显示系统通知
      if (type === 'error') {
        await this.showSystemNotification(notification);
      }
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  private async saveNotification(notification: Notification): Promise<void> {
    try {
      const data = await chrome.storage.local.get([this.NOTIFICATION_KEY]);
      const notifications: Notification[] = data[this.NOTIFICATION_KEY] || [];
      notifications.unshift(notification);

      // 限制通知数量
      if (notifications.length > this.MAX_NOTIFICATIONS) {
        notifications.pop();
      }

      await chrome.storage.local.set({ [this.NOTIFICATION_KEY]: notifications });
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  private async displayNotification(notification: Notification): Promise<void> {
    try {
      // 创建通知元素
      const element = document.createElement('div');
      element.className = `jtb-notification jtb-notification-${notification.type} jtb-notification-${notification.position}`;
      element.innerHTML = `
        <div class="jtb-notification-content">
          ${notification.icon ? `<img src="${notification.icon}" class="jtb-notification-icon" />` : ''}
          <div class="jtb-notification-text">
            <div class="jtb-notification-title">${notification.title}</div>
            <div class="jtb-notification-message">${notification.message}</div>
          </div>
          ${notification.actions ? `
            <div class="jtb-notification-actions">
              ${notification.actions.map(action => `
                <button class="jtb-notification-action">${action.label}</button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

      // 添加到文档
      document.body.appendChild(element);

      // 添加动作事件监听
      if (notification.actions) {
        const buttons = element.querySelectorAll('.jtb-notification-action');
        buttons.forEach((button, index) => {
          button.addEventListener('click', () => {
            notification.actions![index].callback();
            this.removeNotification(element);
          });
        });
      }

      // 自动移除
      if (notification.duration) {
        setTimeout(() => {
          this.removeNotification(element);
        }, notification.duration);
      }
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  private async showSystemNotification(notification: Notification): Promise<void> {
    try {
      if (chrome.notifications) {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: notification.icon || '/icon.png',
          title: notification.title,
          message: notification.message
        });
      }
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  private removeNotification(element: HTMLElement): void {
    element.classList.add('jtb-notification-hide');
    setTimeout(() => {
      element.remove();
    }, 300); // 等待动画完成
  }

  public async getNotifications(): Promise<Notification[]> {
    try {
      const data = await chrome.storage.local.get([this.NOTIFICATION_KEY]);
      return data[this.NOTIFICATION_KEY] || [];
    } catch (error) {
      errorHandler.handleError(error);
      return [];
    }
  }

  public async clearNotifications(): Promise<void> {
    try {
      await chrome.storage.local.remove([this.NOTIFICATION_KEY]);
      // 移除所有通知元素
      document.querySelectorAll('.jtb-notification').forEach(element => {
        element.remove();
      });
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const notificationService = NotificationService.getInstance();