
//vuex  状态管理
import Vue from 'vue'
import Vuex from 'vuex'    

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		cityid:'',
		JSESSIONID:'',
		openid:'',
		session_key:'',
		businessType: [2],
		storeId:'',
		isLogin:null,
		productPrimaryTypeName:'',  //二级菜单名
		
    },
    mutations: {
		adverStatus(state,cont){
			state.productPrimaryTypeName = cont;
			console.log(state)
		},
        copy(state,cont){
            //单一的改变某一个变量
            state.storeId = cont;
        },
		//改变登录状态
		changeLogin(state,cont){
			state.isLogin = cont;
		},
		changebussiness(state,cont){
			state.businessType = cont;
		},
        change(state,contObj){
            //通过传入的变量去改变对应的全局变量
           Object.assign(state,contObj)
        },
    },
    actions:{
        copeFun:function(context,mData){
            context.commit('copy',mData)
        },
        changeFun:function(context,obj){
            context.commit('change',obj)
        }
    }
})

export default store