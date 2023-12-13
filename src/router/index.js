import Vue from "vue";
import Router from "vue-router";

const _import = require("./_import_" + process.env.NODE_ENV);

Vue.use(Router);


export const constantRouterMap = [
    {path: '/', redirect: '/login'},
    {path: "/login", component: _import("login"), hidden: true},
    {path: "*", component: _import("errorPage/404"), hidden: true},
    {path: "/401", component: _import("errorPage/401"), hidden: true},
    // {path: "/index",component: _import("index"), hidden: true },
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [];
