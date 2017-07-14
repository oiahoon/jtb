<template>
  <div class="pure-g search-box">
    <form class="pure-form pure-u-23-24" name="jira" id="jira">
      <label for="name">{{ projectName }}</label>
      <input name="jira_number" placeholder="JIRA ID" autofocus type="text" class="pure-input-2-3">
      <button type="submit" class="button-secondary pure-button">Go</button>
    </form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        projectName: 'VEB'
      }
    }
  }
</script>

<style scoped>
  label {
    font-weight: bolder;
  }
</style>