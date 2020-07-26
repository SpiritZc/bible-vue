export default {
  name:'sysMenu',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/sysMenu/getTableList",//获取表格数据api
          insertApi:"/api/sysMenu/insert",//新增用api
          updateApi:"/api/sysMenu/update",//更新用api
          getDetailApi:"/api/sysMenu/getDetail",//获取详情用api
          deleteOneApi:"/api/sysMenu/delete",//单条删除api
          deleteBatchApi:"/api/sysMenu/deletebatch",//批量删除api
          getAllMenusApi:"/api/sysMenu/getAllMenus",//获取所有菜单api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
          {type:'Input',label:'菜单名称',prop:'menuName'},
          {type:'Select',label:'菜单类型',prop:'menuType',options:this.selectUtil.menuType},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
          menuName:"",//菜单名称 
          menuType:"",//菜单类型
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'sysMenu_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'sysMenu_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'sysMenu_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'sysMenu_batchdelete'}
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
            {label:'菜单名称',prop:'menuName',align:'center'},
            {label:'菜单路径',prop:'menuUrl',align:'center'},
            {label:'菜单图标',prop:'menuIcon',align:'center'},
            {label:'访问规则',prop:'rule',align:'center',codeType:'menuRule',formatter:this.commonUtil.getTableCodeName},
            {label:'是否隐藏',prop:'isHidden',align:'center',codeType:'yesNo',formatter:this.commonUtil.getTableCodeName},
            {label:'菜单类型',prop:'menuType',align:'center',codeType:'menuType',formatter:this.commonUtil.getTableCodeName},
            // {label:'class属性',prop:'clazz',align:'center'},
            {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
              {label:'查看',type:'text',auth:'sysMenu_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
              {label:'编辑',type:'text',auth:'sysMenu_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
              {label:'菜单功能',type:'text',auth:'sysMenu_function',handle:(row)=>this.routerTo(row)},
              {label:'删除',type:'text',auth:'sysMenu_delete',handle:(row)=>this.deleteOne(row.id)},
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
          {type:'Input',label:'菜单名称',prop:'menuName',rules:{required:true,maxLength:30}},
          {type:'Input',label:'菜单路径',prop:'menuUrl',rules:{required:true,maxLength:100}},
          {type:'Input',label:'菜单图标',prop:'menuIcon',rules:{required:true,maxLength:50}},
          {type:'Select',label:'访问规则',prop:'rule',rules:{required:true},options:this.selectUtil.menuRule},
          {type:'Select',label:'是否隐藏',prop:'isHidden',rules:{required:true},options:this.selectUtil.yesNo},
          {type:'Select',label:'菜单类型',prop:'menuType',rules:{required:true},options:this.selectUtil.menuType},
          {type:'Select',label:'上级菜单',prop:'parentMenuId',rules:{required:false},props:{label:'menuName',value:'id'},focus:this.getAllMenus},
          // {type:'Input',label:'class属性',prop:'clazz',rules:{required:false,maxLength:200}},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
          menuName:"",//菜单名称 
          menuUrl:"",//菜单路径 
          menuIcon:"",//菜单图标 
          rule:"",//访问规则，1登录后访问 2登录并授权访问 默认 2 
          isHidden:"",//是否隐藏菜单
          menuType:"",
          parentMenuId:"",//上级菜单
          clazz:"",//菜单属性
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
      // this.getAllMenus();
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
        this.getAllMenus();
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
     * @description: 获取所有的菜单
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getAllMenus(){
      if(!this.pageData.modalData.menuType)
      {
        this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.menutype.select",null),type: this.commonConstants.messageType.error});
        return;
      }
      var obj = {
        params:this.pageData.modalData,
        removeEmpty:false,
        url:this.pageData.requestUrl.getAllMenusApi
      }
      this.commonUtil.doPost(obj) .then(response=>{
        if (response.code == "200")
        {
          this.pageData.modalForm[6].options = response.responseData;
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        }
      });
    },
    routerTo(row){
      this.$store.commit("setParameters",{key:'menuId',value:row.id});
      this.$store.commit("setParameters",{key:'menuType',value:row.menuType});
      this.$router.push({ name: 'sysFunction'})
    }
  }
};