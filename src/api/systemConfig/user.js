import request from "@/api/request";

export function userSave(data) {
  if (data.id) {
      return request({
          url: '/user/update',
          method: 'post',
          data
      });
  } else {
      return request({
          url: '/user/save',
          method: 'post',
          data
      });
  }
}
/**
 * 删除用户
 * @param {*} id 
 * @returns 
 */
export function userDeleteById(id) {
  return request({
      url: '/user/deleteById',
      method: 'post',
      data: {
        id
      }
  });
}
/**
 * 用户重置密码
 * @param {*} data 
 * @returns 
 */
export function userRestPassword(data) {
  return request({
      url: '/user/restPassword',
      method: 'post',
      data
  });
}

/**
 * 更新用户状态
 * @param {*} data 
 * @returns 
 */
export function updateUserStatus(data) {
  return request({
    url: '/user/disableUser',
    method: 'post',
    data
  });
}