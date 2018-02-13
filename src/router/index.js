import Vue from 'vue'
import Router from 'vue-router'
import app from '@/App.vue'
import autorization from '@/components/autorization.vue'
import history from '@/components/history/history.vue'
import userHistory from '@/components/history/userHistory.vue'
import productHistory from '@/components/history/productHistory.vue'
import productHistoryItem from '@/components/history/productHistoryItem.vue'
import productHistoryAll from '@/components/history/productHistoryAll.vue'
import administration from '@/components/administration/administration.vue'
import users from '@/components/administration/components/users.vue'
import equipment from '@/components/administration/components/equipment.vue'
import home from '@/components/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      //name: 'autorization',
      component: autorization
    },
    {
      path: '/home',
      //name: 'autorization',
      component: home
    },
    {
      path: '/admin',
      //name: 'admin',
      component: administration,
      children:[
        {
          path:'users',
          component:users
        },
        {
          path:'equipment',
          component:equipment
        }
      ]

    },
    {
      path:'/history',
      component: history,
      children:[
        {
          path:'user/:id',
          component:userHistory
        },
        {
          path:'product/:product_id',
          component:productHistory,
          children:[
            {
              path:'item',
              component:productHistoryItem,
            },
            {
              path:'all',
              component:productHistoryAll,
              props:{product_id: true}
            }
          ]
        }
      ]
    },
    /*{
      path: '/userHistory/:id',
      //name: 'userHistory',
      component: userHistory
    },
    {
      path: '/productHistory/:id',
      //name: 'productHistory',
      component: productHistory
    },*/
     {
      path: '*',
      //name: 'default',
      component: autorization
    }
  ]
})
