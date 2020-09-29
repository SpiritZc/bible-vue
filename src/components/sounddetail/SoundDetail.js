export default {
  name:'soundDetail',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/soundDetail/getTableList",//获取表格数据api
          insertApi:"/api/soundDetail/insert",//新增用api
          updateApi:"/api/soundDetail/update",//更新用api
          getDetailApi:"/api/soundDetail/getDetail",//获取详情用api
          deleteOneApi:"/api/soundDetail/delete",//单条删除api
          deleteBatchApi:"/api/soundDetail/deletebatch",//批量删除api
          roleListApi:"/api/sysRole/getRoles",//获取所有的角色列表
          userListByRoleId:"/api/sysUser/getUserByRoleId",//根据角色获取用户
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'音频文件名',prop:'soundName'},
					{type:'Input',label:'音频路径',prop:'soundUrl'},
					{type:'Input',label:'音频作者',prop:'soundAuthor'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
          categorySecondId:"",//
					soundName:"",//音频文件名 
					soundUrl:"",//音频路径 
          soundAuthor:"",//音频作者 
          categoryId:"",//
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'soundDetail_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'soundDetail_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'soundDetail_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'soundDetail_batchdelete'}
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
					{label:'音频文件名',prop:'soundName',align:'center'},
          {label:'音频路径',prop:'soundUrl',align:'center',type:"audio",audioConfig:(row)=>this.getAudioConfig(row)},
          {label:'图片路径',prop:'soundImg',align:'center',type:"image",popover:true},
					{label:'音频作者',prop:'soundAuthor',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看',type:'text',auth:'soundDetail_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
						{label:'编辑',type:'text',auth:'soundDetail_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
						{label:'删除',type:'text',auth:'soundDetail_delete',handle:(row)=>this.deleteOne(row.id)},
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
          // {type:'Select',label:'关联用户',prop:'isAssociateUser',rules:{required:true},options:this.selectUtil.yesNo,},
          // {type:'Select',label:'角色id',prop:'roleId',rules:{required:true},props:{label:'roleName',value:'id'},focus:this.getAllRoles},
          // {type:'Select',label:'用户id',prop:'userId',rules:{required:true},props:{label:'accountName',value:'id'},focus:this.getUserByRole},
          {type:'Input',label:'音频文件名',prop:'soundName',rules:{required:true,maxLength:100},labelWidth:'120px'},
          // {type:'Input',label:'音频路径',prop:'',rules:{required:true,maxLength:255}},
          {type:'Upload',label:'音频路径',prop:'soundUrlList',tips:'请上传音频文件',rules:{required:true},multiple:false,accept:"audio/*",width:'200px',labelWidth:'120px',readonly:true},
          {type:'Upload',label:'图片路径',prop:'imageList',rules:{required:true},multiple:false,accept:"image/*",width:'200px',labelWidth:'120px',readonly:true},
          {type:'Input',label:'音频作者',prop:'soundAuthor',rules:{required:true,maxLength:100},labelWidth:'120px'},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
          categoryId:"",//有声类别id
          isAssociateUser:"",//是否关联用户 1关联 2不关联
					soundName:"",//音频文件名 
					soundUrl:"",//音频路径 
          soundAuthor:"",//音频作者 
          roleId:"",//角色id
          userId:"",//用户id
          soundUrlList:[],//音频文件
          imageList:[],//
          soundImg:"",
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
    let categorySecondId=this.$store.getters.parameters['categorySecondId'];//获取topicId
    this.pageData.queryData.categorySecondId = categorySecondId;
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
          this.pageData.modalForm[1].readonly = true;
          this.pageData.modalForm[2].readonly = true;
        }
        if(type == this.commonConstants.modalType.update){
          this.pageData.modalForm[1].readonly = false;
          this.pageData.modalForm[2].readonly = false;
        }
       
        this.getDetail(id);
      }else{
        this.pageData.modalForm[1].readonly = false;
        this.pageData.modalForm[2].readonly = false;
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
        if(this.pageData.modalData.soundUrlList == null)
        {
          this.pageData.modalData.soundUrlList = [];
        }
        this.pageData.modalData.soundUrlList.push({name:response.responseData.soundUrl.substring(response.responseData.soundUrl.lastIndexOf("/")+1),url:response.responseData.soundUrl});
        if(this.pageData.modalData.imageList == null)
        {
          this.pageData.modalData.imageList = [];
        }
        this.pageData.modalData.imageList.push({name:response.responseData.soundImg.substring(response.responseData.soundImg.lastIndexOf("/")+1),url:response.responseData.soundImg});
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
        console.log(this.pageData.modalData.soundUrlList)
        if (valid) {
          var params = {
            id:this.pageData.modalData.id,
            categorySecondId:this.pageData.queryData.categorySecondId,//有声类别id
            soundUrl:this.pageData.modalData.soundUrlList[0].url,//音频文件名 
            duration:this.pageData.modalData.soundUrlList[0].duration,//音频时长
            soundImg:this.pageData.modalData.imageList[0].url,//图片路径
            soundName:this.pageData.modalData.soundName,//音频路径 
            soundAuthor:this.pageData.modalData.soundAuthor,//推文图片路径
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
    /**
     * 获取所有的角色
     */
    getAllRoles(){
      // if(){

      // }
      var obj = {
        url:this.pageData.requestUrl.roleListApi,
      }
      this.commonUtil.doGet(obj).then(response=>{
        if (response.code == "200")
        {
          this.pageData.modalForm[1].options = response.responseData;
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        }
      });
    },
    getUserByRole(){
      var obj = {
        url:this.pageData.requestUrl.userListByRoleId,
        params:{roleId:this.pageData.modalData.roleId},
      }
      this.commonUtil.doGet(obj).then(response=>{
        if (response.code == "200")
        {
          this.pageData.modalForm[2].options = response.responseData;
          this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
        }
      });
    },
    getAudioConfig(row){
      var obj = {};
      obj.title = row.soundName
      obj.author = row.soundAuthor
      obj.url = row.soundUrl
      obj.pic = row.soundImg
      return obj
    }
  }
};