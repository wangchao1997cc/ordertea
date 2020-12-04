//定义环境 请求封装
const base_url_m = 'https://qc.can-dao.com:7776/'; //测试环境
const default_value_f = 'Action?' + 'key=93ba9db2f9f4f0e4'
const default_value_s = 'SecretAction?' + 'key=93ba9db2f9f4f0e4'
import store from '../store/store.js';


var JSESSIONID = store.state.JSESSIONID;

// let againData = null;
// let requestNUms = 1; //请求次数限制
// let header = {
// 	"Cookie":  JSESSIONID? JSESSIONID:'',
// }

//使用 data.actionName   请求的方式
export function service(url, method, data, isloading) {
	let header = {
		'content-type': method === 'get' ? 'application/x-www-form-urlencoded' : 'application/json',
		"Cookie": JSESSIONID ? 'JSESSIONID=' + JSESSIONID : '',
	}
	return request(method, header, url, data, isloading)
}


//正常请求方式
export function normoal(url, method, data, isPlicing, isloading) {
	if (isPlicing) { //是否把参数拼接到地址后 
		let params = jsonToUrlForm(data);
		url += params
	}
	let header = {
		'content-type': method === 'get' ? 'application/x-www-form-urlencoded' : 'application/json',
		"Cookie": JSESSIONID ? JSESSIONID : '',
	}
	return nrequest(method, header, url, data, isloading)
}

/**
 * json拼接成url 请求那样
 */
function jsonToUrlForm(paramJson) {
	var formString = "";
	for (var key in paramJson) {
		var value = paramJson[key];
		formString += "&" + key + "=" + value;
		// if (formString == "") {
		// 	formString += "?" + key + "=" + value;
		// } else {
		// 	formString += "&" + key + "=" + value;
		// }
	}
	return formString;
}

function nrequest(method, header, url, data, isloading) {
	if (isloading) uni.showLoading({
		mask: true
	});
	return new Promise((resolve, reject) => {
		uni.request({
			header: header,
			url: base_url_m + url,
			data: data,
			method: method,
			dataType: 'json',
			async success(e) {
				if (isloading) uni.hideLoading();
				if (e.statusCode === 200) {
					resolve(e.data);
					if (!JSESSIONID) {
						// JSESSIONID = e.header["Set-Cookie"].match(/JSESSIONID=(.*)?;/)[1];
						JSESSIONID = '08fc5e45-9a32-43d8-bc8c-6cb1562e174d; path=/; expires=Mon, 07-Dec-2020 09:58:40 GMT';  //单页面测试使用
						let data = {
							"JSESSIONID": JSESSIONID
						};
						store.dispatch('changeFun', data);
					}
				}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}


function request(method, header, url, data, isloading) {
	// if (requestNUms > 3) return;
	if (isloading) uni.showLoading({
		mask: true
	});
	return new Promise((resolve, reject) => {
		if(data){
			let way = data.way;
			delete data.way;
		}
		uni.request({
			header: header,
			url: base_url_m + (data && data.way ? default_value_s : default_value_f),
			data: {
				actionName: url,
				content: data || '',
			},
			method: method,
			dataType: 'json',
			async success(e) {
				if (isloading) uni.hideLoading();
				if (e.statusCode === 200) {
					resolve(e.data);
				} else {
					// resolve(e.data);
				}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}
//wx登录
// function wxLogin() {
// 	return new Promise((resolve, reject) => {
// 		uni.login({
// 			success: params => {
// 				let wxCode = params.code;
// 				resolve(wxCode)
// 			}
// 		});
// 	})
// }

//用户登录
// async function ajaxUserLogin() {
// 	requestNUms += 1;
// 	let wxCode = await wxLogin();
// 	let res = await service('/api/free/login/login/jsCodeAndInvite', 'post', {
// 		"jsCode": wxCode
// 	})
// 	if (res && res.code == 200) {
// 		uni.setStorageSync('mToken', res.data.mToken);
// 		againData.header['mtoken'] = res.data.mToken;
// 		return await request(againData.method, againData.header, againData.url, againData.data, againData.isloading);
// 	}
// }
