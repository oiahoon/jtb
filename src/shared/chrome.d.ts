/// <reference types="chrome"/>

declare namespace chrome {
  namespace storage {
    interface StorageChange {
      oldValue?: any;
      newValue?: any;
    }

    interface StorageArea {
      get(keys?: string | string[] | object | null): Promise<{ [key: string]: any }>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    const local: StorageArea;
    const sync: StorageArea;

    interface StorageChangedEvent extends chrome.events.Event<(changes: { [key: string]: StorageChange }, areaName: string) => void> {}
    const onChanged: StorageChangedEvent;
  }

  namespace runtime {
    function openOptionsPage(): Promise<void>;
    const onInstalled: chrome.events.Event<(details: { reason: string }) => void>;
  }

  namespace tabs {
    function create(createProperties: { url: string }): Promise<chrome.tabs.Tab>;
  }
}