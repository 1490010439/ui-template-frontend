import request from '@/utils/request'

export function selectLikeNamePage(name) {
  return request({
    url: '/role/selectLikeNamePage?name=' + name,
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/role/select',
    method: 'get'
  })
}

export function getPageRoles(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data: data 
  })
}

export function deleteRole(ids) {
  return request({
    url: '/role/delete',
    method: 'delete',
    data: ids
  })
}

export function getRoleInfo(id) {
  return request({
    url: `/role/getById?id=${id}`,
    method: 'get'
  })
}

export function addOrUpdate(id, data) {
  return request({
    url: `/role/${!id ? 'insert' : 'update'}`,
    method: 'post',
    data: data
  })
}
