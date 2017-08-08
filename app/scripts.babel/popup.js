'use strict';

import Vue from 'vue';
import Axios from 'axios';
import VueLocalStorage from 'vue-ls';

Vue.prototype.$ajax = Axios

var options = {
  namespace: storage_prefix
};
Vue.use(VueLocalStorage, options);

import Popup from './popup/Popup.vue';
import Noconfig from './popup/Noconfig.vue';

console.log(Vue.ls.get('project'))
if (Vue.ls.get('jiraLink')=='' || Vue.ls.get('project')=='' || Vue.ls.get('jql')==''
  || Vue.ls.get('jiraLink')== undefined || Vue.ls.get('project')== undefined || Vue.ls.get('jql')== undefined) {
  new Vue({
      el: '#app',
      render: c => c(Noconfig)
  });
}
else{
  new Vue({
      el: '#app',
      render: c => c(Popup)
  });
}

// this is the workaround to make sure the popup display well
// via https://bugs.chromium.org/p/chromium/issues/detail?id=307912
setTimeout(function(){document.getElementById('workaround-4296411').style.display='block';}, 88);
