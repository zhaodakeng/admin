//可以在mock.js文件中模拟数据
//如果引入出现... 执行npm i --save-dev @types/mockjs

// 引入mockjs
import Mock from 'mockjs'

Mock.setup({
    timeout: '200-600'
})
const login = (opt) => {
    // post传递过来的参数
    // console.log(opt.body) //json字符串 需要转成对象
    let {phone, password} = JSON.parse(opt.body)
    return {
        token: Math.random()
    }
}
const router = [
    {
    id: 2,
    name: 'test',
    title: '菜单1',
    icon: 'icon-fanhui',
    path: '/test3',
    pid: undefined,
    sort: 1,
    type: 'menu'
}, {
    id: 3,
    name: 'test2',
    title: '路由管理',
    icon: 'icon-gengduo',
    path: '/test2',
    pid: undefined,
    sort: 1,
    type: 'menu',

}, {
    id: 4,
    name: 'test3',
    title: '菜单3',
    icon: 'home',
    path: '/test3',
    component: 'home/index',
    pid: 2,
    sort: 1,
    type: 'menu',
}, {
    id: 5,
    name: 'test4',
    title: '路由列表',
    icon: 'home',
    path: '/test4',
    component: 'router/index',
    pid: 3,
    sort: 1,
    type: 'menu',
}]
// 查询接口--get
Mock.mock('/user/login', 'post', login)
Mock.mock('/user/loginout', 'get')
Mock.mock('/user/queryLoginUser', 'get', {
    router
})
Mock.mock('/router/getList', 'post', {
    records:router,
    total:router.length
})
/*
// 新增接口--post
Mock.mock('/mock/addNews','post',handleAddName)
// 删除接口--delete(请求的查询参数拼接在请求路径中的，需要对路径进行处理，使用正则，只要是符合校验的进来进行操作)
Mock.mock(/^\/mock\/deleteNews/,'delete',handleDeleteName)
*/


// 直接返回数据
// Mock.mock('/mock/news','put',{
// 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//   "list|10":[
//     {
//       "fname":"@cfirst()",
//       "lname":"@clast()",
//       "avatar":"@image('100x100','pink','#fff','png','Hello')",
//       "info":"@cparagraph()",
//       "age":"@integer(0,100)",
//       "address":"@county(true)",
//       "yzm":"@string('number',6)"
//     }
//   ]
// })
