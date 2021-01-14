import store from '../store/store.js';
export const jumpAdvertise = item => {
	switch (item.jumpType) {
		case 1:
			uni.navigateTo({
				url: '../../pages/webview/webview.vue?url=' + item.jumpUrl
			})
			break;
		case 2:
			console.log(item.productPrimaryTypeName)
			store.commit('adverStatus', item.productPrimaryTypeName)
			uni.switchTab({
				url: '../../pages/ordermenu/ordermenu',
			})
			break;
	}
}

//正则验证手机号码
export const checkMobile = data => {
	let checkphone = /^1\d{10}$/;
	return checkphone.test(data);
	
}

export const appshare = () => {
	let userId = uni.getStorageSync('userinfo').clientId;
	return {
		title: "富必达欢迎您！",
		path: '/pages/menu/menu?id=' + userId,
	}
}
/*
时间倒计时插件
TimeDown.js
*/
export const TimeDown = (endDate) => {
	endDate = new Date(endDate);

	//当前时间
	var nowDate = new Date();
	//相差的总秒数
	var totalSeconds = parseInt((endDate - nowDate) / 1000);
	if (totalSeconds < 0 || totalSeconds == 0) {
		return false;

	}
	//天数
	var days = Math.floor(totalSeconds / (60 * 60 * 24));
	//取模（余数）
	var modulo = totalSeconds % (60 * 60 * 24);
	//小时数
	var hours = Math.floor(modulo / (60 * 60));
	modulo = modulo % (60 * 60);
	//分钟
	var minutes = Math.floor(modulo / 60);
	//秒
	var seconds = modulo % 60;
	let timearr = [days, hours, minutes, seconds];
	return timearr;
}

//获取用户信息
export const getUserInfo = () => {
	let userinfo = uni.getStorageSync('userinfo');
	if (!userinfo) return false;
	return userinfo;
}

/**
 * 弹出提对话框
 */
function showMessage(message, msgType) {
	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000,
		// mask: 'true'
	})

}

// /**
//  * 前往广告页面  判断方式
//  */
// export const goPageAdvert = (banners) => {
// 	let url = banners.h5Url;
// 	switch (banners.bannerType) {
// 		case 1:
// 			uni.navigateTo({
// 				url: "../../pages/webview/webview?url=" + url
// 			})
// 			break;
// 	}

// }

/**
 * 手机号正则判断
 */
function checkPhone(phone) {
	if (!(/^1[3456789]\d{9}$/.test(phone))) {
		return false;
	}
	return true
}

//时间格式转换

function formatDate(now) {
	now = new Date(now);
	var year = now.getFullYear(); //取得4位数的年份
	var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
	var date = now.getDate(); //返回日期月份中的天数（1到31）
	var hour = now.getHours(); //返回日期中的小时数（0到23）
	var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
	var second = now.getSeconds(); //返回日期中的秒数（0到59）
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//加法函数  
export const accAdd = (arg1, arg2) => {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if (c > 0) {
		var cm = Math.pow(10, c);
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	return (arg1 + arg2) / m;
}

//减法函数  
export const subtr = (arg1, arg2) => {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	//last modify by deeka  
	//动态控制精度长度  
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}


//乘法函数  
export const accMul = (arg1, arg2) => {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}



//除法函数  
export const accDiv = (arg1, arg2) => {
	var t1 = 0,
		t2 = 0,
		r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {}
	// with(Math) {
	r1 = Number(arg1.toString().replace(".", ""));
	r2 = Number(arg2.toString().replace(".", ""));
	return (r1 / r2) * pow(10, t2 - t1);
	// }
}



function datasort(arr) {
	let newarr = [];
	for (let i in arr) {
		newarr[0] = arr[1];
		newarr[1] = arr[0];
		newarr[2] = arr[2];
	}
	return newarr;
}
//删除对象属性
const delKey = (obj, arr) => {
	arr.forEach(v => {
		delete obj[v]
	})
	return obj
}

export const showModal = (callback, content, tit, showCancel, cancelText, confirmText) => {
	uni.showModal({
		title: tit || '提示',
		content: content,
		confirmColor: '#A8D732',
		cancelColor: '#A8D732',
		showCancel: showCancel,
		cancelText: cancelText || '取消',
		confirmText: confirmText || '确认',
		success: function(res) {
			if (res.confirm) {
				callback(1)
			} else if (res.cancel) {
				callback(2)
			}
		},
	});
};
/**
 * 弹出提对话框
 */
export const showToast = (message) => {
	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000,
		// mask: 'true'
	})
};

/**
 * 时间转换为XX前
 */
export const clickDateDiff = function(value) {
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(value);
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + '月前';
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + '周前';
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + '天前';
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + '小时前';
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + '分钟前';
	} else {
		result = '刚刚';
	}
	return result;
};
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
