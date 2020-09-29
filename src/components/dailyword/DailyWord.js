export default {
  name:'dailyWord',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/dailyWord/getTableList",//获取表格数据api
          insertApi:"/api/dailyWord/insert",//新增用api
          updateApi:"/api/dailyWord/update",//更新用api
          getDetailApi:"/api/dailyWord/getDetail",//获取详情用api
          deleteOneApi:"/api/dailyWord/delete",//单条删除api
          deleteBatchApi:"/api/dailyWord/deletebatch",//批量删除api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'标题',prop:'title'},
					{type:'Input',label:'文章来源作者',prop:'fromAuthor'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					title:"",//标题 
					fromAuthor:"",//文章来源作者 
					content:"",//短文内容 
					img:"",//短文图片路径 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'dailyWord_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'dailyWord_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'dailyWord_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'dailyWord_batchdelete'}
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
					{label:'标题',prop:'title',align:'center'},
					{label:'文章来源作者',prop:'fromAuthor',align:'center'},
					{label:'短文内容',prop:'content',align:'center'},
          {label:'短文图片路径',prop:'img',align:'center',type:"image",popover:true},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看',type:'text',auth:'dailyWord_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
						{label:'编辑',type:'text',auth:'dailyWord_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
						{label:'删除',type:'text',auth:'dailyWord_delete',handle:(row)=>this.deleteOne(row.id)},
					]}
        ],
        //表格列表头end
        //modal配置 start
        modalConfig:{ 
          title: "新增", //弹窗标题,值为:新增，查看，编辑
          show: false, //弹框显示
          formEditDisabled:false,//编辑弹窗是否可编辑
          width:'800px',//弹出框宽度
          modalRef:"modalRef",//modal标识
          type:"1"//类型 1新增 2编辑 3保存
        },
        //modal配置 end
        //modal表单 start
        modalForm:[
					{type:'Input',label:'标题',prop:'title',rules:{required:true,maxLength:200},labelWidth:'120px'},
					{type:'Input',label:'文章来源作者',prop:'fromAuthor',rules:{required:true,maxLength:100},labelWidth:'120px'},
					{type:'Textarea',label:'短文内容',prop:'content',rules:{required:true,maxLength:200},labelWidth:'120px',width:'500px'},
					{type:'Upload',label:'图片路径',prop:'imageList',rules:{required:true},multiple:false,accept:"image/*",width:'200px',labelWidth:'120px',readonly:true},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
					title:"",//标题 
					fromAuthor:"",//文章来源作者 
					content:"",//短文内容 
          img:"",//短文图片路径 
          imageList:[],//短文图片集合
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
        if(type == this.commonConstants.modalType.detail){
          this.pageData.modalForm[3].readonly = true;
        }
        if(type == this.commonConstants.modalType.update){
          this.pageData.modalForm[3].readonly = false;
        }
       
        this.getDetail(id);
      }else{
        this.pageData.modalForm[3].readonly = false;
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
        if(this.pageData.modalData.imageList == null)
          {
            this.pageData.modalData.imageList = [];
          }
          this.pageData.modalData.imageList.push({name:response.responseData.img.substring(response.responseData.img.lastIndexOf("/")+1),url:response.responseData.img});
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
          var params = {
            id:this.pageData.modalData.id,
            title:this.pageData.modalData.title,//标题 
            fromAuthor:this.pageData.modalData.fromAuthor,//文章来源作者 
            content:this.pageData.modalData.content,//推文图片路径
            img:this.pageData.modalData.imageList[0].url,//推文图片路径 
          }
            var obj = {
              params:params,
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