import request from '@/utils/request'

export function selectLikeNamePage(name) {
  return request({
    url: '/menu/selectLikeNamePage?name=' + name,
    method: 'get'
  })
}


export function nav() {
  return request({
    url: '/menu/nav',
    method: 'get'
  })
}

export function getMenus(data) {
  return request({
    url: '/menu/list',
    method: 'get',
    data : data
  })
}


export function deleteMenu(menuId) {
  return request({
    url: '/menu/deleteMenu',
    method: 'delete',
    data: menuId
  })
}

export function selectMenu() {
  return request({
    url: '/menu/select',
    method: 'get'
  })
}

export function getMenuInfo(id) {
  return request({
    url: `/menu/getById?id=${id}`,
    method: 'get'
  })
}

export function addOrUpdate(id, data) {
  return request({
    url: `/menu/${!id ? 'insert' : 'update'}`,
    method: 'post',
    data: data
  })
}
