import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      routes: []
  },
  mutations: {//同步执行
      initRoutes(state, data) {
          state.routes = data
      }
  },
  actions: {
      //异步执行
  }
})
