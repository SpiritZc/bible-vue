import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name:'sysUser',
  data() {
    return{
      pageData:{
        that:this,
        //请求的url start
        requestUrl:{
          toCliamsApi:"/api/activiti/getToClaimsTasks",//待办任务api
          toDoTasksApi:"/api/activiti/getToDoTasks",//待办任务api
          claimTaskApi:"/api/activiti/claimsTask",//领取任务api
          taskHisApi:"/api/activiti/getTaskHistory",//审批记录
          completeTasksApi:"/api/activiti/getCompleteTasks",//已完成的任务
        },
        //请求的url end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          // {label:'新增',type:'primary',handle:()=>this.showInsert({pageData:this.pageData,removeEmpty:false,init:this.getRoles}),auth:'sysUser_insert'},
          // {label:'批量删除',type:'danger',handle:()=>this.deleteBatch({pageData:this.pageData}),auth:'sysUser_batchdelete'}
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
          {label:'任务id',prop:'id',align:'center'},
          {label:'任务标识',prop:'businessKey',align:'center'},
          {label:'任务概要',prop:'taskDesc',align:'center'},
          {label:'任务名称',prop:'name',align:'center'},
          {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
            {label:'领取任务',type:'text',auth:'index_claim',handle:(that,row)=>this.claimTasks(row.id)},
            {label:'审批记录',type:'text',auth:'index_approval',handle:(that,row)=>this.taskHis(row)},
          ]}
        ],
        //表格列表头end
        //表格分页信息start
        toDoTablePage:{
          currentPage: 1,
          pageSize:10,
          pageTotal: 0,
          pageSizeRange:[5, 10, 20, 50]
        },
        //表格分页信息end
        //表格列表头start
        toDoTableCols:[
          {label:'任务id',prop:'id',align:'center'},
          {label:'任务标识',prop:'businessKey',align:'center'},
          {label:'任务概要',prop:'taskDesc',align:'center'},
          {label:'任务名称',prop:'name',align:'center'},
          {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
            {label:'去审批',type:'text',auth:'index_approval',handle:(that,row)=>this.approval(row)},
            {label:'审批记录',type:'text',auth:'index_approval',handle:(that,row)=>this.taskHis(row)},
          ]}
        ],
        //表格列表头end
        toDoTableData:[],
        //表格数据end
        //表格工具栏按钮 start
        toDoTableHandles:[
          // {label:'新增',type:'primary',handle:()=>this.showInsert({pageData:this.pageData,removeEmpty:false,init:this.getRoles}),auth:'sysUser_insert'},
          // {label:'批量删除',type:'danger',handle:()=>this.deleteBatch({pageData:this.pageData}),auth:'sysUser_batchdelete'}
        ],

        //表格分页信息start
        completeTablePage:{
          currentPage: 1,
          pageSize:10,
          pageTotal: 0,
          pageSizeRange:[5, 10, 20, 50]
        },
        //表格分页信息end
        //表格列表头start
        completeTableCols:[
          {label:'任务id',prop:'id',align:'center'},
          {label:'任务标识',prop:'businessKey',align:'center'},
          {label:'任务概要',prop:'taskDesc',align:'center'},
          {label:'任务名称',prop:'name',align:'center'},
          {label:'操作时间',prop:'endTime',align:'center'},
          {label:'审批状态',prop:'status',align:'center',formatter:this.commonUtil.getCodeName},
          {label:'审批意见',prop:'comment',align:'center'},
          {label:'操作',prop:'operation',align:'center',type:'button',btnList:[
            {label:'审批记录',type:'text',auth:'index_approval',handle:(that,row)=>this.taskHis(row)},
          ]}
        ],
        //表格列表头end
        completeTableData:[],
        //表格数据end
        //表格工具栏按钮 start
        completeTableHandles:[
          // {label:'新增',type:'primary',handle:()=>this.showInsert({pageData:this.pageData,removeEmpty:false,init:this.getRoles}),auth:'sysUser_insert'},
          // {label:'批量删除',type:'danger',handle:()=>this.deleteBatch({pageData:this.pageData}),auth:'sysUser_batchdelete'}
        ],
      }
    }
  },
  mounted(){
    this.getToClaimsTasks();
    this.getToDoTasks();
    this.getCompleteTasks();
  },
  methods:{
    ...mapActions([
      'searchtablelist','showModal','save','closeModal','showDetail','delete','saveCallback','showDetailCallback',
      'showEdit','showEditCallback','showInsert','deleteCallback','selectChange','deleteBatch','reset'
    ]),
    //获取待领取任务
    getToClaimsTasks(){
        var param = Object.assign({}, this.queryData, this.pageData.tablePage);
        var object = {
            url:this.pageData.requestUrl.toCliamsApi,
            params:param,
            tableData:this.pageData.tableData,
            tablePage:this.pageData.tablePage
        }
        this.commonUtil.getTableList(object);
    },
    //获取待办任务
    getToDoTasks(){
      var param = Object.assign({}, this.queryData, this.pageData.toDoTablePage);
      var object = {
          url:this.pageData.requestUrl.toDoTasksApi,
          params:param,
          tableData:this.pageData.toDoTableData,
          tablePage:this.pageData.toDoTablePage
      }
      this.commonUtil.getTableList(object);
    },
    //领取任务
    claimTasks(id){
      let param = {
        url:this.pageData.requestUrl.claimTaskApi,
        params:{taskId:id},
        removeEmpty:false,
        callback:this.claimTasksCallback
      }
      this.commonUtil.doAjaxPost(param)
    },
    claimTasksCallback(response){
      this.getToClaimsTasks();
      this.getToDoTasks();
    },
    approval(row){
      this.$router.push({ name:row.routerUrl,query:{taskId:row.id,businessKey:row.businessKey}})
    },
    taskHis(row,type){
      this.$router.push({ name:"activitihis",query:{businessKey:row.businessKey}})
    },
    //获取待办任务
    getCompleteTasks(){
      var param = Object.assign({}, this.queryData, this.pageData.completeTablePage);
     
      var object = {
          url:this.pageData.requestUrl.completeTasksApi,
          params:param,
          tableData:this.pageData.completeTableData,
          tablePage:this.pageData.completeTablePage
      }
      this.commonUtil.getTableList(object);
    },
  }
};