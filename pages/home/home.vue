<template>
	<view class="content">
		<!-- 首页banner -->
		<swiper class="head-info" :autoplay="true" :circular="true" :interval="3000" :duration="1000">
			<!-- <navbar :config="config"></navbar> -->
			<swiper-item v-for="(item,index) in bannerData.topBannerList" :key="index" @click="jumpAdvertise(item,index)">
				<image :src="item.picUrl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="home-cont">
			<!-- 自取/外卖/集点卡部分 -->
			<view class="app-model">
				<view class="model-box">
					<view class="" @click="jumpMenu(2)">
						<image class="take-pic" src="../../static/homepage/home_takeit_pic.png" mode=""></image>
						<text>门店自取</text>
						<text class="juide-txt">下单免排队</text>
						<!-- <image class="take-btn" src="../../static/homepage/takeit_btn.png"></image> -->
					</view>
					<view class="" @click="jumpMenu(1)">
						<image class="take-pic" src="../../static/homepage/home_takeout_pic.png"></image>
						<text>外卖</text>
						<text class="juide-txt">无接触配送，送到家</text>
						<!-- <image class="take-btn" src="../../static/homepage/takeout_btn.png"></image> -->
					</view>
				</view>
				
			</view>
			<view class="integral">
				<view class="integral_f" @click="jumpClissIfy(3)">
					<text>集点卡\n</text>
					<text>再集{{(pointActive.number - pointNum)?(pointActive.number - pointNum):(pointActive.number || 0)}}单可获得好礼</text>
					<sildermine :config="sliderConfig"></sildermine>
				</view>
				<view class="box-r">
					<view class="integral_s" @click="jumpClissIfy(2)">
						<text>我的优惠券\n</text>
						<text>{{memberinfo.coupons.length || 0}}张待使用</text>
					</view>
					<view class="integral_t" @click="jumpWallet">
						<text>我的余额\n</text>
						<text>充值享优惠</text>
					</view>
				</view>
			</view>
			<!-- 积分商城部分 -->
			<view class="active_card" @click="jumpClissIfy(1)">
				<view class="card_l">
					<image class="card_icon" src="../../static/homepage/home_inter_icon.png"></image>
					<text>积分商城</text>
			
				</view>
				<view class="card_r">
					<text>更多好物</text>
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
			<!-- 我的优惠券 / 我的余额 / 积分商城 -->
			<!-- <view class="blance-box" v-if="member">
				<view class="blance-l" @click="jumpWallet">
					<view>
						<image src="../../static/money_icon.png"></image>
						我的余额：{{memberinfo.balance?memberinfo.balance:0}}
					</view>
					<view>
						点击进行充值，享取优惠
						<image src="../../static/07_icon_right.png"></image>
					</view>
				</view>
				<image class="blance-icon" src="../../static/member_icon.png" @click="jumpMembercode"></image>
			</view> -->
			<!-- <view class="integral" v-if="member">
				<view class="integral-item" v-for="(item,index) in integralarr" :key="index" @click="jumpClissIfy(index)">
					<view class="intehead_info">
						<image :src="item.icon"></image>
						<view class="">
							<text>{{item.tit}}\n</text>
							<text>{{item.value}}</text>
						</view>
					</view>
					<image class="bg-pic" :src="item.bg"></image>
				</view>
			</view> -->
			<view class="adver">
				<view class="adver-tit">
					新鲜事
				</view>
				<view class="adver-item" v-for="(item,index) in newsImag" :key="index" @click="bootNewBtn(index)">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="blank"></view>
		<author ref="authorM" @loginSuccess="loginSuccess"></author>
		<!-- 好友邀请模块 -->
		<view class="mask" v-if="notAuth">
			<view class="author-info">
				<image class="pop-top" src="../../static/POP_top.png"></image>
				<view class="home-id">
					<image src="../../static/active/invitation_coupons.png"></image>
				</view>
				<view class="juide-cont">
					<view class="title">
						{{shareCoupons.name}}
					</view>
					<view class="juide-content">
						<text>实付满{{shareCoupons.moneyRestriction}}元后就可以使用</text>
					</view>
					<view class="autho_btn" @click="receiveCouponsBtn">
						{{memberinfo?'领取优惠券':'登陆/注册领取优惠券'}}
					</view>
				</view>
			</view>
		</view>
		<!-- 天将红包模块 -->
		<view class="mask" v-if="redRewardInfo">
			<view class="reward-box">
				<view class="reward-head-box" :style="{backgroundImage:'url('+redRewardInfo.imageUrl +')'}">
					<view class="reward-tit">
						天降红包
					</view>
					<scroll-view class="reward-item-box" scroll-y="true">
						<view class="reward-item" v-for="(item,index) in rewardarr" :key="index">{{item}}</view>
					</scroll-view>
					<view class="recive-btn" @click="receiveReward">
						{{memberinfo?'一键领取':'登陆/注册一键领取'}}
					</view>
				</view>
				<view class="close-redReward" @click="closeRedward">
					<image src="../../static/POP_close01.png"></image>
				</view>
			</view>

		</view>
		<!-- 集点卡活动 -->
		<view class="mask" v-if="maskShow" @catchtouchmove="true">
			<view class="order-info" :animation="animationData">
				<view class="desc-box">
					<view class="head-tit">
						{{pointActive.title || '积点活动'}}
						<view class="close-pic" @click="closePointActive">
							<image src="../../static/cha.png"></image>
						</view>
					</view>
					<scroll-view scroll-y="true" class="desc-cont">
						<view v-if="pointActive" class="desc-time"> <text v-if="timelimit">{{pointActive.startTime + ' 至 ' + pointActive.endTime}}</text>
							<text v-else>长期有效</text> </view>
						<text class="desc-time" v-else>非常抱歉，现在没有开启积点活动</text>
						<view class="desc-cont-o" v-if="pointActive">
							<jyf-parser :html="pointActive.description" selectable="true"></jyf-parser>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser'; //富文本组件

	const app = getApp();
	import author from '../../components/author.vue'
	import {
		getBannerList
	} from '../../utils/publicApi.js'
	import sildermine from '../../components/minesilder.vue'
	import {
		jumpAdvertise,
		appshare
	} from '../../utils/utils.js'
	import {
		getLocation,
	} from '../../utils/author.js'
	import {
		mapState,
		mapMutations,
	} from "vuex";
	import {
		ajaxUserLogin,
		refreshUserInfo,
		getMemberInfo,
		getRecharge
	} from '../../utils/publicApi.js'
	import {
		goUserAddress
	} from '../../utils/goToPage.js'
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				timelimit: true, //积点时间限制
				// walletShow:false,  //充值套餐显示否
				animationData: {}, //动画控件
				maskShow: false, //集点卡活动介绍
				rewardarr: [], //奖励数组
				notAuth: false, //好友邀请幕布
				title: 'Hello',
				sliderConfig: {
					progresswidth: '240upx',
					progressbar: '0%',
				},
				newsImag: ["https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/7622/d770639ad08da8dcdb8a8a2ab82134d.jpg",
					"https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/7622/banner20201118151452.png"
				],

				memberinfo: null, //用户信息
				bannerData: {}, //轮播图数据
				shareCoupons: null, //分享的优惠卷
				// config: {
				// 	slideHeight: 400,
				// 	hiddentit: false,
				// 	color: '#343434',
				// 	bgcolor: 'white',
				// },
				integralarr: [{
						icon: '../../static/homepage/home_sm_inte.png',
						tit: '我的积分',
						value: '0',
						bg: '../../static/homepage/home_ingetral.png',
					},
					{
						icon: '../../static/my/shop_icon.png',
						tit: '积分商城',
						value: '更多好物',
						bg: '../../static/homepage/home_store.png',
					}, {
						icon: '../../static/homepage/home_sm_earn.png',
						tit: '赚取积分',
						value: '玩转积分',
						bg: '../../static/homepage/home_inte_t.png',
					},
					{
						icon: '../../static/homepage/home_sm_coupon.png',
						tit: '我的优惠卷',
						value: '0',
						bg: '../../static/homepage/home_coupons.png',
					},
					{
						icon: '../../static/homepage/home_sm_card.png',
						tit: '集点卡',
						value: '',
						bg: '../../static/homepage/home_card.png',
					},

				],
				homeParams: {},
				redRewardInfo: null, //天将红包信息
				pointActive: null, //集点卡活动信息
				member: false, //是否展示会员内容
			}
		},
		components: {
			sildermine,
			author,
			jyfParser
		},
		onShow() {
			let memberinfo = this.memberinfo;
			if(memberinfo){
				getMemberInfo(true).then(res=>{
					this.member = res;
				});
				this.pointActivity();
			}
		},
		// computed:{
		// 	...mapState(['isLogin']),
		// },
		async onLoad(options) {
			uni.showLoading({
				mask: 'true'
			})
			this.member = app.globalData.member;
			if (!this.JSESSIONID) {
				uni.hideTabBar({});
				await ajaxUserLogin(); //先进行登录
			}
			if (options.giveCardId) {
				this.homeParams = options;
			}
			uni.showTabBar({})
			uni.showLoading({
				mask: true
			})
			this.init()
		},

		onShareAppMessage(res) {
			return appshare()
		},
		computed: {
			...mapState(['cityid', 'JSESSIONID', 'isLogin']),
			pointNum() {
				let pointActive = this.pointActive;
				let num = 0;
				let percent = '0%';
				if (pointActive) {
					if (pointActive.sumNumber > pointActive.number) {
						num = pointActive.sumNumber % pointActive.number
					} else if (pointActive.sumNumber == pointActive.number) {
						num = 0;
					} else {
						num = pointActive.sumNumber;
					}
				}
				if (num) {
					percent = Math.floor((num / pointActive.number) * 100);
				}
				this.sliderConfig.progressbar = percent + '%';
				return num;
			}
		},
		methods: {
			async init() {
				if (this.member) {
					this.juideUserInfo(); //判断用户是否登录
					this.renderAnimation(); //定义动画
				} else {
					uni.hideLoading()
				}
				this.getBannerList(); //获取轮播图
			},
			//打开集点卡介绍幕布
			checkPonitDesc() {
				this.maskShow = true;
				let animation = this.animation;
				this.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					this.animationData = animation.export();
				})
			},
			//关闭集点卡活动
			closePointActive() {
				let that = this;
				that.maskShow = false;
				let animation = that.animation;
				that.animationData = animation.export();
			},
			//定义动画
			renderAnimation() {
				let that = this;
				let animation = uni.createAnimation({ //定义动画
					duration: 300,
					timingFunction: 'linear',
					delay: 0
				})
				that.animation = animation;
			},
			//关闭天降红包弹窗
			closeRedward() {
				this.redRewardInfo = null;
			},
			//查看积点活动
			async pointActivity() {
				let data = {
					cardId: this.memberinfo.id,
				}
				let res = await api.pointActivity(data);
				if (res.code == 200) {
					if (res.data[0]) {
						if (!res.data[0].description) {
							res.data[0].description = '<div>暂无内容</div>'
						}
					
						this.pointActive = res.data[0];
						if (res.data[0].endTime.slice(0, 4) > 2099) {
							this.timelimit = false
						}
					}
				}
			},
			//领取天降红包
			async receiveReward() {
				let that = this;
				let memberinfo = that.memberinfo;
				if (!memberinfo) {
					// this.redRewardInfo = null;
					return that.$refs.authorM.showPop();
				}
				uni.showLoading({
					title: '领取中'
				})
				let data = {
					cardId: that.memberinfo.id,
					activityId: that.redRewardInfo.id,
				}
				this.redRewardInfo = null;
				let res = await api.receiveReward(data);
				uni.hideLoading()
				if (res.code == 200) {
					that.redRewardInfo = null;
					that.$msg.showToast('恭喜您领取成功～');
					this.memberinfo = await getMemberInfo(true);
				} else {
					that.$msg.showToast(res.message);
				}
			},
			//跳转我的会员码
			jumpMembercode() {
				if (!this.memberinfo) {
					return this.noLoginHander();
				}
				uni.navigateTo({
					url: '../membercode/membercode'
				})
			},
			//领取好友赠送的优惠卷
			async receiveCouponsBtn() {
				let memberinfo = this.memberinfo;
				if (!memberinfo) {
					return that.$refs.authorM.showPop();
				}
				let data = {
					giveCardId: this.homeParams.giveCardId,
					obtainCardId: this.memberinfo.id,
					ticketId: this.homeParams.ticketId,
				}
				let res = await api.receiveCoupons(data, true);
				this.notAuth = false
				if (res.code == 200) {
					this.$msg.showToast('领取成功～')
					this.memberinfo = await getMemberInfo(true);
				} else {
					this.$msg.showToast(res.message)
				}
			},
			async juideUserInfo() {
				let that = this;
				let userinfo = await refreshUserInfo(true);
				if (!userinfo || !userinfo.phone) { //是否注册 ，没有注册的情况下
					let redReaward = await that.redReaward(); //查询红包奖励（天将红包）
					if (that.homeParams.giveCardId || redReaward) { //用户赠送的优惠卷
						if (that.homeParams.giveCardId) {
							that.receiveCoupons(); //查询好友赠送的优惠卷
						}
					} else {
						that.$refs.authorM.showPop();
					}
				} else {
					let memberinfo = await getMemberInfo(true);
					console.log(memberinfo)
					that.integralarr[0].value = memberinfo.point;
					that.integralarr[3].value = memberinfo.coupons.length + '张';
					that.memberinfo = memberinfo;
					if (that.homeParams && that.homeParams.giveCardId) {
						that.receiveCoupons(); //查询好友赠送的优惠卷优惠卷
					}
					that.pointActivity(); //查询积点活动
					that.redReaward(memberinfo.id);
				}
				uni.hideLoading();
			},
			//查询红包奖励
			async redReaward(id) {
				let data = {}
				if (id) {
					data.cardId = id
				}
				let res = await api.redRewardActive(data);
				if (res.code == 200) {
					if (res.data[0]) {
						this.redRewardInfo = res.data[0];
						let rewardarr = res.data[0].ticketName.split(',');
						this.rewardarr = rewardarr;
						return rewardarr;
					}
				}
			},

			//查询好友赠送的优惠卷
			async receiveCoupons() {
				let homeParams = this.homeParams;
				if (this.memberinfo && this.memberinfo.id == homeParams.giveCardId) {
					return;
				}
				let data = {
					ticketId: homeParams.ticketId,
					giveCardId: homeParams.giveCardId,
				}
				let res = await api.confirmStutas(data);
				if (res.code == 200) {
					this.shareCoupons = res.data;
					this.notAuth = true;
				} else {
					this.$msg.showToast(res.message)
				}
			},
			async loginSuccess(val) {
				this.$refs.authorM.hidePop();
				let memberinfo = await getMemberInfo(true);
				this.memberinfo = memberinfo;
				this.pointActivity(); //查询积点活动
				if (this.redRewardInfo) {
					return this.receiveReward(); //注册成功领取天降红包
				}
				if (this.homeParams && this.homeParams.giveCardId) {
					this.receiveCouponsBtn(); //注册成功领取好友赠送的优惠卷
				}
			},
			//跳转点单页，判断自取或外卖
			jumpMenu(type) {
				if (type == 1) {
					goUserAddress('select');
				} else {
					this.$store.commit('changebussiness', [2])
					uni.switchTab({
						url: '../ordermenu/ordermenu'
					})
				}
			},
			//获取轮播图广告
			async getBannerList() {
				let res = await getBannerList();
				if (res) {
					this.bannerData = res;
				}
			},
			async getLocation() {
				let location = await getLocation();
			},
			bootNewBtn(index) {
				let url = '';
				switch (index) {
					case 0:
						url = 'https://mp.weixin.qq.com/s/vK-cBUCVqIaH8WS7zHgJGQ';
						break
					case 1:
						url = 'https://mp.weixin.qq.com/s/zc3Gb3zEeWtHzm1-DHMNwQ';
						break;
				}
				uni.navigateTo({
					url: '../webview/webview?url=' + url,
				})
			},
			jumpAdvertise(item, index) {
				if (index == 0) {
					uni.switchTab({
						url: '../mine/mine'
					})
					return;
				}
				jumpAdvertise(item)
			},
			//跳转充值
			async jumpWallet() {
				let walletShow = await getRecharge();
				if (!walletShow) {
					return this.$msg.showToast('非常抱歉，现在没有开启充值活动')
				}
				if (this.memberinfo) {
					uni.navigateTo({
						url: '../wallet/wallet'
					})
				} else {
					return this.noLoginHander();
				}
			},
			noLoginHander() {
				// 没有登录处理
				this.$msg.showToast('亲，先登录哦～')
				this.$refs.authorM.showPop();
			},
			//跳转各个分类页面
			jumpClissIfy(index) {
				if (!this.memberinfo) {
					return this.noLoginHander();
				}
				switch (index) {
					case 1:
						uni.navigateTo({
							url: '../shopping/shopping'
						})
						break;
					case 2:
						uni.navigateTo({
							url: '../coupons/coupons'
						})
						break;
					case 3:
						this.checkPonitDesc();
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.blank {
		height: 100upx;
	}

	%integral {
		padding-top: 32upx;
		@include box-padding(30upx);
		padding-top: 30upx;
		box-sizing: border-box;
		line-height: 44upx;

		text {
			font-size: 32upx;
			font-weight: bold;
			margin-bottom: 4upx;

			&:nth-of-type(2) {
				font-size: $font-md;
				color: #969CAB;
				font-weight: normal;
			}
		}
	}

	.close-redReward {
		position: absolute;
		top: -52upx;
		right: -25upx;
		@include rect(36upx, 36upx);

		image {
			@include rect(100%, 100%)
		}
	}

	.reward-box {

		position: absolute;
		top: 20%;
		left: 75upx;
		width: 600upx;
		background-color: $bg-white;
		border-radius: $radius-md;
		z-index: 29;


		.reward-head-box {
			height: 720upx;
			background-size: cover;
			@include box-padding(28upx);
			padding-top: 1upx;

			.reward-tit {
				font-weight: 700;
				margin-top: 36upx;
				text-align: center;
				font-size: 34upx;
			}

			.reward-item-box {
				@include rect(100%, 440upx);
				margin-top: 60upx;


				.reward-item {
					@include rect(100%, 100upx);
					line-height: 100upx;
					border-radius: $radius-md;
					background-color: rgba(255, 255, 255, 0.9);
					@include box-padding(30upx);
					margin-bottom: 40upx;
					text-align: center;
					font-size: 30upx;
				}
			}

			.recive-btn {
				@include rect(400upx, 88upx);
				background-color: $main-color;
				@include text-allcenter(88upx);
				color: $text-white;
				border-radius: 44upx;
				margin: 20upx auto;

			}
		}
	}

	.mask {
		@extend %all-mask;

		.author-info {

			width: 580upx;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 85upx;
			background-color: $bg-white;
			border-radius: $radius-md;
			position: relative;
			// @include box-padding(32upx);
			padding-top: 1upx;
			z-index: 9;

			.pop-top {
				position: absolute;
				@include rect(260upx, 56upx);
				top: -52upx;
				left: 160upx;
			}
		}

		.home-id {
			@include rect(100%, 140upx);
			margin: 40upx auto;
			display: flex;
			justify-content: center;
			border-bottom: 1upx #E2E2E2 solid;

			image {
				@include rect(88upx, 88upx);
			}
		}

		.juide-cont {
			width: 100%;
			@include box-padding(32upx);
			padding-bottom: 1upx;

			.title {
				font-size: 34upx;
				text-align: center;
			}

			.juide-content {
				text-align: center;
				margin-top: 30upx;
				font-size: 28upx;
				line-height: 46upx;
				color: #B5B5B5;

			}

			.autho_btn {
				@extend %clear-button;
				font-size: 28upx;
				@include rect(300upx, 68upx);
				border-radius: $radius-md;
				background-color: $main-color;
				@include text-allcenter(68upx);
				color: $text-white;
				margin: 50upx auto;
			}
		}
	}

	.content {
		width: $screen-width;
		color: $uni-text-color;
		font-size: $font-md;
	}

	.head-info {
		// @include rect(100%, 422upx);
		@include rect(100%, 640upx);

		// background-color: $main-color;.
		swiper-item {
			// @include rect(100%, 422upx);
			@include rect(100%, 640upx);

			image {
				@include rect(100%, 100%);
			}
		}
	}

	.home-cont {
		position: relative;
		width: 100%;
		@include box-padding(32upx);
		margin-top: -40upx;

		.app-model {
			width: 100%;
			background-color: $bg-white;
			border-radius: 16upx;
			margin-bottom: 32upx;

			.model-box {
				@include rect(100%, 320upx);
				display: flex;

				view {
					@include rect(50%, 100%);
					@extend %flex-column;

					text {
						font-size: 36upx;
						line-height: 44upx;
						margin-top: 4upx;
					}

					.juide-txt {
						font-size: 24upx;
						color: #969CAB;
						margin-top: 28upx;
					}

					.take-pic {
						margin-top: 56upx;
						@include rect(112upx, 112upx)
					}

				}
			}
		}
	}

	.blance-box {
		@include rect(100%, 160upx);
		background-color: $bg-white;
		margin: 0upx 0 20upx auto;
		@extend %flex-alcent;
		border-radius: $radius-md;
		justify-content: space-between;

		.blance-l {
			margin-left: 36upx;

			view {
				@extend %flex-alcent;

				image {
					@include rect(32upx, 32upx) margin-right: 25upx;
				}

				&:last-child {
					color: $text-grey;
					font-size: 24upx;
					margin-top: 15upx;

					image {
						@include rect(9upx, 18upx);
						margin-left: 24upx;
					}
				}
			}
		}

		.blance-icon {
			@include rect(52upx, 52upx);
			margin-right: 50upx;
		}
	}

	.integral {
		width: 100%;
		height: 416upx;
		display: flex;
		justify-content: space-between;

		.integral_f {
			@include rect(335upx, 100%);
			border-radius: 16upx 0px 0px 16upx;
			background: $bg-white url(https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/miniAppSetting/b3a2e7b3e5227e1e1ba86c8a5c5b150.png) no-repeat;
			background-size: cover;
			@extend %integral;

		}

		.box-r {
			@include rect(335upx, 100%);

			.integral_s {
				@include rect(100%, 200upx);
				border-radius: 0px 16upx 0px 0px;
				background: $bg-white url(https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/miniAppSetting/d95e99296259695998bffdce64541e2.png) no-repeat;
				background-size: cover;
				margin-bottom: 16upx;
				@extend %integral;
			}

			.integral_t {
				@include rect(100%, 200upx);
				background: $bg-white url(https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/miniAppSetting/b2b95be2f4f202508436db72c10f174.png) no-repeat;
				background-size: cover;
				border-radius: 0px 0px 16upx 0px;
				@extend %integral;
			}
		}

		// .integral-item {
		// 	@include rect(220upx, 228upx);
		// 	margin: 0 19upx 19upx 0;
		// 	background-color: $bg-white;
		// 	border-radius: $radius-md;
		// 	position: relative;
		// 	overflow: hidden;

		// 	.bg-pic {
		// 		@include rect(112upx, 112upx);
		// 		position: absolute;
		// 		right: -20upx;
		// 		bottom: -14upx;
		// 	}

		// 	&:nth-of-type(3) {
		// 		margin: 0;

		// 		.sm-icon {
		// 			@include rect(31upx, 27upx);
		// 		}

		// 		.bg-pic {
		// 			@include rect(90upx, 105upx);
		// 			right: 0upx;
		// 			bottom: -9upx;
		// 		}
		// 	}

		// 	&:nth-of-type(2) {
		// 		.sm-icon {
		// 			@include rect(31upx, 27upx);
		// 		}

		// 		.bg-pic {
		// 			@include rect(98upx, 98upx);
		// 			right: 0upx;
		// 			bottom: -2upx;
		// 		}
		// 	}

		// 	&:nth-of-type(4) {
		// 		.sm-icon {
		// 			@include rect(30upx, 23upx);
		// 		}

		// 		.bg-pic {
		// 			@include rect(122upx, 122upx);
		// 			right: -22upx;
		// 			bottom: -22upx;
		// 		}
		// 	}


		// 	&:last-child {
		// 		width: 458upx;
		// 		margin: 0;

		// 		.sm-icon {
		// 			@include rect(26upx, 24upx);
		// 		}

		// 		.bg-pic {
		// 			@include rect(143upx, 143upx);
		// 			right: -20upx;
		// 			bottom: -20upx;
		// 		}
		// 	}

		// 	.intehead_info {
		// 		width: 100%;
		// 		margin: 36upx 0 0 24upx;
		// 		display: flex;

		// 		image {
		// 			@include rect(32upx, 32upx);
		// 			margin-right: 16upx;
		// 		}

		// 	}

		// 	.active {
		// 		width: 272upx;
		// 		margin: 20upx 0 0 30upx;

		// 		.active-juide {
		// 			height: 44upx;
		// 			display: flex;
		// 			align-items: flex-end;
		// 			margin-bottom: 20upx;

		// 			text {
		// 				line-height: 44upx;
		// 				font-size: 41upx;

		// 				&:last-child {
		// 					line-height: 30upx;
		// 					font-size: 21upx;
		// 				}
		// 			}

		// 			image {
		// 				@include rect(27upx, 44upx);
		// 				margin-right: 14upx;
		// 			}
		// 		}

		// 	}
		// }
	}

	.adver {
		width: 100%;
		// background-color: $bg-white;
		padding-top: 1upx;
		box-sizing: border-box;
		border-radius: $radius-md;

		.adver-tit {
			font-size: $font-lg;
			font-weight: 700;
			font-size: 36upx;
			line-height: 44upx;
			margin: 52upx 0 20upx 0;
		}

		.adver-item {
			@include rect(100%, 220upx);
			border-radius: 8upx;
			overflow: hidden;
			margin-bottom: 28upx;

			image {
				@include rect(100%, 100%);
			}
		}
	}



	.order-info {
		position: absolute;
		width: 100%;
		bottom: 0;
		// height: 53%;
		transform: translateY(100%);
		background-color: #F5F5F5;
		border-top-right-radius: 20upx;
		border-top-left-radius: 20upx;
		overflow: hidden;

		.desc-box {
			width: 100%;
			background: #F8F8FA;
			flex-direction: column;
			align-items: center;
			display: flex;

			view {
				display: flex;
			}

			.head-tit {
				@include rect(100%, 100upx);
				font-size: 35upx;
				line-height: 100upx;
				justify-content: center;
				font-weight: 700;
				position: relative;

				.close-pic {
					position: absolute;
					@include rect(100upx, 100upx);
					right: 0upx;
					top: 0upx;

					image {
						@include rect(55upx, 55upx);
						margin: 23upx 23upx 0 12upx;
					}
				}


			}

			.desc-cont {
				@include rect(698upx, 450upx);
				background-color: $bg-white;
				border-radius: $radius-md;
				flex-direction: column;
				@include box-padding(25upx);
				padding-bottom: 48upx;
				margin-bottom: 40upx;

				.desc-time {
					font-size: 28upx;
					color: black;
					line-height: 108upx;
				}

				.desc-cont-o {
					width: 100%;
					font-size: 25upx;
					color: #8A8A8A;
				}
			}

			.turnTo_btn {
				@include rect(698upx, 88upx);
				justify-content: cneter;
				line-height: 88upx;
				background-color: $main-color;
				color: $text-white;
				font-size: 32upx;
				margin: 0upx auto 40upx auto;
				border-radius: 44upx;
				justify-content: center;
			}
		}
	}
	.active_card {
		@include rect(100%, 122upx);
		@extend %flex-alcent;
		@include box-padding(30upx);
		justify-content: space-between;
		background-color: $bg-white;
		margin-top: 32upx;
		border-radius: 16upx;
	
	
		.card_l {
			@extend %flex-alcent;
			height: 100%;
	
			image {
				@include rect(72upx, 72upx) margin-right: 8upx;
			}
		}
	
		.card_r {
			image {
				@include rect(11upx, 17upx);
				margin-left: 18upx;
			}
	
			color: #969CAB;
			font-size: 24upx;
		}
	
		.active-desc {
			color: #969CAB;
		}
	
		.card_icon {
			@include rect(40upx, 48upx);
			margin-right: 18upx;
		}
	}
</style>
