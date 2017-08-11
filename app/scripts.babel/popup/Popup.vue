<template>
  <div class="container">
    <div class="pure-g search-box">
      <form class="pure-form pure-u-23-24" name="jira" id="jira" @submit.prevent="goTicket()">
        <div class="pure-u-9-24">
          <input name="project_name" class="pure-input-3-4" v-model="projectName" placeholder="Empty" title="Your frequently-used project’s ABBR" />
          <label for="seperator" class="seperator">&minus;</label>
        </div>
        <div class="pure-u-9-24">
          <input name="jira_number" id="jira_number" v-model.number.trim="jiraNumber" placeholder="JIRA ID" autofocus type="text" class="pure-input-1">
        </div>
        <div class="pure-u-1-5">
          <button type="submit" class="button-secondary pure-button">Go</button>
        </div>
      </form>
    </div>
    <list-component jiraLink="jiraLink"></list-component>
  </div>
</template>
<script>
  import ListComponent from './list.vue'
  export default {
    name: 'JTB',
    components: {
      ListComponent
    },
    data() {
      return {
        jiraLink: this.$ls.get('jiraLink'),
        projectName: this.$ls.get('project', ''),
        jql: this.$ls.get('jql', ''),
        jiraNumber: this.jiraNumber
      }
    },
    computed: {
      jira_url: function(){
        return new URL(this.jiraLink).origin
      },
      jira_key: function(){
        if(this.projectName == '') { return this.jiraNumber }
        else { return this.projectName + '-' + this.jiraNumber }
      }
    },
    methods:{
      goTicket: function(){
        chrome.tabs.create({url: this.jira_url+'/browse/'+this.jira_key, active: false});
        this.jiraNumber=''
      }
    },
    watch: {
      projectName: function(val, oldVal){
        this.$ls.set('project', val);
        console.log('project name changed, ['+ oldVal + '] => [' + val+ ']');
      }
    }

  }
  setTimeout(function(){document.getElementById('jira_number').focus();}, 108);
</script>

<style scoped>
  label {
    font-weight: bolder;
  }
  .pure-form input {
    border: 2px solid #ddd;
    box-shadow: none;
    font-size: 100%;
  }
  button {
    padding: 0.6em 2em;
    border-radius: 5px;
    float: right;
  }
</style>