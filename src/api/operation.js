import request from '@/utils/request'

export function selectLikeNamePage(name) {
  return request({
    url: '/operation/selectLikeNamePage?name=' + name,
    method: 'get'
  })
}

export function getoperations(data) {
  return request({
    url: '/operation/list',
    method: 'get',
    data: data
  })
}

export function getPageoperations(data) {
  return request({
    url: '/operation/list',
    method: 'post',
    data: { body: data }
  })
}

export function deleteoperation(ids) {
  return request({
    url: '/operation/deleteOperation',
    method: 'delete',
    data: ids
  })
}

export function getoperationInfo(id) {
  return request({
    url: `/operation/getById?id=${id}`,
    method: 'get'
  })
}

export function addOrUpdate(id, data) {
  return request({
    url: `/operation/${!id ? 'insert' : 'update'}`,
    method: 'post',
    data: data
  })
}
