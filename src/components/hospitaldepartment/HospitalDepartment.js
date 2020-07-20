export default {
  name:'hospitalDepartment',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/hospitalDepartment/getTableList",//获取表格数据api
          insertApi:"/api/hospitalDepartment/insert",//新增用api
          updateApi:"/api/hospitalDepartment/update",//更新用api
          getDetailApi:"/api/hospitalDepartment/getDetail",//获取详情用api
          deleteOneApi:"/api/hospitalDepartment/delete",//单条删除api
          deleteBatchApi:"/api/hospitalDepartment/deletebatch",//批量删除api
          getPrimaryDeptApi:"/api/primaryDept/getAllDepts",//获取一级科室api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
          {type:'Input',label:'科室编码',prop:'deptCode'},
					{type:'Input',label:'科室名称',prop:'deptName'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
          deptCode:"",//科室编码
					deptName:"",//科室名称 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'hospitalDepartment_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'hospitalDepartment_search'}
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          {label:'新增',type:'primary',handle:()=>this.showModal(this.commonConstants.modalType.insert),auth:'hospitalDepartment_insert'},
          {label:'批量删除',type:'danger',handle:()=>this.deleteBatch(),auth:'hospitalDepartment_batchdelete'}
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
          {label:'科室编码',prop:'deptCode',align:'center'},
					{label:'科室名称',prop:'deptName',align:'center'},
          {label:'平台科室',prop:'sysDeptName',align:'center'},
          {label:'自定义科室',prop:'standardDeptName',align:'center'},
					{label:'备注',prop:'memo',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看',type:'text',auth:'hospitalDepartment_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
						{label:'编辑',type:'text',auth:'hospitalDepartment_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
						{label:'删除',type:'text',auth:'hospitalDepartment_delete',handle:(row)=>this.deleteOne(row.id)},
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
          {type:'Input',label:'科室编码',prop:'deptCode',rules:{required:true,maxLength:40}},
					{type:'Input',label:'科室名称',prop:'deptName',rules:{required:true,maxLength:200}},
          {type:'TreeSelect',label:'平台科室',prop:'sysDeptId',rules:{required:false},props:{parent: 'id',value: 'id',label: 'name',children: 'children'},data:[],ref:'select',url:"/api/secondDept/getSecondDeptsByPrimaryId",clearable:true},
          {type:'Input',label:'自定义科室',prop:'standardDeptName',width:"515px",rules:{required:false,maxLength:200},suggestions:"平台科室中没有合适的选项时填写此项目！"},
          {type:'Textarea',label:'备注',prop:'memo',rules:{required:false,maxLength:200},width:'515px'},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
          deptCode:"",//科室编码
          deptName:"",//科室名称 
          sysDeptId:null,//平台科室
					standardDeptName:"",//系统科室名称 
					memo:"",//备注 
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
      let hospitalId=this.$store.getters.parameters['hospitalId'];//获取hospitalId
      this.pageData.queryData.hospitalId = hospitalId;
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
      this.getPrimaryDept();
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
        this.$refs.modalRef.$refs.select[0].labelModel = response.responseData.sysDeptName;
        this.pageData.modalData.sysDeptId = response.responseData.sysDeptId+'';
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
            let hospitalId=this.$store.getters.parameters['hospitalId'];//获取hospitalId
            this.pageData.modalData.hospitalId = hospitalId;
            var obj = {
              params:this.pageData.modalData,
              removeEmpty:true,
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
     * @description: 获取一级科室
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    getPrimaryDept(){
      var obj = {
        params:{},
        url:this.pageData.requestUrl.getPrimaryDeptApi
      };
      this.commonUtil.doPost(obj).then(response=>{
       this.pageData.modalForm[2].data = response.responseData
      });
    },
  }
};