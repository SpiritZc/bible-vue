import Axios from 'axios'
export default {
  name:'hospitalApply',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/hospitalApply/getTableList",//获取表格数据api
          insertApi:"/api/hospitalApply/insert",//新增用api
          getDetailApi:"/api/hospitalApply/getDetail",//获取详情用api
          updateApi:"/api/hospitalApply/update"
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
          {type:'DateRange',label:'申请时间',prop:'applyTime'},
					// {type:'Input',label:'医院名称',prop:'hospitalName'},
					// {type:'Input',label:'医院联系人',prop:'hospitalContact'},
					// {type:'Input',label:'联系方式',prop:'hospitalContactInfo'},
					// {type:'Input',label:'商务跟进',prop:'businessFollow'},
          // {type:'Input',label:'商务联系方式',prop:'businessPhone'},
          {type:'Select',label:'处理状态',prop:'processStatus',options:this.selectUtil.processStatus},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
          applyTime:null,//申请时间
					// hospitalName:"",//医院名称 
					// hospitalContact:"",//医院联系人 
					// hospitalContactInfo:"",//联系方式 
					// businessFollow:"",//商务跟进 
          // businessPhone:"",//商务联系方式 
          status:"",//审核状态
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'hospitalApply_search'},
          {label:'重置',type:'warning',handle:()=>this.resetSearch(),auth:'hospitalApply_search'}
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
          pageSizeRange:[ 10, 20]
        },
        //表格分页信息end
        //表格列表头start
        tableCols:[
          {label:'时间',prop:'createTime',align:'center'},
          {label:'医院名称',prop:'hospitalName',align:'center'},
					{label:'所属地区',prop:'provinceName',align:'center',formatter:this.commonUtil.formArea},
					{label:'联系人',prop:'hospitalContact',align:'center'},
          {label:'联系方式',prop:'hospitalContactInfo',align:'center'},
          {label:'处理状态',prop:'processStatus',align:'center',codeType:'processStatus',formatter:this.commonUtil.getTableCodeName},
					// {label:'商务跟进',prop:'businessFollow',align:'center'},
          // {label:'商务联系方式',prop:'businessPhone',align:'center'},
          // {label:'审核状态',prop:'status',align:'center',codeType:'applyStatus',formatter:this.commonUtil.getTableCodeName},
          // {label:'审批时间',prop:'approvalTime',align:'center'},
          // {label:'审批人',prop:'approvalUser',align:'center'},
					// {label:'备注',prop:'remark',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						// {label:'查看',type:'text',auth:'hospitalApply_getdetail',handle:(row)=>this.showModal(this.commonConstants.modalType.detail,row.id)},
						{label:'查看详情',type:'text',auth:'hospitalApply_update',handle:(row)=>this.showModal(this.commonConstants.modalType.update,row.id)},
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
          {type:'Input',label:'医院名称',prop:'hospitalName',width:'515px',rules:{required:true,maxLength:100}},
          {type:'Region',label:'所属地区',prop:'areaCode',rules:{required:true},options:[],width:"515px"},
					{type:'Input',label:'医院联系人',prop:'hospitalContact'},
          {type:'Input',label:'联系方式',prop:'hospitalContactInfo'},
          {type:'Radio',label:'处理结果',prop:'status',rules:{required:true},radios:[{value:'2',label:'审核通过，已上报公司'},{value:'3',label:'审核不通过'}],change:this.changeStatus},
					{type:'Input',label:'商务跟进',prop:'businessFollow',rules:{required:false,maxLength:20}},
					{type:'Input',label:'联系方式',prop:'businessPhone',rules:{required:false,maxLength:20,type:'mobilephone'}},
					{type:'Textarea',label:'备注',prop:'remark',width:'515px',rules:{required:false,maxLength:500}},
        ],
        //modal表单 end
        //modal 数据 start
        modalData : {//modal页面数据
          areaCode:[],
					hospitalName:"",//医院名称 
          provinceCode:"",
          cityCode:"",
          reginCode:'',
					hospitalContact:"",//医院联系人 
					hospitalContactInfo:"",//联系方式 
					businessFollow:"",//商务跟进 
					businessPhone:"",//商务联系方式 
          remark:"",//备注 
          status:null,//处理结果
        },
        //modal 数据 end
        //modal 按钮 start
        modalHandles:[
          {label:'取消',type:'default',handle:()=>this.closeModal()},
          {label:'保存',type:'primary',handle:()=>this.save()}
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
      if(this.pageData.queryData.applyTime != null && this.pageData.queryData.applyTime.length>0)
      {
        this.pageData.queryData.startDate = this.pageData.queryData.applyTime[0];
        this.pageData.queryData.endDate = this.pageData.queryData.applyTime[1];
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
      this.pageData.modalConfig.show = true;
      this.pageData.modalConfig.type = type;
      if(type == this.commonConstants.modalType.update)
      {
        this.pageData.modalConfig.title = "审核"
        this.pageData.modalConfig.formEditDisabled=false;
      }else if(type == this.commonConstants.modalType.detail)
      {
        this.pageData.modalConfig.title = this.commonConstants.modalTitle.detail;
        this.pageData.modalConfig.formEditDisabled=true;
      }
      this.getDetail(id);
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
        this.pageData.modalData.areaCode = [];
        this.pageData.modalData.areaCode[0] = this.pageData.modalData.provinceCode;
        this.pageData.modalData.areaCode[1] = this.pageData.modalData.cityCode;
        this.pageData.modalData.areaCode[2] = this.pageData.modalData.reginCode;
        $('#cascaderRegion').find('input').val(response.responseData.provinceName+" / "+response.responseData.cityName+" / "+response.responseData.reginName)
        if(this.commonConstants.modalType.update == this.pageData.modalConfig.type)
        {
          if(this.pageData.modalData.status == 1)
          {
            this.pageData.modalData.status = null;
          }
          this.pageData.modalForm[4].radios = [{value:2,label:'审核通过，已上报公司'},{value:3,label:'审核不通过'}];
        }else{
          this.pageData.modalForm[4].radios = [{value:1,label:'待审核'},{value:2,label:'审核通过，已上报公司'},{value:3,label:'审核不通过'}];
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
      this.pageData.modalConfig.show = false;//关闭modal
      this.commonUtil.clearObj(this.pageData.modalData);//清空modalData
      this.$refs['modalRef'].$refs['modalFormRef'].resetFields();//校验重置
      this.pageData.modalForm[7].rules.required = false;
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
            this.pageData.modalData.provinceCode = this.pageData.modalData.areaCode[0];
            this.pageData.modalData.cityCode = this.pageData.modalData.areaCode[1];
            this.pageData.modalData.reginCode = this.pageData.modalData.reginCode[2];
            var obj = {
              params:this.pageData.modalData,
              removeEmpty:false,
              url:this.pageData.requestUrl.updateApi
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
    selectChange(rows){
      this.pageData.selectList = rows;
    },
    editIsDisabled(row){
      if(row.status == this.commonConstants.applyStatus.PENDINGREVIEW)
      {
        return false;
      }else{
        return true;
      }
    },
    editDisabled(){
      return true;
    },
    changeStatus(){
      if(this.pageData.modalData.status == 3)
      {
        this.pageData.modalForm[7].rules.required = true;
      }else{
        this.pageData.modalForm[7].rules.required = false;
      }
      
    },
  }
};