/*
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-05 16:00:15
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-20 07:50:44
 */ 
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false
//包引用------start
//0.引入babel-polyfill,兼容Ie,将es6转为es5
import 'babel-polyfill'


//1.引入element-ui
import ElementUI, { Message } from 'element-ui'
//默认样式
// import 'element-ui/lib/theme-chalk/index.css'
//自定义样式
import "../static/theme/theme-blue/index.css";
import "../static/css/global.css";
import '../static/theme/theme-blue/iconfont/iconfont.css'
Vue.use(ElementUI)
//后引入路由,组件内样式可以覆盖elementui样式
import router from './router'


//2.引入axios
import axios from 'axios';
// axios.defaults.timeout = 30 * 1000;  
Vue.prototype.$http=axios;//将axios改写到vue原型属性,调用方式例如this.$http.post(xxx)
//3.引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//4.引入ckeditor
// import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
// 引入 状态管理 vuex
import store from './store'
//5.引入moment,表格日期格式化
import moment from 'moment'
Vue.prototype.$moment=moment;//设置到vue原型属性,调用方式this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
import $ from 'jquery'
import commonUtil from './components/common/common'
Vue.prototype.commonUtil = commonUtil;
import commonConstants from './components/common/constants'
Vue.prototype.commonConstants = commonConstants;
import selectUtil from './components/common/selectValue'
Vue.prototype.selectUtil = selectUtil;
import upload from './components/component/upload/upload';
Vue.use(upload);
import fileUpload from './components/component/upload/fileUpload';
Vue.use(fileUpload);
import nodeSelect from './components/component/treeselect/nodeSelect';
Vue.use(nodeSelect);
import selectNode from './components/component/treeselect/selectNode';
Vue.use(selectNode);
import multiselectNode from './components/component/treeselect/multiselectNode';
Vue.use(multiselectNode);
import validate from './components/component/validate/validate'
Vue.use(validate);
import searchForm from './components/component/searchform/searchForm';
Vue.use(searchForm);
import cusTable from './components/component/table/custable';
Vue.use(cusTable);
import modal from './components/component/modal/modal';
Vue.use(modal);
import region from './components/component/region/region';
Vue.use(region);
import global_ from './components/common/Global'//引用文件
Vue.prototype.GLOBAL = global_//挂载到Vue实例上面
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
//包引用------end
//自定义指令
Vue.directive('has', {
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      if(value =="ignore")
      {
        return true;
      }
      // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
      let apis = sessionStorage.getItem("apiList");
      let list = apis.split(",")
      if(list != null && list.length > 0)
      {
        for (let item of list) {
          if (item === value) {
            return true;
          }
        }
      }
      
      return false;
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
