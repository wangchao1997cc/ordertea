import Vue from 'vue';
import App from './App';
import store from './store/store.js';
import {
	showToast,showModal
} from './utils/utils.js';

// var brandId = 8100;//正式
// var brandIdc = 26001227  //正式
// var menuId = '1041';
const global = {   
	brandId: 456,
	menuId: 1804,
	brandIdc: 383
}

Vue.prototype.$global = global;
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$msg = {showToast,showModal};

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
