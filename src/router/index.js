import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/User'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: User
    }]
  }, {
    path: '/login',
    component: Login
  }]
})
