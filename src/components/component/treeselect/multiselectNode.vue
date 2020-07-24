<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-05 16:00:15
 * @LastEditors: caiyang
 * @LastEditTime: 2020-06-29 16:16:08
--> 
<template>
    <div>
        <el-select
        ref="select"
        popper-class="mod-select-tree"
        :value="labelModel"
        :multiple="false"
        :clearable="false"
        >
        <el-option :value="valueModel"  style="height: auto">
            <el-tree
            ref="tree"
            empty-text="无数据"
            :expand-on-click-node="false"
            :data="options"
            clearable
            :props="props"
            :node-key="props.value"
            :load="loadNode"
            :lazy="lazy"
            :show-checkbox="true" 
            :check-strictly="checkStrictly"
            @check-change="handleCheckChange"
            >
            </el-tree>
        </el-option>
        </el-select>
    </div>
</template>
<script>
    export default {
        name: 'MultiSelectTree',
        // 设置绑定参数
         /**  https://blog.csdn.net/tangcc110/article/details/83624333 还不懂看这
         * vue提供model属性让我们在组件内部就可以调用到其父级的事件，
         * 当前父级事件是固定写法event:"zhangwuji",这个prop:"ychecked"是
         * 将父级的cstChecked赋值给ychecked，然后再传给props:{ychecked:Number}
         * */
        model: {
            prop: 'value', // ychecked与父级cstChecked联动
            event: 'selected', // 事件名随便定义，叫张无忌都可以，反正有了model后就可以触发父组件的事件了，zhangwujijt
        },
        data() {
            return {
            // eslint-disable-next-line
            labelModel: "",   // 输入框显示值
            valueModel: [],   // 实际请求传值
            once: false,
            };
        },
        props: {
            // 接收绑定参数
            value: [String], // 父级cstChecked传进来会默认赋值给了model{prop:"ychecked"},ychecked再把值赋给props:{ ychcked:Number }
            // 树形控件 - 选项数据，懒加载时无需设置
            options: {
                type: Array,
                default: () => ([]),
            },
            props: {
                type: Object,
                default: () => ({
                    parent: 'parentId',
                    value: 'id',
                    label: 'label',
                    children: 'children',
                }),
                
            },
            lazy:{
                type:Boolean,
                default:true
            },
            checkStrictly:{
                type:Boolean,
                default:true
            },
            clearable:{
                type:Boolean,
                default:false
            },
            url:{
                type:String,
                default:''
            },
        },
        methods:{
            loadNode(node, resolve){
                this.node = node;
                this.resolve = resolve;
                if(node && node.key)
                {
                    var obj = {
                        params:{id:node.key?node.key:0},
                        url:this.url
                    };
                    this.commonUtil.doGet(obj).then(response=>{
                        resolve(response.responseData);
                    });
                }
                
            },
            handleCheckChange(data,isChecked,isLeafChecked){
                let res = this.$refs.tree.getCheckedNodes(false, false);
                let arr = [];
                let arrLabel = [];
                res.forEach(item => {
                    arrLabel.push(item[this.props.label]);
                    arr.push(item[this.props.value]);
                });
                this.labelModel = arrLabel.join(',');   
                this.valueModel = arr.join(',');
                 /**
                     * vue自带的$emit方法是专门用来触发父级事件的，如父级：<cst-test v-model="cstChecked"></cst-test> ，此处v-model 跟上面的定义model有关联，
                     * 当zhangwuji事件触发后会默认把值传给prop:'ychecked'，从而改变了在父级传入的变量cstChecked
                     * */
                this.$emit('selected', this.valueModel);
            }
        },
        
    }
</script>
<style lang="scss" scoped>
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover
{
    background-color: #ffffff !important;
}

</style>