# 动态路由基础框架

最后修订2023年11月16日

修订人961011576@qq.com

<br/>

element.js

```javascript
//配置element ui 引入的组件，去除不需要的组件可以减少打包后的体积
```

<br/>

## f5刷新时触发

1.main.js

```javascript
store.dispatch('GetUserInfo').then(() => {//初始化时获取userinfo后再初始化vue实例

}).finally(()=>{
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
})
```

2.user.js

```javascript
GetUserInfo() //根据token获取用户信息
//根据用户权限
1 updateRouter()//更新路由
2 updateMenu()//更新菜单
//无权限或者token过期
1.loginout() // 退出登录
2.window.location.href = window.location.origin //回到首页
```

## 正常登录

```javascript
1.login.vue
 调用user.js的login函数
2.user.js -login()
  调用登录接口
 返回token
3.login.vue
 GetUserInfo() //通过token兑换userinfo 
4.user.js
  GetUserInfo() //根据token获取用户信息
  //根据用户权限
  1 updateRouter()//更新路由
  2 updateMenu()//更新菜单
  //无权限或者token过期
  1.loginout() // 退出登录
  2.window.location.href = window.location.origin //回到首页
5.login.vue
正常跳转到首页
 
```

## 路由返回格式

例：

```javascript
GetUserInfo(){
    return {
        router: [{
            id: 2,
            name: 'test',
            title: '菜单1',
            icon: 'icon-fanhui',
            path: '/test3',//顶级菜单默认跳转的路由
            pid: undefined,//undefined为顶级菜单
            sort: 1,
            type: 'menu',//类型menu菜单 , router 路由
        }, {
            id: 3,
            name: 'test2',
            title: '菜单2',
            icon: 'icon-gengduo',
            path: '/test2',
            pid: undefined, // 顶级菜单
            sort: 1,
            type: 'menu',

        }, {
            id: 4,
            name: 'test3',
            title: '菜单3',
            icon: 'home',
            path: '/test3',
            component: 'home/index', // 对应文件目录 '文件夹/文件夹/.../文件'
            pid: 2, //上级菜单
            sort: 1,
            type: 'menu',
        }, {
            id: 5,
            name: 'test4',
            title: '菜单4',
            icon: 'home',
            path: '/test4',
            component: 'home/index',
            pid: 3,//上级菜单
            sort: 1,
            type: 'menu',
        }]
    }
}

```

## 全局scss

global.scss

## 字典
dictionaries.js
```javascript
//登录成功后会调用initDictionaries()；预加载字典数据，之后调用字典则使用缓存数据

```
