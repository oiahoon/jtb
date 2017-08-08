<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <h1>Jira Tool Box<code>{{ version }}</code></h1>

      <div class="form-group">
        <input type="text" required="required" v-model.trim="jiraLink" />
        <label class="control-label" for="input">Jira link</label><i class="bar"></i>
      </div>

      <div class="form-group">
        <input type="text" required="required" v-model.trim="projectName" />
        <label class="control-label" for="input">Project Name</label><i class="bar"></i>
      </div>

      <div class="form-group">
        <textarea rows="6" required="required" v-model.trim="jql"></textarea>
        <label class="control-label" for="textarea">JQL or Filter</label><i class="bar"></i>
      </div>

    </form>
    <div class="button-container">
      <button class="button" type="button" @click="saveOptions"><span>Save</span></button>
    </div>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        jiraLink: this.$ls.get('jiraLink'),
        projectName: this.$ls.get('project'),
        jql: this.$ls.get('jql'),
        version: manifest.version
      }
    },
    methods:{
      saveOptions: function(){
        this.$ls.set('jiraLink', new URL(this.jiraLink).origin);
        this.$ls.set('project', this.projectName);
        this.$ls.set('jql', this.jql);
        console.log("options saving");
      }
    },
  }
</script>