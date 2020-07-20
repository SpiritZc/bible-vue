export default {
  name:'doctorDetail',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/doctorDetail/getTableList",//获取表格数据api
          insertApi:"/api/doctorDetail/insert",//新增用api
          updateApi:"/api/doctorDetail/update",//更新用api
          getDetailApi:"/api/doctorDetail/getDetail",//获取详情用api
          deleteOneApi:"/api/doctorDetail/delete",//单条删除api
          deleteBatchApi:"/api/doctorDetail/deletebatch",//批量删除api
          changeStatusApi:"/api/doctorDetail/changeStatus",//更新状态api
          resetPwdApi:"/api/doctorDetail/resetPwd",//重置密码
          getHospitalTableApi:"/api/doctorDetail/getHospitalTableList",//获取医院表格数据
          getHospitalDepts:"/api/hospitalDepartment/getHospitalDepts",//获取医院科室
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
          {type:'Input',label:'医院名称',prop:'hospitalName'},
					{type:'Input',label:'医生姓名',prop:'doctorName'},
					{type:'Select',label:'入驻类型',prop:'authType',options:this.selectUtil.authType},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					doctorName:"",//医生姓名 
					hospitalName:"",//手机号 
					authType:"",//入驻类型
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'搜索',type:'primary',handle:()=>this.searchtablelist(),auth:'doctorDetail_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'doctorDetail_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'doctorDetail_insert'},
          // {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'doctorDetail_batchdelete'}
        ],
        //表格工具栏按钮 end
        selectList:[],//表格选中的数据
        //表格分页信息start
        tablePage:{
          currentPage: 1,
          pageSize:10,
          pageTotal: 0,
          pageSizeRange:[10, 20]
        },
        //表格分页信息end
        //表格列表头start
        tableCols:[
          {label:'医院ID',prop:'hospitalCode',align:'center'},
          {label:'医院名称',prop:'hospitalName',align:'center'},
					{label:'医生姓名',prop:'doctorName',align:'center'},
          {label:'身份证号',prop:'idCard',align:'center'},
          {label:'手机号',prop:'mobile',align:'center'},
					{label:'科室',prop:'deptName',align:'center'},
          {label:'职称',prop:'title',align:'center'},
          {label:'添加时间',prop:'createTime',align:'center'},
          {label:'入驻类型',prop:'authType',align:'center',codeType:'authType',formatter:this.commonUtil.getTableCodeName},
					{label:'状态',prop:'authStatus',align:'center',codeType:'authStatus',formatter:this.commonUtil.getTableCodeName},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						// {label:'查看',type:'text',auth:'doctorDetail_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
						{label:'编辑',type:'text',auth:'doctorDetail_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row)},
            {label:this.label,type:'text',auth:'doctorDetail_changestatus',handle:(row)=>this.doctorStatus(row)},
            {label:'重置密码',type:'text',auth:'doctorDetail_resetpwd',handle:(row)=>this.resetPwd(row.id)},
					]}
        ],
        //表格列表头end
        //modal配置 start
        modalConfig:{ 
          title: "新增", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示
          formEditDisabled:false,//编辑弹窗是否可编辑
          width:'1000px',//弹出框宽度
          modalRef:"modalRef",//modal标识
          type:"1"//类型 1新增 2编辑 3保存
        },
        //modal配置 end
        //modal表单 start
        modalForm:[
          {type:'Upload',label:'医生头像',prop:'headPicList',rules:{required:false},width:'700px'},
          {type:'Input',label:'医生姓名',prop:'doctorName',rules:{required:true,maxLength:20}},
          {type:'Input',label:'医院名称',prop:'hospitalName',rules:{required:true,maxLength:20},focus:this.hospitalFocus},
					// {type:'Select',label:'医生性别',prop:'gender',rules:{required:true,maxLength:5},options:this.selectUtil.gender},
          {type:'Input',label:'手机号',prop:'mobile',rules:{required:true,maxLength:20,type:'mobile'}},
          {type:'Region',label:'所属地区',prop:'areaCode',rules:{required:true},options:[],width:"350px",disabled:this.commonUtil.disabled},
          {type:'Input',label:'详细地址',prop:'address',rules:{required:true,maxLength:500},width:"365px",disabled:this.commonUtil.disabled},
          {type:'Select',label:'科室',prop:'deptId',rules:{required:true},props:{label:'deptName',value:'id'},focus:()=>this.getHospitalDepts()},
					{type:'Input',label:'身份证号',prop:'idCard',rules:{required:false,maxLength:20,type:'idcard',validator:this.commonUtil.idcardValidator}},
          {type:'Select',label:'职称',prop:'title',rules:{required:true},options:this.selectUtil.title},
          {type:'Select',label:'入驻类型',prop:'authType',rules:{required:true},options:this.selectUtil.authType},
					{type:'Upload',label:'身份证国徽面照片',prop:'idCardNationalPicList',rules:{required:false},width:'700px',labelWidth:"150px"},
					{type:'Upload',label:'身份证人像面照片',prop:'idCardPortraitPicList',rules:{required:false},width:'700px',labelWidth:"150px"},
					{type:'Input',label:'执业医师资格证编码',prop:'qualificationCertificateCode',rules:{required:false,maxLength:100},labelWidth:"150px"},
					{type:'Upload',label:'执业医师资格证照片',prop:'qualificationCertificatePicList',rules:{required:false},width:'700px',labelWidth:"150px"},
					{type:'Input',label:'执业医师证编码',prop:'licensedDoctorCertificateCode',rules:{required:false,maxLength:100},labelWidth:"150px"},
          {type:'Upload',label:'执业医师证照片',prop:'licensedDoctorCertificatePicList',rules:{required:false},width:'700px',labelWidth:"150px"},
          {type:'Textarea',label:'简介',prop:'introduction',rules:{required:false},width:'800px'},
					{type:'Textarea',label:'医生擅长',prop:'goodAt',rules:{required:false,maxLength:500},width:'800px'},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					doctorName:"",//医生姓名 
          // gender:"",//医生性别 男 女 未知 
          hospitalId:"",
          hospitalName:"",//医院名称
          areaCode:[],//地区
          address:"",//详细地址
          deptId:"",//科室
					mobile:"",//手机号 
					idCard:"",//身份证号 
					title:"",//医生职称 医师 主治医师 副主任医师 主任医师 
          headPic:"",//医生头像 
          headPicList:[],
          idCardNationalPic:"",//身份证国徽面照片 
          idCardNationalPicList:[],
          idCardPortraitPic:"",//身份证人像面照片 
          idCardPortraitPicList:[],
					qualificationCertificateCode:"",//执业医师资格证编码 
          qualificationCertificatePic:"",//执业医师资格证照片 
          qualificationCertificatePicList:[],
					licensedDoctorCertificateCode:"",//执业医师证编码 
          licensedDoctorCertificatePic:"",//执业医师证照片 
          licensedDoctorCertificatePicList:[],
					goodAt:"",//医生擅长 
					introduction:"",//医生简介 
					authStatus:"",//认证状态 1未认证 2待审核 3认证通过 4认证不通过 
					authType:"",//认证步骤0 未做过认证操作1认证类型2基本信息 3上传证件 
        },
        //modal 数据 end
        //modal 按钮 start
        modalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeModal()},
          {label:'提交',type:'primary',handle:()=>this.save()}
        ],
        //modal 按钮 end
        doctorHospitaltableCols:[
					{label:'医院名称',prop:'hospitalName',align:'center',width:150,overflow:true},
          {label:'所属地区',prop:'area',align:'center',width:150,overflow:true,formatter:this.commonUtil.formArea},
          {label:'详细地址',prop:'address',align:'center',width:150,overflow:true},
					{label:'医院科室',prop:'deptName',align:'center',width:150,overflow:true},
          {label:'系统科室',prop:'systemDept',align:'center',width:150,overflow:true},
          {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'删除',type:'text',auth:'ignore',handle:(row)=>this.deleteDoctorHospital(row.hospitalId)},
					]}
        ],
        doctorHospitaltableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showAddHospital(),auth:'ignore'},
        ],
        doctorHospitaltableData:[],
        doctorHospitalmodalConfig:{ 
          title: "添加执业医院", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示
          formEditDisabled:false,//编辑弹窗是否可编辑
          width:'1000px',//弹出框宽度
          modalRef:"docrotHospitalRef",//modal标识
          type:"1"//类型 1新增 2编辑 3保存
        },
        //modal配置 end
        //modal表单 start
        doctorHospitalmodalForm:[
					{type:'Select',label:'医院',prop:'hospitalId',rules:{required:true},options:[],remote:true,remoteMethod:this.getHospitals,props:{label:"hospitalName",value:"id"}},
					{type:'Select',label:'科室',prop:'deptId',rules:{required:true},options:[],props:{label:"deptName",value:"id"},focus:this.getHosDept},
        ],
        //modal表单 end
        //modal 数据 start
        doctorHospitalmodalData : {//modal页面数据
					hospitalId:"",//医生姓名 
					deptId:"",//医生性别 男 女 未知 
        },
        //modal 数据 end
        //modal 按钮 start
        doctorHospitalmodalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeDoctorHospitalModal()},
          {label:'提交',type:'primary',handle:()=>this.addDoctorHospital()}
        ],
        hospitalModalConfig:{ 
          title: "选择医院", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示
          formEditDisabled:false,//编辑弹窗是否可编辑
          width:'1000px',//弹出框宽度
          modalRef:"modalRef",//modal标识
          type:"1"//类型 1新增 2编辑 3保存
        },
        hospitalTableData:[],
        hospitalTablePage:{
          currentPage: 1,
          pageSize:5,
          pageTotal: 0,
          pageSizeRange:[10, 20]
        },
        hospitalTableCols:[
					{label:'医院编码',prop:'hospitalCode',align:'center'},
					{label:'医院名称',prop:'hospitalName',align:'center'},
          {label:'所属地区',prop:'provinceCode',align:'center',formatter:this.commonUtil.formArea},
          {label:'医院等级',prop:'hospitalGrade',align:'center'},
					{label:'医院性质',prop:'hospitalNature',align:'center'},
          {label:'合作医院',prop:'hospitalIsSettled',align:'center',codeType:'yesNo',formatter:this.commonUtil.getTableCodeName},
        ],
         //查询表单内容 start
         hospitalSearchForm:[
					{type:'Input',label:'医院编码',prop:'hospitalCode'},
          {type:'Input',label:'医院名称',prop:'hospitalName'},
          {type:'Select',label:'是否合作医院',prop:'hospitalIsSettled',options:this.selectUtil.yesNo},
        ],
        //查询表单内容 end
        //查询条件 start
        hospitalQueryData:{
					hospitalCode:"",//医院编码 
					hospitalName:"",//医院名称 
					hospitalIsSettled:null,//1、是 2、否 
        },
        //查询条件 end
        //查询表单按钮start
        hospitalSearchHandle:[
          {label:'查询',type:'primary',handle:()=>this.getHospitalTableData(),auth:'hospitalDetail_search'},
          {label:'重置',type:'warning',handle:()=>this.resetHospitalSearch(),auth:'hospitalDetail_search'}
        ],
        hospitalRow:null,//选择的医院
      }
    }
  },
  mounted(){
    this.searchtablelist();
  },
  methods:{
    /**
     * @description: 获取表格数据
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    searchtablelist(){
      var obj = {
        url:this.pageData.requestUrl.listApi,
        params:Object.assign({}, this.pageData.queryData, this.pageData.tablePage),
      }
      this.commonUtil.getTableList(obj).then(response=>{
        this.commonUtil.tableAssignment(response,this.pageData.tablePage,this.pageData.tableData);
      });
    },
    resetSearch(){
      this.commonUtil.clearObj(this.pageData.queryData);
      this.searchtablelist();
    },
    /**
     * @description: modal显示
     * @param {type} 类型 1新增，2编辑 3详情 
     * @param {id} 数据唯一标识
     * @return: 
     * @author: caiyang
     */    
    showModal(type,row){
      this.commonUtil.showModal(this.pageData.modalConfig,type);
      if(type != this.commonConstants.modalType.insert)
      {
        this.getDetail(row);
        this.pageData.modalForm[1].disabled = this.commonUtil.disabled;
        this.pageData.modalForm[3].disabled = this.commonUtil.disabled;
      }else{
        this.pageData.modalForm[1].disabled = this.commonUtil.undisabled;
        this.pageData.modalForm[3].disabled = this.commonUtil.undisabled;
      }
      // this.pageData.modalForm[9].tableCols = this.pageData.doctorHospitaltableCols;
      // this.pageData.modalForm[9].tableHandles = this.pageData.doctorHospitaltableHandles;
      // this.pageData.modalForm[9].tableData = this.pageData.doctorHospitaltableData;
      
    },
    /**
     * @description: 获取详细数据
     * @param {id} 数据唯一标识
     * @return: 
     * @author: caiyang
     */    
    getDetail(row){
      var obj = {
        url:this.pageData.requestUrl.getDetailApi,
        params:{id:row.id,doctorHospitalId:row.doctorHospitalId},
      }
      this.commonUtil.doPost(obj).then(response=>{
        this.commonUtil.coperyProperties(this.pageData.modalData,response.responseData);//数据赋值
        // this.pageData.doctorHospitaltableData .splice(0)
        // for (let index = 0; index < response.responseData.doctorHospital.length; index++) {
        //   const element = response.responseData.doctorHospital[index];
        //   this.$set(this.pageData.doctorHospitaltableData,index, element)
        // }
        var obj = response.responseData;
        if(obj.headPic)
        {
          var headPic = {name:obj.headPicName,url:obj.headPic};
          this.pageData.modalData.headPicList = [];
          this.pageData.modalData.headPicList.push(headPic);
        }
        if(obj.idCardNationalPic)
        {
          var idCardNationalPic = {name:obj.idCardNationalPicName,url:obj.idCardNationalPic};
          this.pageData.modalData.idCardNationalPicList = [];
          this.pageData.modalData.idCardNationalPicList.push(idCardNationalPic);
        }
        if(obj.idCardPortraitPic)
        {
          var idCardPortraitPic = {name:obj.idCardPortraitPicName,url:obj.idCardPortraitPic};
          this.pageData.modalData.idCardPortraitPicList = [];
          this.pageData.modalData.idCardPortraitPicList.push(idCardPortraitPic);
        }
        if(obj.qualificationCertificatePic)
        {
          var qualificationCertificatePic = {name:obj.qualificationCertificatePicName,url:obj.qualificationCertificatePic};
          this.pageData.modalData.qualificationCertificatePicList = [];
          this.pageData.modalData.qualificationCertificatePicList.push(qualificationCertificatePic);
        }
        if(obj.licensedDoctorCertificatePic)
        {
          var licensedDoctorCertificatePic = {name:obj.licensedDoctorCertificatePicName,url:obj.licensedDoctorCertificatePic};
          this.pageData.modalData.licensedDoctorCertificatePicList = [];
          this.pageData.modalData.licensedDoctorCertificatePicList.push(licensedDoctorCertificatePic);
        }
        this.pageData.modalData.authType = obj.authType+'';
        this.pageData.modalData.areaCode = [];
        if(response.responseData.doctorHospitalId)
        {
          this.pageData.modalData.areaCode[0] = response.responseData.provinceCode;
          this.pageData.modalData.areaCode[1] = response.responseData.cityCode;
          this.pageData.modalData.areaCode[2] = response.responseData.reginCode;
          $('#cascaderRegion').find('input').val(response.responseData.provinceName+" / "+response.responseData.cityName+" / "+response.responseData.reginName);
        }else{
          $('#cascaderRegion').find('input').val("")
        }
        if(response.responseData.hospitalId){
          this.getHospitalDepts()
        }
       
      });
    },
    /**
     * @description: 关闭modal
     * @param 
     * @return: 
     * @author: caiyang
     */    
    closeModal(){
      this.$refs['modalRef'].$refs['modalFormRef'].resetFields();//校验重置
      this.pageData.modalConfig.show = false;//关闭modal
      this.commonUtil.clearObj(this.pageData.modalData);//清空modalData
      $('#cascaderRegion').find('input').val("");
    },
    /**
     * @description: 保存数据
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    save(){
      this.$refs['modalRef'].$refs['modalFormRef'].validate((valid) => {
        if (valid) {
            // if(!this.pageData.doctorHospitaltableData || this.pageData.doctorHospitaltableData.length == 0)
            // {
            //   this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.add.doctorhospital",null),type: this.commonConstants.messageType.error});
            //   return;
            // }
            if(this.pageData.modalData.idCardNationalPicList && this.pageData.modalData.idCardNationalPicList.length>0)
            {
              this.pageData.modalData.idCardNationalPic = this.pageData.modalData.idCardNationalPicList[0].url;
            }
            if(this.pageData.modalData.idCardPortraitPicList && this.pageData.modalData.idCardPortraitPicList.length>0)
            {
              this.pageData.modalData.idCardPortraitPic = this.pageData.modalData.idCardPortraitPicList[0].url;
            }
            if(this.pageData.modalData.qualificationCertificatePicList && this.pageData.modalData.qualificationCertificatePicList.length>0)
            {
              this.pageData.modalData.qualificationCertificatePic = this.pageData.modalData.qualificationCertificatePicList[0].url;
            }
            if(this.pageData.modalData.licensedDoctorCertificatePicList && this.pageData.modalData.licensedDoctorCertificatePicList.length>0)
            {
              this.pageData.modalData.licensedDoctorCertificatePic = this.pageData.modalData.licensedDoctorCertificatePicList[0].url;
            }
            if(this.pageData.modalData.headPicList && this.pageData.modalData.headPicList.length>0)
            {
              this.pageData.modalData.headPic = this.pageData.modalData.headPicList[0].url;
            }
            this.pageData.modalData.doctorHospital = this.pageData.doctorHospitaltableData;
            this.pageData.modalData.provinceCode = this.pageData.modalData.areaCode[0];
            this.pageData.modalData.cityCode = this.pageData.modalData.areaCode[1];
            this.pageData.modalData.reginCode = this.pageData.modalData.areaCode[2];
            var obj = {
              params:this.pageData.modalData,
              removeEmpty:false,
            }
            if(this.pageData.modalConfig.type == this.commonConstants.modalType.insert)
            {
              obj.url = this.pageData.requestUrl.insertApi;
            }else{
              obj.url = this.pageData.requestUrl.updateApi
            }
            this.commonUtil.doPost(obj) .then(response=>{
              if (response.code == "200")
              {
                this.closeModal();
                this.searchtablelist();
              }
            });
        }else{
            return false;
        }
      });
    },
    /**
     * @description: 删除一条数据
     * @param {id} 数据唯一标识 
     * @return: 
     * @author: caiyang
     */    
    deleteOne(id){
      let obj = {
        url:this.pageData.requestUrl.deleteOneApi,
        messageContent:this.commonUtil.getMessageFromList("confirm.delete",null),
        callback:this.searchtablelist,
        params:{id:id},
        type:"get",
      }
      //弹出删除确认框
      this.commonUtil.showConfirm(obj)
    },
    /**
     * @description: 批量删除
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    deleteBatch(){
        const length = this.pageData.selectList.length;
        if(length == 0)
        {
            this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.batchdelete.empty",null),type: this.commonConstants.messageType.error});
        }else{
          let ids = new Array();
          for (let i = 0; i < length; i++) {
              ids.push(this.pageData.selectList[i].id);
          }
          let obj = {
            url:this.pageData.requestUrl.deleteBatchApi,
            messageContent:this.commonUtil.getMessageFromList("confirm.delete",null),
            callback:this.searchtablelist,
            params:ids,
            type:"post",
          }
          this.commonUtil.showConfirm(obj);
        }
    },
    selectChange(rows){
      this.pageData.selectList = rows;
    },
    //显示新增医院对话框
    showAddHospital(){
      this.pageData.doctorHospitalmodalConfig.show = true;
    },
    //模糊查询获取医院
    getHospitals(query)
    {
      if(query)
      {
        var object = {
            url: "/api/hospitalDetail/getHospitals",
            params: {hospitalName:query},
            removeEmpty: false
          };
      this.commonUtil.doPost(object).then(response => {
            if (response.code == "200") {
              this.pageData.doctorHospitalmodalForm[0].options = response.responseData;
            }
          });
      }else{
        this.pageData.doctorHospitalmodalForm[0].options = [];
      }
    },
    //获取医院科室
    getHosDept(){
      if(this.pageData.doctorHospitalmodalData.hospitalId)
      {
        var object = {
          url: "/api/hospitalDepartment/getHospitalDepts",
          params: {hospitalId:this.pageData.doctorHospitalmodalData.hospitalId},
          removeEmpty: false
        };
        this.commonUtil.doPost(object).then(response => {
          if (response.code == "200") {
            this.pageData.doctorHospitalmodalForm[1].options = response.responseData;
          }
        });
      }else{
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.hospital.select",null),type: this.commonConstants.messageType.error});
        this.pageData.doctorHospitalmodalForm[1].options = [];
        return;
      }
    },
    //添加执业地点
    addDoctorHospital(){
      this.$refs['docrotHospitalRef'].$refs['modalFormRef'].validate((valid) => {
        if (valid) {
           var hospital = this.getSelectHospital(this.pageData.doctorHospitalmodalData.hospitalId);
           var hospitalDept = this.getSelectDept(this.pageData.doctorHospitalmodalData.deptId);
           var doctorHospital = {hospitalId:hospital.id,hospitalName:hospital.hospitalName,
            address:hospital.address,deptId:hospitalDept.id,
            deptName:hospitalDept.deptName,systemDept:hospitalDept.sysDeptName,provinceCode:hospital.provinceCode,provinceName:hospital.provinceName,
            cityCode:hospital.cityCode,cityName:hospital.cityName,reginCode:hospital.reginCode,reginName:hospital.reginName};
            var index = this.ifDoctorHospitalExist(hospital.id);
            if(index > -1)
            {
              var source = this.pageData.doctorHospitaltableData[index].source;
              doctorHospital.source = source;
              this.pageData.doctorHospitaltableData[index] = doctorHospital;
              this.$set(this.pageData.doctorHospitaltableData,index, doctorHospital)
            }else{
              this.pageData.doctorHospitaltableData.push(doctorHospital);
            }
            
          this.closeDoctorHospitalModal();
        }else{
            return false;
        }
      });
    },
    //关闭执业地点
    closeDoctorHospitalModal(){
      this.pageData.doctorHospitalmodalConfig.show = false;
      this.pageData.doctorHospitalmodalForm[0].options = [];
      this.pageData.doctorHospitalmodalForm[1].options = [];
      this.pageData.doctorHospitalmodalData.hospitalId = "";
      this.pageData.doctorHospitalmodalData.deptId = "";
    },
    //获取选中的医院信息
    getSelectHospital(hospitalId)
    {
      var result;
      for (let index = 0; index < this.pageData.doctorHospitalmodalForm[0].options.length; index++) {
        const element = this.pageData.doctorHospitalmodalForm[0].options[index];
        if(element.id == hospitalId){
          result = element;
          break;
        }
      }
      return result;
    },
    //获取选中的科室信息
    getSelectDept(deptId)
    {
      var result;
      for (let index = 0; index < this.pageData.doctorHospitalmodalForm[1].options.length; index++) {
        const element = this.pageData.doctorHospitalmodalForm[1].options[index];
        if(element.id == deptId)
        {
          result = element;
          break;
        }
      }
      return result;
    },
    //判断执业医院是否已经添加
    ifDoctorHospitalExist(hospitalId){
      var result = -1;
      if(this.pageData.doctorHospitaltableData && this.pageData.doctorHospitaltableData.length>0)
      {
        for (let index = 0; index < this.pageData.doctorHospitaltableData.length; index++) {
          const element = this.pageData.doctorHospitaltableData[index];
          if(element.hospitalId == hospitalId)
          {
            result = index;
            break;
          }
        }
      }
      return result;
    },
    //删除医生执业地点
    deleteDoctorHospital(id){
      var index = this.ifDoctorHospitalExist(id)
      if(index>-1)
      {
        this.pageData.doctorHospitaltableData.splice(index,1);
      }
    },
    //启用停用显示
    label(row){
      if(row.status == 1)
      {
        return "禁用";
      }else{
        return "启用";
      }
    },
    //医生启用停用
    doctorStatus(row){
      var obj = {
        params:{id:row.id,status:row.status==1?2:1},
        removeEmpty:false,
        url:this.pageData.requestUrl.changeStatusApi,
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
          this.searchtablelist();
        }
      });
    },
    //重置密码
    resetPwd(id){
      var obj = {
        params:{id:id},
        removeEmpty:false,
        url:this.pageData.requestUrl.resetPwdApi,
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
        }
      });
    },
    hospitalFocus(){
      this.pageData.hospitalModalConfig.show = true;
      this.getHospitalTableData();
    },
    getHospitalTableData(){
      var obj = {
        url:this.pageData.requestUrl.getHospitalTableApi,
        params:Object.assign({}, this.pageData.hospitalQueryData, this.pageData.hospitalTablePage),
      }
      this.commonUtil.getTableList(obj).then(response=>{
        this.commonUtil.tableAssignment(response,this.pageData.hospitalTablePage,this.pageData.hospitalTableData);
      });
    },
    resetHospitalSearch(){
      this.commonUtil.clearObj(this.pageData.hospitalQueryData);
      this.getHospitalTableData();
    },
    currentChange(currentRow){
      this.pageData.hospitalRow = currentRow;
    },
    closeHospitalModal(){
      this.pageData.hospitalModalConfig.show = false;//关闭modal
      this.commonUtil.clearObj(this.pageData.hospitalQueryData);//清空modalData
      this.pageData.hospitalTableData = [];
      this.pageData.hospitalRow = null;
      this.pageData.hospitalTablePage.currentPage = 1;
      this.pageData.hospitalTablePage.pageSize = 5;
      this.pageData.hospitalTablePage.pageTotal = 0;
    },
    /**
     * @description: 选择医院
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    selectHospital(){
      if(this.pageData.hospitalRow == null)
      {
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.hospital.select",null),type: this.commonConstants.messageType.error});
        return;
      }else{
        this.pageData.modalData.hospitalName = this.pageData.hospitalRow.hospitalName;
        this.pageData.modalData.hospitalId = this.pageData.hospitalRow.id;
        this.pageData.modalData.areaCode = [];
        $('#cascaderRegion').find('input').val("");
        this.pageData.modalData.areaCode[0] = this.pageData.hospitalRow.provinceCode;
        this.pageData.modalData.areaCode[1] = this.pageData.hospitalRow.cityCode;
        this.pageData.modalData.areaCode[2] = this.pageData.hospitalRow.reginCode;
        $('#cascaderRegion').find('input').val(this.pageData.hospitalRow.provinceName+" / "+this.pageData.hospitalRow.cityName+" / "+this.pageData.hospitalRow.reginName);
        this.pageData.modalData.address = this.pageData.hospitalRow.address
        this.closeHospitalModal();
        this.pageData.modalForm[6].options = [];
        this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        this.pageData.modalData.deptId = null;
      }
    },
    /**
     * @description: 根据医院id获取科室
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getHospitalDepts(){
      this.pageData.modalForm[6].options = [];
      this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
      if(!this.pageData.modalData.hospitalId)
      {
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.hospital.select",null),type: this.commonConstants.messageType.error});
        return;
      }
      var obj = {
        params:{hospitalId:this.pageData.modalData.hospitalId},
        removeEmpty:false,
        url:this.pageData.requestUrl.getHospitalDepts
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
          this.pageData.modalForm[6].options = response.responseData
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        }
      });
    },
  }
};