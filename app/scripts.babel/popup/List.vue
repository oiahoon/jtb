<template>
  <nav class="archive-links pure-u-23-24">
    <div class="go-login" :class="showLogin">
      You are not logined.
      <button class="pure-button-primary pure-button" @click="goJiraLogin">Login First</button>
    </div>
    <div class="loader" :class="loadingStatus">Loading...</div>
    <ol :class="listShow">
      <item-component
        v-for="(item, index) in items"
        v-bind:item="item"
        v-bind:index="index"
        v-bind:key="index">
      </item-component>
    </ol>
  </nav>
</template>

<script>
  import ItemComponent from './Item.vue'

  export default {
    name: 'list',
    props: ['jiraLink'],
    data() {
      var items = []
      this.retriveJiraData()
      return {
        items: items,
        currentUser: 'Unknown',
        loadingStatus: false,
        listShow: 'hidden',
        showLogin: 'hidden'
      }
      // return this.sampleData()
      // return {
      //   items: this.sampleData()
      // }
    },
    components: {
      ItemComponent
    },
    watch: {
      items: function(){
        this.loadingStatus = 'hidden',
        this.listShow = false
      }
    },
    methods: {
      goJiraLogin: function(){
        var url = this.$ls.get('jiraLink')
        chrome.tabs.create({url: url, active: true})
      },
      sampleData: function(){

        function Ticket(dataHash) {
          this.title   = dataHash['title'];
          this.date    = dataHash['date'];
          this.comment = dataHash['comment'];
          this.type    = dataHash['type'];
        }
        var items = [
          // new Ticket({title: 'Tellus Cursus Magna Vestibulum', date: 'Nov 05, 2012', comment: 'No Comments', type: 'bug'}),
          // new Ticket({title: 'Justo Adipiscing Tristique ...', date: 'Nov 01, 2012', comment: 'No Comments' }),
          // new Ticket({title: 'Herman Miller - Why Design', date: 'Nov 05, 2012', comment: 'No Comments'}),
          // new Ticket({title: 'Eames Lounge Chair', date: 'Nov 05, 2012', comment: '1 Comments', type: 'story'}),
          // new Ticket({title: 'COODO Modular', date: 'Jun 25, 2012', comment: '1 Comments'})
        ]
        return items
      },
      retriveJiraData: function(){
        var jira_data    = []
        var jql          = this.$ls.get('jql')
        var originUrl    = this.$ls.get('jiraLink')
        var apiSearchUrl = originUrl + "/rest/api/2/search"
        var apiSessionUrl = originUrl + "/rest/auth/1/session"
        var vm = this

        // session
        this.$ajax.get(apiSessionUrl)
          .then(function (response) {
            console.log(response)
            if (response.errorMessages) {
              vm.showLogin = false
              vm.loadingStatus = 'hidden'
              exit;
            }
            else{
              vm.currentUser = response.name
            }
          })
          .catch(function (error) {
            vm.showLogin = false
            vm.loadingStatus = 'hidden'
            console.log(error);
            exit;
          });

        if(!jql && this.$ls.get('project')){
          jql = 'project = '+ this.$ls.get('project')
        }

        this.$ajax.post(apiSearchUrl, {
            'jql': jql,
            "startAt": 0,
            "maxResults": 50,
            "fields":["id","key", "duedate", "summary",
                      "progress","timespent", "status", "customfield_12551",
                      // "subtasks", "fixVersions",
                      "assignee", "customfield_11150", "issuetype"]
          }
        )
        .then(function (response) {
          console.log("response from jira:")
          console.log(response)
          var tickets = response.data.issues
          tickets.forEach(function(ticket){
            vm.items.push(
              new Ticket(ticket)
            )
          })
        })
        .catch(function (error) {
          console.log(error);
        });

        function Ticket(item) {
          this.id             = item.id;
          this.key            = item.key;
          this.issuetype      = (item.fields.issuetype) ? item.fields.issuetype.name : 'none';
          this.summary        = item.fields.summary;
          this.assignee       = (item.fields.assignee) ? item.fields.assignee.displayName : 'nobody';
          this.dev_duedate    = (item.fields.customfield_12551) ? item.fields.customfield_12551 : '';
          this.status         = item.fields.status;
          this.sprint         = (item.fields.customfield_11150) ? item.fields.customfield_11150 : '';
          this.url            = originUrl + '/browse/' + item.key;
        }
      }
    }
  }
</script>