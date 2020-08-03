export default {
  name:'fileLog',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/fileLog/getTableList",//获取表格数据api
          insertApi:"/api/fileLog/insert",//新增用api
          updateApi:"/api/fileLog/update",//更新用api
          getDetailApi:"/api/fileLog//getDetail",//获取详情用api
          deleteOneApi:"/api/fileLog/delete",//单条删除api
          deleteBatchApi:"/api/fileLog/deletebatch",//批量删除api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'文件名',prop:'fileName'},
					// {type:'Input',label:'文件大小',prop:'fileSize'},
          {type:'Select',label:'文件操作类型',prop:'type',options:this.selectUtil.fileType},
					{type:'Select',label:'上传状态',prop:'operateStatus',options:this.selectUtil.fileOperateStatus},
					// {type:'Input',label:'异常信息',prop:'errorInfo'},
					// {type:'Input',label:'返回结果',prop:'result'},
					// {type:'Input',label:'访问路径',prop:'fileUrl'},
					// {type:'Input',label:'请求机器ip',prop:'operateIp'},
					// {type:'Input',label:'执行时长',prop:'executeTime'},
					{type:'Select',label:'请求来源',prop:'menuType',options:this.selectUtil.menuType},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					fileName:"",//文件名 
					fileSize:"",//文件大小 
					type:"",//文件操作类型 1上传2下载3删除4查看 
					operateStatus:"",//上传状态 1上传成功 2上传失败3删除成功4删除失败 
					errorInfo:"",//异常信息 
					result:"",//返回结果 
					fileUrl:"",//访问路径 
					operateIp:"",//请求机器ip 
					executeTime:"",//执行时长 
					requestSource:"",//请求来源 1 后台运营 2其他 默认1 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'fileLog_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'fileLog_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'fileLog_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'fileLog_batchdelete'}
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
					{label:'文件名',prop:'fileName',align:'center'},
					// {label:'文件大小',prop:'fileSize',align:'center'},
					{label:'文件操作类型',prop:'type',align:'center',codeType:'fileType',formatter:this.commonUtil.getTableCodeName},
					{label:'上传状态',prop:'operateStatus',align:'center',codeType:'fileOperateStatus',formatter:this.commonUtil.getTableCodeName},
					// {label:'异常信息',prop:'errorInfo',align:'center'},
					// {label:'返回结果',prop:'result',align:'center'},
					{label:'访问路径',prop:'fileUrl',align:'center'},
					{label:'请求机器ip',prop:'operateIp',align:'center'},
          // {label:'执行时长',prop:'executeTime',align:'center'},
          
					{label:'请求来源',prop:'requestSource',align:'center',codeType:'menuType',formatter:this.commonUtil.getTableCodeName},
					// {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
					// 	{label:'查看',type:'text',auth:'fileLog_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
					// 	{label:'编辑',type:'text',auth:'fileLog_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
					// 	{label:'删除',type:'text',auth:'fileLog_delete',handle:(row)=>this.deleteOne(row.id)},
					// ]}
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
					{type:'Input',label:'文件名',prop:'fileName',rules:{required:true,maxLength:200}},
					{type:'Input',label:'文件大小',prop:'fileSize',rules:{required:true}},
					{type:'Input',label:'文件操作类型 1上传2下载3删除4查看',prop:'type',rules:{required:true,type:'number'}},
					{type:'Input',label:'上传状态 1上传成功 2上传失败3删除成功4删除失败',prop:'operateStatus',rules:{required:true,type:'number'}},
					{type:'Input',label:'异常信息',prop:'errorInfo',rules:{required:true,maxLength:500}},
					{type:'Input',label:'返回结果',prop:'result',rules:{required:true,maxLength:2000}},
					{type:'Input',label:'访问路径',prop:'fileUrl',rules:{required:true,maxLength:200}},
					{type:'Input',label:'请求机器ip',prop:'operateIp',rules:{required:true,maxLength:20}},
					{type:'Input',label:'执行时长',prop:'executeTime',rules:{required:true,maxLength:50}},
					{type:'Input',label:'请求来源 1 后台运营 2其他 默认1',prop:'requestSource',rules:{required:true,type:'number'}},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					fileName:"",//文件名 
					fileSize:"",//文件大小 
					type:"",//文件操作类型 1上传2下载3删除4查看 
					operateStatus:"",//上传状态 1上传成功 2上传失败3删除成功4删除失败 
					errorInfo:"",//异常信息 
					result:"",//返回结果 
					fileUrl:"",//访问路径 
					operateIp:"",//请求机器ip 
					executeTime:"",//执行时长 
					requestSource:"",//请求来源 1 后台运营 2其他 默认1 
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
  }
};