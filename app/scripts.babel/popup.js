'use strict';

console.log('\'Allo \'Allo! Popup');
import Vue from 'vue';
import Axios from 'axios';
import VueLocalStorage from 'vue-ls';

Vue.prototype.$ajax = Axios

var options = {
  namespace: 'jtb__'
};
Vue.use(VueLocalStorage, options);

import Popup from './popup/Popup.vue';

var defaultJql = 'project = veb AND issuetype in standardIssueTypes() AND status in (Open, \'In Progress\', Test, Review, Design, Coding, \'Review Queue\', \'Code Review\') AND assignee in (currentUser()) ORDER BY created DESC';
new Vue({
    el: '#app',
    render: c => c(Popup),
    mounted: function() {
      if (Vue.ls.get('project') == undefined || Vue.ls.get('project') == '') {
        Vue.ls.set('project', 'VEB');
      }
      Vue.ls.set('jql', defaultJql);
      Vue.ls.set('jira_url', 'https://jirafnd.dev.activenetwork.com');
    },
    data: {
      jiraNumber: '',
      jiraLink: '',
      projectName: '',
      jql: ''
    }
});

// this is the workaround to make sure the popup display well
// via https://bugs.chromium.org/p/chromium/issues/detail?id=307912
setTimeout(function(){document.getElementById('workaround-4296411').style.display='block';}, 88);
