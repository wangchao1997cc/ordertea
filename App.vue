<script>
	// import {ajaxUserLogin} from './utils/publicApi.js'
	export default {
		globalData: {
			remark:'',   //订单的备注信息
			brandId: 456,
			menuId: 1804,
			brandIdc: 383,
			clientId: '32e58123cb58fe0bc7ed15933b4537f4fa0d07',
			storeInfo: {},   //当前的店铺信息
			orderinfo: {},   //当前结算的订单信息
			productPrimaryTypeName:null,   //广告的一级菜单名
			businessinfo:null,  //积分商品信息
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


<style >
	/*每个页面公共css */
	page {
		background: #F8F8FA;
	}
	.el-table td,
	.el-table th.is-leaf {
	
	  border-bottom: 1px solid #EBEEF5;
	  border-right: 1px solid #EBEEF5;
	}
	
	.el-table {
	  border-left: 1px solid #EBEEF5;
	  border-top: 1px solid #EBEEF5;
	}
</style>
