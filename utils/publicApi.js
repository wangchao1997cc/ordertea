import api from '../WXapi/api.js'
import store from '../store/store.js'
const app = getApp();

//刷新用户信息
export const refreshUserInfo = async callback => {
	let res = await api.getUserInfo();
	if (res && res.status == 1) {
		if (res.data.phone) {
			store.commit('changeLogin', res.data.phone);
		}
		if (callback) {
			return res.data;
		}
		uni.setStorageSync('userinfo', res.data);
	}
}


//等待排队
export const waitLineUp = async data => {
	let res = await api.waitLineup(data);
	if (res.code == 200) {
		return res;
		// uni.setStorageSync('userinfo', res.data);
	} else {
		return '';
	}
}

//获取充值套餐
export const getRecharge = async callback => {
	let res = await api.getRecharge({}, true);
	if (res && res.code == 200) {
		let data = false;
		if (res.data.length) {
			data = res.data;
		}
		return data;
	}
}


//获取会员用户信息
export const getMemberInfo = async Summit => {
	let wxCode = await wxLogin();
	let data = {
		APPID: app.globalData.appid,
		CODE: wxCode,
		Summit: Summit
	}
	let res = api.getMemberInfo(data);
	console.log(res)
	return res
	// uni.request({
	// 	 url: 'https://oapi.keqin89.com/KeQinOpenApi.asmx/WechatGetOpenIDXCX',
	// 	 method: 'POST',

	// })
	// if(!store.state.isLogin){
	// 	return null;
	// }
	// let data = {
	// 	mobile: store.state.isLogin,
	// }
	// let res = await api.getMemberInfo(data);
	// if (res && res.code == 200) {
	// 	if(!store.state.cardNo){
	// 		store.commit('setCardNo', res.data[0].cardNo);
	// 	}
	// 	uni.setStorageSync('memberinfo', res.data[0]);
	// 	if(callback){
	// 		return res.data[0];
	// 	}
	// }
}


//用户注册
export const userRegister = async data => {
	let activeParams = app.globalData.activeParams;
	if (activeParams && !data.activityId) {
		data.recommendedId = activeParams.recommendedId;
		data.activityId = activeParams.activityId;
	}
	let res = await api.vUserLogin(data);
	if (res && res.code == 200) {
		return res.data[0];
	}
}

export const getBannerList = async callback => {
	let res = await api.getBannerList({});
	if (res.status == 1) {
		return res.data
	}
}



//wx登录
export function wxLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: params => {
				let wxCode = params.code;
				resolve(wxCode)
			}
		});
	})
}

export const getCityId = async (cityname, isboolean) => {
	let data = {
		name: cityname
	}
	let res = await api.getCityId(data, isboolean);
	if (res.status == 1) {
		return res.data;
	}
}

//小程序登录获取openid
export const ajaxUserLogin = async (takeit) => {
	let wxCode = await wxLogin();
	let data = {
		code: wxCode,
	};
	let res = await api.getWxOpenid(data, true);
	refreshUserInfo();
	if (res.status == 1) {
		delete res.data.errcode;
		store.commit('change', res.data);
		return res.data;
	}
}


//微信支付
export const wxPayment = (payment) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			'timeStamp': payment.timeStamp,
			'nonceStr': payment.nonceStr,
			'package': payment.package,
			'signType': payment.signType,
			'paySign': payment.paySign,
			'success': function(res) {
				resolve(res)
			},
			'fail': function(res) {
				reject(res)
			},
		})
	})

}






// module.exports = {
// 	refreshUserInfo:refreshUserInfo
// }
