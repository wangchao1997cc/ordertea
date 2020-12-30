import api from '../WXapi/api.js'
import store from '../store/store.js'

//刷新用户信息
export const refreshUserInfo = async callback => {
	
	let res = await api.getUserInfo();
	console.log(res)
	if (res && res.status == 1) {
		if (res.data.phone) {
			store.commit('changeLogin', res.data.phone);
			getMemberInfo();
		}
		if (callback) {
			return res.data;
		}
		uni.setStorageSync('userinfo', res.data);
	}
}


//获取会员用户信息
export const getMemberInfo = async callback => {
	let data = {
		mobile: store.state.isLogin,
	}
	let res = await api.getMemberInfo(data);
	if (res && res.code == 200) {
		uni.setStorageSync('memberinfo', res.data[0]);
	}
}


//用户注册
export const userRegister = async data => {
	let res = await api.vUserLogin(data);
	if (res && res.code == 200) {
		uni.setStorageSync('memberinfo', res.data[0]);

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
