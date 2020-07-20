/*
 * @Description: 消息内容
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-15 16:42:04
 */ 
let MSG_LIST = new Array();
//错误消息start
MSG_LIST["error.system"] = "系统异常，请重试。";
MSG_LIST["error.input.notnull"] = "{0}不能为空。";
MSG_LIST["error.input.length"] = "{0}长度为{1}到{2}个字符之间。";
MSG_LIST["error.input.min.length"] = "{0}输入长度请大于等于{1}个字符。";
MSG_LIST["error.input.max.length"] = "{0}输入长度请小于等于{1}个字符。";
MSG_LIST["error.input.format"] = "{0}请输入{1}格式的数据。";
MSG_LIST["error.date.format"] = "{0}格式错误，请选择日期。";
MSG_LIST["error.checkbox.notnull"] = "请至少选择一个{0}。";
MSG_LIST["error.select.notnull"] = "请选择{0}。";
MSG_LIST["error.regexp.format"] = "{0}输入格式错误，请重新输入。";
MSG_LIST["error.mobile.format"] = "{0}请输入正确的手机号码。";
MSG_LIST["error.phone.format"] = "{0}请输入正确的座机号码。";
MSG_LIST["error.mobilephone.format"] = "请输入正确的手机号码或者座机号码。";
MSG_LIST["error.idcard.format"] = "请输入正确的身份证号。";
MSG_LIST["error.input.float.format"] = "{0}格式错误，小数点后请保留{1}位以内。";
MSG_LIST["error.batchdelete.empty"] = "请选择需要删除的数据。";
MSG_LIST["error.delete"] = "数据删除失败，请重试。";
MSG_LIST["error.upload"] = "文件上传失败，请重试。";
MSG_LIST["error.upload.empty"] = "请选择需要上传的文件。";
MSG_LIST["error.upload.exceed"] = "最多可上传{0}个文件。";
MSG_LIST["error.upload.type"] = "文件{0}无法上传，请上传格式为{1}结尾的文件。";
MSG_LIST["error.auth.select"] = "请选择授权内容。";
MSG_LIST["error.length.range"] = "{0}长度范围错误，maxLength需要大于等于minLength。";
MSG_LIST["error.number.range"] = "{0}请输入大于等于{1}小于等于{2}的数。";
MSG_LIST["error.number.min"] = "{0}请输入大于等于{1}的数。";
MSG_LIST["error.number.max"] = "{0}请输入小于等于{1}的数。";
MSG_LIST["error.compare.range"] = "{0}大小范围错误，max需要大于等于min";
MSG_LIST["error.search.param"] = "查询参数错误，请检查必须参数是否填写，已填写的参数格式是否正确";
MSG_LIST["error.identify.code"] = "验证码输入错误，请重新输入。";
MSG_LIST["error.org.role.param"] = "请先选择用户所属组织。";
MSG_LIST["error.confirmpwd"] = "两次密码输入的不一致，请重新输入。";
MSG_LIST["error.menutype.select"] = "请先选择菜单类型。";
MSG_LIST["error.hospital.select"] = "请选择医院。";
MSG_LIST["error.add.doctorhospital"] = "请添加医生执业地点。";
MSG_LIST["error.idcard.validate"] = "无效的身份证号码，请重新输入。";
//错误消息end

//确认消息start
MSG_LIST["confirm.delete.select"] = "此操作将会删除选中数据，是否继续？";
MSG_LIST["confirm.delete"] = "此操作将会删除数据，是否继续？";
MSG_LIST["confirm.stopaccount"] = "此操作将会禁用掉该医院下的所有后台账号和医生账号，是否继续？";
//确认消息end

//通知成功消息start
MSG_LIST["info.delete"] = "数据删除成功。";
//通知成功消息end
export default MSG_LIST;