<script>
	// import {ajaxUserLogin} from './utils/publicApi.js'
	export default {
		globalData: {
			brandId: 456,
			menuId: 1804,
			brandIdc: 383,
			clientId: '32e58123cb58fe0bc7ed15933b4537f4fa0d07',
			storeInfo: {},   //当前的店铺信息
			orderinfo: {},   //当前结算的订单信息
		},
		onLaunch: async function() {},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>


<style>
	/*每个页面公共css */
	page {
		background: #F8F8FA;
	}
</style>
