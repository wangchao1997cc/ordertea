import api from '../WXapi/api.js'
import store from '../store/store.js'

//刷新用户信息
export const refreshUserInfo = async callback => {
	let res = await getUserInfo();
	if (res.code == 200) {
		uni.setStorageSync('userinfo', res.data);
		if (callback) {
			return res
		}
	}
}

//wx登录
function wxLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: params => {
				let wxCode = params.code;
				resolve(wxCode)
			}
		});
	})
}

export const getCityId = async (cityname,isboolean) => {
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
