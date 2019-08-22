import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return {
    address: "西湖区工专路 77 号",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    country: "China",
    email: "antdesign@alipay.com",
    geographic: {province: {label: "浙江省", key: "330000"}, city: {label: "杭州市", key: "330100"}},
    group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
    name: "用户名",
    notifyCount: 12,
    phone: "0752-268888888",
    signature: "海纳百川，有容乃大",
    tags: [{key: "0", label: "很有想法的"}, {key: "1", label: "专注设计"}, {key: "2", label: "辣~"}],
    title: "交互专家",
    unreadCount: 11,
    userid: "00000001"
  }
  // return request('/api/currentUser');
}
