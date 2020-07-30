export default {
    name:'tBook',
    data() {
      return{
        pageData:{
          //请求的url start
          requestUrl:{
            listApi:"/api/tBook/getTableList",//获取表格数据api
            insertApi:"/api/tBook/insert",//新增用api
            updateApi:"/api/tBook/update",//更新用api
            getDetailApi:"/api/tBook//getDetail",//获取详情用api
            deleteOneApi:"/api/tBook/delete",//单条删除api
            deleteBatchApi:"/api/tBook/deletebatch",//批量删除api
            getAllCategory:"/api/tCategory/getAllCategory",//查询类别列表
          },
          //请求的url end
          //查询表单内容 start
          searchForm:[
                      {type:'Input',label:'书籍名称',prop:'bookName'},
                      // {type:'Input',label:'拼音',prop:'pinyin'},
                      {type:'Select',label:'书籍类别',prop:'cid'},
                      {type:'Input',label:'作者',prop:'author'},
                      // {type:'Input',label:'图片路径',prop:'image'},
                      // {type:'Input',label:'描述',prop:'description'},
                      {type:'Input',label:'书籍状态',prop:'state'},
                      {type:'Input',label:'上架时间',prop:'deploytime'},
                      // {type:'Input',label:'浏览次数',prop:'hits'},
                      // {type:'Input',label:'书籍的路径',prop:'url'},
          ],
          //查询表单内容 end
          //查询条件 start
          queryData:{
                      bookName:"",//书籍名称 
                      pinyin:"",//拼音 
                      cid:"",//书籍类别 
                      author:"",//作者 
                      image:"",//图片路径 
                      description:"",//描述 
                      state:"",//书籍状态（1 已上架 2 已下架 默认值1 ） 
                      deploytime:"",//上架时间 
                      hits:"",//浏览次数 
                      url:"",//书籍的路径 
          },
          //查询条件 end
          //查询表单按钮start
          searchHandle:[
            {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'tBook_search'},
            {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'tBook_search'}
          ],
          //查询表单按钮end
          //表格数据start
          tableData:[],
          //表格数据end
          //表格工具栏按钮 start
          tableHandles:[
            {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'tBook_insert'},
            {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'tBook_batchdelete'}
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
                      {label:'书籍名称',prop:'bookName',align:'center'},
                      {label:'拼音',prop:'pinyin',align:'center'},
                      {label:'书籍类别',prop:'cid',align:'center'},
                      {label:'作者',prop:'author',align:'center'},
                      // {label:'图片路径',prop:'image',align:'center'},
                      {label:'描述',prop:'description',align:'center'},
                      {label:'书籍状态',prop:'state',align:'center'},
                      {label:'上架时间',prop:'deploytime',align:'center'},
                      {label:'浏览次数',prop:'hits',align:'center'},
                      // {label:'书籍的路径',prop:'url',align:'center'},
                      {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
                          {label:'查看',type:'text',auth:'tBook_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
                          {label:'编辑',type:'text',auth:'tBook_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
                          {label:'删除',type:'text',auth:'tBook_delete',handle:(row)=>this.deleteOne(row.id)},
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
                      {type:'Input',label:'书籍名称',prop:'bookName',rules:{required:true,maxLength:100}},
                    //   {type:'Input',label:'拼音',prop:'pinyin',rules:{required:true,maxLength:100}},
                      {type:'Select',label:'书籍类别',prop:'cid',rules:{required:true},props:{label:'name',value:'id'},focus:this.getAllCategory},
                      {type:'Input',label:'出版社',prop:'publishing',rules:{required:true}},
                      {type:'Input',label:'作者',prop:'author',rules:{required:true,maxLength:100}},
                      {type:'Input',label:'描述',prop:'description',rules:{maxLength:255}},
                      // {type:'Select',label:'书籍状态',prop:'state',rules:{required:true},options:this.selectUtil.bookState},
                      {type:'Date',label:'上架时间',prop:'deploytime',rules:{required:true},change:(value)=>this.dateChange(value)},
                    //   {type:'Input',label:'浏览次数',prop:'hits',rules:{required:true}},
                      {type:'Upload',label:'图片路径',prop:'imageList',rules:{required:true},multiple:false,accept:"image/*",width:'300px',labelWidth:'180px',readonly:true},
                      {type:'Upload',label:'书籍的路径',prop:'urlList',rules:{required:true},multiple:false,accept:".txt",width:'300px',labelWidth:'180px',tips:"请上传txt文件",readonly:true},
          ],
          //modal表单 end
          //modal 数据 start
          modalData : {//modal页面数据
                bookName:"",//书籍名称 
              //   pinyin:"",//拼音 
                cid:"",//书籍类别 
                author:"",//作者 
                image:"",//图片路径 
                imageList:[],
                description:"",//描述 
                state:"",//书籍状态（1 已上架 2 已下架 默认值1 ） 
                deploytime:"",//上架时间 
                hits:"",//浏览次数 
                url:"",//书籍的路径 
                urlList:[],
                publishing:"",//出版社
          },
          //书籍类型数据start
          categoryData : {
            name:""//类别名
          },
           //书籍类型数据end
          //modal 数据 end
          //modal 按钮 start
          modalHandles:[
            {label:'取消',type:'default',handle:()=>this.closeModal()},
            {label:'提交',type:'primary',handle:()=>this.save()}
          ],
          //modal 按钮 end
          uploadState:true,
        },
        //
      }
    },
    mounted(){
      this.searchtablelist();
    },
    computed:{
      
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
            this.pageData.modalForm[6].readonly = true;
          }
          if(type == this.commonConstants.modalType.update){
            this.pageData.modalForm[6].readonly = false;
          }
         
          this.getDetail(id);
        }else{
          this.pageData.modalForm[6].readonly = false;
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
          this.pageData.modalData.imageList.push({url:response.responseData.image});
          if(this.pageData.modalData.urlList == null)
          {
            this.pageData.modalData.urlList = [];
          }
          this.pageData.modalData.urlList.push({url:response.responseData.url});
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
      },
      /**
       * @description: 保存数据
       * @param {type} 
       * @return: 
       * @author: caiyang
       */    
      save(){
        this.$refs['modalRef'].$refs['modalFormRef'].validate((valid) => {
          console.log(this.pageData.modalData.imageList[0])
          if (valid) {
              var params = {
                bookName:this.pageData.modalData.bookName,//书籍名称 
              //   pinyin:"",//拼音 
                cid:this.pageData.modalData.cid,//书籍类别 
                author:this.pageData.modalData.author,//作者 
                image:this.pageData.modalData.imageList[0].url,//图片路径 
                description:this.pageData.modalData.description,//描述 
                state:this.pageData.modalData.state,//书籍状态（1 已上架 2 已下架 默认值1 ） 
                deploytime:this.pageData.modalData.deploytime,//上架时间 
                url:this.pageData.modalData.urlList[0].url,//书籍的路径 
                publishing:this.pageData.modalData.publishing,//出版社
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
      //查询所有书的分类
      getAllCategory(){
        var obj = {
          url:this.pageData.requestUrl.getAllCategory,
        }
        this.commonUtil.doGet(obj).then(response=>{
          if (response.code == "200")
          {
            this.pageData.modalForm[1].options = response.responseData;
            this.$refs['modalRef'].$forceUpdate();//在methods中需强制更新，mounted中不需要
          }
        });
          
      },
      //日期组件改变
      dateChange(value){
        console.log(value)
      }
    }

  };