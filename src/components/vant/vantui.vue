<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-07-20 07:54:06
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-20 08:01:51
--> 
<template>
   <div style="text-align:left;margin-left:10px">
       <van-nav-bar
        title="问卷调查"/>
        <van-form @submit="onSubmit">
            <p>问题1、下面的问题你会选择哪个？<van-tag type="primary" round >单选题</van-tag></p>
            <van-radio-group v-model="radio" :rules="[{ required: true, message: '请填写用户名' }]">
                <van-radio name="1" style="margin-top:3px">单选框 1</van-radio>
                <van-radio name="2" style="margin-top:3px">单选框 2</van-radio>
            </van-radio-group>
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 3px' }"></van-divider>
            <p>问题2、下面的问题你会选择哪个？<van-tag type="primary" round >单选题</van-tag></p>
            <van-radio-group v-model="radio2" :rules="[{ required: true, message: '请填写用户名' }]">
                <van-radio name="1" style="margin-top:3px">单选框 1</van-radio>
                <van-radio name="2" style="margin-top:3px">单选框 2</van-radio>
            </van-radio-group>
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 3px' }"></van-divider>
            <p>问题3、下面的问题你会选择哪几个？<van-tag type="success" round >多选题</van-tag></p>
            <van-checkbox-group v-model="result" >
                <van-checkbox name="a" shape="square" style="margin-top:3px">复选框 a</van-checkbox>
                <van-checkbox name="b" shape="square" style="margin-top:3px">复选框 b</van-checkbox>
            </van-checkbox-group>
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 3px' }"></van-divider>
            <p>问题4、请写出你知道的设计模式？<van-tag type="warning" round >简答题</van-tag></p>
            <van-field
            v-model="message"
            rows="1"
            autosize
            label=""
            type="textarea"
            placeholder="" :rules="[{ required: true, message: '请填写答案' }]"
            />
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 3px' }"></van-divider>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                提交
                </van-button>
            </div>
            
        </van-form>
   </div>
</template>
<script>
import Vue from 'vue'
import { Field } from 'vant';
Vue.use(Field);
import { Button } from 'vant';
Vue.use(Button);
import { NavBar } from 'vant';
Vue.use(NavBar);
import { Form } from 'vant';
Vue.use(Form);
import { RadioGroup, Radio } from 'vant';
Vue.use(Radio);
Vue.use(RadioGroup);
import { Collapse, CollapseItem } from 'vant';
Vue.use(Collapse);
Vue.use(CollapseItem);
import { Tag } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tag);
export default {
  name: 'HelloWorld',
  data () {
    return {
        radio:"",
        radio2:"",
        result:[],
        message:""
    }
  },
  methods:{
      onSubmit(values) {
        console.log('submit', values);
        },
  }
}
</script>
