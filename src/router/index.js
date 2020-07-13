import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    name: 'Setting',
    alwaysShow: true,
    meta: { title: '系统设置', icon: 'icon-system', noCache: true, permission: 'admin:setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/sys/user'),
        meta: { title: '用户管理', icon: 'user', noCache: true, permission: 'admin:user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/sys/role'),
        meta: { title: '角色管理', icon: 'tree', permission: 'admin:role' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/sys/menu'),
        meta: { title: '菜单管理', icon: 'list', permission: 'admin:menu' }
      },
      {
        path: 'operation',
        name: 'operation',
        component: () => import('@/views/sys/operation'),
        meta: { title: '操作管理', icon: 'edit', permission: 'admin:operation' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    name: 'Error',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router