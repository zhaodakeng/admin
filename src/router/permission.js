import router from './index'
import store from '../store'

import {getToken} from "@/utils/tool";

const whiteList = ['/login']// 不重定向白名单

router.beforeEach((to, from, next) => {
    if (to.path === '/login' && getToken()) {
        store.dispatch("loginout").then(() => {
            next('/login')
            location.reload(); // 刷新
        })
    } else if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
        next()
    } else if (getToken()) { // 判断是否有token
        next()
    } else {
        next('/login') // 否则全部重定向到登录页
    }
})

router.afterEach(() => {
})
