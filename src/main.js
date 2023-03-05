import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementui from 'element-ui'
import {initMenu} from '@/utils/menus'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

import {postRequest, putRequest, getRequest, deleteRequest} from "@/utils/api"
import { downloadRequest } from './utils/download'

Vue.config.productionTip = false
Vue.use(elementui,{size:'small'})

Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.downloadRequest = downloadRequest

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
        //因为每次刷新会重置vuex
      initMenu(router, store);
        //存入用户信息，判断用户信息是否存在
      if (!window.sessionStorage.getItem('user')) {
          return getRequest('/admin/info').then((result) => {
              if (result) {
                  window.sessionStorage.setItem('user', JSON.stringify(result));
                  next();
              }
          })
      }
      next();
  } else {
      if (to.path == '/' || to.path =='/home') {
          next();
      } else {
        console.log(to.path)
          next('/?redirect=' + to.path);
      }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
