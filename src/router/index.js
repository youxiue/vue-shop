import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
// 新的加载方式
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/Users')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Roles')

// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/goods/Params')

// import GoodsList from '@/components/goods/List'
// import AddGoods from '@/components/goods/AddGoods'
const GoodsList = () => import(/* webpackChunkName: "goods" */ '@/components/goods/List')
const AddGoods = () => import(/* webpackChunkName: "goods" */ '@/components/goods/AddGoods')

// import Orders from '@/components/order/Order'
// import Report from '@/components/report/Report'
const Orders = () => import(/* webpackChunkName: "orders_report" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "orders_report" */ '@/components/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从哪里来
  // next 是一个函数 表示放行
  // next() 放行    next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token 表示未登录 跳转到登录页面
  if (!tokenStr) return next('/login')
  // 有token 则放行
  next()
})

export default router
