import Vue from 'vue'
import { Button,Form, FormItem, Input, Message } from 'element-ui'

// Vue.use()将引入的组件设为全局可用
Vue.use(Button)
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// Message组件需要进行全局挂载
Vue.prototype.$message = Message