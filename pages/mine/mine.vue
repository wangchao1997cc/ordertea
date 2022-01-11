<template>
	<view class="content">
		<view class="header_info">
			<image src="../../static/my/mine_bg.png" mode="aspectFill"></image>
			<!-- <navbar :config="config"></navbar> -->
			<view class="member-code" @click="jumpMemberCoed" v-if="member">
				<image src="../../static/member_icon.png"></image>
				会员码
			</view>
		</view>
		<view class="member-card">
			<view class="member-head">
				<view class="user-pic" @click="phoneLogin">
					<view class="pic-box">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view class="user-label" v-if="member">
						<image :src="currentLev.background" mode="aspectFill"></image>
						{{currentLev.levelName || ''}}
					</view>
					<view class="user-label" v-else>
						未登录会员
					</view>
				</view>
				
				<view class="user-detail" v-if="member">
					<view class="user-name">
						{{memberinfo.name?memberinfo.name:'普通用户'}}
					</view>
					<view class="card-no">
						卡号：{{memberinfo.cardNo || ''}}
					</view>
					<view class="slider-box">
						<view class="slider">
							<sildermine :config="sliderConfig"></sildermine>
						</view>
						<view class="fl">{{`${memberinfo.experience?memberinfo.experience:0}`}}/{{`${currentLev.upperLimit?currentLev.upperLimit:0}`}}</view>
					</view>
					<view class="upgrade_juide" v-if="currentLev.upperLimit-memberinfo.experience<0">
						恭喜您，已经达到最高等级
					</view>
					<view class="upgrade_juide" v-else>
						在累计{{(currentLev.upperLimit-memberinfo.experience) || 0}}经验值就可以升级
					</view>
				</view>
				<view class="user-detail" v-else>
					<view class="user-name">
						<open-data type="userNickName"></open-data>
					</view>
				</view>
			</view>
			<view class="user-assets" v-if="member">
				<view class="assets-item" @click="jumpShopping">
					<text>{{memberinfo.point?memberinfo.point:0}}</text>
					<text>商城</text>
				</view>
				<view class="assets-item" @click="jumpCoupons">
					<text>{{memberinfo.couponsCount?memberinfo.couponsCount:0}}</text>
					<text>优惠券</text>
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
				<view class="service-item" v-for="(item,index) in servicearr" :key="index" @click="jumpClassIfyPage(index)">
					<image :src="item.img"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<author ref="authorM" @loginSuccess="loginSuccess"></author>
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
							完善后即可获得您的专属折扣券
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
	const app = getApp();
	import author from '../../components/author.vue';
	import api from '../../WXapi/api.js'
	import sildermine from '../../components/minesilder.vue'
	import {
		getMemberInfo,
		getRecharge
	} from '../../utils/publicApi.js'
	import {
		subtr
	} from '../../utils/utils.js'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				notAuth: false,
				sliderConfig: {
					progresswidth: '320upx',
					progressbar: '0%'
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
					img: '../../static/my/change_password.png',
					text: '修改密码'
				}, {
					img: '../../static/my/about_icon.png',
					text: '关于我们'
				}, ],
				currentLev: null,
				member:false,   //是否展示会员内容
			}
		},
		onLoad() {
			// this.getActiveInfo();   //查询是否有裂变活动
		},
		computed:{
			...mapGetters(['memberinfo']),
		},
		async onShow() {
			let that = this,
				member = app.globalData.member;
			if(member){
				let memberinfo = getMemberInfo(that.memberinfo.mobile);
				// let memberinfo = that.memberinfo;
				console.log('会员信息',memberinfo)
				that.getGradeInfo(); //获取当前等级信息
				if (!memberinfo || !memberinfo.name) {
					// that.notAuth = true;
				}
			}else{
				that.servicearr = [{
					img: '../../static/my/about_icon.png',
					text: '关于我们'
				},]
			}
			that.member = member;
		},
		components: {
			sildermine,
			author,
		},
		methods: {
			// 手机号码登录
			phoneLogin() {
				if (!this.member) {
					this.$refs.authorM.showPop();
				}
			},
			async loginSuccess(val) {
				let that = this;
				that.$refs.authorM.hidePop();
				let member = app.globalData.member;
				if(member){
					let memberinfo = that.memberinfo;
					console.log('会员信息',memberinfo)
					that.getGradeInfo(); //获取当前等级信息
					that.servicearr = [{
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
						img: '../../static/my/change_password.png',
						text: '修改密码'
					}, {
						img: '../../static/my/about_icon.png',
						text: '关于我们'
					}, ]
				}else{
					that.servicearr = [{
						img: '../../static/my/about_icon.png',
						text: '关于我们'
					},]
				}
				that.member = member;
			},
			//查询裂变活动
			async getActiveInfo() {
				let res = await api.fissionActive({}, true);
				if (res.code == 200) {
					if (res.data) {
						return res.data;
						// this.activeinfo = res.data;
					}
				}
			},
			//获取当前等级信息
			async getGradeInfo() {
				let that = this;
				let res = await api.getLevel({});
				if (res.code == 200) {
					let experience = that.memberinfo.experience;
					let lev = res.data.filter(item => {
						return (experience == item.lowerLimit || experience > item.lowerLimit) && (experience < item.upperLimit ||
							experience == item.lowerLimit)
					})
					if (lev.length == 0) {
						lev.push(res.data[res.data.length - 1])
					}
					let width = 0;
					width = Math.floor((that.memberinfo.experience / lev[0].upperLimit) * 100);
					if (width) {
						that.sliderConfig.progressbar = width + '%';
					}
					that.currentLev = lev[0];
				} else {
					that.$msg.showToast(res.message)
				}
			},
			//用户授权信息
			async getUserInfo(e) {
				if (e.detail.errMsg == 'getUserInfo:ok') {
					let userInfo = e.detail.userInfo;
					userInfo.gender = subtr(userInfo.gender, 1);
					let memberinfo = uni.getStorageSync('memberinfo')
					let data = {
						name: userInfo.nickName,
						headUrl: userInfo.avatarUrl,
						sex: userInfo.gender,
						cardId: memberinfo.id,
					}
					let res = await api.updateMember(data, true);
					if (res.code == 200) {
						uni.navigateTo({
							url: '../userdetail/userdetail'
						})
					} else {
						this.$msg.showToast(res.message)
					}
				}
				this.notAuth = false;
			},
			//跳转优惠券
			jumpCoupons() {
				uni.navigateTo({
					url: '../coupons/coupons'
				})
			},
			//跳转商城
			jumpShopping() {
				uni.navigateTo({
					url: '../shopping/shopping'
				})
			},
			//跳转钱包页面
			async jumpWallet() {
				let walletShow = await getRecharge();
				if (!walletShow) {
					return this.$msg.showToast('非常抱歉，现在没有开启充值活动')
				}
				uni.navigateTo({
					url: '../wallet/wallet'
				})
			},
			//跳转分类页面
			async jumpClassIfyPage(index) {
				if(!this.member){
					uni.navigateTo({
						url: '../mine/aboutM/aboutM'
					})
					return;
				}
				let url = '';
				switch (index) {
					case 0:
						url = '../transrecord/transrecord';
						break;
					case 1:
						url = '../address/address';
						break;
					case 2:
						url = '../userdetail/userdetail';
						break;
					case 3:
						let walletShow = await getRecharge();
						if (!walletShow) {
							return this.$msg.showToast('非常抱歉，现在没有开启充值活动')
						}
						url = '../wallet/wallet';
						break;
					case 4:
						url = '../shopping/shopping';
						break;
					case 5:
						let activeinfo = await this.getActiveInfo();
						if (!activeinfo) {
							return this.$msg.showToast('非常抱歉，现在没有开启裂变活动，敬请期待！')
						}
						url = '../active/active';
						break;
					case 6:
						url = '../gradedesc/gradedesc';
						break;
					case 7:
						url = '../changePassword/changePassword';
						break;
					case 8:
						url = '../mine/aboutM/aboutM';
						break;
				}
				uni.navigateTo({
					url: url
				})
			},
			//跳转会员码
			jumpMemberCoed() {
				uni.navigateTo({
					url: '../membercode/membercode'
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
		position: relative;

		// background: url('https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/7622/top_bg.png');
		// background-size: 750upx 542upx;
		image {
			@include rect(100%, 100%)
		}

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
		@include rect(698upx, auto);
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

		@include rect(698upx, auto);
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
				&:last-child{
					image {
						@include rect(40upx, 40upx);
					}
				}
			}

		}
	}
</style>
