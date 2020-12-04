<template>
	<view class="classify">
		<!--顶部搜索-->
		<!-- <search></search> -->
		<view class="content">
			<!-- 左侧导航栏 -->
			<scroll-view scroll-y class="left-aside">
				<view v-for="(item, index) in products" :key="index" class="f-item b-b" :class="{active: item.uid === currentId}"
				 @click="tabtap(item)">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view scroll-with-animation @scroll-into-view="currentId"  scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop"
			 :style="{height:shopBoxHeight + 'rpx'}" binddragend="touchEnd">
				<!-- 对应产品列表 -->
				<view v-for="(item, index) in products" :key="index" class="s-list" :id="'main-'+item.uid">
					<view class="">
						{{item.name}}
					</view>
					<view class="t-list">
						<block v-for="(titem,idx) in item.products" :key="idx">
							<view class="t-item">
								<image :src="titem.logo"></image>
								<text class="title">{{titem.name}}</text>
								<text class="price">{{titem.price}}</text>
							</view>
						</block>
					</view>
				</view>
				<view class="blank">
				</view>
			</scroll-view>
		</view>
		<choseStore :nearList="nearList" @switchStore="switchStore" ref="chosestore"></choseStore>
		<loadpage :loadingState="loadingState"></loadpage>
	</view>
</template>

<script>
	let newload = false;  //页面第一次加载
	import choseStore from '../../components/choseStore.vue'
	import loadpage from '../../components/loadingpage.vue'
	import {ajaxUserLogin} from '../../utils/publicApi.js'
	import {mapState,mapMutations} from "vuex";
	import {getLocation, getCityAddress, conversion,} from '../../utils/author.js'
	import {goChoseCity} from '../../utils/goToPage.js'
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				shopBoxHeight: null,
				tabScrollTop: 0, //滚动条与顶部的距离
				currentId: 1, //二级分类当前的pid
				location: {}, //地址
				products:[],   //商品列表
				nearList:[],   //附近门店信息
				loadingState: false,  //展现loading
			}
		},

		async onLoad() {
			await ajaxUserLogin();   //先进行登录
			this.init();
		},
		components: {
			choseStore,
			loadpage
		},
		computed: {
			...mapState(['openid', 'bussinessType'])
		},
		onShow: function onShow() {
			if(newload) {
				this.getLocation(); //获取地理位置
			}
			if (this.products.length && this.products[0].top) {
				setTimeout(() => {
					this.calcSize();
				}, 150)
			}
		},
		methods: {
			//确认选择的店铺
			switchStore(storeId) {
				this.getStoreMenu(storeId);
			},
			async getStoreMenu(storeId){
				this.loadingState = false;
				let that = this;
				let data = {
					storeId: storeId,
					sendType: that.bussinessType
				}
				let res = await api.getProductMenu(data);
				if(res && res.status == 1){
					this.handleShopData(res.data.bigs);
				}
			},
			init() {
				let that = this;
				newload = true;  //第二次从onshow刷新地理位置
				that.getLocation(); //获取地理位置
				that.getCategoryList(); //获取默认的商品列表
				that.computReftHe(); //计算右边商品列表的高度
			},
			//计算左边商品分类的高度
			computReftHe() {
				const sysinfo = uni.getSystemInfoSync();
				let windowHeight = sysinfo.windowHeight;
				this.shopBoxHeight = windowHeight * (750 / sysinfo.windowWidth) - 116;
			},
			//获取地理位置
			async getLocation() {
				let that = this;
				let location = await getLocation();
				let lat = location.latitude;
				let log = location.longitude;
				if (location) {
					that.location = location;
					that.getNearShopList(); //获取距离最近的门店
					let res = await getCityAddress(lat, log); //获取地理详细信息
					if (res && res.statu == 1) {
						that.getCityId(res.result.ad_info.city); //获取城市id
						that.setCacheData(res.result.address_component.city);  //服务器存储
					}
				}
			},
			//获取当前附近的门店
			async getNearShopList(cityid) {
				let that = this;
				let location = that.location;
				let data = {
					coordinate: [location.longitude, location.latitude],
					businessType: that.businessType,
				}
				let res = await api.getNearStoreList(data);
				if(res && res.status == 1){
					let nearList = res.data.rows;
					nearList.forEach(item => {
						item.distance = conversion(item.distance) //换算距离
					})
					if(nearList.length > 1){   //如果附近多个店铺则展示选择店铺弹窗
						that.$refs.chosestore.showChoseprop();
						that.nearList = nearList;
					}else if(nearList.length == 1){ //只有一个则展现这个店铺
						that.getStoreMenu(nearList[0].storeId)
					}
				}else{
					goChoseCity();  //前往选择省份
				}
			},

			//服务端设置缓存
			async setCacheData(cityName) {
				let data = {
					cityName: cityName,
					openId: this.openid,
				}
				let res = await api.setCache(data);
				if (res && res.status) {

				}
			},
			//获取城市id
			async getCityId(cityname) {
				let data = {
					name: cityname
				}
				let res = await api.getCityId(data, false);
				// console.log(res)
				if (res.status == 1) {
					let data = {
						cityid: res.data
					}
					this.$store.dispatch('changeFun', data);
					// console.log(this.$store.state)
				}
			},
			//处理获取到的商铺菜单
			handleShopData(data){
				let that = this;
				that.products = data;
				that.currentId = data[0].uid;
				that.loadingState = true;
				setTimeout(() => {   //页面绘图  延迟加载
					that.calcSize();
				}, 150)
			},
			//获取默认商品数据
			async getCategoryList() {
				
				let data = {
					brandId: this.$global.brandIdc,
				};
				let res = await api.getDefaultMeun(data);
				if (res.status == 1) {
					this.handleShopData(res.data.bigs)
				}
			},
			//一级分类点击
			tabtap(item) {
				clearTimeout(this.timer);
				this.currentId = item.uid;
				let index = this.products.findIndex(sitem => sitem.uid === item.uid);
				this.tabScrollTop = this.products[index].top;
				// console.log(this.currentId)
			},

			//右侧栏滚动
			asideScroll(e) {
				let that = this;
				let scrollTop = e.detail.scrollTop;
				let tabs = that.products.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					if(that.currentId != tabs[0].uid){
						that.currentId = tabs[0].uid;
					}
				}
			},
			// 计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.products.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.uid);
					view.fields({
						size: true
					}, data => {
						if (!data) return;
						item.top = h - 30 < 0 ? 0 : h - 15;
						h += data.height;
					}).exec();
				})
			},
		}
	}
</script>

<style lang='scss'>
	.classify {
		width: $screen-width;
		box-sizing: border-box;
		/* 	overflow: hidden; */
		background-color: #fff;
	}

	.input-box {
		/* border: 1px red solid; */
		height: 72upx;
		position: relative;
		display: flex;
		align-items: center;
		margin: 20upx 30upx;

		.iconfont {
			width: 72upx;
			font-size: 48upx;
			font-weight: 500;
		}

		input {
			flex: 1;
			height: 72upx;
			padding-left: 30upx;
			border-radius: 36upx;
			font-size: 28upx;
			border: 1upx solid #888;
		}
	}

	.content {
		display: flex;
	}

	.left-aside {
		width: 180upx;
		background-color: #fff;
		border-right: 1upx #D4D4D4 solid;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		/* &:after{
			content:'';
			position: absolute;
			width: 120upx;
			height: 1upx;
			border-bottom: 1upx #EEEEEE solid;
			bottom: 0upx;
			left: 30upx;
		} */

		&:before {
			content: '';
			position: absolute;
			left: 0;
			transform: scaleY(0);
			height: 36upx;
			width: 8upx;
			background-color: $base-color;
			border-radius: 0 4px 4px 0;
			opacity: .8;
		}

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				transition: all .3s;
				transform: scaleY(1);
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		@include box-padding(30upx);

		.blank {
			width: 100%;
			height: 400upx;
		}
	}

	.t-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
	}

	.t-item {
		width: 240upx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: 26upx;
		color: #666;
		margin-bottom: 22upx;

		image {
			width: 240upx;
			height: 240upx;
			/* margin-bottom: 20upx; */
		}

		.title {
			width: 100%;
			text-align: center;
			font-size: 26upx;
			color: #333333;
			margin: 20upx 0;
			height: 36upx;
			@include lineOnly();
		}

		.price {
			font-size: 28upx;
			color: #333333;
		}
	}
</style>
