<!--
 * @Description: 医院入驻申请
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-17 16:18:37
 * @LastEditors: caiyang
 * @LastEditTime: 2020-06-22 11:38:03
--> 
<template>

<body>
  <div class="applystep">
    <div class="steps">
        <el-steps :active="3"  align-center >
            <el-step title="请准确填写医院信息表单" ></el-step>
            <el-step title="提交表单等待审核" ></el-step>
            <el-step title="等待工作人员联系" ></el-step>
        </el-steps>
    </div>
  </div>
    <div class="main">
      <div class="container a-container" id="a-container">
        <div>
        <el-form  ref="formRef" class="form" :model="formData">
            <h2 class="form_title title">申请入驻</h2>
           <el-form-item prop="hospitalName" :rules='filter_rules("医院名称",{required:true})'>
                <el-input :style="'width:430px'"  type="text" placeholder="医院名称" v-model="formData.hospitalName"/>
           </el-form-item>
           <el-form-item prop="areaCode" :rules='filter_rules("所在地区",{required:true})'>
             <region :customStyle="'width:430px'" v-model="formData.areaCode" :areaCode.sync="formData.areaCode"></region>
           </el-form-item>
           <el-form-item prop="hospitalContact" :rules='filter_rules("联系人",{required:true})'>
                <el-input :style="'width:430px'" type="text" placeholder="联系人" v-model="formData.hospitalContact"/>
           </el-form-item>
           <el-form-item prop="hospitalContactInfo" :rules='filter_rules("联系方式",{required:true,type:"mobilephone"})'>
                <el-input :style="'width:430px'" type="text" placeholder="联系方式" v-model="formData.hospitalContactInfo"/>
           </el-form-item>
           <el-button class="form__button button" @click="apply()">提交</el-button>
        </el-form>
         </div>
      </div>
      <div class="switch" id="switch-cnt">
        <div class="switch__circle"></div>
        <div class="switch__circle switch__circle--t"></div>
        <div class="switch__container" id="switch-c1">
          <h2 class="switch__title title">欢迎入驻易复诊互联网平台</h2>
          <p class="switch__description description">请填写准确的信息并提交，我们会在第一时间与您联系。</p>
        </div>
      </div>
    </div>
</body>
</template>
<script>
export default {
  data() {
    return {
        formData:{
            hospitalName:"",
            areaCode:[],
            provinceCode:"",
            cityCode:"",
            reginCode:"",
            hospitalContact:"",
            hospitalContactInfo:"",
        },
        provinces:[],
        cities:[],
        regions:[],
    };
  },
  methods: {
    apply(){
        this.$refs['formRef'].validate((valid) => {
          if (valid) {
                    this.formData.provinceCode = this.formData.areaCode[0];
                    this.formData.cityCode = this.formData.areaCode[1];
                    this.formData.reginCode = this.formData.areaCode[2];
                    var obj = {
                      params:this.formData,
                      removeEmpty:false,
                      url:"/api/hospitalApply/insert"
                    }
                    this.commonUtil.doPost(obj) .then(response=>{
                    if (response.code == "200")
                    {
                      this.commonUtil.clearObj(this.formData);
                      this.cities = [];
                      this.regions = [];
                      this.$refs['formRef'].resetFields();//校验重置
                      this.$refs['modalFormRef'].resetFields();//校验重置
                    }
              });
          }else{
              return false;
          }
        });
    }
  },
  mounted() {
  }
};
</script>
<style scoped>
  @import '../../../static/css/hospitalapply/style.css';
</style>