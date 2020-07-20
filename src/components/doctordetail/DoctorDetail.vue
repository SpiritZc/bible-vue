<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-07-02 13:46:00
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-18 14:49:56
--> 
<template>
    <div  class="_tablepage">
        <searchForm  :searchForm="pageData.searchForm" :searchData="pageData.queryData" :searchHandle="pageData.searchHandle">
        </searchForm>
       <cusTable  
      :isSelection='false'
      :isIndex='false'
      :isPagination='true'
      :isHandle='true'
      :tableCols='pageData.tableCols' 
      :tableHandles='pageData.tableHandles'
      :tableData='pageData.tableData'
      :tablePage='pageData.tablePage'
      @handleCurrentChange='searchtablelist()'
      @selectChange='selectChange'></cusTable>
       <modal ref="modalRef" :modalConfig='pageData.modalConfig' 
       :modalForm='pageData.modalForm' :modalData='pageData.modalData' 
       :modalHandles='pageData.modalHandles'
       @closeModal="closeModal()"></modal>
       <!-- <modal ref="docrotHospitalRef" :modalConfig='pageData.doctorHospitalmodalConfig' 
       :modalForm='pageData.doctorHospitalmodalForm' :modalData='pageData.doctorHospitalmodalData' 
       :modalHandles='pageData.doctorHospitalmodalHandles'
       @closeModal="closeDoctorHospitalModal()"></modal> -->
       <el-dialog
        :title="pageData.hospitalModalConfig.title"
        :visible.sync="pageData.hospitalModalConfig.show"
        :width="pageData.hospitalModalConfig.width"
        :close-on-click-modal='false'
        @close="closeHospitalModal">
            <searchForm  :searchForm="pageData.hospitalSearchForm" :searchData="pageData.hospitalQueryData" :searchHandle="pageData.hospitalSearchHandle">
        </searchForm>
            <cusTable  
            :isSelection='false'
            :isIndex='true'
            :isPagination='true'
            :isHandle='true'
            :tableCols='pageData.hospitalTableCols' 
            :tableData='pageData.hospitalTableData'
            :tablePage='pageData.hospitalTablePage'
            @currentChange='currentChange'
            @handleCurrentChange='getHospitalTableData()'
            :highlightCurrentRow='true'
            ></cusTable>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeHospitalModal">取 消</el-button>
                <el-button type="primary" @click="selectHospital">确 定</el-button>
            </span>
       </el-dialog>
    </div>
</template>
<script src="./DoctorDetail.js"></script>