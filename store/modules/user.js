import {
	getUserOpenInfo
} from '../../utils/publicApi.js'
import Vue from 'vue'

const state = {
	memberinfo: null,
	openidinfo: {  //openid seekey 登录信息
	},
	configure: {  //小程序配置信息
	},
	plusinfo: null,
};

const mutations = {
	SET_PLUSINFO : (state, plusinfo) => {
		state.plusinfo = plusinfo;
	},
	SET_OPENIDINFO: (state, openidinfo) => {
		state.openidinfo = openidinfo;
	},
	SET_MEMBERINFO: (state, memberinfo) => {
		Vue.set(state, 'memberinfo', memberinfo)
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
