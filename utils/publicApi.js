import api from '../WXapi/api.js'
import config from '../config/index.js'
import store from '../store/index.js'

//注册弹窗是否显示
export const getFirstRegister = async callback => {
	try{
		let date = new Date().getTime()
		let register = uni.getStorageSync('popupShowTime');
		console.log(date,register)
		if (!register) {
			uni.setStorageSync('popupShowTime', date);
			return true
		} else if (date > (register + 24*60*60*1000)) {
			uni.setStorageSync('popupShowTime', date);
			return true
		} else {
			return false
		}
	}catch(e){
		//TODO handle the exception
		return false
	}
}

//刷新用户信息
export const refreshUserInfo = async callback => {
	let params = {
		WXOpenID: store.getters.openidinfo.openid,
		interFaces: 'MemberInfoGet'
	};
	let res = await api.getUserInfo(params);
	console.log(res)
	const app = getApp();
	if (res && res.Message.length) {
		if (res.Message[0].strMobilePhone) {
			// store.commit('changeLogin', res.data.phone);
			app.globalData.member = true;
		} else {
			app.globalData.member = false;
		}
		if (callback) {
			return res;
		}
		// uni.setStorageSync('userinfo', res.data);
	} else {
		if (!callback) {
			let params = {
				HQCode: config.hqcode,
				WXOpenID: store.getters.openidinfo.openid,
				interFaces: 'MemberInfoRegister'
			};
			let plusInfo =  await api.getUserInfo(params); //plus 注册会员
			store.commit('SET_PLUSINFO', plusInfo.Message); //存储会员code
			if (callback) {
				return plusInfo;
			}
		}
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


//获取用户openid seekey 等信息
export const getUserOpenInfo = async Summit => {
	let wxCode = await wxLogin();
	let data = {
		APPID: config.appid,
		CODE: wxCode,
		Summit: Summit
	}
	return api.getUserOpenInfo(data);
}

//获取会员用户信息
export const getMemberInfo = async (phone,callback) => {
	let data = {
		mobile: phone,
	}
	let res = await api.getMemberInfo(data);
	if (res && res.code == 200) {
		store.commit('user/SET_MEMBERINFO',res.data[0])  //存储用户信息
	}
}

// //获取会员用户信息
// export const getMemberInfo = async Summit => {
// 	let wxCode = await wxLogin();
// 	let data = {
// 		APPID: config.appid,
// 		CODE: wxCode,
// 		Summit: Summit
// 	}
// 	return api.getMemberInfo(data);
// }


//用户注册
export const userRegister = async data => {
	let activeParams = getApp().globalData.activeParams;
	if (activeParams && !data.activityId) {
		data.recommendedId = activeParams.recommendedId;
		data.activityId = activeParams.activityId;
	}
	let res = await api.vUserLogin(data);
	if (res && res.code == 200) {
		store.commit('user/SET_MEMBERINFO',res.data[0])  //存储用户信息
	}
}

// export const getBannerList = async callback => {
// 	let res = await api.getBannerList({});
// 	if (res.status == 1) {
// 		return res.data
// 	}
// }



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
// export const ajaxUserLogin = async (takeit) => {
// 	let wxCode = await wxLogin();
// 	let data = {
// 		code: wxCode,
// 	};
// 	let res = await api.getWxOpenid(data, true);
// 	refreshUserInfo();
// 	if (res.status == 1) {
// 		delete res.data.errcode;
// 		store.commit('change', res.data);
// 		return res.data;
// 	}
// }


//微信支付
export const wxPayment = (payment) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			'timeStamp': payment.timeStamp,
			'nonceStr': payment.Noncestr,
			'package': 'prepay_id=' + payment.prepay_id,
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
