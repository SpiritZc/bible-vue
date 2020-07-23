<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-06-11 18:14:53
--> 
<template>
  <!-- 没用el-aside因为自带300宽度 -->
  <div class="_aside">
    <el-menu
      :default-active="onRoutes"
      :collapse="navShow"
      class="el-menu-vertical-demo menu"
      unique-opened
      router
    >
      <template v-for="(menu_one,i) in menuData">
        <el-submenu  :key="i" :index="menu_one.path">
          <template slot="title">
            <i :class="menu_one.icon"></i>
            <span>{{menu_one.title}}</span>
          </template>

          <el-menu-iteml-menu-item
            v-for="(menu_two,i) in menu_one.subs"
            :key="i"
            :index="menu_two.path"
          >
            <i :class="menu_two.icon"></i>
            <span>{{menu_two.title}}</span>
          </el-menu-iteml-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<style lang="scss">
._aside {
  .menu {
    height: 100%;
  }
  .menu:not(.el-menu--collapse) {
    //设置才可以有折叠特效
    width: 300px;
  }
}
</style>

<script>
import bus from "../common/bus";
// import commonUtil from '../common/common'
export default {
  data() {
    return {
      navShow: false, //导航是否折叠
      menuData: [
        // {path:"p_system",icon:"el-icon-document",title:"系统管理",subs:[{path:"sysUser",icon:"el-icon-document",title:"用户管理"},{path:"userAccount",icon:"el-icon-document",title:"账户管理"},{path:"sysOrg",icon:"el-icon-document",title:"组织管理"},{path:"userRole",icon:"el-icon-document",title:"角色管理"}]}
      ]
    };
  },
  created() {
    bus.$on("navShowChange", navShow => {
      this.navShow = navShow;
    });
  },
  mounted() {
    this.getMenus();
  },
  methods: {
      getMenus(){
        var obj={
          url:"/api/sysMenu/getIndexMenu",
          params:{},
        }
        this.commonUtil.doPost(obj) .then(response=>{
            this.menuData = response.responseData
        });
        // this.commonUtil.doAjaxPost(param);
      },
      getMenusCallback(response){
        this.menuData = response.responseData
      }
  },
  computed: {
    onRoutes() {
      //监听路由,设置默认激活项目
      return this.$route.path.replace("/", "");
    }
  }
};
</script>