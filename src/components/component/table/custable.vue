<!--表格组件 -->
<template>
<section class="ces-table-page">
  <!-- 表格操作按钮 -->
    <section class="ces-handle" v-if='tableHandles.length > 0'>
      <el-row class="operate">
       <el-col :span="24">
      <el-button 
        v-for='item in tableHandles' 
        :key='item.label'
        :type="item.type" 
        :icon='item.icon' 
        v-has="item.auth"
        @click="item.handle()">{{item.label}}</el-button>
        </el-col>
       </el-row>
    </section>
    <!-- 数据表格 -->
    <section class="ces-table">
        <el-table  :data='tableData' :size='size' style="width: 100%;height:100%"
          :border  ='isBorder'
          @selection-change='selectChange'
          @current-change='currentChange'
          v-loading='loading' 
          :defaultSelections='defaultSelections'
          :highlight-current-row='highlightCurrentRow'
          ref="cesTable">
            <el-table-column v-if="isSelection" type="selection" align="center" ></el-table-column>
            <el-table-column v-if="isIndex" type="index" :label="indexLabel" align="center" width="50"></el-table-column>
            <!-- 数据栏 -->
            <el-table-column v-for="item in tableCols" 
              :key="item.id"
              :prop="item.prop" 
              :label="item.label" 
              :width="item.width"
              :align="item.align" 
              :render-header="item.require?renderHeader:null"
              :show-overflow-tooltip="item.overflow"
              >
                <template slot-scope="scope" >
                  <!-- html -->
                  <span v-if="item.type==='html'" v-html="item.html(scope.row)"></span>
                  <!-- 按钮 -->
                  <span v-if="item.type==='button'" >
                    <el-button v-for="btn in item.btnList" :key="(typeof btn.label).toLowerCase()=='string'?btn.label:btn.auth"
                      :disabled="btn.disabled && btn.disabled(scope.row)"
                      :type="btn.type" 
                      :size="size || btn.size" 
                      :icon="btn.icon" 
                      v-has="btn.auth"
                      @click="btn.handle && btn.handle(scope.row)">{{(typeof btn.label).toLowerCase()=="string"?btn.label:btn.label(scope.row)}}</el-button>
                    </span>
                  <!-- 输入框 -->
                  <el-input v-if="item.type==='input'" v-model="scope.row[item.prop]" :size="size || btn.size"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)"
                    @focus="item.focus && item.focus(scope.row)"></el-input>
                  <!-- 下拉框 -->
                  <el-select v-if="item.type==='select'" v-model="scope.row[item.prop]" :size="size || btn.size"  :props="item.props"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" 
                    @change='item.change && item.change(scope.row)'>
                      <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value"></el-option>
                  </el-select>
                  <!-- 单选组 -->
                  <el-radio-group v-if="item.type==='radioGroup'" v-model="scope.row[item.prop]"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'>
                      <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
                  </el-radio-group>
                  <!-- 复选框 -->
                  <el-checkbox-group v-if="item.type==='checkbox'" v-model="scope.row[item.prop]" 
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'>
                      <el-checkbox v-for="ra in item.checkboxs" :label="ra.value" :key='ra.value'>{{ra.label}}</el-checkbox>
                  </el-checkbox-group>
                  <!-- 评价 -->
                  <el-rate v-if="item.type==='rate'" v-model="scope.row[item.prop]"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'></el-rate>
                  <!-- 开关 -->
                  <el-switch v-if="item.type==='switch'" v-model="scope.row[item.prop]" :size="size || btn.size" 
                    :active-value='item.values&&item.values[0]'
                    :inactive-value='item.values&&item.values[1]'
                    :disabled="item.isDisabled && item.isDisabled(scope.row)"
                    @change='item.change && item.change(scope.row)'></el-switch>
                  <!-- 图像 -->
                  <!-- <el-image v-if="item.type==='image'" :src="scope.row[item.prop]"/> -->
                  <el-popover v-if="item.type==='image' && item.popover"
                    placement="right"
                    title=""
                    trigger="hover"
                    width="500"
                    >
                    <img :src="scope.row[item.prop]" style="width: 100%"/>
                    <img slot="reference" :src="scope.row[item.prop]" :alt="scope.row[item.prop]" style="height: 100%;width: 100%;border-radius:50%; ">
                  </el-popover>
                   <img v-if="item.type==='image' && !item.popover" :src="scope.row[item.prop]" :alt="scope.row[item.prop]" style="height: 100%;width: 100%;border-radius:50%; ">
                  <!-- 滑块 -->
                  <el-slider v-if="item.type==='slider'" v-model="scope.row[item.prop]" 
                  :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'></el-slider>
                  <!-- 默认 -->
                  <span v-if="!item.type" 
                    :style="item.itemStyle && item.itemStyle(scope.row)" :size="size || btn.size" 
                    :class="item.itemClass && item.itemClass(scope.row)">{{(item.formatter && item.formatter(item.prop,scope.row,item.codeType)) || scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
        </el-table>
    </section>
    <!-- 分页 -->
    <section class="ces-pagination"  v-if='isPagination'>
        <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total,sizes ,prev, pager, next,jumper"
            :page-size="tablePage.pageSize"
            :page-sizes="tablePage.pageSizeRange"
            :current-page="tablePage.currentPage"
            :total="tablePage.pageTotal"
        >
        </el-pagination>
    </section>
</section>
</template>

<script>

export default {
  props:{
    // 表格型号：mini,medium,small
    size:{type:String,default:'medium'},
    isBorder:{type:Boolean,default:true},
    loading:{type:Boolean,default:false},
    // 表格操作
    isHandle:{type:Boolean,default:false},
    tableHandles:{type:Array,default:()=>[]},
    // 表格数据
    tableData:{ type:Array,default:()=>[]},
    // 表格列配置
    tableCols:{ type:Array,default:()=>[]},
    // 是否显示表格复选框
    isSelection:{type:Boolean,default:false},
    defaultSelections:{ type:[Array,Object], default:()=>null},
    // 是否显示表格索引
    isIndex:{type:Boolean,default:false},
    indexLabel: {type:String,default:'序号'},
    // 是否显示分页
    isPagination:{type:Boolean,default:true},
    // 分页数据
    tablePage:{ type:Object,default:()=>({pageSize:10,currentPage:1,total:0,pageSizeRange:[5, 10, 20, 50,100]})},
    highlightCurrentRow:{type:Boolean,default:false},
  },
  data(){
    return {
    }
  },
  watch:{
    'defaultSelections'(val) {
        this.$nextTick(function(){
          if(Array.isArray(val)){
            val.forEach(row=>{
              this.$refs.cesTable.toggleRowSelection(row)
            })
          }else{
            this.$refs.cesTable.toggleRowSelection(val)
          }
        })      
    }
  },
  methods:{
    selectChange(val){
      this.$emit('selectChange',val);
    },
    // 表格勾选
    select(rows,row){
      this.$emit('select',rows,row);
    },
    // 全选
    selectAll(rows){
      this.$emit('select',rows)
    },
    // 
    handleCurrentChange(val){
      this.tablePage.currentPage = val;
      this.$emit('handleCurrentChange');
    },
    handleSizeChange(val) {
      this.tablePage.pageSize = val;
      this.$emit('handleCurrentChange');
    },
    renderHeader(h,obj) {
      return h('span',{class:'ces-table-require'},obj.column.label)
    },
    currentChange(currentRow, oldCurrentRow){
       this.$emit('currentChange',currentRow);
    }
  },
}
</script>
<style>
.ces-table-require::before{
  content:'*';
  color:red;
}
</style>