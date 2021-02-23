import Vue from 'vue';
import App from './App';
import store from './store/store.js';
import {
	showToast,showModal
} from './utils/utils.js';

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$msg = {showToast,showModal};

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
