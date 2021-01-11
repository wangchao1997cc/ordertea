<template>
	<view class="content">
		<swiper class="head-info" :autoplay="true" :circular="true" :interval="3000" :duration="1000">
			<!-- <navbar :config="config"></navbar> -->
			<swiper-item v-for="(item,index) in bannerData.topBannerList" :key="index" @click="jumpAdvertise(item)">
				<image :src="item.picUrl"></image>
			</swiper-item>
		</swiper>
		<view class="home-cont">
			<view class="app-model">
				<view class="" @click="jumpMenu(2)">
					<image class="take-pic" src="../../static/homepage/home_takeit_pic.png" mode=""></image>
					<image class="take-btn" src="../../static/homepage/takeit_btn.png"></image>
				</view>
				<view class="" @click="jumpMenu(1)">
					<image class="take-pic" src="../../static/homepage/home_takeout_pic.png"></image>
					<image class="take-btn" src="../../static/homepage/takeout_btn.png"></image>
				</view>
			</view>
			<view class="blance-box" @click="jumpWallet">
				<view class="blance-l">
					<view>
						<image src="../../static/money_icon.png"></image>
						我的余额：{{memberinfo.balance?memberinfo.balance:0}}
					</view>
					<view>
						点击进行充值，享取优惠
						<image src="../../static/07_icon_right.png"></image>
					</view>
				</view>
				<image class="blance-icon" src="../../static/member_icon.png"></image>
			</view>
			<view class="integral">
				<view class="integral-item" v-for="(item,index) in integralarr" :key="index" @click="jumpClissIfy(index)">
					<view class="intehead_info">
						<image :src="item.icon"></image>
						<view class="">
							<text>{{item.tit}}\n</text>
							<text>{{item.value}}</text>
						</view>
					</view>
					<view class="active" v-if="index==4">
						<view class="active-juide">
							<image class="sm-icon" src="../../static/homepage/home_milktea.png"></image>
							<text>6 </text>
							<text>/ 7</text>
						</view>
						<sildermine :config="sliderConfig"></sildermine>
						<view class="active-desc">
							再集4杯可获得好礼
							<image src="../../static/homepage/right.png"></image>
						</view>
					</view>
					<image class="bg-pic" :src="item.bg"></image>
				</view>
			</view>
			<view class="adver">
				<view class="adver-tit">
					新鲜事
				</view>
				<view class="adver-item" v-for="(item,index) in bannerData.bottomBannerList" :key="index" @click="jumpAdvertise(item)">
					<image :src="item.picUrl" mode="aspectFill"></image>
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
						天将红包
					</view>
					<scroll-view class="reward-item-box" scroll-y="true">
						<view class="reward-item" v-for="(item,index) in rewardarr">{{item}}</view>
					</scroll-view>
					<view class="recive-btn" @click="receiveReward">
						{{memberinfo?'一键领取':'登陆/注册一键领取'}}
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	const app = getApp();
	import author from '../../components/author.vue'
	import {
		getBannerList
	} from '../../utils/publicApi.js'
	import sildermine from '../../components/minesilder.vue'
	import {
		jumpAdvertise
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
		getMemberInfo
	} from '../../utils/publicApi.js'
	import {
		goUserAddress
	} from '../../utils/goToPage.js'
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				rewardarr: [], //奖励数组
				notAuth: false, //好友邀请幕布
				progressbar: '60%',
				title: 'Hello',
				sliderConfig: {
					progresswidth: '272upx',
					progressbar: '50%',
				},
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
			}
		},
		components: {
			sildermine,
			author,
		},
		// computed:{
		// 	...mapState(['isLogin']),

		// },
		async onLoad(options) {
			uni.hideTabBar({});
			if (!this.JSESSIONID) {
				await ajaxUserLogin(); //先进行登录
			}
			if (options.giveCardId) {
				this.homeParams = options;
			}
			uni.showTabBar({})
			this.init(); //归纳函数
		},
		computed: {
			...mapState(['cityid', 'JSESSIONID', 'isLogin'])
		},
		methods: {
			init() {
				this.getBannerList();
				this.juideUserInfo(); //判断用户是否登录
			},
			//领取天降红包
			async receiveReward() {
				let memberinfo = this.memberinfo;
				if (!memberinfo) {
					return that.$refs.authorM.showPop();
				}
				let data = {
					cardId: this.memberinfo.id,
					activityId: this.redRewardInfo.id,
				}
				let res = await api.receiveReward(data);
				if (res.code == 200) {
					this.redRewardInfo = null;
					this.$msg.showToast('恭喜您领取成功～');
				} else {
					this.$msg.showToast(res.message);
				}
			},
			//点击领取优惠卷
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
				let res = await api.receiveCoupons(data);
				this.notAuth = false
				if (res.code == 200) {
					this.$msg.showToast('领取成功～')
				} else {
					this.$msg.showToast(res.message)
				}
			},
			async juideUserInfo() {
				let that = this;
				if (!that.isLogin) {
					let userinfo = await refreshUserInfo(true);
					if (!userinfo || !userinfo.phone) {
						if (that.homeParams && that.homeParams.giveCardId) {
							that.receiveCoupons(); //领取优惠卷
						} else {
							that.$refs.authorM.showPop();
						}
						that.redReaward(); //查询红包奖励
					} else {
						let memberinfo = await getMemberInfo(true);
						that.integralarr[0].value = memberinfo.point;
						that.integralarr[3].value = memberinfo.coupons.length + '张';
						that.memberinfo = memberinfo;
						if (that.homeParams && that.homeParams.giveCardId) {
							that.receiveCoupons(); //领取优惠卷
						}
						that.redReaward(memberinfo.id);
					}
				}
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
						
						console.log('奖励数组', rewardarr)
					}
				}
			},
			//领取优惠卷
			async receiveCoupons() {
				let homeParams = this.homeParams;
				if (this.memberinfo.id != homeParams.giveCardId) {
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
				}
			},
			async loginSuccess(val) {
				let memberinfo = await getMemberInfo(true);
				this.memberinfo = memberinfo;
				if (this.redRewardInfo) {
					return this.receiveReward();
				}
				if (that.homeParams && that.homeParams.giveCardId) {
					that.receiveCouponsBtn(); //领取优惠卷
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
			jumpAdvertise(item) {
				jumpAdvertise(item)
			},
			//跳转充值
			jumpWallet() {
				if (this.memberinfo) {
					uni.navigateTo({
						url: '../wallet/wallet'
					})
				}
			},
			//跳转各个分类页面
			jumpClissIfy(index) {
				if (!this.memberinfo) {
					return;
				}
				switch (index) {
					case 0:
						uni.switchTab({
							url: '../mine/mine'
						})
						break;
					case 1:
						uni.navigateTo({
							url: '../shopping/shopping'
						})
						break;
					case 2:
						uni.switchTab({
							url: '../ordermenu/ordermenu'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '../coupons/coupons'
						})
						break;
					case 4:
						// uni.switchTab({
						// 	url:'../mine/mine'
						// })
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

	.reward-box {
		position: absolute;
		top: 20%;
		left: 75upx;
		width: 600upx;
		background-color: $bg-white;
		border-radius: $radius-md;
		overflow: hidden;
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
					line-height: 88upx;
					border-radius: $radius-md;
					background-color: $bg-white;
					@include box-padding(30upx);
					margin-bottom: 40upx;

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
		@include rect(100%, 640upx);

		// background-color: $main-color;.
		.swiper-item {
			@include rect(100%, 100%);

			image {
				@include rect(100%, 100%);
			}
		}
	}

	.home-cont {
		width: 100%;
		@include box-padding(26upx);
		margin-top: -80upx;

		.app-model {
			@include rect(100%, 345upx);
			background-color: $bg-white;
			border-radius: $radius-md;
			@extend %flex-alcent;

			view {
				@include rect(50%, 258upx);
				@extend %flex-column;
				justify-content: center;

				.take-btn {
					margin-top: 28upx;
					@include rect(143upx, 53upx)
				}

				&:first-child {
					.take-pic {
						@include rect(119upx, 94upx)
					}

					border-right: 1upx $line-color solid;
				}

				&:last-child {
					.take-pic {
						@include rect(107upx, 88upx)
					}
				}
			}
		}
	}

	.blance-box {
		@include rect(100%, 160upx);
		background-color: $bg-white;
		margin: 20upx 0;
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
		@extend %flex-list;

		.integral-item {
			@include rect(220upx, 268upx);
			margin: 0 19upx 19upx 0;
			background-color: $bg-white;
			border-radius: $radius-md;
			position: relative;
			overflow: hidden;

			.bg-pic {
				@include rect(112upx, 112upx);
				position: absolute;
				right: -20upx;
				bottom: -14upx;
			}

			&:nth-of-type(3) {
				margin: 0;

				.sm-icon {
					@include rect(31upx, 27upx);
				}

				.bg-pic {
					@include rect(90upx, 105upx);
					right: 0upx;
					bottom: -9upx;
				}
			}

			&:nth-of-type(2) {
				.sm-icon {
					@include rect(31upx, 27upx);
				}

				.bg-pic {
					@include rect(98upx, 98upx);
					right: 0upx;
					bottom: -2upx;
				}
			}

			&:nth-of-type(4) {
				.sm-icon {
					@include rect(30upx, 23upx);
				}

				.bg-pic {
					@include rect(122upx, 122upx);
					right: -22upx;
					bottom: -22upx;
				}
			}


			&:last-child {
				width: 458upx;
				margin: 0;

				.sm-icon {
					@include rect(26upx, 24upx);
				}

				.bg-pic {
					@include rect(143upx, 143upx);
					right: -20upx;
					bottom: -20upx;
				}
			}

			.intehead_info {
				width: 100%;
				margin: 36upx 0 0 24upx;
				display: flex;

				image {
					@include rect(32upx, 32upx);
					margin-right: 16upx;
				}

			}

			.active {
				width: 272upx;
				margin: 40upx 0 0 30upx;

				.active-juide {
					height: 44upx;
					display: flex;
					align-items: flex-end;
					margin-bottom: 30upx;

					text {
						line-height: 44upx;
						font-size: 41upx;

						&:last-child {
							line-height: 30upx;
							font-size: 21upx;
						}
					}

					image {
						@include rect(27upx, 44upx);
						margin-right: 14upx;
					}
				}

				.active-desc {
					width: 100%;
					margin-top: 10upx;
					font-size: 24upx;
					@extend %flex-alcent;
					color: #A3A3A3;

					image {
						@include rect(6upx, 13upx);
						margin-left: 12upx;
					}
				}
			}


		}
	}

	.adver {
		width: 100%;
		background-color: $bg-white;
		padding: 1upx 35upx;
		box-sizing: border-box;
		border-radius: $radius-md;

		.adver-tit {
			font-size: $font-lg;
			font-weight: 700;
			margin: 40upx auto;
		}

		.adver-item {
			@include rect(628upx, 220upx);
			border-radius: 8upx;
			overflow: hidden;
			margin-bottom: 28upx;

			image {
				@include rect(100%, 100%);
			}
		}
	}
</style>
