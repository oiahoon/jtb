<template>
  <div class="popup">
    <div class="popup-header">
      <h1>Jira Tool Box</h1>
    </div>
    <div class="popup-content">
      <div v-if="loading" class="loading">
        Loading...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="ticket-list">
        <div v-for="ticket in tickets" :key="ticket.key" class="ticket-item">
          <div class="ticket-header">
            <span class="ticket-key">{{ ticket.key }}</span>
            <span class="ticket-status" :style="{ backgroundColor: getStatusColor(ticket.status) }">
              {{ ticket.status }}
            </span>
          </div>
          <div class="ticket-title">{{ ticket.summary }}</div>
          <div class="ticket-meta">
            <span class="ticket-type">{{ ticket.type }}</span>
            <span class="ticket-assignee">{{ ticket.assignee }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup-footer">
      <button class="btn btn-default" @click="openOptions">Settings</button>
      <button class="btn btn-primary" @click="refreshTickets">Refresh</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { jiraAPI } from '../shared/api';
import { errorHandler } from '../shared/error';
import { notificationService } from '../shared/notification';
import type { Ticket } from '../shared/types';

const tickets = ref<Ticket[]>([]);
const loading = ref(true);
const error = ref('');

const loadTickets = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await jiraAPI.getTickets('assignee = currentUser() ORDER BY updated DESC');
    tickets.value = response;
  } catch (err) {
    error.value = 'Failed to load tickets';
    errorHandler.handleError(err);
  } finally {
    loading.value = false;
  }
};

const refreshTickets = async () => {
  await loadTickets();
  await notificationService.showNotification(
    'success',
    'Tickets Refreshed',
    'Your tickets have been updated'
  );
};

const openOptions = () => {
  chrome.runtime.openOptionsPage();
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'To Do': '#e6f7ff',
    'In Progress': '#fff7e6',
    'Done': '#f6ffed',
    'Blocked': '#fff1f0'
  };
  return colors[status] || '#f5f5f5';
};

onMounted(() => {
  loadTickets();
});
</script>

<style scoped>
.popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.error {
  color: #ff4d4f;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-item {
  background: white;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ticket-key {
  font-weight: 600;
  color: #1890ff;
}

.ticket-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
}

.ticket-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.ticket-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.ticket-type {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 2px;
}

.ticket-assignee {
  color: #1890ff;
}
</style>