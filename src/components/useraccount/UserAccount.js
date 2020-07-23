export default {
  name:'userAccount',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/sysUser/getTableList",//获取表格数据api
          insertApi:"/api/sysUser/insert",//新增用api
          updateApi:"/api/sysUser/update",//更新用api
          getDetailApi:"/api/sysUser/getDetail",//获取详情用api
          deleteOneApi:"/api/sysUser/delete",//单条删除api
          deleteBatchApi:"/api/sysUser/deletebatch",//批量删除api
          getOrgTreeApi:"/api/sysOrg/getNextLayer",//获取组织机构树api
          getOrgRolesApi:"/api/userRole/getOrgRoles",//获取组织对应的角色api
          resetPwdApi:"/api/sysUser/resetPwd",//重置密码api
          updateStatusApi:"/api/sysUser/updateStatus",//启用停用
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'账户名',prop:'accountName'},
					{type:'Input',label:'用户姓名',prop:'userName'},
					// {type:'Input',label:'手机号',prop:'userMobile'},
					{type:'Input',label:'电话',prop:'userPhone'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					accountName:"",//账户名 
					userName:"",//用户姓名 
					userMobile:"",//手机号 
					userPhone:"",//电话 
					userEmail:"",//邮箱 
					accountDesc:"",//账户描述 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'userAccount_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'userAccount_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'userAccount_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'userAccount_batchdelete'}
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
					{label:'账户名',prop:'accountName',align:'center'},
					{label:'用户姓名',prop:'userName',align:'center'},
					// {label:'手机号',prop:'userMobile',align:'center'},
					{label:'电话',prop:'userPhone',align:'center'},
          {label:'邮箱',prop:'userEmail',align:'center'},
          // {label:'所属机构',prop:'orgNames',align:'center'},
          {label:'用户角色',prop:'roleName',align:'center'},
          {label:'账户描述',prop:'accountDesc',align:'center'},
          {label:'状态',prop:'status',align:'center',codeType:'status',formatter:this.commonUtil.getTableCodeName},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看',type:'text',auth:'sysUser_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
            {label:'编辑',type:'text',auth:'sysUser_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
            {label:'重置密码',type:'text',auth:'sysUser_resetpwd',handle:(row)=>this.resetPwd(row.id)},
            {label:this.label,type:'text',auth:'sysUser_status',handle:(row)=>this.updateStatus(row)},
						{label:'删除',type:'text',auth:'sysUser_delete',handle:(row)=>this.deleteOne(row.id)},
					]}
        ],
        //表格列表头end
        //modal配置 start
        modalConfig:{ 
          title: "新增", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示
          formEditDisabled:false,//编辑弹窗是否可编辑
          width:'700px',//弹出框宽度
          modalRef:"modalRef",//modal标识
          type:"1"//类型 1新增 2编辑 3保存
        },
        //modal配置 end
        //modal表单 start
        modalForm:[
					{type:'Input',label:'账户名',prop:'accountName',rules:{required:true,maxLength:40}},
					{type:'Input',label:'用户姓名',prop:'userName',rules:{required:true,maxLength:40}},
					// {type:'Input',label:'手机号',prop:'userMobile',rules:{required:true,maxLength:20,type:'mobile'}},
					{type:'Input',label:'电话',prop:'userPhone',rules:{required:false,maxLength:20,type:'mobile'}},
          {type:'Input',label:'邮箱',prop:'userEmail',rules:{required:false,maxLength:50,type:'email'}},
          // {type:'TreeSelect',label:'所属组织',prop:'parentOrgId',rules:{required:true},props:{parent: 'parentOrgId',value: 'id',label: 'orgName',children: 'children'},data:[],ref:'select',url:"/api/sysOrg/getNextLayer"},
          // {type:'MultiTreeSelect',label:'所属组织',prop:'orgId',rules:{required:true},props:{parent: 'parentOrgId',value: 'id',label: 'orgName',children: 'children'},data:[],ref:'select',url:"/api/sysOrg/getNextLayer"},
          {type:'Select',label:'用户角色',prop:'roleId',rules:{required:true},props:{label:'userRoleName',value:'id'},focus:()=>this.roleFocus(),ref:"roleSelect"},
					{type:'Input',label:'账户描述',prop:'accountDesc',rules:{required:false,maxLength:500}},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					accountName:"",//账户名 
					userName:"",//用户姓名 
					userMobile:"",//手机号 
					userPhone:"",//电话 
					userEmail:"",//邮箱 
          accountDesc:"",//账户描述 
          roleId:"",//角色id
          orgId:"",//组织id
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
        var orgNames="";
        var orgIds = "";
        if(response.responseData.orgs && response.responseData.orgs.length>0)
        {
          for (let index = 0; index < response.responseData.orgs.length; index++) {
            if(index==response.responseData.orgs.length-1)
            {
              orgNames = orgNames + response.responseData.orgs[index].orgName;
              orgIds = orgIds + response.responseData.orgs[index].id;
            }else{
              orgNames = orgNames + response.responseData.orgs[index].orgName+",";
              orgIds = orgIds + response.responseData.orgs[index].id+",";
            }
          }
        }
        this.pageData.modalData.orgId = orgIds;
        this.$refs.modalRef.$refs.select[0].labelModel = orgNames;
        if(response.responseData.userRole){
          this.pageData.modalForm[6].options = [{"id":response.responseData.userRole.id,"userRoleName":response.responseData.userRole.userRoleName}];
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
          this.pageData.modalData.roleId = response.responseData.userRole.id;
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
      this.$refs.modalRef.$refs.select[0].labelModel = "";
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
          var orgIds = this.pageData.modalData.orgId.split(",")
          this.pageData.modalData.orgIds = orgIds;
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
       this.pageData.modalForm[5].data = response.responseData
      });
    },
    /**
     * @description: 点击角色事件
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    roleFocus(){
      this.pageData.modalForm[6].options = [];
      if(!this.pageData.modalData.orgId)
      {
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.org.role.param",null),type: this.commonConstants.messageType.error});
        return;
      }
      var obj = {
        params:{orgIds:this.pageData.modalData.orgId.split(",")},
        url:this.pageData.requestUrl.getOrgRolesApi
      };
      this.commonUtil.doPost(obj) .then(response=>{
        this.pageData.modalForm[6].options = response.responseData;
        this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
      });
    },
    resetPwd(id){//重置密码
      var obj = {
        url:this.pageData.requestUrl.resetPwdApi,
        params:{id:id},
      }
      this.commonUtil.doGet(obj).then(response=>{
        
      });
    },
    updateStatus(row){
      var obj = {
        params:{id:row.id,status:row.status==1?2:1},
        url:this.pageData.requestUrl.updateStatusApi
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
          this.searchtablelist();
        }
      });
    },
    //启用停用显示
    label(row){
      if(row.status == 1)
      {
        return "停用";
      }else{
        return "启用";
      }
    },
  }
};