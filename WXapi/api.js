import {
	service,normoal
} from './http.js';
const key = '&key=93ba9db2f9f4f0e4';

//service请求区域
//获取城市id
const getCityId = (data, isloading) => {
	return service('candao.base.getCityIdByCityName', 'post', data, isloading)
}

//获取附近门店列表
const getNearStoreList = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getNearStoreList', 'post', data , isloading)
} 
 
 //获取门店列表
 const getStoreList = (data, isPlicing, isloading) => {
 	return service('candao.storeStandard.getStoreList', 'post', data , isloading)
 }

//获取最近的一家门店
const getNearStore = (data, isPlicing, isloading) => {
	return service('candao.storeStandard.getNearStore', 'post', data , isloading)
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





//normoal请求区域
//微信登录
const getWxOpenid = (data, isPlicing, isloading) => {
	return normoal('LocalAction?method=getOpenId'+ key, 'post', data, isPlicing, isloading)
}

//设置缓存
const setCache = (data, isPlicing, isloading) => {
	return normoal('Cache?actionId=1', 'post', data, isPlicing, isloading)
}





module.exports = {
	getStoreList:getStoreList,
	getNearStore:getNearStore,
	updateAddress:updateAddress,
	addUserAddress:addUserAddress,
	getUserAddress:getUserAddress,
	getDistrict:getDistrict,
	getCityList:getCityList,
	getOpenCityList:getOpenCityList,
	getProductMenu:getProductMenu,
	getCityId:getCityId,
	getWxOpenid: getWxOpenid,
	setCache:setCache,
	getNearStoreList:getNearStoreList,
	getDefaultMeun:getDefaultMeun
}
