<template>
  <div id="login">
    <div id="bgd">
      <canvas
        id='myCanvas'
        :width='width'
        :height='height'
      >
      </canvas>
    </div>
    <div id="loginBox">
      <h2>欢迎登录</h2><br>
      <el-form
        :model="formLogin"
        class="form "  
        ref="form"
        label-width="0px"
      >
        <el-form-item prop="loginName" :rules='filter_rules("账号",{required:true})'>
          <el-input  v-model="formLogin.loginName" placeholder="账号" suffix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules='filter_rules("密码",{required:true})'>
          <el-input type="password" v-model="formLogin.password" placeholder="密码" suffix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item style="margin-top:55px;">
             <el-button type="primary" @click="login" class="submitBtn" round>登录</el-button>
        </el-form-item>
        <div class="disclaimer">
        <p>欢迎使用运营管理
          后台</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      context: null,
      stars: [], //星星数组
      shadowColorList: [
        "#39f",
        "#ec5707",
        "#b031d4",
        "#22e6c7",
        "#92d819",
        "#14d7f1",
        "#e23c66"
      ], //阴影颜色列表
      directionList: ["leftTop", "leftBottom", "rightTop", "rightBottom"], //星星运行方向
      speed: 50, //星星运行速度
      last_star_created_time: new Date(), //上次重绘星星时间
      Ball: class Ball {
        constructor(radius) {
          this.x = 0;
          this.y = 0;
          this.radius = radius;
          this.color = "";
          this.shadowColor = "";
          this.direction = "";
        }

        draw(context) {
          context.save();
          context.translate(this.x, this.y);
          context.lineWidth = this.lineWidth;
          var my_gradient = context.createLinearGradient(0, 0, 0, 8);
          my_gradient.addColorStop(0, this.color);
          my_gradient.addColorStop(1, this.shadowColor);
          context.fillStyle = my_gradient;
          context.beginPath();
          context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
          context.closePath();

          context.shadowColor = this.shadowColor;
          context.shadowOffsetX = 0;
          context.shadowOffsetY = 0;
          context.shadowBlur = 10;

          context.fill();
          context.restore();
        }
      }, //工厂模式定义Ball类
      width: window.innerWidth,
      height: window.innerHeight,
      formLogin: {
        loginName: "",
        password: "",
        code:""
      },
    };
  },
  methods: {
    //提交登录
    login() {
      const self = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var param = {
            accountName: this.formLogin.loginName,
            password: this.formLogin.password,
          };
          var object = {
              url:"/api/login/doLogin",
              params:param,
              removeEmpty:false,
          }
          this.commonUtil.doPost(object).then(response=>{
              if (response.code == "200")
              {
                var responseData = response.responseData;
                // sessionStorage.setItem(this.commonConstants.sessionItem.orgIds, responseData.orgIds); //所属组织信息
                sessionStorage.setItem(this.commonConstants.sessionItem.isAdmin, responseData.isAdmin); //是否超级管理员
                sessionStorage.setItem(this.commonConstants.sessionItem.position, responseData.roleName); //用户职位
                sessionStorage.setItem(this.commonConstants.sessionItem.userName, responseData.userName); //用户名
                sessionStorage.setItem(this.commonConstants.sessionItem.apiList, responseData.functions);//接口权限，用于判断页面按钮是否显示
                sessionStorage.setItem(this.commonConstants.sessionItem.authorization, responseData.token);//token
                // this.commonUtil.initCodeTypeValue();//数据字典初始化
                this.$router.replace({ path: "/index" });
                this.setCookie('accountName',responseData.accountName);
              }
          });
        }else{
          return false;
        }
      })
    },
    //设置cookie
    setCookie(key,value) {
        //字符串拼接cookie
        window.document.cookie = key+"="+value;
    },
    getCookie(key){
      if (window.document.cookie.length > 0){
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('='); //再次切割
          //判断查找相对应的值
          if (arr2[0] == key) {
            return arr2[1];
          }
        }
      }
    },
    //重复动画
    drawFrame() {
      let animation = requestAnimationFrame(this.drawFrame);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.createStar(false);
      this.stars.forEach(this.moveStar);
    },
    //展示所有的星星
    createStar(params) {
      let now = new Date();
      if (params) {
        //初始化星星
        for (var i = 0; i < 50; i++) {
          const radius = Math.random() * 3 + 2;
          let star = new this.Ball(radius);
          star.x = Math.random() * this.canvas.width + 1;
          star.y = Math.random() * this.canvas.height + 1;
          star.color = "#ffffff";
          star.shadowColor = this.shadowColorList[
            Math.floor(Math.random() * this.shadowColorList.length)
          ];
          star.direction = this.directionList[
            Math.floor(Math.random() * this.directionList.length)
          ];
          this.stars.push(star);
        }
      } else if (!params && now - this.last_star_created_time > 3000) {
        //每隔3秒重绘修改颜色其中30个球阴影颜色
        for (var i = 0; i < 30; i++) {
          this.stars[i].shadowColor = this.shadowColorList[
            Math.floor(Math.random() * this.shadowColorList.length)
          ];
        }
        this.last_star_created_time = now;
      }
    },
    //移动
    moveStar(star, index) {
      if (star.y - this.canvas.height > 0) {
        //触底
        if (Math.floor(Math.random() * 2) === 1) {
          star.direction = "leftTop";
        } else {
          star.direction = "rightTop";
        }
      } else if (star.y < 2) {
        //触顶
        if (Math.floor(Math.random() * 2) === 1) {
          star.direction = "rightBottom";
        } else {
          star.direction = "leftBottom";
        }
      } else if (star.x < 2) {
        //左边
        if (Math.floor(Math.random() * 2) === 1) {
          star.direction = "rightTop";
        } else {
          star.direction = "rightBottom";
        }
      } else if (star.x - this.canvas.width > 0) {
        //右边
        if (Math.floor(Math.random() * 2) === 1) {
          star.direction = "leftBottom";
        } else {
          star.direction = "leftTop";
        }
      }
      if (star.direction === "leftTop") {
        star.y -= star.radius / this.speed;
        star.x -= star.radius / this.speed;
      } else if (star.direction === "rightBottom") {
        star.y += star.radius / this.speed;
        star.x += star.radius / this.speed;
      } else if (star.direction === "leftBottom") {
        star.y += star.radius / this.speed;
        star.x -= star.radius / this.speed;
      } else if (star.direction === "rightTop") {
        star.y -= star.radius / this.speed;
        star.x += star.radius / this.speed;
      }
      star.draw(this.context);
    }
  },
  mounted() {
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");
    this.createStar(true);
    this.drawFrame();
    let accountName = this.getCookie('accountName');
    this.$refs['form'].resetFields();//校验重置
    this.formLogin.loginName = accountName;
  }
};
</script>

<style lang='less' scoped>
#login {
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: left top;
  background-color: #409eff;
  color: #fff;
  font-family: "Source Sans Pro";
  background-size: 100% 100%;
  background-image: url("../../static/img/background.jpg");
  position: relative;
  #bgd {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  #loginBox {
    width: 240px;
    height: 280px;
    position: absolute;
    top: 0;
    //left: 0;
    right: 15%;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, #00000094 100%);
    /deep/ .inps input {
      border: none;
      color: #fff;
      background-color: transparent;
      font-size: 12px;
    }
    .submitBtn {
      background-color: transparent;
    //   color: #39f;
      width: 240px;
    }
    .iconfont {
      color: #fff;
    }
  }
  .disclaimer{
    position: absolute;
    bottom: 20px;
    left: 35px;
    width: 250px;
    font-size: 10px;
    color: #d3d7f7;
    }
    h2{
        color: #d3d7f7;
    }
}
</style>