//定义环境 请求封装
import store from '../store/store.js';
import paramsM from './paramsMethod.js'

//正式环境 key
// const default_value_f = 'Action?' + 'key=6886173bf669d7bc'
// const default_value_s = 'SecretAction?' + 'key=6886173bf669d7bc'
// const key = 'rc09pv1O21dfY01nx8wx';   //正式环境
const base_url_m = 'https://apitest.fnb-tech.com/FNBOpenApi.asmx/'; //正式环境   餐道
const baseurl_v43 = 'https://crmapi.fnb-tech.com/openapi/' //正式环境	会员

// const baseurl_v43 = 'http://192.168.1.58:8090/openapi/' //内网环境	会员

//测试环境key
// const default_value_f = 'Action?' + 'key=93ba9db2f9f4f0e4'
// const default_value_s = 'SecretAction?' + 'key=93ba9db2f9f4f0e4'
// const key = 'jdhajshdjf871238767o';   //测试环境
// const base_url_m ='https://qc.can-dao.com:7776/'  //测试环境
// const baseurl_v43 = 'https://api.vi-ni.com/openapi/'   //测试环境 会员

// var JSESSIONID = store.state.JSESSIONID;
//使用 data.actionName   请求的方式
export function service(url, Method, data, isloading) {
	data = JSON.stringify(data);
	let params = {
		InterFaces: Method,
		...paramsM.config,
		Message: data,
		Sign: paramsM.getSign(Method, data),
	}
	let header = {
		'content-type': 'application/x-www-form-urlencoded',
	}
	url = base_url_m + url;
	return request(header, url, params, isloading)
}


// 正常请求方式
export function normoal(url, data, isloading) {
	// return console.log(1111)
	let header = {
		'content-type': 'application/x-www-form-urlencoded',
	}
	url = base_url_m + url;
	return nrequest(header, url, data, isloading)
}


//v_4.3接口请求

// const sign = md5('1.0.9asdf1234')

const timestmpParams = {
	method: 'get',
	header: {},
	url: baseurl_v43 + 'v4_3/getCurrentTimeMilli',
}
export async function service_v(url, method, data, isloading) {
	let timestamp = await nrequest(timestmpParams.method, timestmpParams.header, timestmpParams.url, timestmpParams
		.data);
	const header = {
		// "content-type": method === 'get' ? 'application/x-www-form-urlencoded' : 'application/json',
		"brandId": app.globalData.brandId,
		"clientId": app.globalData.clientId,
		"timestamp": timestamp.data,
	}
	if (url == 'v4/cardSell/getStores') {
		url = 'https://crmapi.fnb-tech.com/webapi/' + url
		header.storeId = data.storeId
	} else {
		url = baseurl_v43 + url;
	}
	let storeCode = app.globalData.storeInfo.extraStoreId;
	if (storeCode && url != 'v4_3/weixin/recharge') {
		header.storeCode = storeCode;
	}

	if (data && data.storeCode) { //门店列表时，查询门店等待时间
		header.storeCode = data.storeCode
	}
	let md5Params = Object.assign({}, header);
	header.key = key;
	Object.assign(md5Params, data);
	md5Params = handleSingn(md5Params);


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

function nrequest(header, url, data, isloading) {
	if (isloading) uni.showLoading({
		mask: true
	});
	return new Promise((resolve, reject) => {
		uni.request({
			header: header,
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			async success(e) {
				if (isloading) uni.hideLoading();
				if (e.statusCode === 200) {
					// if (!JSESSIONID) {
					// 	JSESSIONID = e.header["Set-Cookie"].match(/JSESSIONID=(.*)?;/)[1];
					// 	store.commit('jessionid', JSESSIONID);
					// }
					resolve(e.data);
				}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}


function request(header, url, data, isloading) {
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
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			async success(e) {
				if (isloading) uni.hideLoading();
				if (e.statusCode === 200) {
				} else { //错误提示
				}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}
