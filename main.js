import Vue from 'vue'
import app from './App.vue'

import store from './store'

new Vue({ store, render: h => h(app) }).$mount('#app')
