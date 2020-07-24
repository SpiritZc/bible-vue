/*
 * @Description: 下拉选项用共通js
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-17 20:08:28
 */ 
const selectUtil = {
 
}

/**
 * @description: 是否下拉选项
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.yesNo=[
    {value:1,label:"是"},
    {value:2,label:"否"},
]

/**
 * @description: 用户锁定状态
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.status=[
    {value:1,label:"正常"},
    {value:2,label:"锁定"},
]


/**
 * @description: 菜单访问规则
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.menuRule=[
    {value:1,label:"登陆后访问"},
    {value:2,label:"登陆后并授权访问"},
]

/**
 * @description: 接口访问规则
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.functionRule=[
    {value:1,label:"公开访问"},
    {value:2,label:"登陆后访问"},
    {value:3,label:"登陆后并授权访问"},
]

/**
 * @description: 状态
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.status=[
    {value:1,label:"启用"},
    {value:2,label:"停用"},
]

/**
 * @description: 申请状态
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.applyStatus=[
    {value:1,label:"待审核"},
    {value:2,label:"审核通过"},
    {value:3,label:"审核未通过"},
]

/**
 * @description: 医院等级
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.hospitalGrade=[
    {value:'三级甲等',label:"三级甲等"},
    {value:'三级乙等',label:"三级乙等"},
    {value:'三级丙等',label:"三级丙等"},
    {value:'二级甲等',label:"二级甲等"},
    {value:'二级乙等',label:"二级乙等"},
    {value:'二级丙等',label:"二级丙等"},
    {value:'一级甲等',label:"一级甲等"},
    {value:'一级乙等',label:"一级乙等"},
    {value:'一级丙等',label:"一级丙等"},
    {value:'无等级',label:"无等级"},
]
/**
 * @description: 医院性质
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.hospitalNature=[
    {value:'公立医院',label:"公立医院"},
    {value:'私立医院',label:"私立医院"},
]

/**
 * @description: 医院类型
 * @param {type} 
 * @return: 
 * @author: caiyang
 */
selectUtil.hospitalType=[
    {value:'综合性医院',label:"综合性医院"},
    {value:'专科医院',label:"专科医院"},
]

selectUtil.menuType=[
    {value:1,label:"运营后台菜单"},
    {value:2,label:"医生PC端菜单"},
]
selectUtil.gender=[
    {value:"男",label:"男"},
    {value:"女",label:"女"},
    {value:"未知",label:"未知"},
]

selectUtil.authStausFull=[
    {value:1,label:"未认证"},
    {value:2,label:"待审核"},
    {value:3,label:"认证通过"},
    {value:4,label:"认证未通过"},
]
selectUtil.authStaus=[
    {value:2,label:"未审核"},
    {value:3,label:"通过"},
    {value:4,label:"未通过"},
]

selectUtil.title=[
    {value:"住院医师",label:"住院医师"},
    {value:"主治医师",label:"主治医师"},
    {value:"副主任医师",label:"副主任医师"},
    {value:"主任医师",label:"主任医师"},
]
selectUtil.authType=[
    {value:"1",label:"平台招募"},
    {value:"2",label:"个人入驻"},
    {value:"3",label:"医院入驻"},
]
selectUtil.processStatus=[
    {value:"1",label:"已处理"},
    {value:"2",label:"未处理"},
]



export default selectUtil;