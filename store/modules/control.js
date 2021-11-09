
const state = {
	businessType: 2,  //1堂食 2自取模式 3外卖模式
	storeId:null,  //选择的门店id
	paymentMode:null,
};

const mutations = {
	SET_BUSINESSTYPE: (state, businessType) => {
		state.businessType = businessType;
	},
	SET_STOREID: (state, storeId) => {
		state.storeId = storeId;
	},
	SET_PAYMENTMODE: (state,paymentMode) => {
		state.paymentMode = paymentMode;
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	// actions,
};
