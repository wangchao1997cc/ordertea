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
	return service('candao.storeStandard.getStoreList', 'post', data , isloading)
}

//获取地区所对应的门店列表
const getStoreList = (data, isloading) => {
	return service('candao.storeStandard.getStoreList', 'post', data, isloading)
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
