import Vue from 'vue';
import App from './App';
import store from './store/index.js';
import {
	showToast,showModal
} from './utils/utils.js';

Vue.prototype.$store = store;
Vue.prototype.$msg = {showToast,showModal};

Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
