<template>
	<view class="content">
		<view class="header_info">
			<!-- <navbar :config="config"></navbar> -->
			<view class="member-code">
				<image src="../../static/member_icon.png"></image>
				会员码
			</view>
		</view>
		<view class="member-card">
			<view class="member-head">
				<view class="user-pic">
					<view class="pic-box">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view class="user-label">
						<image :src="currentLev.background" mode="aspectFill"></image>
						{{currentLev.levelName}}
					</view>
				</view>
				<view class="user-detail">
					<view class="user-name">
						{{memberinfo.name?memberinfo.name:'用户'}}
					</view>
					<view class="card-no">
						卡号：{{memberinfo.cardNo}}
					</view>
					<view class="slider-box">
						<view class="slider">
							<sildermine :config="sliderConfig"></sildermine>
						</view>
						<view class="fl">{{`${memberinfo.experience?memberinfo.experience:0}`}}\{{`${currentLev.upperLimit?currentLev.upperLimit:0}`}}</view>
					</view>
					<view class="upgrade_juide">
						在累计{{currentLev.upperLimit-memberinfo.experience}}经验值就可以升级
					</view>
				</view>
			</view>
			<view class="user-assets">
				<view class="assets-item" @click="jumpShopping">
					<text>{{memberinfo.point?memberinfo.couponsCount:0}}</text>
					<text>商城</text>
				</view>
				<view class="assets-item" @click="jumpCoupons">
					<text>{{memberinfo.couponsCount?memberinfo.couponsCount:0}}</text>
					<text>优惠卷</text>
				</view>
				<view class="assets-item" @click="jumpWallet">
					<text>{{memberinfo.balance?memberinfo.balance:0}}</text>
					<text>钱包</text>
				</view>
			</view>
		</view>
		<view class="min-service-box">
			<view class="head-tit">
				我的服务
			</view>
			<view class="service-box">
				<view class="service-item" v-for="(item,index) in servicearr" :key="index">
					<image :src="item.img"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<view class="mask" v-if="notAuth">
			<view class="author-info">
				<image class="pop-top" src="../../static/POP_top.png"></image>
				<view class="home-id">
					<image src="../../static/my/mine_detail_icon.png"></image>
				</view>
				<view class="juide-cont">
					<view class="title">
						完善信息
					</view>
					<view class="juide-content">
						<text>您的会员信息还不完整哦!
							为了您的权益请尽快完善您的会员信息
							完善后即可获得您的专属折扣卷
						</text>
					</view>
					<button class="autho_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">
						即刻完善信息
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import navbar from '../../components/nav.vue'
	import api from '../../WXapi/api.js'
	import sildermine from '../../components/minesilder.vue'
	import {
		getMemberInfo
	} from '../../utils/publicApi.js'
	import {subtr} from '../../utils/utils.js'
	export default {
		data() {
			return {
				notAuth: false,
				memberinfo: {},
				sliderConfig: {
					progresswidth: '320upx',
					progressbar: '50%',
				},
				servicearr: [{
					img: '../../static/my/pay-record.png',
					text: '消费记录'
				}, {
					img: '../../static/address_icon.png',
					text: '地址管理'
				}, {
					img: '../../static/my/mine_detail_icon.png',
					text: '个人资料'
				}, {
					img: '../../static/my/blance_icon.png',
					text: '余额充值'
				}, {
					img: '../../static/my/shop_icon.png',
					text: '积分商城'
				}, {
					img: '../../static/my/active_icon.png',
					text: '裂变活动'
				}, {
					img: '../../static/my/lv_icon.png',
					text: '会员等级'
				}, {
					img: '../../static/my/about_icon.png',
					text: '关于我们'
				}, ],
				currentLev:{},
			}
		},
		onLoad() {
			
		},
		async onShow() {
			let memberinfo = await getMemberInfo(true);
			this.memberinfo = memberinfo;
			this.getGradeInfo(); //获取当前等级信息
			if (!memberinfo || !memberinfo.name) {
				this.notAuth = true;
			}
		},
		components: {
			sildermine,
		},
		methods: {
			//获取当前等级信息
			async getGradeInfo() {
				let res = await api.getLevel({});
				if(res.code==200){
					let experience = this.memberinfo.experience;
					let lev =  res.data.filter(item => {
						return (experience == item.lowerLimit || experience > item.lowerLimit) && (experience < item.upperLimit || experience == item.lowerLimit)
					})
					this.currentLev = lev[0];
				}
			},
			//用户授权信息
			async getUserInfo(e) {
				if (e.detail.errMsg == 'getUserInfo:ok') {
					let userInfo = e.detail.userInfo;
					userInfo.gender = subtr(userInfo.gender,1);
					let memberinfo = uni.getStorageSync('memberinfo')
					let data = {
						name: userInfo.nickName,
						headUrl: userInfo.avatarUrl,
						sex: userInfo.gender,
						cardId: memberinfo.id,
					}
					let res = await api.updateMember(data, true);
					if (res.code == 200) {
						this.notAuth = false;
						uni.navigateTo({
							url: '../userdetail/userdetail'
						})
					}
				}
			},
			//跳转优惠卷
			jumpCoupons(){
				uni.navigateTo({
					url:'../coupons/coupons'
				})
			},
			//跳转商城
			jumpShopping(){
				uni.navigateTo({
					url:'../shopping/shopping'
				})
			},
			//跳转钱包页面
			jumpWallet(){
				uni.navigateTo({
					url:'../wallet/wallet'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		font-size: $font-md;
		width: $screen-width;
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

	.header_info {
		@include rect(750upx, 542upx);
		border: 1upx $main-color solid;
		position: relative;
		background-color: $main-color;

		.member-code {
			position: absolute;
			@include rect(145upx, 55upx);
			bottom: 123upx;
			right: 23upx;
			background-color: $bg-white;
			border-radius: 55upx;
			@extend %flex-alcent;
			justify-content: center;
			font-size: 20upx;
			color: $main-color;

			image {
				@include rect(25upx, 25upx);
				margin-right: 12upx;
			}
		}

	}

	.member-card {
		position: relative;
		@include rect(698upx, 328upx);
		background-color: $bg-white;
		border-radius: $radius-md;
		margin: -105upx auto 0 auto;
		z-index: 10;
		@include box-padding(28upx);

		.member-head {
			@include rect(100%, 180upx);
			display: flex;
			padding-left: 20upx;
			box-sizing: border-box;

			.user-pic {
				position: relative;
				z-index: 20;
				@include rect(160upx, 160upx);
				border-radius: 80upx;
				margin-top: -40upx;

				.pic-box {
					@include rect(160upx, 160upx);
					border-radius: 80upx;
					overflow: hidden;

					open-data {
						@include rect(160upx, 160upx);
					}
				}

				.user-label {
					position: absolute;
					@include rect(155upx, 40upx);
					bottom: -17upx;
					left: 2.5upx;
					border: 2upx $main-color solid;
					box-sizing: border-box;
					@extend %flex-alcent;
					justify-content: center;
					background-color: $bg-white;
					border-radius: 20upx;
					color: #F5C164;
					font-size: 20upx;
					line-height: 40upx;

					image {
						@include rect(27upx, 18upx);
						margin-right: 8upx;
					}
				}
			}

			.user-detail {
				margin-left: 23upx;

				.user-name {
					font-size: 32upx;
					color: #28282A;
					font-weight: 700;
					margin-top: 20upx;
				}

				.card-no {
					font-size: 22upx;
					color: #A3A3A3;
					margin-top: 5upx;
				}

				.slider-box {
					width: 430upx;
					font-size: 20upx;
					color: $main-color;
					position: relative;

					.slider {
						width: 320upx;
					}

					.fl {
						position: absolute;
						width: 100upx;
						right: -8upx;
						top: -8upx;
					}
				}

				.upgrade_juide {
					color: #A3A3A3;
					font-size: 20upx;
					font-size: 20upx;
				}
			}
		}

		.user-assets {
			@include rect(100%, 114upx);
			display: flex;
			margin-top: 10upx;

			.assets-item {
				flex: 1;
				@extend %flex-column;
				justify-content: center;
				font-size: 32upx;
				font-weight: 700;

				text:last-child {
					font-size: 24upx;
					color: #A3A3A3;
					margin-top: 15upx;
				}

			}
		}
	}

	.min-service-box {

		@include rect(698upx, 400upx);
		background-color: $bg-white;
		margin: 25upx auto;
		border-radius: $radius-md;
		@include box-padding(40upx);
		padding-top: 1upx;

		.head-tit {
			font-size: 32upx;
			margin-top: 30upx;
		}

		.service-box {
			width: 100%;
			@extend %flex-list;
			margin-top: 40upx;

			.service-item {
				width: 25%;
				@extend %flex-column;
				margin-bottom: 56upx;

				text {
					font-size: 24upx;
					color: #A3A3A3;
					margin-top: 12upx;
				}

				image {
					@include rect(37upx, 48upx);
				}

				&:nth-of-type(2) {
					image {
						@include rect(35upx, 48upx);
					}
				}

				&:nth-of-type(3) {
					image {
						@include rect(45upx, 48upx);
					}
				}

				&:nth-of-type(4) {
					box-sizing: border-box;

					image {
						@include rect(48upx, 48upx);
					}
				}

				&:nth-of-type(n+5) {
					image {
						@include rect(40upx, 40upx);
					}
				}
			}

		}
	}
</style>
