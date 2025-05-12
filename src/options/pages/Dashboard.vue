<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Dashboard</h2>
      <div class="dashboard-actions">
        <div class="export-dropdown">
          <button class="export-btn" @click="showExportMenu = !showExportMenu">
            <span class="icon">↓</span>
            Export
          </button>
          <div class="export-menu" v-if="showExportMenu">
            <button @click="exportData('csv')">Export as CSV</button>
            <button @click="exportData('json')">Export as JSON</button>
            <button @click="exportData('excel')">Export as Excel</button>
          </div>
        </div>
        <button class="refresh-btn" @click="refreshData">
          <span class="icon">↻</span>
          Refresh
        </button>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="grid-item">
        <Chart
          type="pie"
          title="Ticket Status"
          :tickets="tickets"
        />
      </div>
      <div class="grid-item">
        <Chart
          type="doughnut"
          title="Ticket Types"
          :tickets="tickets"
        />
      </div>
      <div class="grid-item">
        <Chart
          type="line"
          title="Activity"
          :showTimeRange="true"
        />
      </div>
      <div class="grid-item">
        <Chart
          type="bar"
          title="Errors"
          :showTimeRange="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from '../../shared/components/Chart.vue';
import { useConfigStore } from '../stores/config';
import { jiraAPI } from '../../shared/api';
import { errorHandler } from '../../shared/error';
import { notificationService } from '../../shared/notification';
import { exportService } from '../../shared/export';
import type { ExportFormat } from '../../shared/export';

const configStore = useConfigStore();
const tickets = ref([]);
const showExportMenu = ref(false);

const refreshData = async () => {
  try {
    const response = await jiraAPI.getTickets(configStore.jql);
    tickets.value = response;
    await notificationService.showNotification(
      'success',
      'Data Refreshed',
      'Dashboard data has been updated successfully'
    );
  } catch (error) {
    errorHandler.handleError(error);
  }
};

const exportData = async (format: ExportFormat) => {
  try {
    await exportService.exportData(tickets.value, 'tickets', {
      format,
      includeHeaders: true
    });
    showExportMenu.value = false;
  } catch (error) {
    errorHandler.handleError(error);
  }
};

onMounted(async () => {
  await refreshData();
});
</script>

<style scoped>
.dashboard {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
}

.export-dropdown {
  position: relative;
}

.export-btn,
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn {
  background: #f0f0f0;
  color: #333;
}

.export-btn:hover {
  background: #e0e0e0;
}

.refresh-btn {
  background: #1890ff;
  color: white;
}

.refresh-btn:hover {
  background: #40a9ff;
}

.export-btn .icon,
.refresh-btn .icon {
  font-size: 16px;
}

.export-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 120px;
  z-index: 1000;
}

.export-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.export-menu button:hover {
  background: #f5f5f5;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  flex: 1;
}

.grid-item {
  min-height: 400px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>