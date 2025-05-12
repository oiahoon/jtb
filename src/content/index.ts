import { JiraAPI } from '../shared/api';
import type { Ticket } from '../shared/types';
import './style.css';

// 检查是否是 Jira 页面
function isJiraPage(): boolean {
  return window.location.hostname.includes('atlassian.net');
}

// 获取当前任务信息
function getCurrentTicket(): Ticket | null {
  const keyElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]');
  if (!keyElement) return null;

  const key = keyElement.textContent?.trim() || '';
  const summary = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]')?.textContent?.trim() || '';
  const status = document.querySelector('[data-testid="status-field"]')?.textContent?.trim() || '';
  const assignee = document.querySelector('[data-testid="issue-field-assignee"]')?.textContent?.trim() || '';
  const type = document.querySelector('[data-testid="issue-field-issuetype"]')?.textContent?.trim() || '';

  return {
    id: key,
    key,
    issuetype: type,
    summary,
    assignee,
    dev_duedate: '',
    status: {
      name: status,
      id: ''
    },
    sprint: '',
    url: window.location.href
  };
}

// 显示提示信息
function showTooltip(text: string, target: HTMLElement) {
  const tooltip = document.createElement('div');
  tooltip.className = 'jtb-tooltip';
  tooltip.textContent = text;

  document.body.appendChild(tooltip);

  const rect = target.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

  requestAnimationFrame(() => {
    tooltip.classList.add('visible');
  });

  setTimeout(() => {
    tooltip.classList.remove('visible');
    setTimeout(() => {
      tooltip.remove();
    }, 200);
  }, 2000);
}

// 添加快速操作按钮
function addQuickActions() {
  const header = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]');
  if (!header) return;

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'jtb-quick-actions';

  const buttons = [
    {
      text: '📋 Copy Key',
      action: (button: HTMLButtonElement) => {
        const key = getCurrentTicket()?.key;
        if (key) {
          navigator.clipboard.writeText(key);
          showTooltip('Copied to clipboard!', button);
        }
      }
    },
    {
      text: '🔗 Copy URL',
      action: (button: HTMLButtonElement) => {
        navigator.clipboard.writeText(window.location.href);
        showTooltip('Copied to clipboard!', button);
      }
    },
    {
      text: '📝 Copy Summary',
      action: (button: HTMLButtonElement) => {
        const summary = getCurrentTicket()?.summary;
        if (summary) {
          navigator.clipboard.writeText(summary);
          showTooltip('Copied to clipboard!', button);
        }
      }
    }
  ];

  buttons.forEach(({ text, action }) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => action(button));
    actionsContainer.appendChild(button);
  });

  header.appendChild(actionsContainer);
}

// 添加键盘快捷键
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Alt + K: 复制任务 Key
    if (event.altKey && event.key === 'k') {
      const key = getCurrentTicket()?.key;
      if (key) {
        navigator.clipboard.writeText(key);
        showTooltip('Copied key to clipboard!', document.body);
      }
    }
    // Alt + U: 复制任务 URL
    if (event.altKey && event.key === 'u') {
      navigator.clipboard.writeText(window.location.href);
      showTooltip('Copied URL to clipboard!', document.body);
    }
    // Alt + S: 复制任务摘要
    if (event.altKey && event.key === 's') {
      const summary = getCurrentTicket()?.summary;
      if (summary) {
        navigator.clipboard.writeText(summary);
        showTooltip('Copied summary to clipboard!', document.body);
      }
    }
  });
}

// 初始化
async function initialize() {
  if (!isJiraPage()) return;

  // 等待页面加载完成
  const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]')) {
      addQuickActions();
      addKeyboardShortcuts();
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 启动
initialize();