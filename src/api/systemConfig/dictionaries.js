import request from "@/api/request";

const dictionaries = new Map()
let initStatus = false
const send = (url, method, params = {}) => {
    if (dictionaries.has(url))
        return new Promise(resolve => {
            resolve(dictionaries.get(toMapKey(url, params)))
        })
    else
        return new Promise(resolve => {
            request({
                url,
                method,
                params: {
                    dictionaries: true,
                    ...params
                }
            }).then(res => {
                dictionaries.set(toMapKey(url, params), res)
                resolve(res)
            })
        });
}
const toMapKey = (url, params) => {
    return JSON.stringify({url, ...params})
}

/**
 * 初始化字典
 * @returns {Promise<unknown[]>}
 */
export function initDictionaries() {
    let promiseList = []

    promiseList.push(getSysCode(100))
    promiseList.push(getSysCode(105))
    promiseList.push(getSysCode(106))
    promiseList.push(getSysCode(107))
    promiseList.push(getSysCode(108))
    promiseList.push(getSysCode(109))
    // promiseList.push(getSysCodeByCodeType({codeType: '100'}))

    if (initStatus)
        return new Promise(resolve => {
            resolve()
        })
    else
        return Promise.all(promiseList).then(res => {
            initStatus = true
            console.log('字典加载完成')
        })
}

/**
 * 发送获取字典接口
 * @param {*} codeType 字典类型
 * @returns
 */
export function getSysCode(codeType){
    let url = `/codeDict/getSysCodeByCodeType?codeType=${codeType}`
    return send(url, 'get')
}

export function findPlatformById(id) {
    let url = '/role/queryAllPlatform'
    let params = {}
    return dictionaries.get(toMapKey(url, params)).data.find(item => item.id == id)
}
/**
 * 页面获取字典
 * @param {*} url
 * @returns
 */
export function findSysCodeByUrl(url){
    let params = {}
    return dictionaries.get(toMapKey(url, params)).data
}

export function dictSave(data) {
    if (data.id) {
        return request({
            url: `/dict/update`,
            method: 'post',
            data
        });
    } else {
        return request({
            url: `/codeDict/batchInsert`,
            method: 'post',
            data
        });
    }

}

/**
 * 批量添加字典
 * @param {*} data
 * @returns
 */
export function batchInsert(data) {
    return request({
        url: `/codeDict/batchInsert`,
        method: 'post',
        data
    });
}

/**
 * 修改字典
 * @param {*} data
 * @returns
 */
export function updateData(data) {
    return request({
        url: `/codeDict/update`,
        method: 'post',
        data
    });
}

/**
 * 批量删除字典
 * @param {*} data
 * @returns
 */
export function deleteBatch(data) {
    return request({
        url: `/codeDict/deleteBatch`,
        method: 'post',
        data
    });
}

/**
 * 根据字典类型获取字典
 * @param {*} data
 * @returns
 */
export function getSysCodeByCodeType(params) {
    return request({
        url: `/codeDict/getSysCodeByCodeType`,
        method: 'get',
        params
    });
}