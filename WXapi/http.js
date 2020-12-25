//定义环境 请求封装
const base_url_m = 'https://qc.can-dao.com:7776/'; //测试环境
const baseurl_v43 = 'https://api.vi-ni.com/openapi/' //测试环境	
// const baseurl_v43 = 'https://api.v-ka.com/openapi/'    //生产环境
const default_value_f = 'Action?' + 'key=93ba9db2f9f4f0e4'
const default_value_s = 'SecretAction?' + 'key=93ba9db2f9f4f0e4'
import store from '../store/store.js';
const app = getApp();
const key = 'jdhajshdjf871238767o';



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
	header: {
	},
	url: baseurl_v43 + 'v4_3/getCurrentTimeMilli',
}
export async function service_v(url, method, data, isloading) {
	let timestamp = await nrequest(timestmpParams.method, timestmpParams.header, timestmpParams.url, timestmpParams.data);
	const header = {
		// "content-type": method === 'get' ? 'application/x-www-form-urlencoded' : 'application/json',
		"brandId": app.globalData.brandId,
		"clientId": app.globalData.clientId,
		"timestamp":timestamp.data,
	}
	let storeCode = app.globalData.storeInfo.extraStoreId;
	if(storeCode){
		header.storeCode = storeCode;
	}
	let md5Params = Object.assign({},header);
	header.key = key;
	Object.assign(md5Params,data);
	md5Params = handleSingn(md5Params);
	url = baseurl_v43 + url;
	header.sign = md5Params;
	return nrequest(method, header, url, data, isloading)
}
//处理   md5 sign参数
function handleSingn(data){
	let newData = {};
	Object.keys(data).sort().map(key => {
		if(typeof(data[key])=='object'){
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
					resolve(e.data);
					if (!JSESSIONID) {
						JSESSIONID = e.header["Set-Cookie"].match(/JSESSIONID=(.*)?;/)[1];
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
				} else {}
			},
			fail(e) {
				reject(e)
			}
		})
	})
}
