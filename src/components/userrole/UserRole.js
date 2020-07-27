export default {
  name:'userRole',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/sysRole/getTableList",//获取表格数据api
          insertApi:"/api/sysRole/insert",//新增用api
          updateApi:"/api/sysRole/update",//更新用api
          getDetailApi:"/api/sysRole/getDetail",//获取详情用api
          deleteOneApi:"/api/sysRole/delete",//单条删除api
          deleteBatchApi:"/api/sysRole/deletebatch",//批量删除api
          getOrgTreeApi:"/api/sysOrg/getNextLayer",//获取组织机构树api
          getAuthTreeApi:"/api/sysMenu/getAuthTree",//获取角色授权树api
          authApi:"/api/sysRole/authed",//授权api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'角色代码',prop:'roleCode'},
          {type:'Input',label:'角色名称',prop:'roleName'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					userRoleCode:"",//角色代码 
					userRoleName:"",//角色名称 
					description:"",//角色描述 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'sysRole_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'sysRole_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'sysRole_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'sysRole_batchdelete'}
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
					{label:'角色代码',prop:'roleCode',align:'center'},
          {label:'角色名称',prop:'roleName',align:'center'},
          // {label:'所属组织',prop:'orgName',align:'center'},
					{label:'角色描述',prop:'roleDesc',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看',type:'text',auth:'sysRole_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
            {label:'编辑',type:'text',auth:'sysRole_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
            {label:'权限配置',type:'text',auth:'sysRole_auth',handle:(row)=>this.showAuthModal(row.id)},
						{label:'删除',type:'text',auth:'sysRole_delete',handle:(row)=>this.deleteOne(row.id)},
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
					{type:'Input',label:'角色代码',prop:'roleCode',rules:{required:true,maxLength:30}},
					{type:'Input',label:'角色名称',prop:'roleName',rules:{required:true,maxLength:50}},
          {type:'Input',label:'角色描述',prop:'roleDesc',rules:{required:false,maxLength:255}},
          // {type:'TreeSelect',label:'所属组织',prop:'orgId',rules:{required:true},props:{parent: 'parentOrgId',value: 'id',label: 'orgName',children: 'children'},data:[],ref:'select',url:"/api/sysOrg/getNextLayer"},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					roleCode:"",//角色代码 
					roleName:"",//角色名称 
          roleDesc:"",//角色描述 
          // orgId:"",//组织id
        },
        //modal 数据 end
        //modal 按钮 start
        modalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeModal()},
          {label:'提交',type:'primary',handle:()=>this.save()}
        ],
        //modal 按钮 end
        //授权页面配置 start
        authDialogParam:{//modal页面标题、是否显示等参数
          title: "权限配置", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示,
          type:"1"
        },
        authModalForm:[
          {type:'Tree',data:[],checked:[],props:{children: 'children',label: 'menuName'},key:"menuId",ref:"authTree"},
        ],
        authModalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeAuthModal()},
          {label:'提交',type:'primary',handle:()=>this.auth()}
        ],
        authModalData:{
          id:"",//角色id
          authed:[],//已授权的数据
        },
        //授权页面配置end
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
      // this.getOrgTree();
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
        // this.$refs.modalRef.$refs.select[0].labelModel = response.responseData.orgName;
      });
    },
    /**
     * @description: 关闭modal
     * @param 
     * @return: 
     * @author: caiyang
     */    
    closeModal(){
      
      this.pageData.modalConfig.show = false;//关闭modal
      // this.commonUtil.clearObj(this.pageData.modalData);//清空modalData
      this.$refs['modalRef'].$refs['modalFormRef'].resetFields();//校验重置
      // this.$refs.modalRef.$refs.select[0].labelModel = "";
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
            if(sessionStorage.getItem(this.commonConstants.sessionItem.isAdmin)!=1&&sessionStorage.getItem(this.commonConstants.sessionItem.orgIds).length==1)
            {
              this.pageData.modalData.orgId = sessionStorage.getItem(this.commonConstants.sessionItem.orgIds)[0];
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
       this.pageData.modalForm[3].data = response.responseData
      });
    },
    showAuthModal(id){//显示权限配置页面
      this.pageData.authDialogParam.show = true;//显示弹框
      this.pageData.authModalData.id = id;
      this.getAuthTree(id);//获取权限树
    },
    closeAuthModal(){//关闭权限配置页面
      this.pageData.authDialogParam.show = false;//关闭弹框
      this.pageData.authModalForm[0].data = [];
      this.pageData.authModalForm[0].checked = [];
      this.pageData.authModalData.authed=[];
    },
    /**
     * @description: 获取授权树
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getAuthTree(id){
      var obj = {
        params:{id:id},
        removeEmpty:false,
        url:this.pageData.requestUrl.getAuthTreeApi
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
          this.pageData.authModalForm[0].data = response.responseData.treeData;
          this.pageData.authModalForm[0].checked = response.responseData.authed;
        }
      });
    },
    auth(){//确定授权
      var checkedNodes = this.$refs.authRef.$refs.authTree[0].getCheckedNodes(false,true);
      if(checkedNodes && checkedNodes.length>0)
      {
        for (let index = 0; index < checkedNodes.length; index++) {
          this.pageData.authModalData.authed.push(checkedNodes[index].menuId);
        }
      }
      if(this.pageData.authModalData.authed.length == 0)
      {
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.auth.select",null),type: this.commonConstants.messageType.error});
      }else{
        var obj = {
          url:this.pageData.requestUrl.authApi,
          params:this.pageData.authModalData,
          removeEmpty:false,
        }
        this.commonUtil.doPost(obj) .then(response=>{
          this.closeAuthModal();
        });
      }
    }
  }
};