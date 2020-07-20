/*
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-07-02 13:55:53
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-17 19:57:23
 */ 
export default {
  name:'doctorApply',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/doctorDetail/getApplyTableList",//获取表格数据api
          toApprovalApi:"/api/doctorDetail/toApproval",//更新用api
          getDetailApi:"/api/doctorDetail/getApplyDoctorDetail",//获取详情用api
          getHospitalTableApi:"/api/doctorDetail/getHospitalTableList",//获取医院表格数据
          getHospitalDepts:"/api/hospitalDepartment/getHospitalDepts",//获取医院科室
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
          {type:'DateRange',label:'申请时间',prop:'applyDate'},
					// {type:'Input',label:'医生姓名',prop:'doctorName'},
					// {type:'Input',label:'手机号',prop:'mobile'},
					// {type:'Input',label:'身份证号',prop:'idCard'},
					{type:'Select',label:'审核状态 ',prop:'authStatus',options:this.selectUtil.authStaus},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					doctorName:"",//医生姓名 
					mobile:"",//手机号 
					idCard:"",//身份证号 
          applyDate:"",//申请时间 
          authStatus:null,//认证状态
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'doctorApply_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'doctorApply_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
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
          {label:'时间',prop:'applyTime',align:'center'},
          {label:'医生姓名',prop:'doctorName',align:'center'},
          {label:'医院名称',prop:'hospitalName',align:'center'},
          {label:'所属地区',prop:'area',align:'center',formatter:this.commonUtil.formArea},
          {label:'医院科室',prop:'deptName',align:'center'},
          {label:'职称',prop:'title',align:'center'},
          {label:'手机',prop:'mobile',align:'center'},
          {label:'医生类型',prop:'authType',align:'center',codeType:'authType',formatter:this.commonUtil.getTableCodeName},
          {label:'审核状态',prop:'authStatus',align:'center',codeType:'authStatus',formatter:this.commonUtil.getTableCodeName},
					// {label:'审批人',prop:'approvalUser',align:'center'},
					// {label:'审核不通过原因',prop:'reason',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看详情',type:'text',auth:'doctorApply_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
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
					{type:'Input',label:'医生姓名',prop:'doctorName',rules:{required:true,maxLength:20},disabled:this.commonUtil.disabled},
					{type:'Select',label:'医生性别',prop:'gender',rules:{required:true},options:this.selectUtil.gender,disabled:this.commonUtil.disabled},
					{type:'Input',label:'手机号',prop:'mobile',rules:{required:true,maxLength:20,type:'mobile'},disabled:this.commonUtil.disabled},
					{type:'Input',label:'身份证号',prop:'idCard',rules:{required:true,maxLength:20},disabled:this.commonUtil.disabled},
          {type:'Select',label:'医生职称',prop:'title',rules:{required:true},options:this.selectUtil.title,disabled:this.commonUtil.disabled},
          {type:'Input',label:'医院编码',prop:'hospitalCode',rules:{required:true},disabled:this.commonUtil.disabled},
          {type:'Input',label:'所属医院',prop:'hospitalName',rules:{required:true},focus:this.hospitalFocus},
          {type:'Input',label:'科室编码',prop:'deptCode',rules:{required:true},disabled:this.commonUtil.disabled},
          {type:'Select',label:'科室名称',prop:'deptId',rules:{required:true},props:{label:'deptName',value:'id'},focus:()=>this.getHospitalDepts(),change:()=>this.deptChange()},
          {type:'Select',label:'认证状态',prop:'authStatus',rules:{required:true},options:this.selectUtil.authStaus,disabled:this.commonUtil.disabled},
					{type:'Input',label:'申请时间',prop:'applyTime',rules:{required:true},disabled:this.commonUtil.disabled},
          {type:'Upload',label:'身份证国徽面照片',prop:'idCardNationalPicFileList',rules:{required:true},multiple:false,accept:"image/*",width:'750px',labelWidth:'150px',readonly:true},
          {type:'Upload',label:'身份证人像面照片',prop:'idCardPortraitPicFileList',rules:{required:true},multiple:false,accept:"image/*",width:'750px',labelWidth:'150px',readonly:true},
					{type:'Input',label:'执业医师资格证编码',prop:'qualificationCertificateCode',rules:{required:true,maxLength:100},labelWidth:'150px'},
					{type:'Upload',label:'执业医师资格证照片',prop:'qualificationCertificatePicFileList',rules:{required:true},multiple:false,accept:"image/*",width:'750px',labelWidth:'150px',readonly:true},
					{type:'Input',label:'执业医师证编码',prop:'licensedDoctorCertificateCode',rules:{required:true,maxLength:100},labelWidth:'150px'},
					{type:'Upload',label:'执业医师证照片',prop:'licensedDoctorCertificatePicFileList',rules:{required:true},multiple:false,accept:"image/*",width:'750px',labelWidth:'150px',readonly:true},
          {type:'Radio',label:'审核结果',prop:'approvalStatus',rules:{required:true},labelWidth:'150px',radios:[{value:'3',label:'审核通过'},{value:'4',label:'审核不通过'}],change:()=>this.statusChange()},
          {type:'Textarea',label:'审核不通过原因',prop:'reason',rules:{required:false,maxLength:500},labelWidth:'150px',width:'700px'},
          {type:'Textarea',label:'备注',prop:'remark',width:'700px',rules:{required:false,maxLength:500},disabled:this.commonUtil.disabled,labelWidth:'150px'},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					doctorName:"",//医生姓名 
					gender:"",//医生性别 男 女 未知 
					mobile:"",//手机号 
					idCard:"",//身份证号 
					title:"",//医生职称 医师 主治医师 副主任医师 主任医师 
          headPic:"",//医生头像 
          idCardNationalPicFileList:[],
          idCardNationalPic:"",//身份证国徽面照片 
          idCardPortraitPicFileList:[],
					idCardPortraitPic:"",//身份证人像面照片 
          qualificationCertificateCode:"",//执业医师资格证编码 
          qualificationCertificatePicFileList:[],
					qualificationCertificatePic:"",//执业医师资格证照片 
          licensedDoctorCertificateCode:"",//执业医师证编码 
          licensedDoctorCertificatePicFileList:[],
					licensedDoctorCertificatePic:"",//执业医师证照片 
					authStatus:null,//认证状态 1未认证 2待审核 3认证通过 4认证不通过 
					authStep:null,//认证步骤 0未做过认证 1基本信息认证 2上传证件 
					applyTime:null,//申请时间 
					approvalTime:null,//审核时间 
					approvalUser:null,//审批人 
          reason:"",//审核不通过原因 
          hospitalCode:null,//医院编码
          hospitalId:null,//所属医院
          hospitalName:null,
          deptCode:null,//科室编码
          deptId:null,//科室id
          deptName:null,//科室名称
          approvalStatus:null,//审核结果
          remark:"",
        },
        //modal 数据 end
        //modal 按钮 start
        modalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeModal()},
          {label:'提交',type:'primary',handle:()=>this.save()}
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
        //modal 按钮 end
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
      if(this.pageData.queryData.applyDate != null && this.pageData.queryData.applyDate.length>0)
      {
        this.pageData.queryData.startDate = this.pageData.queryData.applyDate[0];
        this.pageData.queryData.endDate = this.pageData.queryData.applyDate[1];
      }else{
        this.pageData.queryData.startDate = null;
        this.pageData.queryData.endDate = null;
      }
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
    showModal(type,id){
      this.commonUtil.showModal(this.pageData.modalConfig,type);
      if(type != this.commonConstants.modalType.insert)
      {
        this.getDetail(id);
      }
      
    },
    /**
     * @description: 获取详细数据
     * @param {id} 数据唯一标识
     * @return: 
     * @author: caiyang
     */    
    getDetail(id){
      var obj = {
        url:this.pageData.requestUrl.getDetailApi,
        params:{id:id},
      }
      this.commonUtil.doGet(obj).then(response=>{
        this.commonUtil.coperyProperties(this.pageData.modalData,response.responseData);//数据赋值
        if(this.pageData.modalData.idCardNationalPicFileList == null)
        {
          this.pageData.modalData.idCardNationalPicFileList = [];
        }
        this.pageData.modalData.idCardNationalPicFileList.push({name:response.responseData.idCardNationalPicName,url:response.responseData.idCardNationalPic});
        if(this.pageData.modalData.idCardPortraitPicFileList == null)
        {
          this.pageData.modalData.idCardPortraitPicFileList = [];
        }
        this.pageData.modalData.idCardPortraitPicFileList.push({name:response.responseData.idCardPortraitPicName,url:response.responseData.idCardPortraitPic});
        if(this.pageData.modalData.qualificationCertificatePicFileList == null)
        {
          this.pageData.modalData.qualificationCertificatePicFileList = [];
        }
        this.pageData.modalData.qualificationCertificatePicFileList.push({name:response.responseData.qualificationCertificatePicName,url:response.responseData.qualificationCertificatePic});
        if(this.pageData.modalData.licensedDoctorCertificatePicFileList == null)
        {
          this.pageData.modalData.licensedDoctorCertificatePicFileList = [];
        }
        this.pageData.modalData.licensedDoctorCertificatePicFileList.push({name:response.responseData.licensedDoctorCertificatePicName,url:response.responseData.licensedDoctorCertificatePic});
        this.pageData.modalData.hospitalName = response.responseData.hospitalName;
        if(!this.pageData.modalData.deptId){
          this.pageData.modalData.deptId = response.responseData.deptName;
        }else{
          this.getHospitalDepts()
        }
        this.pageData.modalData.approvalStatus = null;
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
      this.pageData.modalForm[18].rules.required = false;
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
            var params = {
                id:this.pageData.modalData.id,
                hospitalId:this.pageData.modalData.hospitalId,
                deptId:this.pageData.modalData.deptId,
                reason:this.pageData.modalData.reason,
                approvalStatus:this.pageData.modalData.approvalStatus,
                qualificationCertificateCode:this.pageData.modalData.qualificationCertificateCode,
                licensedDoctorCertificateCode:this.pageData.modalData.licensedDoctorCertificateCode,
            };
            var obj = {
              params:params,
              removeEmpty:false,
            }
              obj.url = this.pageData.requestUrl.toApprovalApi;
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
    selectChange(rows){
      this.pageData.selectList = rows;
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
        this.pageData.modalData.hospitalCode = this.pageData.hospitalRow.hospitalCode;
        this.pageData.modalData.hospitalName = this.pageData.hospitalRow.hospitalName;
        this.pageData.modalData.hospitalId = this.pageData.hospitalRow.id;
        this.closeHospitalModal();
      }
    },
    /**
     * @description: 根据医院id获取科室
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getHospitalDepts(){
      this.pageData.modalForm[8].options = [];
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
          this.pageData.modalForm[8].options = response.responseData
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        }
      });
    },
    deptChange(){
      if(this.pageData.modalData.deptId)
      {
        if(this.pageData.modalForm[8].options && this.pageData.modalForm[8].options.length > 0)
        {
          for (let index = 0; index < this.pageData.modalForm[8].options.length; index++) {
            const element = this.pageData.modalForm[8].options[index];
            if(this.pageData.modalData.deptId == element.id)
            {
              this.pageData.modalData.deptCode = element.deptCode;
              return;
            }
          }
        }
      }
    },
    statusChange(){
      if(this.commonConstants.authStatus.REJECTED == this.pageData.modalData.approvalStatus)
      {
        this.pageData.modalForm[18].rules.required = true;
      }else{
        this.pageData.modalForm[18].rules.required = false;
      }
    }
  }
};