import { defineStore } from 'pinia';
import { JiraAPI } from '../../shared/api';
import type { Ticket } from '../../shared/types';

interface TicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

export const useTicketsStore = defineStore('tickets', {
  state: (): TicketsState => ({
    tickets: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTickets() {
      try {
        this.loading = true;
        this.error = null;

        const config = await chrome.storage.local.get(['jtb__jiraLink', 'jtb__jql']);
        if (!config.jtb__jiraLink || !config.jtb__jql) {
          this.error = 'Please configure Jira settings in options page';
          return;
        }

        const api = new JiraAPI(config.jtb__jiraLink);
        this.tickets = await api.getTickets(config.jtb__jql);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load tickets';
      } finally {
        this.loading = false;
      }
    }
  }
});