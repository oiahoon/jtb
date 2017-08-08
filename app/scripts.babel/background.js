'use strict';

import Vue from 'vue';
import Axios from 'axios'
import VueLocalStorage from 'vue-ls';
Vue.prototype.$ajax = Axios
var options = {
  namespace: 'jtb__'
};
Vue.use(VueLocalStorage, options);

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

var project_name = Vue.ls.get('project')
chrome.browserAction.setBadgeText({text: project_name});

console.log('\'Allo \'Allo! Event Page for Browser Action');
