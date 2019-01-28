import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

global.vue = new Vue({
  el: '#app',
  render: h => h(App)
})