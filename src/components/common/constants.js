/*
 * @Description: 常量和数据字典
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-17 20:08:58
 */ 
const commonConstants = {
}

/**
 * @description: 
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonConstants.sessionItem={
    isAdmin:"isAdmin",
    orgIds:"orgIds",
    authorization:"token",
    position:"position",
    userName:"userName",
    apiList:"apiList",
    codeValues:"codeValues"
}
//请求错误码以及对应的错误信息
commonConstants.errorCodeMsg = {
    400:"请求错误。",
    401:"访问权限不足！",
    403:"拒绝访问！",
    404:"无法访问，请确认访问地址是否正确！",
    408:"访问超时。",
    500:"系统异常，请联系管理员",
    501:"未找到该服务",
    502:"网络异常。",
    503:"服务器停止运行，请与管理员联系。",
    504:"服务器停止运行，请与管理员联系。"
}

//message消息级别
commonConstants.messageType={
    success:"success",//成功
    warning:"warning",//警告
    info:"info",//通知
    error:"error"//错误
}


//modal页面的类型
commonConstants.modalType={
    insert:"1",//新增
    update:"2",//编辑
    detail:"3",//详情
}

//modal页面的标题
commonConstants.modalTitle={
    insert:"新增",//新增
    update:"编辑",//编辑
    detail:"详情",//详情
}

commonConstants.applyStatus={
    PENDINGREVIEW:"1",//待审核
    PASS:"2",//审核通过
    FAIL:"3",//审核未通过
}
commonConstants.authStatus={
    UNAUTH:"1",//未认证
    APPROVALING:"2",//待审核
    APPROVAED:"3",//审核通过
    REJECTED:"4",//审核未通过
}
//下拉框属性
commonConstants.props={label:'label',value:'value'}

commonConstants.dictionary={
    yesNo:{
        "1":"是",
        "2":"否"
    },
    menuRule:{
        "1":"登陆后访问",
        "2":"登陆后并授权访问"
    },
    functionRule:{
        "1":"公开访问",
        "2":"登录后访问",
        "3":"登录后并授权访问",
    },
    status:{
        "1":"启用",
        "2":"停用",
    },
    applyStatus:{
        "1":"待审核",
        "2":"审核通过",
        "3":"审核未通过",
    },
    menuType:{
        "1":"运营后台菜单",
        "2":"医生PC端菜单",
    },
    authStatus:{
        "1":"未认证",
        "2":"待审核",
        "3":"通过",
        "4":"未通过",
    },
    authType:{
        "1":"平台招募",
        "2":"个人入驻",
        "3":"医院入驻"
    },
    processStatus:{
        "1":"已处理",
        "2":"未处理",
    },
    bookState:{
        "1":"已上架",
        "2":"已下架"
    }
}

/**
 * @description: 数据字典类型
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
commonConstants.codeType={
    orgType:"orgType",//组织类型
    doctorPost:"doctorPost",//医生职务
}
export default commonConstants;