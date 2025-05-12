import { defineStore } from 'pinia';
import { JiraAPI } from '../../shared/api';
import type { Storage } from '../../shared/types';

interface ConfigState {
  jiraLink: string;
  project: string;
  jql: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    jiraLink: '',
    project: '',
    jql: '',
    loading: false,
    error: null,
    success: null
  }),

  actions: {
    async loadConfig() {
      try {
        this.loading = true;
        this.error = null;

        const config = await chrome.storage.local.get(['jtb__jiraLink', 'jtb__project', 'jtb__jql']);
        this.jiraLink = config.jtb__jiraLink || '';
        this.project = config.jtb__project || '';
        this.jql = config.jtb__jql || '';
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load configuration';
      } finally {
        this.loading = false;
      }
    },

    async saveConfig() {
      try {
        this.loading = true;
        this.error = null;
        this.success = null;

        // 验证 Jira 链接
        const api = new JiraAPI(this.jiraLink);
        const isValid = await api.checkSession();
        if (!isValid) {
          this.error = 'Invalid Jira URL or session expired';
          return;
        }

        // 保存配置
        await chrome.storage.local.set({
          jtb__jiraLink: this.jiraLink,
          jtb__project: this.project,
          jtb__jql: this.jql
        });

        this.success = 'Configuration saved successfully';
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to save configuration';
      } finally {
        this.loading = false;
      }
    }
  }
});