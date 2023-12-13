import request from "@/api/request";
const url = 'role'


export function roleDeleteById(id) {
    return request({
        url: `/${url}/deleteById`,
        method: 'post',
        data: {
            id
        }
    });
}


export function roleSave(data) {
    if (data.id) {
        return request({
            url: `/${url}/update`,
            method: 'post',
            data
        });
    } else {
        return request({
            url: `/${url}/save`,
            method: 'post',
            data
        });
    }

}

export function roleQueryAll(params) {
    return request({
        url: `/role/queryAll`,
        method: 'get',
        params
    });
}