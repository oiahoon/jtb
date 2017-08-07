<template>
  <nav class="archive-links pure-u-23-24">
    <ol>
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
  import ItemComponent from './item.vue'

  export default {
    name: 'list',
    props: ['jiraLink'],
    data() {
      this.retriveJiraData()
      // return this.sampleData()
      return {
        items: this.sampleData()
      }
    },
    components: {
      ItemComponent
    },
    methods: {
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
        var originUrl    = this.$ls.get('jira_url')
        var apiSearchUrl = originUrl + "/rest/api/2/search"
        var vm = this

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
          console.log(response);
          var tickets = response.data.issues
          tickets.forEach(function(ticket){
            vm.items.push(
              new Ticket({
                id: ticket.id,
                key: ticket.key,
                issuetype: ticket.fields.issuetype.name,
                summary: ticket.fields.summary,
                assignee: ticket.fields.assignee.displayName,
                dev_duedate: ticket.fields.customfield_12551,
                status: ticket.fields.status,
                sprint: ticket.fields.customfield_11150
              })
            )
          })
        })
        .catch(function (error) {
          console.log(error);
        });

        function Ticket(dataHash) {
          this.id             = dataHash['id'];
          this.key            = dataHash['key'];
          this.issuetype      = dataHash['issuetype'];
          this.summary        = dataHash['summary'];
          this.assignee       = dataHash['assignee'];
          this.dev_duedate    = dataHash['dev_duedate'];
          this.status         = dataHash['status'];
          this.sprint         = dataHash['sprint'];
          this.url            = originUrl + '/browse/' + dataHash['key'];
        }
      }
    }
  }
</script>