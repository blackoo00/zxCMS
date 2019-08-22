/* eslint-disable no-param-reassign */
import { stringify } from 'qs';
import request from '@/utils/request';
import config from '@/utils/config'

const {host} = config
/* 获取商品列表
   pgae:页面 key:关键词 cid:分类ID
*/
export async function queryProdList(params) {
  // return request(`/api/prod_list?${stringify(params)}`);
  return request(`${host}prod/list?${stringify(params)}`,{
    headers:{
      token:localStorage.getItem('token')
    }
  });
}
/* 获取所有分类（添加商品时使用）
*/
export async function queryCatgAll(params) {
  return request(`${host}cats/all?${stringify(params)}`,{
    headers:{
      token:localStorage.getItem('token')
    }
  });
  // return request(`/api/cms/cats/all?${stringify(params)}`);
}
/* 获取商品分类列表
   pgae:页面 key:关键词
*/
export async function queryCatgList(params) {
  // return request(`/api/catg_list?${stringify(params)}`);
  return request(`${host}cats/list?${stringify(params)}`,{
    headers:{
      token:localStorage.getItem('token')
    }
  });
}
/* 获取订单列表
   pgae:页面 key:关键词
*/
export async function queryOrderList(params) {
  return request(`/api/order_list?${stringify(params)}`,{
    headers:{
      token:localStorage.getItem('token')
    }
  });
  // return request(`http://a.cn/api/cms/order/list?page=1&key=`);
}

/* 添加产品 */
export async function addProd(params) {
  return request(`${host}prod/add`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}

/* 编辑产品 */
export async function editProd(params) {
  return request(`${host}prod/edit`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}
/* 编辑产品 */
export async function delProd(params) {
  return request(`${host}prod/del`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}
/* 添加分类 */
export async function addCat(params) {
  return request(`${host}cats/add`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}
/* 编辑分类 */
export async function editCat(params) {
  return request(`${host}cats/edit`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}
/* 删除分类 */
export async function delCat(params) {
  return request(`${host}cats/del`, {
    method: 'POST',
    headers:{
      token:localStorage.getItem('token')
    },
    data: {
      ...params,
    },
  });
}

/* 用户登录 */
export async function fakeAccountLogin(params) {
  params.ac = params.userName
  params.se = params.password
  return request(`${host}/token/app`, {
    method: 'POST',
    data: params,
  });
}
