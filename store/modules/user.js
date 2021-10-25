import {
	getUserOpenInfo
} from '../../utils/publicApi.js'

const state = {
	memberinfo: {   //会员信息
	},
	openidinfo: {  //openid seekey 登录信息
	},
	configure: {  //小程序配置信息
	},
};

const mutations = {
	SET_OPENIDINFO: (state, openidinfo) => {
		state.openidinfo = openidinfo;
	},
	SET_MEMBERINFO: (state, memberinfo) => {
		state.memberinfo = memberinfo;
	},
	SET_CONFIGURE: (state, configure) => {
		state.configure = configure;
	}
};
const actions = {
	login({
		commit
	}) {
		return new Promise((resolve, reject) => {
			getUserOpenInfo()
				.then(res => {
					commit("SET_OPENIDINFO", res.Message);
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	getSystemInfo({
		commit
	}) {
		uni.getSystemInfo({
			success: res => {
				commit("SET_SYSTEMINFO", res)
			}
		})
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
