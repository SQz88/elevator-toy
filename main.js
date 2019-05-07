import Vue from 'vue'
import app from './App.vue'

const store = require('./store')

new Vue({ store, render: h => h(app) }).$mount('#app')
