'use strict';

import Vue from 'vue';
import VueLocalStorage from 'vue-ls';

var options = {
  namespace: storage_prefix
};
Vue.use(VueLocalStorage, options);

import Options from './options/Options.vue';

new Vue({
  el: '#app',
  render: c => c(Options)
});