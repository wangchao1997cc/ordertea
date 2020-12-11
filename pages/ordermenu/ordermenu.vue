<template>
	<view class="classify">
		<view class="header">
			<view class="address-info">
				<text @click="jumpaddress">{{headerInfo}}\n</text>
				<text @click="switchStore">{{headerinfo_t}}</text>
			</view>
			<view class="store-control">
				<switchC></switchC>
				<text @click="checkDetail">{{showdetail?'更多门店信息':'收起'}}</text>
			</view>
		</view>
		<view class="menu-cont" v-if="showdetail">
			<!-- 左侧导航栏 -->
			<scroll-view scroll-y class="left-aside">
				<view v-for="(item, index) in products" :key="index" class="f-item b-b" :class="{active: item.uid === currentId}"
				 @click="tabtap(item)">
					{{item.name}}
				</view>
			</scroll-view>
			<!-- 右侧饮品列表栏 -->
			<scroll-view scroll-with-animation @scroll-into-view="currentId" scroll-y class="right-aside" @scroll="asideScroll"
			 :scroll-top="tabScrollTop" :style="{height:shopBoxHeight + 'rpx'}" binddragend="touchEnd">
				<!-- 活动banner -->
				<swiper class="header_banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item v-for="(item,index) in products.topBannerList" :key="index">
						<view class="swiper-item">
							<image :src="item"></image>
						</view>
					</swiper-item>
				</swiper>
				<!-- 对应产品列表 -->
				<view v-for="(item, index) in products" :key="index" class="s-list" :id="'main-'+item.uid">
					<view class="class_tit">
						{{item.name}}
					</view>
					<view class="t-list">
						<block v-for="(titem,idx) in item.products" :key="idx">
							<view class="t-item" @click="openOrderMask(titem)">
								<view class="good-pic">
									<image :src="titem.logo?titem.logo:'../../static/menu/logo.png'"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">
										{{titem.name}}
									</view>
									<view class="goods-desc">
										{{titem.desc}}
									</view>
									<view class="goods-footer">
										<view class="goods-price">
											<text>¥{{titem.price}}</text>
										</view>
										<view class="btn-r">
											<view class="juide-text" v-if="titem.isInServiceTime || titem.isSoldOut">
												{{!titem.isInServiceTime?'餐品不在供应时间':(titem.isSoldOut?'商品已售罄':'')}}
											</view>

											<view v-if="titem.type == 1 && !titem.isRequirement" class="goods-single">
												<image v-if="titem.num" src="../../static/sub.png"></image>
												<view class="num">
													{{titem.num?titem.num:''}}
												</view>
												<image src="../../static/add.png"></image>
											</view>
											<view v-else class="meal">
												<text>{{titem.isRequirement?'选规格':'选套餐'}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class="blank">
				</view>
			</scroll-view>
		</view>
		<view class="order-masker" v-if="allmask">
			<view class="order-info" :style="{height: popHeight+'px'}" :animation="animationData" :class="{translate:popHeight}">
				<!-- 高的弹窗 -->
				<view class="order_info_box">
					<view class="goods-pic">
						<view class="close-mask" @click="closePopup">
							<image src="../../static/cha.png"></image>
						</view>
						banner 图
					</view>
					<scroll-view scroll-y class="tea_attr">
						<view class="order-desc">
							<text>好喝的奶茶\n</text>
							<text>这里是好喝的奶茶的发烧发烧发烧发烧发哇</text>
						</view>
						<view class="arrt-cont">
							<view class="arrt-item" v-for="(item,index) in specarr" :key="index">
								<view class="arrt_name">
									{{item.title}}
								</view>
								<view class="arrt_Iitem-cont">
									<view class="arrt_Iitem" :class="{choose_item:aitem.selected || currtabarr[index][0]==idx}" v-for="(aitem,idx) in item.items" :key="idx" @click="chooseAttr(index,idx)">
										{{aitem.name}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>

					<view class="order-footer">
						<view class="num-control">
							<view class="price">
								¥99
							</view>
							<view class="goods-single">
								<image src="../../static/sub.png"></image>
								<view class="num">
									{{titem.num?titem.num:'1'}}
								</view>
								<image src="../../static/add.png"></image>
							</view>
						</view>
						<view class="confirm-btn">
							加入购物车
						</view>
					</view>
				</view>
			</view>
		</view>
		<storeDetail :shopinfo="storeInfo" :shopBoxHeight="shopBoxHeight" :showdetail="showdetail"></storeDetail>
		<choseStore :nearList="nearList" @switchStore="switchStore" ref="chosestore"></choseStore>
		<loadpage :loadingState="loadingState"></loadpage>
	</view>
</template>

<script>
	const app = getApp();
	let newload = false; //页面第一次加载
	import choseStore from '../../components/choseStore.vue' //选择店铺
	import loadpage from '../../components/loadingpage.vue' //loading
	import switchC from '../../components/switch.vue' //自定义switch
	import storeDetail from '../../components/storedetail.vue' //店铺的其他信息展示
	import {
		ajaxUserLogin
	} from '../../utils/publicApi.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	import {
		getLocation,
		getCityAddress,
		conversion,
		etdistance
	} from '../../utils/author.js'
	import {
		goChoseCity,
		goChoseStore,
		goUserAddress
	} from '../../utils/goToPage.js'
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				allmask: false,
				// model: 2, //2为自取模式， 1为外卖模式
				shopBoxHeight: null,
				tabScrollTop: 0, //滚动条与顶部的距离
				currentId: 1, //二级分类当前的pid
				location: {}, //地址
				products: [], //商品列表
				nearList: [], //附近门店信息
				loadingState: false, //展现loading
				storeInfo: {}, //选中的店铺信息
				showdetail: true, //展示店铺更多信息
				useraddress: null, //用户选择的地址信息 
				popHeight: '', //弹出层的高度
				popHeightInfo: { //弹出层的两种高低
				}, //弹出层的高度
				animationData: {},
				specarr: [], //规格属性数据
				currtabarr:[],
			}
		},

		async onLoad(options) {
			// uni.hideTabBar({})
			await ajaxUserLogin(); //先进行登录
			this.init();
		},
		components: {
			choseStore,
			loadpage,
			switchC,
			storeDetail
		},
		computed: {
			...mapState(['openid', 'businessType', 'storeId']),
			headerInfo() {
				let name = '默认店铺';
				if (this.model == 2) {
					this.storeInfo.storeName ? name = this.storeInfo.storeName : '';
				} else {
					name = this.useraddress.receiverAddress + this.useraddress.appendReceiverAddress;
				}
				return name;
			},
			headerinfo_t() {
				let name = '正在选择店铺中...';
				let storeInfo = this.storeInfo;
				if (this.model == 2) {
					let location = this.location;
					if (storeInfo.coordinate) {
						name = '距您' + etdistance(storeInfo.coordinate[1], storeInfo.coordinate[0], location.latitude, location.longitude);
					}
				} else {
					this.$children[0].currtab = 1;
					name = `由${storeInfo.storeName}店配送`
				}
				return name
			},
			model() {
				let name = 2;
				switch (this.businessType[0]) {
					case 1: //外卖模式
						name = 1;
						break;
					case 2:
						name = 2;
						break;
				}
				return name;
			}
		},
		watch: {
			storeInfo(val) {
				if (!this.storeId) {
					app.globalData.storeInfo = val;
				}
			}
		},
		onShow: function onShow() {
			let that = this;
			if (that.storeId) { //如果有storeId则刷新点餐
				that.getStoreMenu(that.storeId);
				that.storeInfo = app.globalData.storeInfo;
				that.$store.commit('copy', '');
			} else if (newload) {
				if (!that.nearList.length) {
					that.goToChoseCity();
				}
			}
			let chooseAddress = uni.getStorageSync('selectAddress');
			if (chooseAddress) { //有地址
				that.useraddress = chooseAddress;
			}
			if (that.products.length && that.products[0].top) {
				setTimeout(() => {
					that.calcSize();
				}, 150)
			}
		},
		methods: {
			init() {
				let that = this;
				newload = true; //第二次从onshow刷新地理位置
				that.getLocation(); //获取地理位置
				that.getCategoryList(); //获取默认的商品列表
				that.computReftHe(); //计算右边商品列表的高度
			},
			//确认选择的店铺
			switchStore(store) {
				this.storeInfo = store;
				this.getStoreMenu(store.storeId);
			},
			//点击商品打开幕布
			openOrderMask(goods) {
				let that = this;
				console.log(goods.isInServiceTime, goods.isSoldOut)
				// if(goods.isInServiceTime || goods.isSoldOut){   //售罄和不在售时间内
				// 	return;
				// }
				let popHeightInfo = that.popHeightInfo;
				that.handleData(goods.property);
				console.log(goods)
				// console.log(goods.propertys)
				// console.log(goods.items)	
				if (goods.type == 1 && !goods.isRequirement) {
					that.openAnimation(popHeightInfo.low);
				} else {
					that.openAnimation(popHeightInfo.hei);
				}
			},
			//选择规格
			chooseAttr(index,idx){
				
				let specarr = this.specarr
				console.log(this.specarr[index].items[idx])
				if(index != specarr.length-1){
					this.currtabarr[index].splice(0,1,idx);
				}else{
					this.specarr[index].items[idx].selected = !this.specarr[index].items[idx].selected;
				}
			},
			//处理规格属性
			handleData(data) {
				let specarr = [];
				let currtabarr = [];
				specarr.push(data.standard);
				for (let i in data.propertys) {
					specarr.push(data.propertys[i]);
				}
				for(let i=0; i<specarr.length; i++){
					currtabarr.push([0]);
				}
				console.log(currtabarr)
				this.currtabarr = currtabarr;
				data.choices.items.forEach(item => {
					this.$set(item, 'selected', false);
					// item.selected = false;
				})
				specarr.push(data.choices)
				// this.choices = data.choices;
				// specarr.push(data.choices);
				// specarr.forEach((item,index) => {
				// 	item.items.forEach((aitem,idx) => {
				// 		if(idx==0 && index!=3){
				// 			aitem.selected = true
				// 		}else{
				// 			aitem.selected = false
				// 		}
				// 	})
				// })console.log(currtabarr)
				console.log(specarr)
				this.specarr = specarr;
			},
			//展现动画
			openAnimation(height) {
				this.allmask = true;
				uni.hideTabBar({});
				this.popHeight = height;
				let animation = this.animation;
				this.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					this.animationData = animation.export();
				})
			},
			//关闭底部的弹窗
			closePopup() {
				uni.showTabBar({})
				let animation = this.animation;
				animation.translateY(this.popHeight).step()
				this.animationData = animation.export();
				this.allmask = false;
			},
			async getStoreMenu(storeId) {
				this.loadingState = false;
				let that = this;
				let data = {
					storeId: storeId,
					sendType: that.model,
				}
				let res = await api.getProductMenu(data);
				if (res && res.status == 1) {
					this.handleShopData(res.data.bigs);
				}
			},
			//计算左边商品分类的高度
			computReftHe() {
				const sysinfo = uni.getSystemInfoSync();
				let windowHeight = sysinfo.windowHeight;
				this.popHeightInfo = {
					hei: windowHeight * 1,
					low: windowHeight * 0.7,
				};
				this.shopBoxHeight = windowHeight * (750 / sysinfo.windowWidth) - 200;
				let animation = uni.createAnimation({ //定义动画
					duration: 300,
					timingFunction: 'linear',
					delay: 0
				})
				this.animation = animation;
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
					// that.getCityId(res.result.ad_info.city); //获取城市id
					// that.setCacheData(res.result.address_component.city); //服务器存储
				}
			},
			// 获取当前附近的门店
			async getNearShopList(cityid) {
				let that = this;
				let location = that.location;
				let data = {
					// coordinate: [location.longitude,location.latitude],
					coordinate: [121.480555, 31.271416],
					businessType: that.businessType,
					pageNow: 0,
					pageSize: 10
				}
				let res = await api.getNearStoreList(data);
				if (res && res.status == 1) {
					let nearList = res.data.rows;
					nearList.forEach(item => {
						item.newdistance = conversion(item.distance) //换算距离
					})
					if (nearList.length > 1) { //如果附近多个店铺则展示选择店铺弹窗
						that.$refs.chosestore.showChoseprop();
					} else if (nearList.length == 1) { //只有一个则展现这个店铺
						that.storeInfo = nearList[0];
						that.getStoreMenu(nearList[0].storeId);
					} else { //没有
						that.goToChoseCity(); //前往选择省份
					}
					that.nearList = nearList;
				} else {
					that.goToChoseCity(); //前往选择省份
				}
			},
			goToChoseCity() {
				this.$msg.showModal(res => {
					goChoseCity(); //前往选择省份
				}, '您的附近没有小茶僮噢～，去其他地方看看吧', '温馨提示', false)
			},
			//位置选择
			jumpaddress() {
				let model = this.model;
				let storeInfo = this.storeInfo;
				if (model == 2) { //自取的情况下
					goChoseStore({
						cityId: storeInfo.cityId,
						cityName: storeInfo.cityName,
						districtId: storeInfo.districtId,
						districtName: storeInfo.districtName,
					})
				} else {
					goUserAddress('select');
				}
			},
			//服务端设置缓存
			// async setCacheData(cityName) {
			// 	let data = {
			// 		cityName: cityName,
			// 		openId: this.openid,
			// 	}
			// 	let res = await api.setCache(data);
			// 	if (res && res.status) {

			// 	}
			// },
			//获取城市id
			// async getCityId(cityname) {
			// 	let data = {
			// 		name: cityname
			// 	}
			// 	let res = await api.getCityId(data, false);
			// 	if (res.status == 1) {
			// 		let data = {
			// 			cityid: res.data
			// 		}
			// 		this.$store.dispatch('changeFun', data);
			// 	}
			// },
			//处理获取到的商铺菜单
			handleShopData(data) {
				let that = this;
				that.products = data;
				that.currentId = data[0].uid;
				that.loadingState = true;
				setTimeout(() => { //页面绘图  延迟加载
					that.calcSize();
				}, 150)
			},
			//获取默认商品数据
			async getCategoryList() {
				let data = {
					brandId: app.globalData.brandIdc,
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
			},

			//右侧栏滚动
			asideScroll(e) {
				let that = this;
				let scrollTop = e.detail.scrollTop;
				let tabs = that.products.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					if (that.currentId != tabs[0].uid) {
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
						item.top = h + 140;
						h += data.height;
					}).exec();
				})
			},
			//查看店铺详细信息
			checkDetail() {
				this.showdetail = !this.showdetail;
			},
			//当外卖模式下切换店铺
			switchStore() {
				if (this.model == 1) {}
			}
		}
	}
</script>

<style lang='scss'>
	.classify {
		width: $screen-width;
		background-color: #fff;
		color: $uni-text-color;

	}

	/* 加减控件 */
	.goods-single {
		height: 44upx;
		line-height: 44upx;
		display: flex;

		image {
			@include rect(44upx, 44upx);
		}

		.num {
			width: 60upx;
			text-align: center;
		}
	}

	.order-masker {
		@extend %all-mask;

		.order-info {
			position: absolute;
			width: 100%;
			bottom: 0;
			transform: translateY(100%);
			background-color: #F5F5F5;
			border-top-right-radius: 20upx;
			border-top-left-radius: 20upx;
		}

		/* .translate{
			transform: translateY(100%);
		} */
		.order_info_box {
			@include rect(100%, 100%);
			padding: 28upx;
			box-sizing: border-box;
			position: relative;

			.goods-pic {
				@include rect(100%, 400upx);
				border: 1upx $main-color solid;
				position: relative;

				.close-mask {
					position: absolute;
					right: 0;
					top: 0;
					@include rect(90upx, 90upx);

					image {
						@include rect(50upx, 50upx);
						margin: 20upx;
					}
				}
			}

			.tea_attr {
				width: 100%;
				max-height: 525upx;
				margin: 25upx auto;
				border-radius: 20upx;
				overflow: hidden;

				.arrt-cont {
					padding: 25upx 40upx;
					box-sizing: border-box;
					background-color: $bg-white;
					border-radius: 20upx;

					.arrt-item {
						/* height: 60upx; */
						/* 		@extend %flex-alcent; */
						line-height: 50upx;
						display: flex;
						margin-bottom: 30upx;

						.arrt_name{
							width: 125upx;
							font-size: 30upx;
						}
						.arrt_Iitem-cont {
							/* margin-left: 40upx; */
							width: 510upx;
							@extend %flex-list;

							.arrt_Iitem {

								font-size: 26upx;
								@include rect(150upx, 50upx);
								text-align: center;
								background-color: #F5F5F5;
								color: #D6D6D6;
								border-radius: 50upx;
								margin-right: 20upx;
								margin-bottom: 15upx;
								box-sizing: border-box;

								&.choose_item {
									border: 1upx $main-color solid;
									background-color: $bg-white;
									color: $main-color;
								}

								&:nth-of-type(3) {
									margin-right: 0upx;
								}
							}
						}
					}
				}
			}

			.order-desc {
				width: 100%;
				padding: 20upx 30upx;
				box-sizing: border-box;
				@include lineAny(2);
				background-color: $bg-white;
				border-radius: 20upx;
				margin-bottom: 25upx;

				text {
					&:last-child {
						font-size: $font-sm;
						color: $text-grey;
					}
				}
			}

			.order-footer {
				width: 694upx;
				position: absolute;
				bottom: 50upx;
				left: 28upx;

				.num-control {
					@include rect(100%, 100upx);
					background-color: $bg-white;
					border-radius: 20upx;
					@extend %flex-alcent;
					justify-content: space-between;
					@include box-padding(30upx);
					line-height: 100upx;
				}

				.confirm-btn {
					@include rect(100%, 100upx);
					background-color: $main-color;
					color: $bg-white;
					@include text-allcenter(100upx);
					margin-top: 25upx;
					border-radius: 20upx;
				}
			}
		}
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

	.header {
		@include rect(100%, 200upx);
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		box-sizing: border-box;
	}

	.left-aside {
		width: 180upx;
		background-color: #fff;
		border-right: 1upx #D4D4D4 solid;
	}

	.menu-cont {
		display: flex;
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
			background-color: $main-color;
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
		@include box-padding(20upx);

		.blank {
			width: 100%;
			height: 200upx;
		}

		.header_banner {
			width: 100%;
			height: 280upx;
			border: 1upx $main-color solid;
			box-sizing: border-box;

			image {
				@include rect(100%, 100%);
			}
		}

		.class_tit {
			font-size: 24upx;
			margin: 15upx 0;
			color: $uni-text-color-grey;
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
		width: 100%;
		height: 200upx;
		box-sizing: border-box;
		display: flex;
		font-size: 26upx;
		/* color: #666; */
		margin: 22upx auto;

		.good-pic {
			@include rect(200upx, 200upx);

			image {
				@include rect(100%, 100%);
			}
		}

		.goods-info {
			height: 100%;
			margin-left: 20upx;
			width: 306upx;

			.goods-name {
				width: 100%;
				font-size: 32upx;
				@include lineOnly();
			}

			.goods-desc {
				width: 100%;
				margin: 20upx 0;
				height: 70upx;
				@include lineAny(2);
				font-size: $font-sm;
				color: $text-grey;
			}

			.goods-footer {
				width: 100%;
				@extend %flex-alcent;
				justify-content: space-between;
				height: 44upx;
				line-height: 44upx;

				.goods-price {
					font-size: 32upx;
					font-weight: 700;
					color: red;
				}

				.btn-r {
					.juide-text {
						color: #666666;
						font-size: $font-sm;
					}



					.meal {
						height: 44upx;
						background-color: $main-color;
						color: $bg-white;
						border-radius: 22upx;
						font-size: $font-sm;
						@include box-padding(20upx);
					}
				}
			}
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
