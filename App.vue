<script>
	// import {ajaxUserLogin} from './utils/publicApi.js'
	export default {
		globalData: {
			remark: '', //订单的备注信息
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
			storeInfo: {}, //当前的店铺信息
			orderinfo: {}, //当前结算的订单信息
			productPrimaryTypeName: null, //广告的一级菜单名
			businessinfo: null, //积分商品信息
			forhere: null, //堂食
			activeParams: null, //推荐人参数
			orderSuccess: false, //下单成功清除购物车
			orderRefresh: false, //下单后订单列表刷新
			exchangeSuccess: false, //兑换成功
			member: true, //是否启用会员部分
		},
		onLaunch: async function() {
			updateApp();
			//测试环境配置

		},
		onShow: function() {},
		onHide: function() {}
	}

	function updateApp() {
		// 获取小程序更新机制兼容
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
						})
					})
				}
			})
		} else {
			//微信版本过低 提示用户升级微信
			uni.showModal({
				title: '提示',
				content: '当前版本过低，无法使用该功能，请升级到最新版本后重试。'
			})
		}
	}
</script>


<style>
	/*每个页面公共css */
	page {
		background: #F8F7FA;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
</style>
