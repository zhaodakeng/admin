import {login, loginout, getUserInfo} from '@/api/login'
import {Message} from 'element-ui'
import {getToken, setToken, removeToken} from "@/utils/tool";

const _import = require("@/router/_import_" + process.env.NODE_ENV);
import router from '@/router'
import store from "@/store";
import {initDictionaries} from "@/api/systemConfig/dictionaries";

const requireComponent = require.context('@/views', true, /\.vue$/)
/**
 * 更新路由
 */
const updateRouter = (routerDataList = []) => {

    if (routerDataList.length == 0) return

    routerDataList.forEach(routerItem => {
        let vueList = requireComponent.keys().filter(item => {
            return item.includes(routerItem.component)
        })
        if (vueList.length > 0)
            router.addRoute({...routerItem, component: _import(routerItem.component)}) // 动态添加可访问路由表
    })
}
/**
 * 更新菜单
 * @param menuDataList
 */
const updateMenu = (menuDataList) => {
    if (menuDataList.length == 0) return
    let json = {
        name: 'index',
        title: '首页',
        path: '/index',
        redirect: menuDataList[0].path,
        component: _import('index'),
        children: []
    }
    menuDataList.forEach(menuItem => {
        let vueList = requireComponent.keys().filter(item => {
            return item.includes(menuItem.component)
        })
        if (vueList.length > 0)
            json.children.push({
                ...menuItem,
                meta: {...menuItem.meta, tabTitle: menuItem.title,type:'menu'},
                component: menuItem.component && _import(menuItem.component)
            })
    })
    router.addRoute(json) // 动态添加可访问路由表
}
const user = {
    state: {
        user: {
            router: []
        },
        token: getToken(),
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            setToken(token)
            state.token = token
        },
        SET_USER: (state, user) => {
            state.user = user
        },
    },

    actions: {
        // 用户名登录
        login({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo.username, userInfo.password).then(response => {
                    if (!response) return resolve()
                    // const data = response.data
                    commit('SET_TOKEN', response.token)
                    resolve()
                }).catch(err=>{
                    reject(err)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({commit, state}) {

            return new Promise((resolve, reject) => {
                if (getToken()) {
                    getUserInfo().then(response => { //返回数据格式看mock.js getUserInfo
                        if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
                            store.dispatch("loginout").then(() => {
                                //回到默认页
                                window.location.href = window.location.origin
                            })
                            return
                        }
                        commit('SET_USER', response.data)
                        //筛选出路由进行添加
                        updateRouter(response.data.router.filter(item => item.type == 'router'))
                        //筛选出菜单路由进行添加
                        updateMenu(response.data.router.filter(item => item.type == 'menu' && item.component))
                        initDictionaries().then(() => {

                        }).finally(() => {
                            resolve(response)
                        })

                    }).catch(error => {
                        reject(error)
                    })
                } else {
                    resolve()
                }


            })
        },
        // 登出
        loginout({commit, state}) {
            return new Promise((resolve, reject) => {
                loginout().then(() => {
                    commit('SET_TOKEN', '')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
}

export default user
