import Vue from 'vue'
import App from './App'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

Vue.use(Buefy)

global.vue = new Vue({
  el: '#app',
  render: h => h(App)
})