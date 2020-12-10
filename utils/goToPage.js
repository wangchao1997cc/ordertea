
//前往选择城市
export function goChoseCity(bollean) {
	let url = '../chosecity/chosecity';
	if(bollean){
		uni.redirectTo({
			url:url
		})
	}else{
		uni.navigateTo({
			url: url
		})
	}
}

//前往地址
export function goUserAddress(type) {
	let url = '../address/address?type=' + type;
	uni.navigateTo({
		url: url
	})
}

const ROUTEPARAMS = 'routeparams';

//本地存储路由数据
function setRouteParams(parms) {
	uni.setStorageSync(ROUTEPARAMS,parms)
}

export function getRouteParams(){
	let data = uni.getStorageSync(ROUTEPARAMS);
	uni.removeStorage({   //获取后删除
			key:ROUTEPARAMS
    })
	return data;
}

// export function removeRouteParams(){
// 	uni.removeStorage({
// 		key:ROUTEPARAMS
// 	})
// }

//前往选择门店
export function goChoseStore(parms) {
	setRouteParams(parms)
	uni.navigateTo({
		url: `../storelist/storelist`,
	})
}