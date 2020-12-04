const QQMapWX = require('../map/qqmap-wx-jssdk.js');

const qqmapsdk = new QQMapWX({
	key: 'R3EBZ-36FCW-VGJRJ-RPKXD-R6HM6-OGFXQ'
});

import {
	showModal,
	showToast
} from '../utils/utils.js';

export const getLocation = () => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'gcj02',
			success(res) {
				resolve(res)
				let data = {
					latitude: res.latitude,
					longitude: res.longitude,
				}
				uni.setStorageSync('location', data);
			},
			fail(res) {
				if (res.errMsg == "getLocation:fail system permission denied") { //系统定位未开启
					return showToast('请打开手机设置中的定位服务,开启后重新打开小程序');
				} else if (res.errMsg == "getLocation:fail authorize no response") { //微信定位服务未开启
					openSet(); //打开微信授权
				}
			}
		})
	})
}

//计算经纬度距离

export const etdistance = (lat1, lng1, lat2, lng2) => {
	var that = this
	var radLat1 = that.toRad(lat1);
	var radLat2 = that.toRad(lat2);
	var a = radLat1 - radLat2;
	var b = that.toRad(lng1) - that.toRad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(
		b / 2), 2)));
	s = s * 6378.137 * 1000;
	// EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000;
	s = conversion(s);
	return s
}
//单位换算   距离
export const conversion = distance => {
	if (distance >= 1000) {
		distance = (distance / 1000).toFixed(1) + "km"
	} else {
		distance = distance.toFixed() + "m"
	}
	return distance;
}

function openSet() {
	var that = this
	uni.getSetting({
		success(res) {
			showModal((json) => {
				if (json == 1) {
					uni.openSetting({ //打开微信设置授权
						success(re) {
							console.log('打开设置', re)
						}
					})
				} else { //拒绝前往选择城市页面
					uni.navigateTo({
						url: 'pages/chosecity/chosecity'
					})
				}
			}, '如需使用小茶僮点餐，请开启微信小程序的定位授权。', '地理位置未授权', true);
		}

	})
}

export function juideFailObtain() {
	showModal((json) => {
		//前往选择城市
		uni.navigateTo({
			url: 'pages/chosecity/chosecity'
		})
	}, '没有获取到定位信息，请手动选择门店', '温馨提示', false);
}

export const getCityAddress = (lat, lon) => {
	return new Promise((resolve, reject) => {
		qqmapsdk.reverseGeocoder({
			location: {
				latitude: lat,
				longitude: lon
			},
			success: function(data) {
				if (data.status == 0) {
					resolve(data)
				} else {
					juideFailObtain();
				}
			},
			fail: function(data) {
				console.log("获取失败", data)
				juideFailObtain();
			}
		});
	})
}
