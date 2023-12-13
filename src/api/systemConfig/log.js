import request from "@/api/request";

/**
 * 删除日志
 * @param {*} id 
 * @returns 
 */
export function logDeleteById(id) {
  return request({
      url: '/log/deleteById',
      method: 'post',
      data: {
        id
      }
  });
}

/**
 * 批量删除日志
 * @param {*} id 
 * @returns 
 */
export function logDeleteBatch(data) {
  return request({
      url: '/log/deleteBatch',
      method: 'post',
      data
  });
}