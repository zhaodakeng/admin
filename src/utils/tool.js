export function getToken() {
    return localStorage.getItem('token')
}
export function setToken(token) {
    return localStorage.setItem('token',token)
}
export function removeToken() {
    return localStorage.removeItem('token')
}

export function imgNameToPath(name){
    return `${window.servicesUrl.apiUrl}/getFile/${name}`
}

export function pxToRem(px) {
    if (/%/ig.test(px)) { // 有百分号%，特殊处理，表述pc是一个有百分号的数，比如：90%
        return px
    } else {
        return (parseFloat(px) / window.servicesUrl.fontSize) + 'rem' // 基数
    }
}

export function pxToPx(px) {
    let docEl = document.documentElement
    let clientWidth = docEl.clientWidth;
    return (parseFloat(px) * (clientWidth / window.servicesUrl.width)) + 'px' // 倍率
}