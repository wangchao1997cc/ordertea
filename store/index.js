import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import control from './modules/control.js'
import getters from "./getters";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    user,
	control,
},
  getters
})