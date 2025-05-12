import axios from 'axios';
import type { Ticket } from './types';
import { cacheService } from './cache';
import { errorHandler, AppError, ErrorType } from './error';
import { retryService } from './retry';

export class JiraAPI {
  private static instance: JiraAPI;
  private baseUrl: string;

  private constructor() {
    const config = cacheService.getConfig();
    if (!config.jiraUrl) {
      throw new AppError(
        ErrorType.CONFIG_ERROR,
        'Jira URL 未配置，请在选项中设置'
      );
    }
    this.baseUrl = config.jiraUrl;
  }

  public static getInstance(): JiraAPI {
    if (!JiraAPI.instance) {
      JiraAPI.instance = new JiraAPI();
    }
    return JiraAPI.instance;
  }

  public async checkSession(): Promise<boolean> {
    try {
      const response = await retryService.retry(() =>
        axios.get(`${this.baseUrl}/rest/api/2/myself`)
      );
      return response.status === 200;
    } catch (error) {
      const appError = errorHandler.handleError(error);
      errorHandler.showError(appError);
      return false;
    }
  }

  public async getTickets(jql: string): Promise<Ticket[]> {
    // 检查缓存是否有效
    if (cacheService.isCacheValid()) {
      return cacheService.getTickets();
    }

    try {
      const response = await retryService.retry(() =>
        axios.get(`${this.baseUrl}/rest/api/2/search`, {
          params: {
            jql,
            fields: 'summary,status,assignee,issuetype,customfield_10016,customfield_10015,updated'
          }
        })
      );

      const tickets = response.data.issues.map((issue: any) => ({
        id: issue.id,
        key: issue.key,
        issuetype: issue.fields.issuetype.name,
        summary: issue.fields.summary,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        dev_duedate: issue.fields.customfield_10016 || '',
        status: {
          name: issue.fields.status.name,
          id: issue.fields.status.id
        },
        sprint: this.parseSprint(issue.fields.customfield_10015),
        url: `${this.baseUrl}/browse/${issue.key}`,
        lastModified: new Date(issue.fields.updated).getTime()
      }));

      // 更新缓存
      await cacheService.updateTickets(tickets);
      return tickets;
    } catch (error) {
      const appError = errorHandler.handleError(error);
      errorHandler.showError(appError);
      throw appError;
    }
  }

  private parseSprint(sprintString: string): string {
    if (!sprintString) return '';
    try {
      const sprints = JSON.parse(sprintString);
      return sprints.map((sprint: any) => sprint.name).join(', ');
    } catch {
      return sprintString;
    }
  }
}

export const jiraAPI = JiraAPI.getInstance();