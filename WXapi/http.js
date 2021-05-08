//定义环境 请求封装






//正式环境 key
const default_value_f = 'Action?' + 'key=6886173bf669d7bc'
const default_value_s = 'SecretAction?' + 'key=6886173bf669d7bc'
const key = 'rc09pv1O21dfY01nx8wx';   //正式环境
const base_url_m = 'https://open6-wxa.can-dao.com/'; //正式环境   餐道
const baseurl_v43 = 'https://crmapi.fnb-tech.com/openapi/' //正式环境	会员
// const baseurl_v43 = 'http://192.168.1.61:8090/openapi/' //内网环境	会员

//测试环境key
// const default_value_f = 'Action?' + 'key=93ba9db2f9f4f0e4'
// const default_value_s = 'SecretAction?' + 'key=93ba9db2f9f4f0e4'
// const key = 'jdhajshdjf871238767o';   //测试环境
// const base_url_m ='https://qc.can-dao.com:7776/'  //测试环境
// const baseurl_v43 = 'https://api.vi-ni.com/openapi/'   //测试环境 会员



import store from '../store/store.js';
const app = getApp();


var JSESSIONID = store.state.JSESSIONID;
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
		"Cookie": JSESSIONID ? 'JSESSIONID=' + JSESSIONID : '',
	}
	url = base_url_m + url;
	return nrequest(method, header, url, data, isloading)
}


//v_4.3接口请求
import md5 from 'blueimp-md5'
// const sign = md5('1.0.9asdf1234')

const timestmpParams = {
	method: 'get',
	header: {},
	url: baseurl_v43 + 'v4_3/getCurrentTimeMilli',
}
export async function service_v(url, method, data, isloading) {
	let timestamp = await nrequest(timestmpParams.method, timestmpParams.header, timestmpParams.url, timestmpParams.data);
	const header = {
		// "content-type": method === 'get' ? 'application/x-www-form-urlencoded' : 'application/json',
		"brandId": app.globalData.brandId,
		"clientId": app.globalData.clientId,
		"timestamp": timestamp.data,
	}
	let storeCode = app.globalData.storeInfo.extraStoreId;
	if (storeCode && url != 'v4_3/weixin/recharge') {
		header.storeCode = storeCode;
	}
	
	if(data && data.storeCode){    //门店列表时，查询门店等待时间
		header.storeCode = data.storeCode
	}
	let md5Params = Object.assign({}, header);
	header.key = key;
	Object.assign(md5Params, data);
	md5Params = handleSingn(md5Params);
	url = baseurl_v43 + url;
	header.sign = md5Params;
	
	return nrequest(method, header, url, data, isloading)
}
//处理   md5 sign参数
function handleSingn(data) {
	let newData = {};
	Object.keys(data).sort().map(key => {
		if (typeof(data[key]) == 'object') {
			data[key] = JSON.stringify(data[key])
		}
		newData[key] = data[key]
	})
	newData.key = key;
	newData = jsonToUrlForm(newData);
	newData = md5(newData.substr(1));
	return newData.toUpperCase();
}

/**
 * json拼接成url 请求那样
 */
function jsonToUrlForm(paramJson) {
	var formString = "";
	for (var key in paramJson) {
		var value = paramJson[key];
		formString += "&" + key + "=" + value;
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
			url: url,
			data: data,
			method: method,
			dataType: 'json',
			async success(e) {
				if (isloading) uni.hideLoading();
				if (e.statusCode === 200) {
					if (!JSESSIONID) {
						// JSESSIONID = "cc8bef60-c231-4a26-b0e3-6c3e13549cbf; path=/; expires=Fri, 01-Jan-2021 02:47:00 GMT"
						JSESSIONID = e.header["Set-Cookie"].match(/JSESSIONID=(.*)?;/)[1];
						// console.log(JSESSIONID)
						// let data = {
						// 	"JSESSIONID": JSESSIONID
						// };
						store.commit('jessionid', JSESSIONID);
					}
					resolve(e.data);
				}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}


function request(method, header, url, data, isloading) {
	if (isloading) uni.showLoading({
		mask: true
	});
	return new Promise((resolve, reject) => {
		if (data) {
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
					// if(e.data.status==11){
					// 	console.log(3333)
					// }
				} else {}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}
