// import Vue from './node_modules/vue/dist/vue.esm'

// Define a new component called button-counter
// Vue.component('button-counter', {
//   data: function() {
//     return {
//       count: 0
//     }
//   },
//   template:
//     '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
// })

import shaft from './components/shaft.vue'

new Vue({
  el: '#app',
  data: {
    hehe: 'heh'
  },
  components: { shaft }
})
