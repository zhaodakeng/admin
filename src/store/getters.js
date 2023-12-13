const getters = {
    //返回菜单树
    menu: state => {
        const router = state.user.user.router
        console.log('router',router)
        const menuList = router.filter(item => {
            return item.type == 'menu' && item.pid == '-1' //类型menu 并且pid为-1的顶级菜单
        }).sort((a, b) => a.sort - b.sort)
        menuList.forEach(menu => {
            menu.children = router.filter(item => {
                return item.type == 'menu' && item.pid == menu.id //获取二级菜单
            }).sort((a, b) => a.sort - b.sort)
        })
        console.log('menuList',menuList)
        return menuList
    },
    user: state => state.user.user,
    //返回路由
    router: state => state.user.user.router,
}
export default getters
