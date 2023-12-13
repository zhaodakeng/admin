import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from "@/utils/tool";
import router from '@/router'

const errFun = (code) => {
    switch (code) {
        case 401:
            router.push({path: '/login'}).catch(() => {
            })
            break
    }
}
const successFun = (code) => {
    switch (code) {
        case 201:
            Message.success('保存成功')
            break
        case 202:
            Message.success('保存成功')
            break
        case 203:
            Message.success('删除成功')
            break
    }
}

// 创建axios实例
const service = axios.create({
    timeout: 300000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
    config.baseURL = window.servicesUrl.apiUrl
    if (getToken()) {
        config.headers['token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
}, error => {
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        let data = response.data;
         // 状态用于判断
        if(data.code == 401){
            //无效token
            Message.error("登录失效，请重新登录！")
            router.push({
                path: '/login',
                replace: true
            })
            return
        } else if (data.code >= 200 && data.code < 300) {
            successFun(data.code)
            // 成功返回数据
            return data;
        } else if (data.code >= 100 && data.code < 200) {
            Message.error(data.message)
        } else {
            Message.error(data.message)
            return Promise.reject(data.message);
        }
    },
    error => {
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    })

export default service
