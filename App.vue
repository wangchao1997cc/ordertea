<script>
	// import {ajaxUserLogin} from './utils/publicApi.js'
	export default {
		globalData: {
			remark:'',   //订单的备注信息
			//测试环境配置
			// brandId: 456,
			// menuId: 1804,
			// brandIdc: 383,
			// clientId: '32e58123cb58fe0bc7ed15933b4537f4fa0d07',
			//正式环境配置
			brandId: 7622,
			menuId: 1804,
			brandIdc: 26000607,
			clientId: 'f613e4e8c9fccdbf0c877d870f4ca157b24af1',
			storeInfo: {},   //当前的店铺信息
			orderinfo: {},   //当前结算的订单信息
			productPrimaryTypeName:null,   //广告的一级菜单名
			businessinfo:null,  //积分商品信息
			forhere:null,  //堂食
			activeParams:null,   //推荐人参数
			orderSuccess:false,   //下单成功清除购物车
			orderRefresh:false,   //下单后订单列表刷新
			exchangeSuccess:false, //兑换成功
			member:true,   //是否启用会员部分
		},
		onLaunch: async function() {},
		//测试环境配置
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>


<style >
	/*每个页面公共css */
	page {
		background: #F8F7FA;
	}
</style>
