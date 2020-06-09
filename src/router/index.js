import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import index from '@/components/index'
import system from '@/components/system'
import error from '@/components/error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login,
      hidden: true
    },{
      path: '/home',
      component: home,
      meta: {
        keepAlive: true,
        requireAuth: true
      },
      hidden: true,
      children:[
        {
          path: '/',
          component : index,
          keepAlive: true,
          requireAuth: true
        }
      ]
    },{
      path:'/system',
      name:'system',
      component:system,
      meta: {
        keepAlive: true,
        requireAuth: true
      },
      hidden: true
    },{     
      path:'*',
      component:error,
      meta: {
        keepAlive: true,
        requireAuth: true
      },
      hidden: true
    }
  ]
})
