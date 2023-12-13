import request from "@/api/request";
const url = 'menu'
export function menuDeleteById(id) {
    return request({
        url: `/${url}/deleteById`,
        method: 'post',
        data: {
            id
        }
    });
}

export function menuSave(data) {
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

export function menuQueryAll() {
    return request({
        url: `/menu/queryAll`,
        method: 'get',
        data:{
            pageNum:0
        }
    });
}
