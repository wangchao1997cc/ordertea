
const state = {
	businessType: 2,  //1外卖模式 2自取模式
};

const mutations = {
	SET_BUSINESSTYPE: (state, businessType) => {
		state.businessType = businessType;
	},
};
// const actions = {
// 	login({
// 		commit
// 	}) {
// 		return new Promise((resolve, reject) => {
// 			getUserOpenInfo()
// 				.then(res => {
// 					commit("SET_OPENIDINFO", res.Message);
// 					resolve(res);
// 				})
// 				.catch((error) => {
// 					reject(error);
// 				});
// 		});
// 	},
// 	getSystemInfo({
// 		commit
// 	}) {
// 		uni.getSystemInfo({
// 			success: res => {
// 				commit("SET_SYSTEMINFO", res)
// 			}
// 		})
// 	}
// };

export default {
	namespaced: true,
	state,
	mutations,
	// actions,
};
