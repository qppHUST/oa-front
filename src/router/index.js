import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Friendchat from '@/views/chat/friendchat.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"login",
    component: Login,
    hidden:true //以确保菜单不会把这个渲染出来
  },
  {
    path:'/home',
    name:'Home',
    component:Home,
    children:[
      {
        path:'/chat',
        name:'在线聊天',
        component:Friendchat
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
