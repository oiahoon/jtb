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

console.log(Vue.ls.get('jiraLink'))
if (Vue.ls.get('jiraLink')=='' || Vue.ls.get('jiraLink')== undefined) {
  new Vue({
      el: '#app',
      render: c => c(Noconfig)
  });
}
// no session
// else if (true) {}
else{
  new Vue({
      el: '#app',
      render: c => c(Popup)
  });
}

// this is the workaround to make sure the popup display well
// via https://bugs.chromium.org/p/chromium/issues/detail?id=307912
setTimeout(function(){document.getElementById('workaround-4296411').style.display='block';}, 88);
