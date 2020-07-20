import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import commonUtil from '../components/common/common'
import commonConstants from '../components/common/constants'
Vue.use(Router)

const router = new Router({
  base:commonUtil.baseUrl,
  mode:"history",
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/components/login.vue'),
      meta: { title: '登录页' }
    },
    {
      path: '/home',
      component: () => import('@/components/homepage/homepage.vue'),
      meta: {
        title: '母版页'
      },
      children: [
        {
          path: '/index',
          name: '系统首页',
          component: () => import('@/components/test/shouye'),
          meta: {
            title: '系统首页',
            hideclose: true,
          }
        },
        {
          path: '/sysUser',
          name: 'sysUser',
          component: () => import('@/components/sysuser/sysUser.vue'),
          meta: {
            title: '用户管理',
          }
        },
        {
          path: '/userAccount',
          name: 'userAccount',
          component: () => import('@/components/useraccount/UserAccount.vue'),
          meta: {
            title: '账号管理',
          }
        },
        {
          path: '/sysOrg',
          name: 'sysOrg',
          component: () => import('@/components/sysorg/SysOrg.vue'),
          meta: {
            title: '组织管理',
          }
        },{
          path: '/userRole',
          name: 'userRole',
          component: () => import('@/components/userrole/UserRole.vue'),
          meta: {
            title: '角色管理',
          }
        },{
          path: '/sysCode',
          name: 'sysCode',
          component: () => import('@/components/syscodetype/SysCodeType.vue'),
          meta: {
            title: '数据字典管理',
          }
        },{
          path: '/sysCodeValue',
          name: 'sysCodeValue',
          component: () => import('@/components/syscodevalue/SysCodeValue.vue'),
          meta: {
            title: '字典值管理',
          }
        },{
          path: '/sysMenu',
          name: 'sysMenu',
          component: () => import('@/components/sysmenu/SysMenu.vue'),
          meta: {
            title: '菜单管理',
          }
        },
        {
          path: '/sysFunction',
          name: 'sysFunction',
          component: () => import('@/components/sysfunction/SysFunction.vue'),
          meta: {
            title: '功能管理',
          }
        },
        {
          path: '/hospitalApply',
          name: 'hospitalApply',
          component: () => import('@/components/hospitalapply/hospitalApply.vue'),
          meta: {
            title: '医院入驻申请',
          }
        },
        {
          path: '/doctorApply',
          name: 'doctorApply',
          component: () => import('@/components/doctorapply/doctorApply.vue'),
          meta: {
            title: '医生入驻申请',
          }
        },
        {
          path: '/hospitalDetail',
          name: 'hospitalDetail',
          component: () => import('@/components/hospitaldetail/HospitalDetail.vue'),
          meta: {
            title: '医院档案',
          }
        },
        {
          path: '/hospitaldepartment',
          name: 'hospitaldepartment',
          component: () => import('@/components/hospitaldepartment/HospitalDepartment.vue'),
          meta: {
            title: '医院科室',
          }
        },
        {
          path: '/doctorDetail',
          name: 'doctorDetail',
          component: () => import('@/components/doctordetail/DoctorDetail.vue'),
          meta: {
            title: '医生档案',
          }
        },
        {
          path: '/patientDetail',
          name: 'patientDetail',
          component: () => import('@/components/patientdetail/PatientDetail.vue'),
          meta: {
            title: '患者档案',
          }
        },
        {
          path: '/systemDept',
          name: 'systemDept',
          component: () => import('@/components/primarydept/PrimaryDept.vue'),
          meta: {
            title: '一级科室库',
          }
        },
        {
          path: '/secondDept',
          name: 'secondDept',
          component: () => import('@/components/seconddept/SecondDept.vue'),
          meta: {
            title: '二级科室库',
          }
        },
        
      ]
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/components/homepage/404.vue'),
      meta: { title: '路由不存在' }
    },
    {
      name: '403',
      path: '/403',
      component: () => import('@/components/homepage/403.vue'),
      meta: { title: '资源不可访问' }
    },
    {
      name: 'hosApply',
      path: '/hosApply',
      component: () => import('@/components/apply/apply.vue'),
      meta: { title: '资源不可访问' }
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      name: 'vantui',
      path: '/vantui',
      component: () => import('@/components/vant/vantui.vue'),
      meta: { title: '资源不可访问' }
    },
  ],
  mode: 'history'
})
/**
 * 全局路由守卫
 */
const rightPathList = ['/login', '/404', '/403','/register','/vantui'];//直接可以进入的页面
router.beforeEach((to, from, next) => {
  // debugger
  console.log('跳转到:', to.fullPath);
  var token = sessionStorage.getItem('token');
  if (rightPathList.includes(to.path)) {
      next();
  }else{
    if (!token && to.path != '/login') {//登陆认证校验,没登录则跳转/login
      next({ path: '/login' })
    }else{
        next();
    }
  }
})
/**
 * 请求拦截器,添加请求头token
 */
axios.interceptors.request.use(
  config => {
    console.log('>>>请求url:',config.url);
    var headers = config.headers;
    // if (sessionStorage.getItem(commonConstants.sessionItem.authorization)) {
    //   headers.token = sessionStorage.getItem(commonConstants.sessionItem.authorization);
    // }
    return config;
  },
  error => {
    console.log('>>>请求异常:',error.message);
    return Promise.reject(error);
  });
//接口请求超时设置
axios.defaults.timeout=30000;//毫秒

axios.defaults.baseURL=commonUtil.baseUrl

/**
 * 应答拦截器,添加请求头token
 */
axios.interceptors.response.use(function (response) {
  // Do something with response data
  console.log('<<<请求成功');
  return response;
}, error=> {
  // Do something with response error
  console.log('<<<异常信息:',error.message);
  return Promise.reject(error);
});


//获取当前路由是否有权限访问
function hasPermit(to) {
  var hasPermit = false;
  if (to.meta && to.meta.role) {
    var ruleList = getRuleList();
    hasPermit = ruleList.some(rule => {
      return to.meta.role.includes(rule);
    });
  }
  return hasPermit;

}
//获取登陆的角色集合
function getRuleList() {
  var ruleList = []; //角色数组
  var strRule = sessionStorage.getItem("position");
  if (strRule.indexOf("|") != -1) {
    ruleList = strRule.split("|");
  } else {
    ruleList.push(strRule);
  }
  return ruleList;
}

export default router
