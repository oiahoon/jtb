import { ErrorType } from './types';
import { recoveryService } from './recovery';
import { backupService } from './backup';
import { reportService } from './report';
import { statsService } from './stats';
import { notificationService } from './notification';

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public async handleError(error: unknown): Promise<AppError> {
    const appError = this.createAppError(error);

    // 创建备份
    await backupService.createBackup();

    // 报告错误
    await reportService.reportError(appError, {
      originalError: error instanceof Error ? error.stack : String(error)
    });

    // 记录错误统计
    await statsService.trackError();

    // 显示错误通知
    await this.showErrorNotification(appError);

    // 尝试恢复
    const recovered = await recoveryService.handleError(appError);
    if (recovered) {
      console.log('Error recovered successfully');
      await notificationService.showNotification(
        'success',
        '错误已恢复',
        '系统已自动恢复，请继续使用',
        { duration: 3000 }
      );
    }

    return appError;
  }

  private createAppError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // 网络错误
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        return new AppError(
          ErrorType.NETWORK_ERROR,
          '网络连接失败，请检查网络设置',
          error
        );
      }

      // 认证错误
      if (error.message.includes('401') || error.message.includes('403')) {
        return new AppError(
          ErrorType.AUTH_ERROR,
          '认证失败，请重新登录 Jira',
          error
        );
      }

      // 配置错误
      if (error.message.includes('configuration') || error.message.includes('config')) {
        return new AppError(
          ErrorType.CONFIG_ERROR,
          '配置错误，请检查设置',
          error
        );
      }
    }

    // 默认错误
    return new AppError(
      ErrorType.DATA_ERROR,
      '发生未知错误，请稍后重试',
      error
    );
  }

  private async showErrorNotification(error: AppError): Promise<void> {
    await notificationService.showNotification(
      'error',
      'JTB Error',
      error.message,
      {
        icon: '/icon.png',
        duration: 5000,
        actions: [
          {
            label: '查看详情',
            callback: () => {
              console.error(`[${error.type}] ${error.message}`, error.originalError);
            }
          },
          {
            label: '报告问题',
            callback: () => {
              // 打开反馈表单
              chrome.runtime.openOptionsPage();
            }
          }
        ]
      }
    );
  }
}

export const errorHandler = ErrorHandler.getInstance();