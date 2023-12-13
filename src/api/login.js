import request from "@/api/request";

export function login(username, password) {
    return request({
        url: '/user/login',
        method: "post",
        data: {
            username, password
        }
    });
}

export function loginout() {
    /*   return new Promise(resolve => {
           resolve()
       })*/
    return request({
        url: "/user/logOut",
        method: "get"
    });
}

export function getUserInfo() {
    return request({
        url: '/user/queryLoginUser',
        method: "get"
    });
}