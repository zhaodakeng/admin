import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts';
import 'class-tool-mini';
import './element'
// 执行mockjs文件
// import '@/utils/mock.js'
import '@/router/permission'
import '@/components'

import Search from "@/components/Search";
import {pxToPx, pxToRem} from "@/utils/tool";

Vue.prototype.Search = Search

Vue.prototype.$echarts = echarts
Vue.prototype.$pxToRem = pxToRem
Vue.prototype.$pxToPx = pxToPx
Vue.config.productionTip = false


store.dispatch('GetUserInfo').then(() => {
}).finally(() => {//初始化时获取userinfo后再初始化vue实例
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
})

