import {
	service,
	normoal,
	service_v
} from './http.js';
const key = '&key=93ba9db2f9f4f0e4';

//service请求区域
//获取城市id
const getCityId = (data, isloading) => {
	return service('candao.base.getCityIdByCityName', 'post', data, isloading)
}

//获取附近门店列表
const getNearStoreList = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getNearStoreList', 'post', data, isloading)
}

//获取门店列表
const getStoreList = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getStoreList', 'post', data, isloading)
}

//获取门店信息
const getStore = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getStore', 'post', data, isloading)
}

//获取最近的一家门店
const getNearStore = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getNearStore', 'post', data, isloading)
}

//获取默认菜单
const getDefaultMeun = (data, isloading) => {
	return service('candao.product.getBrandDefaultMenu', 'post', data, isloading)
}

//获取对应商家id的菜单
const getProductMenu = (data, isloading) => {
	return service('candao.product.getProductMenu', 'post', data, isloading)
}

//获取开放城市
const getOpenCityList = (data, isloading) => {
	return service('candao.storeStandard.getOpenCityList', 'post', data, isloading)
}

//获取所选省份下的所有城市
const getCityList = (data, isloading) => {
	return service('candao.base.listCity', 'post', data, isloading)
}

//获取所选城市下的所有区域
const getDistrict = (data, isloading) => {
	return service('candao.base.listDistrict', 'post', data, isloading)
}

//获取用户的地址信息
const getUserAddress = (data, isloading) => {
	return service('candao.userAddress.getList', 'post', data, isloading)
}

//添加地址信息
const addUserAddress = (data, isloading) => {
	return service('candao.userAddress.add', 'post', data, isloading)
}

//修改地址
const updateAddress = (data, isloading) => {
	return service('candao.userAddress.update', 'post', data, isloading)
}

//删除地址
const deleteAdress = (data, isloading) => {
	return service('candao.userAddress.delete', 'post', data, isloading)
}

//获取广告banner  
const getBannerList = (data, isloading) => {
	return service('candao.storeOwn.getWeChatAppSetting', 'post', data, isloading)
}

//获取用户信息 
const getUserInfo = (data, isloading) => {
	return service('candao.user.getBaseInfo', 'post', data, isloading)
}

//创建订单
const placeOrder = (data, isloading) => {
	return service('candao.orderOwn.postOrder', 'post', data, isloading)
}

//获取微信订阅消息ID列表
const getWxaSubscribeTemplates = (data, isloading) => {
	return service('candao.sms.getWxaSubscribeTemplates', 'post', data, isloading)
}

//获取订单详情
const getOrderDetail = (data, isloading) => {
	return service('candao.orderOwn.getOrderDetail', 'post', data, isloading)
}

//获取微信支付参数
const wxOrderPay = (data, isloading) => {
	return service('candao.pay.orderPay', 'post', data, isloading)
}

//获取订单列表
const getOrderList = (data, isloading) => {
	return service('candao.orderOwn.getUserOrders', 'post', data, isloading)
}

//取消订单
const cancelOrder = (data, isloading) => {
	return service('candao.orderOwn.cancelOrder', 'post', data, isloading)
}




//normoal请求区域
//微信登录
const getWxOpenid = (data, isPlicing, isloading) => {
	return normoal('LocalAction?method=getOpenId' + key, 'post', data, isPlicing, isloading)
}

//设置缓存
const setCache = (data, isPlicing, isloading) => {
	return normoal('Cache?actionId=1', 'post', data, isPlicing, isloading)
}

//用户手机号登录
const phoneLogin = (data, isPlicing, isloading) => {
	return normoal('LocalAction?method=autoLogin' + key, 'post', data, isPlicing, isloading)
}




//v_4.3接口地方  service_v
//用户注册
const vUserLogin = (data, isloading) => {
	return service_v('v4_3/card/register', 'post', data, isloading)
}

//用户注册
const getMemberInfo = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/card/by' + backurl, 'get', data, isloading)
}

function handerGetParams(data) {
	let string = ''
	for (let i in data) {
		string += '/' + data[i];
	}
	return string
}

//品牌优惠活动
const getActivity = (data, isloading) => {
	return service_v('v4_3/find/markting/activity', 'post', data, isloading)
}

//会员权益计算
const memberInterest = (data, isloading) => {
	return service_v('v4_3/calculate/member/interests', 'post', data, isloading)
}




// //获取可使用优惠卷
// const calculationCoupons = (data, isloading) => {
// 	return service_v('v4_3/calculation/coupon', 'post', data, isloading)
// }





module.exports = {
	getStore:getStore,
	cancelOrder:cancelOrder,
	getOrderList:getOrderList,
	wxOrderPay:wxOrderPay,
	getOrderDetail:getOrderDetail,
	placeOrder:placeOrder,
	getWxaSubscribeTemplates:getWxaSubscribeTemplates,
	memberInterest:memberInterest,
	getMemberInfo: getMemberInfo,
	getActivity: getActivity,
	deleteAdress: deleteAdress,
	vUserLogin: vUserLogin,
	phoneLogin: phoneLogin,
	getUserInfo: getUserInfo,
	getBannerList: getBannerList,
	getStoreList: getStoreList,
	getNearStore: getNearStore,
	updateAddress: updateAddress,
	addUserAddress: addUserAddress,
	getUserAddress: getUserAddress,
	getDistrict: getDistrict,
	getCityList: getCityList,
	getOpenCityList: getOpenCityList,
	getProductMenu: getProductMenu,
	getCityId: getCityId,
	getWxOpenid: getWxOpenid,
	setCache: setCache,
	getNearStoreList: getNearStoreList,
	getDefaultMeun: getDefaultMeun
}
