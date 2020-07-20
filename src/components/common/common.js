/*
 * @Description: 通用工具类
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-18 15:50:48
 */ 
import Vue from 'vue'
import { Message,MessageBox } from 'element-ui'
import MSG_LIST from './message'
import Axios from 'axios'
import moment from 'moment'
import commonConstants from './constants'
import router from '../../router'
const commonUtil = {
 
}
commonUtil.baseUrl="/admin";

// commonUtil.codeValues={};//报错所有数据字典值，数据字典值表的id为key，valueName为值

/**
 * @description:消息展示
 * @param  showClose 是否显示关闭按钮 boolean message 消息内容 type 消息类型 success/warning/info/error duration 显示时间, 毫秒。设为 0 则不会自动关闭
 * @return: 
 * @author: caiyang
 */
commonUtil.showMessage = function(obj)
{
    Message({
        showClose: (obj.showClose == undefined)?true:obj.showClose,
        message: obj.message,
        type: (obj.type == undefined)?'success':obj.type,
        duration: (obj.duration == undefined)?3000:obj.duration
    })
}

/**
 * @description: 获取错误消息
 * @param msgid 消息的key 
 * @param msgParams 消息参数
 * @return: 
 * @author: caiyang
 */
commonUtil.getMessageFromList = function(msgid,msgParams)
{
    let msg = MSG_LIST[msgid];
    if ($.trim(msg) == "") {
        msg = msgid + "[该消息不存在。]";
        return msg;
    }
    if (msgParams != null) { 
        for (var i=0; i<msgParams.length; i++) {
            msg = msg.replace("{" + i + "}", msgParams[i]);
        }  
    }
    return msg;
}

//表格日期格式化
commonUtil.formatTableDate = function(row, column)
{
    var date = row[column.property];
    if (date == undefined) {
      return "";
    }
    return commonUtil.formatDate(date);
}
//日期格式化
commonUtil.formatDate = function(val)
{
   return moment(val).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * @description: 获取表格数据
 * @param url:后台请求地址
 * @param param:后台请求参数
 * @return: 
 * @author: caiyang
 */
commonUtil.getTableList = function(obj){
    obj.removeEmpty = false;
    return commonUtil.doPost(obj);
}
/**
 * @description: 共通表格赋值
 * @param response:请求返回数据
 * @param tablePage:表格分页信息
 * @param tableData:表格数据
 * @return: 
 * @author: caiyang
 */
commonUtil.tableAssignment = function(response,tablePage,tableData){
    if (response.code == "200")
    {
        var responseData = response.responseData;
        tableData.splice(0)
        if(responseData.data.length > 0)
        {
            for (let index = 0; index < responseData.data.length; index++) {
                tableData.push(responseData.data[index])
            }
        }
        tablePage.pageTotal = Number(responseData.total);
    }
}
/**
 * @description: 显示modal
 * @param show: true or false,弹框是否显示
 * @param type 类型 1新增 2编辑 3详情
 * @return: 
 * @author: caiyang
 */
commonUtil.showModal = function(modalConfig,type){
    modalConfig.show = true;
    modalConfig.type = type;
    if(type == commonConstants.modalType.insert)
    {
        modalConfig.title = commonConstants.modalTitle.insert
    }else if(type == commonConstants.modalType.update)
    {
         modalConfig.title = commonConstants.modalTitle.update
    }else if(type == commonConstants.modalType.detail)
    {
        modalConfig.title = commonConstants.modalTitle.detail
    }
}
/**
 * @description: 异步post请求
 * @param url 请求后台的url
 * @param params 参数 map格式
 * @param removeEmpty 空字符串是否作为参数传递到后台 false:空字符串将传递到后台 true:空字符串将不会传递到后台，后台对应的值为null
 * @return: 
 * @author: caiyang
 */
commonUtil.doPost = function(obj)
{
    //将删除标志 创建人更新人以及时间移除
    delete obj.params['delFlag']
    delete obj.params['creator']
    delete obj.params['createTime']
    return new Promise((resolve, reject) => {
        Axios.post(obj.url,obj.params,{headers: {
            'Authorization':sessionStorage.getItem(commonConstants.sessionItem.authorization),
            'reqSource':'1'}})
            .then(response => {
                if(response.status == 200)
                {//请求成功
                    var result = response.data;//请求返回结果
                    if(result.newToken)
                    {
                        sessionStorage.setItem(commonConstants.sessionItem.authorization, result.newToken);
                    }
                    if(result.message)
                    {
                        commonUtil.showMessage({message:result.message,type: result.msgLevel})
                    }
                    if(result.code == "50004")//50004说明token超时，需重新登录
                    {
                        sessionStorage.removeItem(commonConstants.sessionItem.authorization);
                        router.replace('/login');
                        commonUtil.showMessage({message:result.message,type: result.msgLevel})
                    }
                    if(obj.callback){
                        obj.callback(result)
                    }
                    
                    resolve(result);
                }else{
                    commonUtil.showMessage({message:commonUtil.getMessageFromList("error.system",null),type: commonConstants.messageType.error})
                }
                        
            })
            .catch(error => {
                //错误处理
                if (error && error.response)
                {
                    switch (error.response.status) {
                        case 400:commonUtil.showMessage({message:commonConstants.errorCodeMsg[400],type: commonConstants.messageType.error});break;
                        case 401:commonUtil.showMessage({message:commonConstants.errorCodeMsg[401],type: commonConstants.messageType.error});break;
                        case 403:commonUtil.showMessage({message:commonConstants.errorCodeMsg[403],type: commonConstants.messageType.error});break;
                        case 404:commonUtil.showMessage({message:commonConstants.errorCodeMsg[404],type: commonConstants.messageType.error});break;
                        case 408:commonUtil.showMessage({message:commonConstants.errorCodeMsg[408],type: commonConstants.messageType.error});break;
                        case 500:commonUtil.showMessage({message:commonConstants.errorCodeMsg[500],type: commonConstants.messageType.error});break;
                        case 501:commonUtil.showMessage({message:commonConstants.errorCodeMsg[501],type: commonConstants.messageType.error});break;
                        case 502:commonUtil.showMessage({message:commonConstants.errorCodeMsg[502],type: commonConstants.messageType.error});break;
                        case 503:commonUtil.showMessage({message:commonConstants.errorCodeMsg[503],type: commonConstants.messageType.error});break;
                        case 504:commonUtil.showMessage({message:commonConstants.errorCodeMsg[504],type: commonConstants.messageType.error});break;
                        default:commonUtil.showMessage({message:commonUtil.getMessageFromList("error.system",null),type: commonConstants.messageType.error});
                    }
                }
            })
            .finally(() => {
            // this.loading = false;
            });  
    });
}
/**
 * @description: 异步get请求
 * @param url:请求后台的url
 * @param params:参数 map格式
 * @param removeEmpty:空字符串是否作为参数传递到后台 false:空字符串将传递到后台 true:空字符串将不会传递到后台，后台对应的值为null
 * @return: 
 * @author: caiyang
 */
commonUtil.doGet = function(obj)
{
    return new Promise((resolve, reject) => {         
        Axios.get(obj.url,{
            params:obj.params,
            headers: {'Authorization':sessionStorage.getItem(commonConstants.sessionItem.authorization),'reqSource':1}
        })
          .then((response) => {
            if(response.status == 200)
            {//请求成功
                var result = response.data;//请求返回结果
                if(result.message)
                {
                    commonUtil.showMessage({message:result.message,type: result.msgLevel})
                }
                if(result.code == "50004")//50004说明token超时，需重新登录
                {
                    sessionStorage.removeItem(commonConstants.sessionItem.authorization);
                    router.replace('/login');
                    commonUtil.showMessage({message:result.message,type: result.msgLevel})
                }
                if(obj.callback){
                    obj.callback(result);
                }
                resolve(result);
                
            }else{
                commonUtil.showMessage({message:commonUtil.getMessageFromList("error.system",null),type: commonConstants.messageType.error})
            }
          })
          .catch((error) => {
            //错误处理
            if (error && error.response)
            {
                switch (error.response.status) {
                    case 400:commonUtil.showMessage({message:commonConstants.errorCodeMsg[400],type: commonConstants.messageType.error});break;
                    case 401:commonUtil.showMessage({message:commonConstants.errorCodeMsg[401],type: commonConstants.messageType.error});break;
                    case 403:commonUtil.showMessage({message:commonConstants.errorCodeMsg[403],type: commonConstants.messageType.error});break;
                    case 404:commonUtil.showMessage({message:commonConstants.errorCodeMsg[404],type: commonConstants.messageType.error});break;
                    case 408:commonUtil.showMessage({message:commonConstants.errorCodeMsg[408],type: commonConstants.messageType.error});break;
                    case 500:commonUtil.showMessage({message:commonConstants.errorCodeMsg[500],type: commonConstants.messageType.error});break;
                    case 501:commonUtil.showMessage({message:commonConstants.errorCodeMsg[501],type: commonConstants.messageType.error});break;
                    case 502:commonUtil.showMessage({message:commonConstants.errorCodeMsg[502],type: commonConstants.messageType.error});break;
                    case 503:commonUtil.showMessage({message:commonConstants.errorCodeMsg[503],type: commonConstants.messageType.error});break;
                    case 504:commonUtil.showMessage({message:commonConstants.errorCodeMsg[504],type: commonConstants.messageType.error});break;
                    default:commonUtil.showMessage({message:commonUtil.getMessageFromList("error.system",null),type: commonConstants.messageType.error});
                }
            }
          });
    });
}
commonUtil.download = function(url,params,callback)
{
    Axios.post(url,params,{   
        responseType: 'blob',            
        },            
    ).then((response=>{                
            const url = window.URL.createObjectURL(new Blob([response.data]));                
            const link = document.createElement('a');                
            link.href = url;   
            if(response.headers.filename)
            {
                link.setAttribute('download', response.headers.filename);         
            }else{
                link.setAttribute('download', commonUtil.getUuid());
            }            
            document.body.appendChild(link);                
            link.click();   
            if(callback)
            {
                callback(response)
            }         
        })
    ).catch((error) => {
        //错误处理
        if (error && error.response)
        {
            const errormsg = error.response.headers.errormsg;
            if(errormsg)
            {
                commonUtil.showMessage({message:decodeURI(errormsg),type: commonConstants.messageType.error});
            }else{
                commonUtil.showMessage({message:commonUtil.getMessageFromList("error.system",null),type: commonConstants.messageType.error});
            }
            
        }
      });
}
//确认消息
//confirmButtonText:确认按钮显示内容 cancelButtonText：取消按钮显示内容，
//api：请求的url requestParam：请求参数 callback：请求成功后的回调函数 type:请求方式，get 或者post，默认为post
commonUtil.showConfirm = function(params)
{
    MessageBox.confirm(params.messageContent,
    {
        confirmButtonText:params.confirmButtonText?params.confirmButtonText:"确认",
        cancelButtonText: params.cancelButtonText?params.cancelButtonText:'取消',
        type:commonConstants.messageType.warning,
    }).then(() => {
        if(params.type && params.type.toLowerCase() == "get")
        {
            var object = {
                url:params.url,
                params:params.params,
                callback:params.callback,
            }
            commonUtil.doGet(object);
        }else{
            var object = {
                url:params.url,
                params:params.params,
                callback:params.callback,
            }
            commonUtil.doPost(object);
        }
    }).catch(() => {
        // commonUtil.showMessage({message:commonUtil.getMessageFromList("error.delete",null),type: commonConstants.messageType.error})        
    });
}
//清空map对象
commonUtil.clearObj = function(obj)
{
    for(var i in obj) {
       if(obj[i]  instanceof Array)
       {
        obj[i] = [];
       }else{
        obj[i] = null;
       }

    }
}

commonUtil.removeEmpty = function (obj)
{
    for(var i in obj)
    {
        if(obj[i] == "")
        {
            delete obj[i]
        }
    }
}

//数据数据字典值对应的name
commonUtil.getDictionaryValueName = function(type,value)
{
    if(commonConstants.dictionary[type])
    {
        return commonConstants.dictionary[type][value];
    }else{
        return "-";
    }
    
    // console.log(commonConstants.dictionary[type][value])
}
//获取uuid
commonUtil.getUuid = function()
{
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if(len) {
      for(i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for(i = 0; i < 36; i++) {
        if(!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
}
//关闭页面
commonUtil.closeTag=function(name,that){
    var tag={
        name:name,
      }
      that.GLOBAL.tagsList.splice(that.GLOBAL.tagsList.indexOf(tag), 1);
      that.$router.push("/index");
}
//对象赋值
commonUtil.coperyProperties = function(target,source)
{
    if(source.id)
    {
        target.id = source.id;
    }
    for(var i in target) {
        target[i] = source[i];
    }
}

//获取表格数据字典值,数据字典定义在前台js文件中
commonUtil.getTableCodeName = function(prop,row,codeType)
{
    var value = row[prop];
    if(codeType)
    {//获取自定义在前台的的数据字典
        return commonUtil.getDictionaryValueName(codeType,value)
    }else{
        //获取数据库中定义的数据字典
        let result = commonUtil.getSysCodeValueName(value);
        if(result == "")
        {
            return "-";
        }
        return result;
    }
}

/**
 * @description: 获取后台定义的数据字典名称
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonUtil.getSysCodeValueName = function(value)
{
    var codeValues = JSON.parse(sessionStorage.getItem("codeValues"));
    return codeValues[value]?codeValues[value]:"";
}

/**
 * @description: 根据数据字典类型获取数据字典所有的值
 * @param {codeType}  数据字典类型
 * @return: 
 * @author: caiyang
 */
commonUtil.getSysCodeValues = function(codeType){
    let result = [];
    let data = commonUtil.doSyncPost("/api/sysCodeValue/selectValByType",{codeType:codeType});
    result = data.responseData;
    return result;
}

/**
 * @description: 根据地区编码获取地区
 * @param {areaCode} 地区编码 
 * @return: 
 * @author: caiyang
 */
commonUtil.getAreaName = function(areaCode)
{
    let areaName = "";
    let data = commonUtil.doSyncPost("/api/sysArea/getAreaNameByCode",{areaCode:areaCode});
    areaName = data.responseData;
    return areaName;
}
/**
 * @description: 获取下级地区，如果要获取一级地区则传'000000'
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonUtil.getNextArea = function(areaCode)
{
    let areas = [];
    let data = commonUtil.doSyncPost("/api/sysArea/getNextAreasByCode",{areaCode:areaCode});
    areas = data.responseData;
    return areas;
}
/**
 * @description: 初始化所有数据字典的值
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonUtil.initCodeTypeValue = function(){
    let data = commonUtil.doSyncPost("/api/sysCodeValue/getAllVal",{});
    // commonUtil.codeValues = data.responseData;
    sessionStorage.setItem("codeValues", JSON.stringify(data.responseData));
}
/**
 * @description: 同步请求
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonUtil.doSyncPost=function(url,params){
    let result;
    $.ajax({
        type : "post",
        url  : commonUtil.baseUrl+url,
        data:JSON.stringify(params),
        async : false,
        dataType : 'json',
        contentType:"application/json;charset=utf-8",
        beforeSend: function(request) {
            request.setRequestHeader('Authorization',sessionStorage.getItem(commonConstants.sessionItem.authorization));
         },
        success : function(data){
           result = data;
        },
        error : function(data){
           console.log(data)
        }
    });
    return result;
}

commonUtil.formArea = function(prop,row){
    return row.provinceName+row.cityName+row.reginName
}

commonUtil.disabled = function(){
    return true;
}
commonUtil.undisabled = function(){
    return false;
}

//三个连续字符判断
commonUtil.LxStr = function(str){
    var arr = str.split('');
        var flag = true;
        for (var i = 1; i < arr.length-1; i++) {
            var firstIndex = arr[i-1].charCodeAt();
            var secondIndex = arr[i].charCodeAt();
            var thirdIndex = arr[i+1].charCodeAt();
            if((thirdIndex - secondIndex == 1)&&(secondIndex - firstIndex==1)){
                flag =  false;
                return flag;
            }

        }
        for (var i = 1; i < arr.length-1; i++) {
            var firstIndex = arr[i-1].charCodeAt();
            var secondIndex = arr[i].charCodeAt();
            var thirdIndex = arr[i+1].charCodeAt();
            if((firstIndex - secondIndex  == 1)&&(secondIndex - thirdIndex==1)){
                flag =  false;
                return flag
            }
        }
        return flag;
}
//设置cookie
commonUtil.setCookie = function(key,value) {
    //字符串拼接cookie
    window.document.cookie = key+"="+value;
}

//获取cookie
commonUtil.getCookie = function(key){
    if (window.document.cookie.length > 0){
      var arr = document.cookie.split('; ');
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('='); //再次切割
        //判断查找相对应的值
        if (arr2[0] == key) {
          return arr2[1];
        }
      }
    }
}
//校验身份证的合法性
commonUtil.idcardValid = function(code){
    code = code.toUpperCase();
    var city = {11: "北京",12: "天津",13: "河北",14: "山西",15: "内蒙古",21: "辽宁",22: "吉林",23: "黑龙江 ",31: "上海",32: "江苏",33: "浙江",34: "安徽",35: "福建",
    36: "江西",37: "山东",41: "河南",42: "湖北 ",43: "湖南",44: "广东",45: "广西",46: "海南",50: "重庆",51: "四川",52: "贵州",53: "云南",54: "西藏 ",61: "陕西",62: "甘肃",
    63: "青海",64: "宁夏",65: "新疆",71: "台湾",81: "香港",82: "澳门",91: "国外 "};
    if(!city[code.substr(0, 2)])
    {
        return false;
    }else{
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for(var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
        }
        var last = parity[sum % 11];
        if(parity[sum % 11] != code[17]) {
            return false;
        }
    }
    return true;
}

//form表单校验身份证号是否合法
commonUtil.idcardValidator = function(rule, value, callback){
    if(commonUtil.idcardValid(value))
    {
        callback();
    }else{
        callback(new Error(commonUtil.getMessageFromList("error.idcard.validate")));
    }
}
export default commonUtil;
