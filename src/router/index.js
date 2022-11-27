import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"login",
    component: Login,
    hidden:true //以确保菜单不会把这个渲染出来
  }
]

const router = new VueRouter({
  routes
})

export default router
