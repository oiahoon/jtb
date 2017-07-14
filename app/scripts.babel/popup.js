'use strict';

console.log('\'Allo \'Allo! Popup');
import Vue from 'vue';
import Popup from './popup/Popup.vue';
import Axios from 'axios'

new Vue({
    el: '#app',
    render: c => c(Popup)
});

