export default {
  name:'hospitalDetail',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/hospitalDetail/getTableList",//获取表格数据api
          insertApi:"/api/hospitalDetail/insert",//新增用api
          updateApi:"/api/hospitalDetail/update",//更新用api
          getDetailApi:"/api/hospitalDetail/getDetail",//获取详情用api
          stopAccountApi:"/api/hospitalDetail/stopAccount",//停用用户api
          getOrgTreeApi:"/api/sysOrg/getNextLayer",//获取组织机构树api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					// {type:'Input',label:'医院编码',prop:'hospitalCode'},
          {type:'Input',label:'医院名称',prop:'hospitalName'},
          {type:'Select',label:'医院等级',prop:'hospitalGrade',options:this.selectUtil.hospitalGrade},
					{type:'Select',label:'是否合作医院',prop:'hospitalIsSettled',options:this.selectUtil.yesNo},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					// hospitalCode:"",//医院编码 
					hospitalName:"",//医院名称 
          hospitalIsSettled:null,//1、是 2、否 
          hospitalGrade:""
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'搜索',type:'primary',handle:()=>this.searchtablelist(),auth:'hospitalDetail_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'hospitalDetail_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'hospitalDetail_insert'},
        ],
        //表格工具栏按钮 end
        selectList:[],//表格选中的数据
        //表格分页信息start
        tablePage:{
          currentPage: 1,
          pageSize:10,
          pageTotal: 0,
          pageSizeRange:[5, 10, 20, 50]
        },
        //表格分页信息end
        //表格列表头start
        tableCols:[
          // {label:'创建时间',prop:'createTime',align:'center'},
					{label:'医院ID',prop:'hospitalCode',align:'center'},
          {label:'医院名称',prop:'hospitalName',align:'center'},
          {label:'医院等级',prop:'hospitalGrade',align:'center'},
          {label:'医院性质',prop:'hospitalNature',align:'center'},
          {label:'医院类型',prop:'hospitalType',align:'center'},
          {label:'合作医院',prop:'hospitalIsSettled',align:'center',codeType:'yesNo',formatter:this.commonUtil.getTableCodeName},
          {label:'所属地区',prop:'provinceCode',align:'center',formatter:this.commonUtil.formArea},
          {label:'详细地址',prop:'address',align:'center'},
          {label:'状态',prop:'status',align:'center',codeType:'status',formatter:this.commonUtil.getTableCodeName},
					// {label:'特色科室',prop:'specialDept',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						// {label:'查看',type:'text',auth:'hospitalDetail_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
            {label:'编辑',type:'text',auth:'hospitalDetail_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
            {label:'科室维护',type:'text',auth:'hospitalDetail_department',handle:(row)=>this.routerTo(row)},
            {label:'账号停用',type:'text',auth:'hospitalDetail_stop',handle:(row)=>this.stopAccount(row)},
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
          {type:'Upload',label:'医院图片',prop:'fileList',rules:{required:false},width:'700px',multiple:false,accept:"image/*"},
					{type:'Input',label:'医院名称',prop:'hospitalName',rules:{required:true,maxLength:100},width:'350px',focus:this.hospitalFocus},
          {type:'Select',label:'医院等级',prop:'hospitalGrade',rules:{required:true},options:this.selectUtil.hospitalGrade,width:'350px'},
          {type:'Region',label:'所属地区',prop:'areaCode',rules:{required:true},width:'350px;'},
					{type:'Input',label:'详细地址',prop:'address',rules:{required:false,maxLength:500},width:'350px;'},
					{type:'Input',label:'联系方式',prop:'phoneNo',rules:{required:false,maxLength:20,type:'mobilephone'},width:'350px'},
          {type:'Select',label:'医院性质',prop:'hospitalNature',rules:{required:true},options:this.selectUtil.hospitalNature,width:'350px'},
          {type:'Input',label:'医院经度',prop:'hospitalLognitude',rules:{required:false,maxLength:20}},
					{type:'Input',label:'医院纬度',prop:'hospitalLatitude',rules:{required:false,maxLength:20}},
          {type:'Select',label:'医院类型',prop:'hospitalType',rules:{required:true},options:this.selectUtil.hospitalType},
          {type:'Select',label:'合作医院',prop:'hospitalIsSettled',rules:{required:true},options:this.selectUtil.yesNo,change:()=>this.changeSettled()},
          {type:'Date',label:'入驻日期',prop:'settledTime',rules:{required:false},width:'200px;'},
          {type:'TreeSelect',label:'上级组织',prop:'parentOrgId',rules:{required:true},props:{parent: 'parentOrgId',value: 'id',label: 'orgName',children: 'children'},data:[],ref:'select',url:"/api/sysOrg/getNextLayer"},
          {type:'Input',label:'特色科室',prop:'specialDept',rules:{required:false,maxLength:500},width:'825px;'},
          {type:'Textarea',label:'乘车路线',prop:'route',rules:{required:false,maxLength:500},width:'825px;'},
          {type:'Textarea',label:'医院简介',prop:'memoShort',rules:{required:false,maxLength:500},width:'825px;'},

        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
          hospitalName:"",//医院名称 
          areaCode:[],//地区代码
					provinceCode:"",//省份编号 
					cityCode:"",//城市编号 
					reginCode:"",//区县编号 
          hospitalPic:"",// 医院照片
          hospitalPicName:"",//医院照片名称
					hospitalGrade:"",//医院等级
					address:"",//医院地址 
					route:"",//医院路线 
					phoneNo:"",//手机 
					memoShort:"",//医院简介
					hospitalLognitude:"",//医院经度 
					hospitalLatitude:"",//医院纬度 
					hospitalNature:"",//医院性质1、公立 2、私立 
          hospitalIsSettled:null,//1、是 2、否 
          hospitalType:null,//医院类型
					settledTime:"",// 入驻时间
          specialDept:"",//特色科室 
          fileList:[],//医院图片
          parentOrgId:"",//上级组织
        },
        //modal 数据 end
        //modal 按钮 start
        modalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeModal()},
          {label:'提交',type:'primary',handle:()=>this.save()}
        ],
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
      this.getOrgTree();
      
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
        if(this.pageData.modalData.hospitalPic)
        {
          this.pageData.modalData.fileList = [];
          let pic = {
            url:this.pageData.modalData.hospitalPic,
            name:this.pageData.modalData.hospitalPicName
          }
          this.pageData.modalData.fileList.push(pic);
        }
        this.pageData.modalData.areaCode = [];
        this.pageData.modalData.areaCode[0] = this.pageData.modalData.provinceCode;
        this.pageData.modalData.areaCode[1] = this.pageData.modalData.cityCode;
        this.pageData.modalData.areaCode[2] = this.pageData.modalData.reginCode;
        $('#cascaderRegion').find('input').val(response.responseData.provinceName+" / "+response.responseData.cityName+" / "+response.responseData.reginName);
        this.$refs.modalRef.$refs.select[0].labelModel = response.responseData.parentOrgName;
        
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
            if(this.pageData.modalData.fileList != null && this.pageData.modalData.fileList.length>0)
            {
              this.pageData.modalData.hospitalPic = this.pageData.modalData.fileList[0].url;
              this.pageData.modalData.hospitalPicName = this.pageData.modalData.fileList[0].name;
            }
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
    /**
     * @description: 是否合作医院修改
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    changeSettled(){
      if(this.pageData.modalData.hospitalIsSettled == 1)
      {
        this.pageData.modalForm[11].show = true;
      }else{
        this.pageData.modalForm[11].show = false;
        this.pageData.modalData.settledTime = null;
      }
    },
    /**
     * @description: 账号停用
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    stopAccount(row){
      let obj = {
        url:this.pageData.requestUrl.stopAccountApi,
        messageContent:this.commonUtil.getMessageFromList("confirm.stopaccount",null),
        callback:this.searchtablelist,
        params:{id:row.id},
        type:"post",
      }
      //弹出删除确认框
      this.commonUtil.showConfirm(obj);
    },
    routerTo(row){
      this.$store.commit("setParameters",{key:'hospitalId',value:row.id});
      this.$router.push({ name: 'hospitaldepartment'})
    },
    /**
     * @description: 获取组织树
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getOrgTree(){
      var obj = {
        params:{id:0},
        url:this.pageData.requestUrl.getOrgTreeApi
      };
      this.commonUtil.doGet(obj).then(response=>{
       this.pageData.modalForm[12].data = response.responseData
      });
    },
  }
};