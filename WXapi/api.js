import {
	service,
	normoal,
	service_v
} from './http.js';
import appConfig from '../config/index.js';
//正式环境
// const key = '&key=6886173bf669d7bc';
//测试环境
// const key = '&key=93ba9db2f9f4f0e4';

//service请求区域
// 获取小程序配置
const getConfigure = (data, isloading) => {
	return service("Parameters", "XCX", "post", data, isloading)
}

//获取用户openid key等
const getUserOpenInfo = (data, isloading) => {
	return normoal('WechatGetOpenIDXCX', data, isloading)
}

//获取轮播图
const getRotation = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Layout", interFaces, "post", data, isloading)
}

//获取手机号
const decryptPhoneNumber = (data, isloading) => {
	let interFaces = data.interFaces;
	return normoal("WechatGetPhoneNumber", data, isloading)
}

//获取用户信息 
const getUserInfo = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Member", interFaces, "post", data, isloading)
}

// 修改更新会员信息 
const MemberInfoUpdate = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Member", interFaces, "post", data, isloading)
}

// //获取会员信息
// const getMemberInfo = (data, isloading) => {
// 	let interFaces = data.interFaces;
// 	return service("Member",interFaces , "post", data, isloading)
// }

//获取附近门店列表 //门店信息  //门店的城市
const getNearStoreList = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Shop", interFaces, "post", data, isloading)
}

//获取门店对应餐单   //单个商品详情
const getProductMenu = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Menu", interFaces, "post", data, isloading)
}

//购物车 订单部分 //添加 //修改 //获取 //订单记录
const shopCarControl = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Order", interFaces, "post", data, isloading)
}

//获取微信订阅消息


//获取支付参数
const getPayMentParams = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("Payment", interFaces, "post", data, isloading)
}

//获取订阅消息
const getWxaSubscribeTemplates = (data, isloading) => {
	let interFaces = data.interFaces;
	return service("WechatAPI", interFaces, "post", data, isloading)
}









//v_4.3接口地方  service_v
//用户注册
const vUserLogin = (data, isloading) => {
	return service_v('v4_3/card/register', 'post', data, isloading)
}

//获取会员信息
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

// //品牌优惠活动
const getActivity = (data, isloading) => {
	return service_v('v4_3/find/markting/activity', 'post', data, isloading)
}

// //会员权益计算
const memberInterest = (data, isloading) => {
	return service_v('v4_3/calculate/member/interests', 'post', data, isloading)
}

// //修改会员信息
const updateMember = (data, isloading) => {
	return service_v('v4_3/card/update', 'post', data, isloading)
}

// //获取等级权益信息
const getLevel = (data, isloading) => {
	return service_v('v4_3/level/by', 'get', data, isloading)
}

// //获取可使用优惠券
const getCoupons = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/coupon/by' + backurl, 'get', data, isloading)
}

// //获取商品列表
const getGoodsList = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/pointProduct/queryList' + backurl, 'get', data, isloading)
}

//获取当前充值套餐
const getRecharge = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/recharge/getPackage' + backurl, 'get', data, isloading)
}


//微信充值下单接口
const rechargeApi = (data, isloading) => {
	let storeId = data.storeId;
	delete data.storeId;
	return service_v('v4_3/weixin/recharge/' + storeId, 'post', data, isloading)
}

//查询交易记录
const checkRecord = (data, isloading) => {
	return service_v('v4_3/transList', 'post', data, isloading)
}

//修改会员支付密码
const updatePassword = (data, isloading) => {
	return service_v('v4_3/updatePassword', 'post', data, isloading)
}


//查询商品详情
const goodsDetail = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/pointProduct/queryOne' + backurl, 'get', data, isloading)
}

//查询积分商品的商店
const pointStore = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/store/by' + backurl, 'get', data, isloading)
}

//生成积分商品的订单
const shopOrder = (data, isloading) => {

	return service_v('v4_3/pointProduct/orders/add', 'post', data, isloading)
}

//生成积分商品的微信支付参数
const shopOrderPayParams = (data, isloading) => {

	return service_v('v4_3/pointProduct/orders/wxPay', 'post', data, isloading)
}

//完成订单支付
const completeOrder = (data, isloading) => {
	return service_v('v4_3/pointProduct/orders/suc', 'post', data, isloading)
}

//兑换记录
const exchangeRecord = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/pointProduct/orderRecord' + backurl, 'get', data, isloading)
}

//获取会员码
const getCodeParams = (data, isloading) => {
	let backurl;
	if (data) {
		backurl = handerGetParams(data);
	}
	return service_v('v4_3/cardCode/queryByCardNo' + backurl, 'get', data, isloading)
}

//裂变活动查询
const fissionActive = (data, isloading) => {
	return service_v('v4_3/activity/markting', 'post', data, isloading)
}

//推荐人的收益
const restulActivity = (data, isloading) => {
	return service_v('v4_3/activity/restul', 'post', data, isloading)
}


//活动详情及活动参与信息查询接口
const activityDesc = (data, isloading) => {
	return service_v('v4_3/activity/information', 'post', data, isloading)
}

//锁定分享的优惠券
const lockingCoupons = (data, isloading) => {
	return service_v('v4_3/card/transfer/ticket/choice', 'post', data, isloading)
}

//兑换优惠券
const codeByTicket = (data, isloading) => {
	return service_v('v4_3/ticket/codeByTicket', 'post', data, isloading)
}

//兑换优惠券
const confirmStutas = (data, isloading) => {
	return service_v('v4_3/card/transfer/ticket/status', 'post', data, isloading)
}

//好友领取优惠券
const receiveCoupons = (data, isloading) => {
	return service_v('v4_3/card/transfer/ticket/get', 'post', data, isloading)
}

//查询天将红包活动
const redRewardActive = (data, isloading) => {
	return service_v('v4_3/find/ticket/activity', 'post', data, isloading)
}

//领取天将红包
const receiveReward = (data, isloading) => {
	return service_v('v4_3/wxActivity/exchange', 'post', data, isloading)
}

//积点活动
const pointActivity = (data, isloading) => {
	return service_v('v4_3/find/point/activity', 'post', data, isloading)
}

//排队 预计前面还有多少订单
const waitLineup = (data, isloading) => {
	return service_v('v4_3/findStore/queue', 'get', data, isloading)
}

//新鲜事列表
const getNewsList = (data, isloading) => {
	return service_v('v4_3/WxTweets/list', 'get', data, isloading)
}

//查询门店列表
const getStores = (data, isloading) => {
	return service_v('v4/cardSell/getStores', 'get', data, isloading)
}



module.exports = {
	getUserInfo,
	MemberInfoUpdate,
	getPayMentParams,
	getWxaSubscribeTemplates,
	getConfigure,
	getUserOpenInfo,
	getRotation,
	decryptPhoneNumber,
	getNearStoreList,
	getProductMenu,
	shopCarControl,
	vUserLogin,
	getMemberInfo,
	getActivity,
	memberInterest,
	updateMember,
	getLevel,
	getCoupons,
	getGoodsList,
	getRecharge,
	rechargeApi,
	checkRecord,
	updatePassword,
	goodsDetail,
	pointStore,
	shopOrder,
	shopOrderPayParams,
	completeOrder,
	exchangeRecord,
	getCodeParams,
	fissionActive,
	restulActivity,
	activityDesc,
	lockingCoupons,
	codeByTicket,
	confirmStutas,
	receiveCoupons,
	redRewardActive,
	receiveReward,
	pointActivity,
	waitLineup,
	getNewsList,
	getStores,
}
