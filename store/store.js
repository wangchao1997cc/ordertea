
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
		bussinessType: 2,
		storeId:'',
    },
    mutations: {
        copy(state,cont){
            //单一的改变某一个变量
            state.storeId = cont;
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