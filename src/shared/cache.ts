import type { Ticket, Config } from './types';

interface CacheData {
  tickets: Ticket[];
  lastUpdated: number;
  config: Config;
}

class CacheService {
  private static instance: CacheService;
  private cache: CacheData = {
    tickets: [],
    lastUpdated: 0,
    config: {
      jiraUrl: '',
      projectKey: '',
      jql: ''
    }
  };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private async loadFromStorage() {
    try {
      const data = await chrome.storage.local.get(['cache']);
      if (data.cache) {
        this.cache = data.cache;
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  private async saveToStorage() {
    try {
      await chrome.storage.local.set({ cache: this.cache });
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  public getTickets(): Ticket[] {
    return this.cache.tickets;
  }

  public getConfig(): Config {
    return this.cache.config;
  }

  public async updateTickets(tickets: Ticket[]) {
    this.cache.tickets = tickets;
    this.cache.lastUpdated = Date.now();
    await this.saveToStorage();
  }

  public async updateConfig(config: Config) {
    this.cache.config = config;
    await this.saveToStorage();
  }

  public isCacheValid(maxAge: number = 5 * 60 * 1000): boolean {
    return Date.now() - this.cache.lastUpdated < maxAge;
  }

  public async clearCache() {
    this.cache = {
      tickets: [],
      lastUpdated: 0,
      config: {
        jiraUrl: '',
        projectKey: '',
        jql: ''
      }
    };
    await this.saveToStorage();
  }
}

export const cacheService = CacheService.getInstance();