<template>
  <div class="container">
    <header class="header">
      <h1>Jira Tool Box Settings</h1>
    </header>

    <form @submit.prevent="saveConfig">
      <div class="form-group">
        <label for="jiraLink">Jira URL</label>
        <input
          id="jiraLink"
          v-model="store.jiraLink"
          type="url"
          placeholder="https://your-domain.atlassian.net"
          required
        />
        <div class="help-text">Enter your Jira instance URL</div>
      </div>

      <div class="form-group">
        <label for="project">Project Key</label>
        <input
          id="project"
          v-model="store.project"
          type="text"
          placeholder="PROJ"
          required
        />
        <div class="help-text">Enter your Jira project key (e.g., PROJ)</div>
      </div>

      <div class="form-group">
        <label for="jql">JQL Query</label>
        <textarea
          id="jql"
          v-model="store.jql"
          rows="4"
          placeholder="project = PROJ AND status != Done ORDER BY updated DESC"
          required
        ></textarea>
        <div class="help-text">Enter JQL query to filter tickets</div>
      </div>

      <div class="actions">
        <button type="submit" class="button button-primary" :disabled="store.loading">
          {{ store.loading ? 'Saving...' : 'Save' }}
        </button>
        <button type="button" class="button button-secondary" @click="resetForm" :disabled="store.loading">
          Reset
        </button>
      </div>

      <div v-if="store.error" class="status status-error">
        {{ store.error }}
      </div>
      <div v-if="store.success" class="status status-success">
        {{ store.success }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigStore } from './stores/config';

const store = useConfigStore();

const saveConfig = async () => {
  await store.saveConfig();
};

const resetForm = async () => {
  await store.loadConfig();
};

onMounted(() => {
  store.loadConfig();
});
</script>