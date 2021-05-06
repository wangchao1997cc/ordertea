<template>
	<view class="classify">
		<view class="header-control">
			<view class="address-info">
				<text @click="jumpaddress">{{headerInfo}}\n</text>
				<text @click="switchStoreOwn">{{headerinfo_t}}</text>
			</view>
			<view class="store-control">
				<view class="table-num" v-if="forhere">
					{{forhere.deskId}}号桌
				</view>
				<switchC v-else @switchTab="switchTab"></switchC>
				<view class="check-juide" @click="checkDetail">
					{{showdetail?'更多门店信息':'收起'}}
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>	
		</view>
		<!-- <view class="active_desc" :style="{height:activeHeight}">
			<scroll-view scroll-y="true" :style="{height:activeHeight}">
				<view class="active-item" v-for="(item,index) in activelist" :key="index">
					<view class="active-tit">
						{{item.title}}
					</view>
					<view class="active-desc">
						<view class="left-box" :class="{on:item.type == 4}" v-if="item.type == 5 || item.type == 4">
							{{item.type == 5?'特':'减'}}
						</view>
						<view class="rich_text">
							<rich-text :nodes="item.description"></rich-text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="close-active" @click="closeActivePop">
				<image src="../../static/menu/close_active.png"></image>
			</view>
		</view> -->
		<!-- <view class="header" v-if="showdetail && !activeHeight">
			<view class="make-busy">
				<view class="make-busy-l">
					<image class="active-pic" src="../../static/active_icon.png"></image>
					<swiper :vertical='true' v-if="activelist.length" class="active-s" :autoplay="true" :interval="5000" :duration="1000"
					 :circular="true">
						<swiper-item v-for="(item,index) in activelist" :key="index">
							<view class="active-goods">
								<view>
									{{item.title}}
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>

				<view class="active-r" @click="jumpActiveDesc(item)" >
					<text>全部活动详情</text>
					<image class="drop_down" src="../../static/menu/drop_down.png"></image>
				</view>

			</view>

		</view> -->

		<view class="menu-cont" v-if="showdetail && !activeHeight">
			<!-- 左侧导航栏 -->
			<scroll-view scroll-y class="left-aside" :style="{height:shopBoxHeight + 'rpx'}" :scroll-into-view="leftCurrtab"
			 scroll-with-animation :scroll-top="leftScrollTop">
				<view v-for="(item, index) in products" :key="index" class="f-item" :class="{active: item.uid === currentId}"
				 @click="tabtap(item)" :id="'left'+item.uid">
					<!-- {{'leftm-'+item.uid}} -->
					<!-- <image :src="item.typeImage?item.typeImage:''" mode="aspectFill"></image> -->
					{{item.name}}
				</view>
				<view class="blank-fill">
				</view>
			</scroll-view>

			<!-- 右侧饮品列表栏 -->
			<scroll-view scroll-with-animation @scroll-into-view="currentId" scroll-y class="right-aside" @scroll="asideScroll"
			 :scroll-top="tabScrollTop" :style="{height:shopBoxHeight + 'rpx'}" binddragend="touchEnd">
				<!-- 活动banner -->
				<swiper v-if="bannerList.length" class="header_banner" :indicator-dots="true" :autoplay="true" :circular="true"
				 :interval="3000" :duration="1000">
					<swiper-item v-for="(item,index) in bannerList" :key="index" @click="jumpAdver(item,index)">
						<image :src="item.picUrl" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<!-- 对应产品列表 -->
				<view v-for="(item, index) in products" :key="index" class="s-list" :id="'main-'+item.uid">
					<view class="class_tit">
						{{item.name}}
					</view>
					<view class="t-list">
						<view class="t-item" v-for="(titem,idx) in item.products" :key="idx" @click="openOrderMask(titem,index,idx)">
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
										<text>¥{{titem.activePrice?titem.activePrice:titem.price}}</text>
										<text class="oldprice" v-if="titem.activePrice">¥{{titem.price}}</text>
									</view>
									<view class="btn-r">

										<view class="juide-text" v-if="!titem.isInServiceTime || titem.isSoldOut">
											{{!titem.isInServiceTime?'非供应时间':(titem.isSoldOut?'商品已售罄':'')}}
										</view>
										<view v-else>
											<view @click.stop="prentEvents" v-if="titem.type == 1 && !titem.property">
												<view class="goods-single">
													<image v-if="titem.nums" src="../../static/sub.png" @click="reduceTap(1,titem)"></image>
													<view class="num">
														{{titem.nums?titem.nums:''}}
													</view>
													<image src="../../static/add.png" @click="addTap(1,titem,index,idx)"></image>
												</view>
											</view>
											<view v-else class="meal">
												<text>{{titem.type==2?'选套餐':'选规格'}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="blank">
				</view>
			</scroll-view>
		</view>
		<view class="order-masker" v-if="allmask" @click="closeAllMask">
			<view class="order-info" :animation="animationData" @click.stop="prentEvents">
				<!-- 商品介绍规格参数等 -->
				<view class="order_info_box" :hidden="maskarr.orderDescMask">
					<view class="goods-pic">
						<image :src="chooseGoods.logo?chooseGoods.logo:'../../static/menu/logo.png'"></image>
						<view class="close-mask" @click="closeAllMask">
							<image src="../../static/cha.png"></image>
						</view>
					</view>
					<scroll-view scroll-y class="tea_attr">
						<view class="order-desc">
							<text>{{chooseGoods.name}}\n</text>
							<text>{{chooseGoods.desc}}</text>
						</view>
						<view class="arrt-cont" v-if="chooseGoods.isRequirement">
							<view class="arrt-item" v-for="(item,index) in specarr" :key="index">
								<view class="arrt_name">
									{{item.title}}
								</view>
								<view class="arrt_Iitem-cont">
									<view class="arrt_Iitem" :class="{choose_item:aitem.selected || currtabarr[index] == idx}" v-for="(aitem,idx) in item.items"
									 :key="idx" @click="chooseAttr(index,idx)">
										{{aitem.name}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="order-footer">
						<view class="num-control">
							<view class="price">
								¥{{chooseGoods.activePrice?chooseGoods.activePrice:chooseGoods.price}}
							</view>
							<view class="goods-single">
								<image src="../../static/sub.png" @click="reduceTap(2)"></image>
								<view class="num">
									{{nums}}
								</view>
								<image src="../../static/add.png" @click="addTap(2)"></image>
							</view>
						</view>
						<view class="confirm-btn" @click="addShopCar()">
							加入购物车
						</view>
					</view>
				</view>
				<!-- 活动详情 -->
				<!-- <view class="active-desc" :hidden="maskarr.activeDesc">
					<view class="head-tit">
						{{choseActive.title}}
						<image @click="closeActiveMask" src="../../static/cha.png"></image>
					</view>
					<scroll-view scroll-y="true" class="desc-cont">
						<view class="desc-time">
							<text v-if="timelimit">{{choseActive.startTime + ' 至 ' + choseActive.endTime}}</text>
							<text v-else>长期有效</text>
						</view>
						<view class="desc-cont-o">
							<rich-text :nodes="choseActive.description" v-if="choseActive.description"></rich-text>
							<text v-else>{{choseActive.ruleDetail}}</text>
						</view>
					</scroll-view>
					
				</view> -->
				<!-- 购物车 -->
				<view class="shopcar-cont" :hidden="maskarr.shopCarCont">
					<view class="head_juide">
						<view @click="reductionData">
							<image src="../../static/clear.png"></image>
							<text>
								清空购物车
							</text>
						</view>
						<view class="close-img" @click="closeAllMask">
							<image class="close-icon" src="../../static/cha.png"></image>
						</view>
					</view>
					<scroll-view scroll-y class="scroll-shopcar" :style="{maxHeight:popHeightInfo.low+'px'}">
						<view class="shopcar-item" v-for="(item,index) in shopcar" :key="index">
							<view class="shopcar-item-pic">
								<image :src="item.logo"></image>
							</view>
							<view class="shop-item-cont">
								<view class="item-name">
									{{item.name}}
								</view>
								<view class="item-desc">
									<text>{{item.descinfo?item.descinfo:''}}</text>
								</view>
								<view class="item-price-control">
									<view class="">
										<text>¥ {{item.price}}</text>
									</view>
									<view class="goods-single">
										<image src="../../static/sub.png" @click="reduceTap(3,item)"></image>
										<view class="num">
											{{item.nums}}
										</view>
										<image src="../../static/add.png" @click="addTap(3,item)"></image>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="mealfee">
						餐盒费：¥{{priceArr.lunchboxfee}}
					</view>
					<view class="mealfee" v-if="isfullprice">
						<text>{{isfullprice.ruleDetail}}</text>- ¥{{isfullprice.discount}}
					</view>
					<view class="blank"></view>
				</view>
			</view>
		</view>
		<view class="chopcar-tab" v-if="shopcar.length && maskarr.shopCarShow">
			<view class="tab-l">
				<view class="shop-car-icon" @click="openAnimation(2)">
					<image src="../../static/shopcar_icon.png"></image>
					<view class="nums-juide">
						{{carnums}}
					</view>
				</view>
				<view class="total-price">
					¥{{priceArr.totalPrice}}
				</view>
				<view class="takeout-juide" v-if="model==1">
					<text>配送费：{{storeInfo.fee}}元，满{{storeInfo.reachFee}}元起送\n</text><text v-if="(storeInfo.reachFee-priceArr.totalPrice)>0">还差{{storeInfo.reachFee-priceArr.totalPrice}}元</text>
				</view>
			</view>
			<view class="tab-r" @click="jumpOrder">
				选好了
			</view>
		</view>
		<view class="busy-cont" :class="{busy_open:busyOpen}" @click="busyJuideSwitch" v-if="busyData && busyData.orderCount">
			<view class="busy-l">
				<!-- <sildermine :config="sliderConfig"></sildermine> -->
				<view class="busy-img">
					<image src="../../static/busy_pic.png"></image>
				</view>
				<view class="order-juide">
					<text>{{busyData.orderCount}}单制作中</text>
					<view class="estima">
						预计{{busyData.orderTime}}分钟后完成
					</view>
				</view>
				<!-- <text>前面还有<text>8</text>笔订单，预计还要20分钟</text> -->
			</view>
			<view class="busy-r">
				<image src="../../static/chevron_duo.png"></image>
			</view>
		</view>
		<storeDetail :shopinfo="storeInfo" :shopBoxHeight="shopBoxHeight+105" :showdetail="showdetail"></storeDetail>
		<choseStore :nearList="nearList" @switchStore="switchStore" ref="chosestore"></choseStore>
		<loadpage :loadingState="loadingState"></loadpage>
		<author ref="authorM" @loginSuccess="loginSuccess"></author>
		<view class="nobusiness" v-if="!storeInfo.isServiceTime && !defaultS">
			<text>门店休息中</text>
			<view class="bussiness-time">
				<text v-for="(item,index) in storeInfo.businessTimes" :key="index">营业时间：{{' '+item.beginTime+'-'+item.endTime}}</text>
			</view>
		</view>
		<view class="nobusiness" v-if="storeInfo.isBusy">
			<text>茶饮制作繁忙</text>
			<view class="bussiness-time">
				<text>门店忙碌中，请选择其他门店</text>
				<!-- <text v-for="(item,index) in storeInfo.businessTimes" :key="index">营业时间：{{' '+item.beginTime+'-'+item.endTime}}&nbsp;&nbsp;</text> -->
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser'; //富文本组件
	const app = getApp();
	let newload = false; //页面第一次加载
	import author from '../../components/author.vue'
	import choseStore from '../../components/choseStore.vue' //选择店铺
	import loadpage from '../../components/loadingpage.vue' //loading
	import switchC from '../../components/switch.vue' //自定义switch
	import storeDetail from '../../components/storedetail.vue' //店铺的其他信息展示
	// import sildermine from '../../components/minesilder.vue' //进度条
	import {
		ajaxUserLogin,
		// getBannerList,
		refreshUserInfo,
		waitLineUp
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
	import {
		accMul,
		subtr,
		accAdd,
		jumpAdvertise,
		appshare
	} from '../../utils/utils.js';
	//排序函数
	function compare(key) {
		return function(value1, value2) {
			var val1 = value1[key];
			var val2 = value2[key];
			return val2 - val1;
		}
	}
	export default {
		data() {
			return {
				busyData: null, //预计排队时间
				busyOpen: false, //繁忙展开
				leftScrollTop: 0, //左边滑动距离顶部
				leftCurrtab: 'left',
				forhere: null,
				computedHeight: null, //系统高度
				activelist: [], //活动list
				bannerList: [], //轮播图广告
				allmask: false,
				nums: '1', //mask 中的nums
				defaultS: false, //是否为默认餐单
				// model: 2, //2为自取模式， 1为外卖模式
				// shopBoxHeight: null,
				tabScrollTop: 0, //滚动条与顶部的距离
				currentId: 1, //二级分类当前的pid
				location: {}, //地址
				products: [], //商品列表
				nearList: [], //附近门店信息
				loadingState: false, //展现loading
				storeInfo: {}, //选中的店铺信息
				showdetail: true, //展示店铺更多信息
				activeHeight: false, //展开活动信息
				useraddress: null, //用户选择的地址信息 
				popHeight: 'auto', //弹出层的高度
				popHeightInfo: { //弹出层的两种高低
				}, //弹出层的高度
				animationData: {}, //动画
				currtabarr: [], //规格属性隐藏
				chooseGoods: {}, //当前选择的商品
				specarr: [], //规格属性数组
				shopcar: [], //购物车数组
				// totalPrice: 0, //购物车总价格
				maskarr: {
					orderDescMask: true, //点击商品规格信息等弹窗
					shopCarCont: true, //购物车弹窗
					shopCarShow: true, //底部购物车导航弹窗
					activeDesc: true,
				},
				sliderConfig: { //进度条参数
					progresswidth: '320upx',
					progressbar: '50%',
				},
				isfullprice: null, //满减
				menuId: null, //餐单id
				choseActive: null, //当前选则查看的活动
				member: false, //当前门店是否需要会员部分
				timelimit: false, //活动时间限制
			}
		},

		components: {
			choseStore,
			loadpage,
			switchC,
			storeDetail,
			author,
			// sildermine,
			jyfParser
		},
		onShareAppMessage(res) {
			return appshare()
		},
		computed: {
			...mapState(['openid', 'businessType', 'storeId', 'JSESSIONID', 'isLogin', 'productPrimaryTypeName']),
			headerInfo() {
				let name = '请选择下单门店 >';
				if (this.model == 2) {
					this.storeInfo.storeName ? name = this.storeInfo.storeName : '';
				} else if (this.useraddress) {
					name = this.useraddress.receiverAddress + this.useraddress.appendReceiverAddress;
				}
				return name;
			},

			shopBoxHeight() {
				let height = 0;
				let computedHeight = this.computedHeight;
				if (computedHeight) {
					height = computedHeight - 142;
					if (this.activelist.length) {
						height = height - 105;
					}
				}
				return height;
			},
			headerinfo_t() {
				let name = '正在选择店铺中...';
				let storeInfo = this.storeInfo;
				if (this.model == 2) {
					let location = this.location;
					if (this.$children.length) {
						if (this.$children[0].currtab != 0) {
							this.$children[0].currtab = 0;
						}
					}
					if (storeInfo.coordinate) {
						name = '距您' + etdistance(storeInfo.coordinate[1], storeInfo.coordinate[0], location.latitude, location.longitude);
					}
				} else {
					if (this.$children.length) {
						this.$children[0].currtab = 1;
						name = `由${storeInfo.storeName}店配送`
					}
				}
				return name
			},
			//外卖还是自取
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
			},
			carnums() {
				let shopcar = this.shopcar;
				let nums = 0;
				if (shopcar.length) {
					shopcar.forEach(item => {
						nums += item.nums
					})
				}
				return nums;
			},
			//商品总价格
			priceArr() {
				let totalPrice = 0; //总价格
				let lunchboxfee = 0; //餐盒费
				let shopcar = this.shopcar;
				let specoffer = []; //特价商品变量
				if (shopcar.length) {
					shopcar.forEach(item => {
						let singleprice = accMul(item.price, item.nums)
						totalPrice = accAdd(totalPrice, singleprice);
						if (item.discounted == 1) {
							specoffer.push(item.price);
						}
						if (item.mealFee) {
							let mealFee = accMul(item.mealFee, item.nums);
							lunchboxfee = accAdd(lunchboxfee, mealFee);
						}
					})
					totalPrice = accAdd(totalPrice, lunchboxfee);
				}
				let activelist = this.activelist;
				let isfullprice = null;
				if (activelist) {
					let fullarr = [];
					activelist.forEach(item => {
						if (item.type == 3) { //满减
							let notSpecPrice = totalPrice;
							if (specoffer.length) {
								specoffer.forEach(item => { //去除特价商品
									notSpecPrice = subtr(notSpecPrice, item)
								})
							}
							let moneyOff = item.moneyOff.sort(compare('moneyCondition'));
							for (let i in moneyOff) {
								if (notSpecPrice > moneyOff[i].moneyCondition) {
									isfullprice = moneyOff[i];
									totalPrice = subtr(totalPrice, moneyOff[i].discount);
									break;
								}
							}
						}
					})
				}
				this.isfullprice = isfullprice;
				return {
					totalPrice: totalPrice,
					lunchboxfee: lunchboxfee,
				};
			},
			//包装费价格
		},
		watch:{
			storeInfo(val){
				if(!this.storeId) {
					app.globalData.storeInfo = val;
				}
			}
		},
		async onLoad(options) {
			if (!this.JSESSIONID) {
				uni.hideTabBar({});
				await ajaxUserLogin(); //先进行登录
			}
			if (options && options.deskId) {
				this.forhere = options;
				app.globalData.forhere = options;
				this.$store.commit('changebussiness', [3])
			}
			// this.juideOptions(options); //判断路径参数
			uni.showTabBar({})
			this.member = app.globalData.member;
			this.init();
		},

		onShow: function onShow() {
			let that = this;
			if (that.storeId) { //如果有storeId 并且不是同一家店铺则刷新点餐
				if (that.storeInfo && that.storeInfo.storeId == that.storeId) {
					this.getStore(this.storeInfo.storeId)
				} else {
					if (that.shopcar.length) {
						this.reductionData();
					}
					if (this.$children[2].hiddenChoseStore) { //选择其他门店   关闭附近门店选择弹窗
						this.$children[2].hiddenChoseStore = false;
					}
					// that.shopcar = []; //清空购物车
					that.storeInfo = app.globalData.storeInfo;
					that.getStoreMenu(that.storeId);
				}
				that.$store.commit('copy', '');
			} else if (newload && !that.storeInfo.storeId) {
				if (!that.nearList.length) {
					that.goToChoseCity();
				}
			} else if (this.storeInfo) { //页面刷新  店铺
				this.getStore(this.storeInfo.storeId)
			}
			if (app.globalData.orderSuccess) { //下单成功
				this.reductionData();
				// that.shopcar = []; //清空购物车
				app.globalData.orderSuccess = false;
			}
			let chooseAddress = uni.getStorageSync('selectAddress');
			if (chooseAddress) { //有地址
				that.useraddress = chooseAddress;
			}
			if (that.products.length && that.products[0].top) {
				that.$nextTick(async () => { //解决DOM更新异步问题
					await that.calcSize();
					if (that.productPrimaryTypeName) {
						that.jumpProduct();
					}
				})
			}
		},
		methods: {
			// juideOptions(options) { //判断路径参数
			// 	if (app.globalData.productPrimaryTypeName) {
			// 		this.productPrimaryTypeName = app.globalData.productPrimaryTypeName;
			// 	}
			// },
			//商铺是否繁忙开关
			busyJuideSwitch() {
				this.busyOpen = !this.busyOpen
			},
			noBussinessTime() {
				let storeInfo = this.storeInfo;
				this.$msg.showModal((res) => {
					if (res == 1) {
						if (this.model == 1) {
							return this.switchStoreOwn();
						}
						goChoseStore({
							cityId: storeInfo.cityId,
							cityName: storeInfo.cityName,
							districtId: storeInfo.districtId,
							districtName: storeInfo.districtName,
						})
					}
				}, '本门店休息中，您可切换门店', '门店休息中...', true, false, '切换门店')
			},
			init() {
				let that = this;
				that.juideUserInfo(); //判断用户是否登录
				that.computReftHe(); //计算右边商品列表的高度
				// that.getBannerList(); //获取轮播图广告
				that.getLocation(); //获取地理位置
			},
			//授权成功关闭弹窗
			async loginSuccess() {
				this.$refs.authorM.hidePop();
				let memberinfo = await getMemberInfo(true);
				this.memberinfo = memberinfo;
			},
			//查看当前活动
			jumpActiveDesc(item) {
				this.activeHeight = this.shopBoxHeight + 105 + 'rpx';
				// this.choseActive = item;
				// if (item.endTime.slice(0, 4) > 2099) {
				// 	this.timelimit = false;
				// } else {
				// 	this.timelimit = true;
				// }
				// this.maskarr.activeDesc = false;
				// this.openAnimation();
			},
			//关闭活动详情弹窗
			closeActivePop() {
				this.activeHeight = 0;
			},
			//还原数据
			reductionData() {
				let shopcar = this.shopcar;
				for (let i in shopcar) {
					this.products[shopcar[i].indexarr.index].products[shopcar[i].indexarr.idx].nums = 0; //同步餐单上的商品数据
				}
				this.shopcar = [];
				this.closeAllMask();
			},
			//获取当前门店信息
			async getStore(storeId) {
				let that = this;
				location = that.location;
				let data = {
					storeId: storeId,
					businessType: that.$store.state.businessType[0],
					coordinate: [location.longitude, location.latitude],
				}
				let res = await api.getStore(data);
				if (res.status == 1) {
					let storeInfo = res.data;
					storeInfo.newdistance = conversion(storeInfo.distance) //换算距离
					that.storeInfo = storeInfo;
					if (app.globalData.storeInfo.storeId != storeId) { // 当onshow刷新店铺
						that.getStoreMenu(storeInfo.storeId);
					}
					app.globalData.storeInfo = storeInfo;
				}
			},
			switchTab() {
				this.showdetail = true;
			},
			//跳转广告
			jumpAdver(item, index) {
				if (index == 0) {
					uni.switchTab({
						url: '../mine/mine'
					})
					return;
				}
				if (item.jumpType == 2) {
					// this.$store.commit('adverStatus',item.productPrimaryTypeName);
					this.jumpProduct(item.productPrimaryTypeName);
				} else {
					jumpAdvertise(item);
				}
			},
			//data的数据初始化
			// dataInit(){

			// },
			async getActivity(menus) {
				let memberinfo = uni.getStorageSync('memberinfo');
				if (!memberinfo) {
					return false;
				}
				let data = {
					cardId: memberinfo.id
				};
				let res = await api.getActivity(data);
				if (res && res.code == 200) {
					res.data.forEach((item) => {
						if (item.type == 5) {
							item.productsBonus.bonusProducts.forEach(aitem => { //计算商品的折扣价格
								menus.forEach(bitem => {
									bitem.products.forEach(citem => {
										if (citem.uid == aitem.productPosId) {
											switch (aitem.discountType) {
												case 0:
													citem.activePrice = Math.round(parseFloat(accMul(citem.price, aitem.value)) * 100) / 100;
													break;
												case 1:
													citem.activePrice = subtr(citem.price, aitem.value);
													break;
												case 2:
													citem.activePrice = aitem.value;
													break;
											}
										}
									})
								})
							})
						}
					})
					this.activelist = res.data;
					return menus;
				}
			},
			async juideUserInfo() {
				if (!this.isLogin) {
					let userinfo = await refreshUserInfo(true);
					if (!userinfo || !userinfo.phone) {
						this.$refs.authorM.showPop();
					}
				}
			},
			//获取轮播图广告
			// async getBannerList() {
			// 	let res = await getBannerList();
			// 	if (res) {
			// 		this.bannerList = res.topBannerList;
			// 	}
			// },
			//
			closeActiveMask() {
				this.closeAllMask();
			},
			//添加按钮
			addTap(type, goods, index, idx) {
				switch (type) {
					case 1:
						goods.indexarr = {
							idx: idx,
							index: index,
						}
						if (!goods.nums) {
							this.$set(goods, 'nums', 1);
						} else {
							goods.nums++;
						}
						this.addShopCar(goods);
						break;
					case 2:
						this.nums++;
						break;
					case 3:
						goods.nums++;
						this.products[goods.indexarr.index].products[goods.indexarr.idx].nums = goods.nums; //同步餐单上的商品数据
						break;
				}
			},
			//减按钮
			reduceTap(type, goods) {
				switch (type) {
					case 1:
						if (goods.nums == 1) {
							this.deleteShopCar(goods);
						}
						goods.nums--;
						for (let i in this.shopcar) {
							if (this.shopcar[i].uid == goods.uid) {
								this.shopcar[i].nums--;
							}
						}
						break;
					case 2:
						if (this.nums == 1) {
							return;
						}
						this.nums--;
						break;
					case 3:
						if (goods.nums == 1) {
							this.deleteShopCar(goods);
						}
						goods.nums--;
						this.products[goods.indexarr.index].products[goods.indexarr.idx].nums = goods.nums; //同步餐单上的商品数据
				}
			},

			//删除购物车的商品
			deleteShopCar(goods) {
				let shopcar = this.shopcar;
				for (let i in shopcar) {
					if (shopcar[i].uid == goods.uid) {
						shopcar.splice(i, 1)
					}
				}
				if (!shopcar.length) {

					this.closeAllMask();
				}
			},
			//添加购物车商品
			addShopCar(goods) {
				let that = this;
				if (!goods) {
					that.$set(that.chooseGoods, 'nums', that.nums);
					goods = that.chooseGoods;
					if (goods.indexarr) {
						that.products[goods.indexarr.index].products[goods.indexarr.idx].nums = that.nums;
					}
				}

				let shopcar = this.shopcar;
				let currtabarr = that.currtabarr;
				let shopitem = { //定义购物车单个变量
					typeId: that.products[goods.indexarr.index].uid,
					uid: goods.uid,
					name: goods.name,
					price: goods.price,
					nums: goods.nums,
					logo: goods.logo ? goods.logo : '../../static/menu/logo.png',
					indexarr: goods.indexarr,
					discounted: 0,
				}
				if (goods.activePrice) {
					shopitem.price = goods.activePrice;
					shopitem.discounted = 1;
					shopitem.orginalPrice = goods.price;
				}
				if (goods.property) { // 如果是选规格   将选中规格参数添加到购物车变量中
					let property = [];
					for (let i in that.specarr) {
						// if (i != that.specarr.length - 1) {
						// return console.log(that.specarr[i].items[currtabarr[i]])
						that.specarr[i].items[currtabarr[i]].title = that.specarr[i].title;
						property.push(that.specarr[i].items[currtabarr[i]])

						// } else {    //加料店铺
						// 	that.specarr[i].items.forEach(item => {
						// 		item.title = that.specarr[i].title;
						// 		if (item.selected) {
						// 			property.push(item)
						// 		}
						// 	})
						// }
					}
					let descinfo = '';
					// let qty = 0;
					property.forEach(item => {
						// qty++;
						descinfo += item.name + '/'
					})
					descinfo = descinfo.substring(0, descinfo.length - 1);
					// shopitem.qty = qty;
					shopitem.descinfo = descinfo;
					shopitem.property = property;
				}
				let ishave = false;
				if (shopcar.length) {
					shopcar.forEach(item => {
						if (item.uid == shopitem.uid) { //购物车内相同的商品数量直接++
							if (item.property) {
								if (JSON.stringify(item.property) == JSON.stringify(shopitem.property)) {
									ishave = true;
									item.nums++;
								}
							} else {
								ishave = true;
								item.nums++;
								that.products[goods.indexarr.index].products[goods.indexarr.idx].nums = item.nums;
							}
						}
					})
				}
				if (!ishave) {
					shopcar.unshift(shopitem)
				}
				if (that.allmask) {
					that.closeAllMask();
					that.maskarr.shopCarShow = true;
				}
			},
			//防止冒泡
			prentEvents() {
				return;
			},
			//确认选择的店铺
			switchStore(store) {
				this.storeInfo = store;
				this.getStoreMenu(store.storeId);
				// that.getActive(store.);
			},
			//点击商品打开幕布
			openOrderMask(goods, index, idx) {
				let that = this;
				if (!this.storeInfo.isServiceTime) {
					return this.$msg.showToast('门店休息中')
				}
				if (this.storeInfo.isBusy) {
					return this.$msg.showToast('茶饮制作繁忙中')
				}
				if (!goods.isInServiceTime || goods.isSoldOut) { //售罄和不在售时间内
					return;
				}
				// let popHeightInfo = that.popHeightInfo;
				let chooseGoods = Object.assign({}, goods); //第一层深拷贝，防止价格影响
				chooseGoods.indexarr = {
					idx: idx,
					index: index,
				}
				that.nums = 1;
				this.chooseGoods = chooseGoods;
				if (goods.type == 1 && goods.isRequirement) {
					that.handleData(goods.property);
				}
				that.maskarr.shopCarShow = false;
				that.openAnimation(1);
			},
			//选择规格
			chooseAttr(index, idx) {
				let that = this;
				let attr = that.specarr[index].items[idx];
				let price = null;
				if (that.specarr[index].items[idx].isSoldOut) {
					return this.$msg.showToast('很抱歉！' + that.specarr[index].items[idx].name + '已经售罄了哦，正在加紧补货中～')
				}
				if (index == that.specarr.length - 1 && attr.hasOwnProperty('selected')) {
					if (that.specarr[index].items[idx].selected) { //已经选中情况   减去价格
						that.computeSpecPrice(attr.price, 0);
					} else { //选中情况   增加价格
						that.computeSpecPrice(0, attr.price);
					}
					that.specarr[index].items[idx].selected = !attr.selected;
				} else {
					let price = that.specarr[index].items[that.currtabarr[index]].price;
					that.computeSpecPrice(price, attr.price); //先减
					that.currtabarr.splice(index, 1, idx);
				}
			},
			//计算商品的规格价格
			computeSpecPrice(price, attrPrice) {
				let chooseGoods = this.chooseGoods;
				if (chooseGoods.activePrice) {
					let activePrice = subtr(chooseGoods.activePrice, price);
					this.chooseGoods.activePrice = accAdd(activePrice, attrPrice);
				} else {
					let nochangePrice = subtr(chooseGoods.price, price);
					this.chooseGoods.price = accAdd(nochangePrice, attrPrice);
				}
			},
			//处理规格属性
			handleData(data) {
				let specarr = [];
				let currtabarr = [];
				if (data.standard) {
					specarr.push(data.standard);
				}
				for (let i in data.propertys) {
					specarr.push(data.propertys[i]);
				}
				for (let i = 0; i < specarr.length; i++) {
					this.computeSpecPrice(0, specarr[i].items[0].price);
					currtabarr.push(0);
				}
				this.currtabarr = currtabarr;
				if (data.choices) {
					data.choices.items.forEach(item => {
						this.$set(item, 'selected', false);
					})
					specarr.push(data.choices)
				}
				this.specarr = specarr;
			},
			//展现动画
			openAnimation(type) {
				let that = this;
				that.allmask = true;
				if (type == 1) {
					that.maskarr.orderDescMask = false;
					uni.hideTabBar({});
				} else if (type == 2) {
					if (that.maskarr.shopCarCont) {
						that.maskarr.shopCarCont = false;
					} else {
						return this.closeAllMask()
					}
				}
				let animation = that.animation;
				that.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					that.animationData = animation.export();
				})
			},
			//关闭所有的幕布
			closeAllMask() {
				let that = this;
				that.allmask = false;
				that.maskarr.orderDescMask = true;
				that.maskarr.shopCarCont = true;
				that.maskarr.shopCarShow = true;
				that.maskarr.activeDesc = true;
				let animation = that.animation;
				that.animationData = animation.export();
				uni.showTabBar({})
			},
			async getStoreMenu(storeId) {
				waitLineUp().then(res => {
					this.busyData = res;
				});
				this.loadingState = false;
				let that = this;
				let data = {
					storeId: storeId,
					sendType: that.model,
				}
				let res = await api.getProductMenu(data);
				if (res && res.status == 1) {
					this.getAdvertList({ //获取餐单广告
						menuId: res.data.menuId,
						storeId: storeId,
					}); //获取店铺广告
					this.menuId = res.data.menuId;
					this.defaultS = false;
					this.handleShopData(res.data.bigs);
					if (!this.storeInfo.isServiceTime) {
						return this.noBussinessTime();
					}
					if (this.model == 1 && this.storeInfo.businessStatus[0].busy) {
						this.noTakeOut();
					}
				}
			},
			//不支持外卖提示
			noTakeOut() {
				let storeInfo = this.storeInfo;
				this.$msg.showModal((res) => {
					if (res == 1) {
						this.switchStoreOwn();
						// goChoseStore({
						// 	cityId: storeInfo.cityId,
						// 	cityName: storeInfo.cityName,
						// 	districtId: storeInfo.districtId,
						// 	districtName: storeInfo.districtName,
						// })
					}
				}, '目前因门店现状问题，我们暂时关闭了小程序外卖，非常抱歉，敬请谅解！', '门店繁忙', true, false, '切换门店')
			},
			//计算左边商品分类的高度
			computReftHe() {
				const sysinfo = uni.getSystemInfoSync();
				let windowHeight = sysinfo.windowHeight;
				this.popHeightInfo = {
					hei: windowHeight * 1,
					low: windowHeight * 0.5,
				};
				this.computedHeight = windowHeight * (750 / sysinfo.windowWidth); //系统高度rpx
				console.log(this.computedHeight)
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
					if (that.forhere) {
						return this.getStore(that.forhere.storeId);
					}
					if (!app.globalData.storeInfo.storeId) {
						that.getNearShopList(); //获取距离最近的门店
						// let res = await getCityAddress(lat, log); //获取地理详细信息
						// console.log(1111,res)
					}
				} else {
					that.getCategoryList(); //获取默认的商品列表

				}
			},
			// 获取当前附近的门店
			async getNearShopList(cityid) {
				let that = this;
				let location = that.location;
				let data = {
					coordinate: [location.longitude, location.latitude],
					// coordinate: ['120.555910', '31.293695'],   //测试地理位置
					// coordinate: ['120.68000030517578', '31.316667556762695'],   //测试地理位置
					businessType: that.businessType,
					pageNow: 0,
					pageSize: 10
				}
				let res = await api.getNearStoreList(data);
				newload = true; //第二次从onshow刷新地理位置
				if (res && res.status == 1) {
					let nearList = res.data.rows;
					nearList.forEach(item => {
						item.newdistance = conversion(item.distance) //换算距离
					})
					if (nearList.length > 1) { //如果附近多个店铺则展示选择店铺弹窗
						that.loadingState = false;
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
					if (res == 1) {
						goChoseCity(); //前往选择省份
					} else {
						this.getCategoryList(); //获取默认的商品列表
					}
				}, '您的附近没有茶汤会噢～，去其他地方看看吧', '温馨提示', true)
			},
			//位置选择
			jumpaddress() {
				if (this.headerInfo == '请选择下单门店 >') {
					return goChoseCity(); //前往选择省份
				}
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
			//跳转订单页面
			jumpOrder() {
				if (this.model == 1 && this.storeInfo.businessStatus[0].busy) {
					this.noTakeOut();
					return;
				}
				this.closeAllMask();
				let storeInfo = app.globalData.storeInfo;
				let memberinfo = uni.getStorageSync('memberinfo');
				if (!memberinfo && this.member) {
					return this.$refs.authorM.showPop();
				}
				let shopcar = this.shopcar;
				let order = [];
				shopcar.forEach((item, index) => {
					let products = {
						qty: item.nums,
						discounted: item.discounted,
						product_no: item.uid,
						name: item.name,
						price: item.price,
						condiments: [],
						typeId: item.typeId,
						listRequirements: [],
					}
					if (item.orginalPrice) {
						products.price = item.orginalPrice;
					}

					if (item.property) {
						let quirements = {
							index: index,
							num: item.nums,
							propertys: []
						}
						let price = 0;
						item.property.forEach(aitem => {
							price = accAdd(price, aitem.price)

							quirements.propertys.push({
								pid: aitem.pid,
								title: aitem.title,
								items: [{
									index: index,
									uid: aitem.uid,
									name: aitem.name,
									price: aitem.price
								}]
							})
						})
						products.price = subtr(products.price, price)
						products.condiments = [{
							qty: 1,
							name: item.descinfo,
							price: price,

						}];
						products.listRequirements = [quirements]
					}
					order.push(products);
				})
				let orderinfo = {
					menuId: this.menuId,
					boxFee: this.priceArr.lunchboxfee,
					fee: storeInfo.fee,
					order: {
						products: [],
					},
				}
				if (this.member) {
					orderinfo.member = {
						cardId: memberinfo.id,
						usePoint: 0,
						useBalance: 1,
						useRestriction: 1,
						cardNo: memberinfo.cardNo,
					};
				} else {
					orderinfo.priceArr = this.priceArr; //餐饮总价
					// .totalPrice;
					// orderinfo.lunchboxfee = this.priceArr.lunchboxfee
				}
				orderinfo.order.products = order;
				app.globalData.orderinfo = orderinfo;
				uni.setStorageSync('orderinfo', orderinfo);
				uni.navigateTo({ //前往下单页
					url: '../settle/settle?storeId=' + this.storeInfo.storeId,
				})
			},
			//处理获取到的商铺菜单
			async handleShopData(data) {
				let that = this;
				if (that.member) { //如果有会员部分就查看活动信息
					let newdata = await that.getActivity(data); //获取活动信息
					if (newdata) {
						data = newdata;
					}
				}

				that.products = data;
				that.currentId = data[0].uid;
				that.loadingState = true;
				that.$nextTick(async () => { //解决DOM更新异步问题
					await that.calcSize();
					if (that.productPrimaryTypeName) {
						that.jumpProduct();
					}
				})
			},
			//跳转到某一个一级分类
			jumpProduct(productPrimaryTypeName) {
				let that = this;
				!productPrimaryTypeName ? productPrimaryTypeName = that.productPrimaryTypeName : '';
				that.products.find(item => {
					if (item.name == productPrimaryTypeName) {
						that.currentId = item.uid;
						that.tabScrollTop = item.top;
						if (that.productPrimaryTypeName) {
							this.$store.commit('adverStatus', null);
						}
					}
				});
			},
			//获取默认商品数据
			async getCategoryList() {
				let data = {
					brandId: app.globalData.brandIdc,
				};
				let res = await api.getDefaultMeun(data);
				if (res.status == 1) {
					this.defaultS = true;
					console.log(res.data)
					this.handleShopData(res.data.bigs)
				}
			},
			//获取默认广告banner
			async getAdvertList(data) {
				let res = await api.getMenuBanner(data);
				if (res.status && res.data) {
					this.bannerList = res.data.menuAdvertList;
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
					if (tabs.length == 1) {
						this.leftScrollTop = this.leftScrollTop + 0.01;
					}
					if (that.currentId != tabs[0].uid) {
						that.currentId = tabs[0].uid;
						that.leftCurrtab = 'left' + tabs[0].uid;
					}
				} else {
					this.leftScrollTop = 0;
				}
			},
			// 计算右侧栏每个tab的高度等信息
			calcSize() {
				return new Promise((res, ret) => {
					let h = 0;
					this.products.forEach((item, i) => {
						let view = uni.createSelectorQuery().select("#main-" + item.uid);
						view.fields({
							size: true
						}, data => {
							if (!data) return;
							item.top = h + 140;
							h += data.height;
							if (i == this.products.length - 1) {
								res();
							}
						}).exec();
					})

				})
			},
			//查看店铺详细信息
			checkDetail() {
				if (this.defaultS) {
					return this.$msg.showToast('请先选择下单店铺哦～')
				}
				if (this.activeHeight) {
					this.activeHeight = 0;
				}
				this.showdetail = !this.showdetail;
			},
			switchStoreOwn() {
				if (this.model == 1) {
					uni.navigateTo({
						url: '../choosestore/choosestore'
					})
				}
			}
		}
		//当外卖模式下切换店铺
		// switchStore() {
	}
</script>

<style lang='scss'>
	.classify {
		width: $screen-width;
		color: $uni-text-color;
	}

	/* 订单等待 */
	.busy-cont {
		@include rect(166px, 50px);
		transition: all .3s;
		position: fixed;
		bottom: 3px;
		right: 0px;
		background: #F1FAD4;
		border-radius: 25px 0 0 25px;
		/* box-shadow: 0px 4upx 21upx 0px rgba(19, 19, 20, 0.08); */
		@extend %flex-alcent;
		justify-content: space-between;


		.busy-l {
			margin-left: 6px;
			display: flex;
			padding-top: .1px;
			height: 50px;

			.busy-img {
				margin-top: 6px;
				width: 38px;
				height: 38px;
				border: 1px solid #B2D14E;
				border-radius: 19px;
				box-sizing: border-box;

				@extend %flex-alcent;
				justify-content: center;

				image {
					@include rect(24px, 24px);
				}
			}

			.order-juide {

				/* height: 50px; */
				margin-left: 8px;
				margin-top: 8px;
				/* border: 1upx red solid; */
				font-size: 10px;
				color: #B2D14E;
				line-height: 14px;

				text {
					line-height: 17px;
					font-weight: bold;
					font-size: 12px;
				}

				.estima {
					margin-top: 2px;
				}
			}

			text {
				text {
					color: $color-red;
				}
			}
		}

		.busy-r {
			@include rect(16px, 16px);
			margin-right: 8px;

			image {
				@include rect(100%, 100%)
			}
		}

		&.busy_open {
			width: 28px;

			.busy-l {
				display: none;
			}

			.busy-r {
				margin-left: 6px;
				margin-right: 0;
				transform: rotate(180deg);
			}
		}

	}

	.nobusiness {
		@include rect(100%, 140upx);
		background-color: $main-color;
		position: fixed;
		bottom: 0;
		left: 0;
		color: $text-white;
		text-align: center;
		padding-top: 20upx;
		box-sizing: border-box;
		font-size: 32upx;

		.bussiness-time {
			font-size: 28upx;
			margin-top: 10upx;

			text {
				margin-right: 12upx;
			}
		}
	}

	.chopcar-tab {
		@include rect(678upx, 112upx);
		border-radius: 56upx;
		position: fixed;
		bottom: 15upx;
		left: 40upx;
		z-index: 201;
		background-color: $bg-white;
		display: flex;
		justify-content: space-between;
		box-shadow: 0px 8upx 21upx 0px rgba(19, 19, 20, 0.08);

		.takeout-juide {
			/* position: absolute;
			bottom: 8upx; */
			font-size: 20upx;
			color: #999999;
			margin-left: 20upx;
			/* left: 200upx; */
		}

		/* box-shadow: ; */
		.tab-l {
			@extend %flex-alcent;
			margin-left: 60upx;
			height: 100%;

			.shop-car-icon {
				@include rect(50upx, 45upx);
				position: relative;

				image {
					@include rect(50upx, 45upx);
				}

				.nums-juide {
					position: absolute;
					@include rect(32upx, 32upx);
					border-radius: 16upx;
					background-color: $color-red;
					right: -10upx;
					top: -10upx;
					@include text-allcenter(32upx);
					color: $text-white;
					font-size: 22upx;
				}
			}

			.total-price {
				color: red;
				font-size: 34upx;
				margin-left: 38upx;
			}
		}

		.tab-r {
			@include rect(167upx, 100%);
			border-top-right-radius: 55upx;
			border-bottom-right-radius: 55upx;
			background-color: $main-color;
			color: $text-white;
			@include text-allcenter(112upx);
			font-size: 32upx;
		}

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
			width: 50upx;
			text-align: center;
		}
	}

	.single-line {
		border-top: 1upx #e0e0e0 solid;
	}

	.order-masker {
		@extend %all-mask;


		/* .translate{
			transform: translateY(100%);
		} */
		.order_info_box {
			@include rect(100%, 100%);
			padding: 25upx;
			box-sizing: border-box;
			position: relative;

			.goods-pic {
				width: 100%;
				background-color: $bg-white;
				height: 372upx;
				/* border: 1upx $main-color solid; */
				position: relative;
				margin: 0 auto;
				@extend %flex-alcent;
				justify-content: center;
				border-radius: $radius-md;

				image {
					@include rect(372upx, 100%);
				}

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
				/* margin: 25upx auto 260upx auto; */
				padding: 1upx 0;
				box-sizing: border-box;
				border-radius: $radius-md;
				overflow: hidden;

				.arrt-cont {
					margin-top: 22upx;
					padding: 20upx 10upx 20upx 40upx;
					box-sizing: border-box;
					background-color: $bg-white;
					border-radius: $radius-md;


					.arrt-item {
						line-height: 50upx;
						display: flex;
						margin-bottom: 20upx;
						padding-top: 1px;

						.arrt_name {
							width: 100upx;
							font-size: $font-md;
							line-height: 38upx;
							padding-right: 30upx;
							box-sizing: border-box;
							margin-top: 14upx;
							/* font-size: upx; */
						}

						.arrt_Iitem-cont {
							/* margin-left: 40upx; */
							width: 530upx;
							@extend %flex-list;

							.arrt_Iitem {
								font-size: 26upx;
								/* @include rect(155upx, 58upx); */
								height: 58upx;
								min-width: 155upx;
								@include box-padding(16upx);
								text-align: center;
								background-color: #F5F5F5;
								color: #616161;
								border-radius: 50upx;
								margin-right: 23upx;
								margin-bottom: 15upx;
								box-sizing: border-box;
								line-height: 58upx;

								&.choose_item {
									border: 1px $main-color solid;
									background-color: $bg-white;
									color: $main-color;
								}

								/* &:nth-of-type(3) {
									margin-right: 0upx;
								} */
							}
						}
					}
				}
			}

			.order-desc {
				width: 100%;
				padding: 20upx 30upx;
				box-sizing: border-box;
				background-color: $bg-white;
				border-radius: $radius-md;
				margin-top: 22upx;
				font-size: 32upx;

				text {
					&:last-child {
						font-size: 24upx;
						color: $text-grey;
						line-height: 40upx;
					}
				}
			}

			.order-footer {
				width: 694upx;
				margin-top: 22upx;

				.num-control {
					@include rect(100%, 104upx);
					background-color: $bg-white;
					border-radius: $radius-md;
					@extend %flex-alcent;
					justify-content: space-between;
					padding: 0 40upx 0 32upx;
					box-sizing: border-box;
					line-height: 100upx;

					.price {
						color: $color-red;
						font-size: 32upx;
					}
				}

				.confirm-btn {
					@include rect(100%, 100upx);
					background-color: $main-color;
					color: $bg-white;
					@include text-allcenter(100upx);
					margin-top: 20upx;
					border-radius: 50upx;
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

	.header-control {
		@extend %flex-alcent;
		@include box-padding(28upx);
		@include rect(100%, 142upx);
		justify-content: space-between;
		background-color: $bg-white;
		padding-top: 1upx;

		.address-info {
			text {
				font-size: 32upx;

				&:last-child {
					font-size: $font-sm;
					color: #A0A4A7;
				}
			}
		}

		.store-control {
			/* height: 100%; */
			text-align: center;

			.check-juide {
				margin-top: 16upx;
				font-size: 20upx;
				color: #a0a0a0;
				justify-content: center;
				@extend %flex-alcent;

				image {
					@include rect(9upx, 18upx);
					transform: rotate(90deg);
					margin-left: 12upx;
				}
			}

			.table-num {
				@include rect(114upx, 50upx);
				background-color: $main-color;
				border-radius: 25upx;
				@include text-allcenter(50upx);
				color: $text-white;
				font-size: 24upx;
				margin: 18upx auto 0 auto;
			}

		}
	}

	.active_desc {
		padding: 24upx 32upx 0 32upx;
		width: 100%;
		height: 0;
		background-color: white;
		transition: all .8s;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;

		.active-item {
			@include rect(100%, auto);
			margin-bottom: 64upx;
			line-height: 44upx;

			.active-tit {
				font-size: 32upx;
				font-weight: 500;
				margin-bottom: 24upx;
			}

			.active-desc {
				/* height: 44upx; */
				display: flex;
				font-size: 24upx;
				/* border: 1upx red solid; */

				.left-box {
					@include rect(36upx, 36upx);
					@include text-allcenter(36upx);
					color: $text-white;
					background-color: #FF3945;
					font-size: 20upx;
					border-radius: 22upx;
					margin-top: 3upx;
					margin-right: 16upx;

					&.on {
						background-color: #FF8D5C;
					}
				}

				.rich_text {
					line-height: 44upx
				}
			}
		}

		.close-active {
			position: absolute;
			bottom: 0;
			left: 0;
			@include rect(100%, 280upx);
			background-color: rgba(255, 255, 255, 0.2);
			@extend %flex-alcent;
			justify-content: center;

			image {
				@include rect(48upx, 48upx);
				transform: rotate(180deg);
			}
		}
	}

	.header {
		width: 100%;
		box-sizing: border-box;

		&::after {
			content: '';
			display: block;
			@include rect(100%, 20upx);
			background-color: $bg-white;
		}


		.active-s {
			background-color: #F8F7FA;
			@include rect(100%, 85upx);

			swiper-item {

				@include rect(100%, 100%);
			}
		}

		.active-goods {
			line-height: 86upx;
			@include rect(100%, 100%);
			@include box-padding(28upx);


			view {
				font-size: $font-sm;
				color: #969CAB;
			}
		}

		.make-busy {
			width: 100%;
			background-color: #F8F7FA;
			padding: 1upx 24upx 0 24upx;
			box-sizing: border-box;
			/* padding-top: 1upx;
			padding-bottom: 20upx; */
			@extend %flex-alcent;
			justify-content: space-between;

			.make-busy-l {
				width: 500upx;
				height: 100%;
				@extend %flex-alcent;
			}

			.active-r {
				font-size: 24upx;
				color: #B2D14E;
				@extend %flex-alcent;

				text {
					line-height: 85upx;
				}

				image {
					@include rect(24upx, 24upx);
					margin-left: 13upx;
				}
			}


		}

		.active-pic {
			@include rect(40upx, 40upx);
		}
	}


	.left-aside {
		width: 196upx;
		background-color: #F8F7FA;
	}

	.blank-fill {
		width: 100%;
		height: 300upx;
	}

	.menu-cont {
		display: flex;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 150upx;
		font-size: 28upx;
		color: #595757;
		position: relative;
		@include box-padding(8upx);

		image {
			@include rect(40upx, 40upx);
			margin: 0 10upx;
		}

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
			color: $uni-text-color;
			background: #FFFFFF;

			&:before {
				transition: all .3s;
				transform: scaleY(1);
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding: 0 46upx 0 20upx;
		box-sizing: border-box;
		background-color: $bg-white;

		.blank {
			width: 100%;
			height: 200upx;
		}

		.header_banner {
			width: 100%;
			height: 246upx;
			box-sizing: border-box;
			border-radius: $radius-md;
			overflow: hidden;
			margin-bottom: 58upx;

			swiper-item {
				@include rect(100%, 100%);
			}

			image {
				@include rect(100%, 100%);
			}
		}


	}

	.class_tit {
		margin-bottom: 58upx;
		font-size: 24upx;
		color: $uni-text-color-grey;
	}

	.t-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 100%;
	}

	.t-item {
		/* border: 1upx red solid; */
		width: 100%;
		height: 140upx;
		box-sizing: border-box;
		display: flex;
		font-size: 26upx;
		margin-bottom: 73upx;

		.good-pic {
			@include rect(140upx, 140upx);
			/* 			border: 1upx $main-color solid; */
			border-radius: 8upx;
			overflow: hidden;

			image {
				@include rect(100%, 100%);
			}
		}

		.goods-info {
			height: 100%;
			margin-left: 28upx;
			width: 306upx;

			.goods-name {
				width: 100%;
				font-size: 32upx;
				@include lineOnly();
			}

			.goods-desc {
				width: 100%;
				height: 34upx;
				margin: 8upx 0;
				@include lineOnly();
				font-size: 22upx;
				color: #A1A1A1;
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
					color: $color-red;
				}

				.oldprice {
					font-size: 24upx;
					color: #a5a5a5;
					text-decoration: line-through;
					font-weight: 400;
					margin-left: 20upx;
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





	.shopcar-cont {
		width: 100%;
		background-color: $bg-white;
		padding-bottom: 160upx;




		.scroll-shopcar {
			width: 694upx;
			margin: 0 auto;
			background-color: $bg-white;
			/* max-height: 800upx; */
		}

		.mealfee {
			margin: 30upx 30upx 0 30upx;
			font-size: $font-md;
			color: #666666;
			display: flex;
			justify-content: space-between;

			text {
				color: $color-red;
				margin-right: 30upx;
			}
		}

		.shopcar-item {
			padding: 30upx 0;
			/* padding: 30upx 28upx; */
			box-sizing: border-box;
			display: flex;
			border-bottom: 1upx #e0e0e0 solid;

			.shopcar-item-pic {
				@include rect(150upx, 150upx);

				/* border: 1upx $main-color solid; */
				image {
					@include rect(100%, 100%);
				}
			}


			.shop-item-cont {
				width: 510upx;
				margin-left: 25upx;

				.item-name {
					font-size: 30upx;
				}

				.item-desc {
					margin-top: 10upx;
					@include rect(65%, 50upx);
					font-size: 20upx;
					color: #AAAAAA;
					@include lineAny(2);
					/* border: 1upx red solid; */
				}

				.item-price-control {
					@include rect(100%, 50upx);
					margin-top: 4upx;
					display: flex;
					align-items: flex-end;
					justify-content: space-between;

					text {
						font-size: 26upx;
					}
				}
			}
		}

		/* @include rect(100%,400upx); */
	}

	.order-info {
		position: absolute;
		width: 100%;
		bottom: 0;
		/* transform: translateY(100%); */
		background-color: #F8F7FA;
		border-top-right-radius: 20upx;
		border-top-left-radius: 20upx;
		overflow: hidden;
	}

	.head_juide {
		@include rect(100%, 129upx);
		@extend %flex-alcent;
		justify-content: space-between;

		.close-icon {
			@include rect(55upx, 55upx);
			margin-left: 22upx;
		}

		.close-img {
			@include rect(100upx, 100upx);
			padding-top: 1upx;
			margin-right: 12upx;
		}

		view {
			margin-left: 28upx;

			image {
				@include rect(32upx, 32upx);
				margin-right: 10upx;
			}

			text {
				color: #767273;
				margin-right: 28upx;
				line-height: 60upx;
			}
		}

	}
</style>
