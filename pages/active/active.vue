<template>
	<view class="content">
		<view class="invitation-tips">
			<view class="top-pic"><image src="../../static/active/active_head.png"></image></view>
			<view class="tips-cont">
				<view class="not-login" v-if="!memberinfo">
					<text v-if="couponsNums">
						您有
						<text>{{ couponsNums }}</text>
						张优惠券待领取
					</text>
					<text v-else>您有新的会员权益待领取</text>
				</view>

				<view class="cont-head" v-else>
					<view class="cont-item">
						<image src="../../static/active/invitation_coupons.png"></image>
						<text>获得优惠券</text>
						<text>{{ profitinfo.earnings.ticketCount || 0 }}张</text>
					</view>
					<view class="cont-item">
						<image src="../../static/active/invita_money.png"></image>
						<text>实际收益</text>
						<text>{{ profitinfo.earnings.orderMoneyEarnings || 0 }}元</text>
					</view>
					<view class="cont-item">
						<image src="../../static/active/invita_fir.png"></image>
						<text>累计邀请</text>
						<text>{{ profitinfo.earnings.invitationCount || 0 }}位</text>
					</view>
				</view>
			</view>
			<view class="invitation-btn">
				<button class="butt_item" v-if="memberinfo" open-type="share"></button>
				<button
					v-else
					class="butt_item"
					open-type="getPhoneNumber"
					@getphonenumber="decryptPhoneNumber"
				></button>
				{{ memberinfo ? '立即邀请' : '立即领取' }}
			</view>
		</view>
		<view class="invitation-tips invita-list" v-if="memberinfo">
			<view class="invita-list-tit">邀请记录</view>
			<scroll-view class="list-box" scroll-y>
				<view class="nodata" v-if="!activeDesc.sharePeopleistList.length">
					暂无邀请信息，快去邀请好友赚取福利吧～
				</view>
				<view
					class="firends-item"
					v-for="(item, index) in activeDesc.sharePeopleistList"
					:key="index"
				>
					<view class="user-pic">
						<image :src="item.headUrl || '../../static/mohead.png'"></image>
						<text>{{ item.name }}</text>
					</view>
					<text class="span">{{ item.createdString }}</text>
				</view>
			</scroll-view>
		</view>
		<view class="invitation-tips invita-list">
			<view class="invita-list-tit">活动规则</view>
			<view class="rules-desc">
				<jyf-parser :html="activeinfo.remark" selectable="true"></jyf-parser>
			</view>
		</view>
		<view class="blank"></view>

		<!-- <author ref="authorM" @loginSuccess="loginSuccess"></author> -->
		<view class="mask" v-if="notAuth">
			<view class="popup">
				<view class="title">授权提示</view>
				<view class="juide-cont" scroll-y>
					<text>请授权您的个人信息，让我们更好的为您服务</text>
				</view>
				<view class="hide-pop">
					<view class="author-btn" @click="cancelBtn">取消</view>
					<button class="author-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">
						确认授权
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import api from '../../WXapi/api.js';
// import author from '../../components/author.vue'
import jyfParser from '@/components/jyf-parser/jyf-parser'; //富文本组件
import {
	refreshUserInfo,
	userRegister,

	getMemberInfo
} from '../../utils/publicApi.js'
// ajaxUserLogin,
import {
	mapState,
	mapMutations
} from "vuex";
import {
	accAdd,
	subtr
} from '../../utils/utils.js'
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			activityId: null, //活动id
			profitinfo: {}, //自己的收益
			activeDesc: {}, //活动详情
			activeinfo: {}, //活动信息
			notAuth: false,
			userdata: {},
		}
	},
	async onShareAppMessage(res) {
		let data = {
			path: '/pages/active/active'
		}
		if (!this.activityId) {
			this.activityId = await this.getActiveInfo();
		}
		if (res.from === 'button') { // 来自页面内分享按钮
			data.path = '/pages/active/active?recommendedId=' + this.memberinfo.id + '&activityId=' + this.activityId;
			data.title = '快来和我一起领取超多福利吧～';
			data.imageUrl = this.activeDesc.imageUrl;
			data.bgImgUrl = this.activeDesc.shareImageUrl;
		}
		return data
	},
	computed: {
		...mapGetters(['memberinfo','openidinfo']),
		couponsNums() {
			let num = 0;
			let activeinfo = this.activeinfo;
			if (activeinfo.giftTicket) {
				let couponsarr = activeinfo.giftTicket.split(',');
				couponsarr.forEach(item => {
					let numarr = item.split('x');
					num = accAdd(num, Number(numarr[1]));
				})
			}
			return num;
		}
	},
	components: {
		// author,
		jyfParser,
	},
	async onLoad(options) {
		uni.showLoading({
			mask: 'true'
		})
		await this.$onLaunched;
		let that = this;
		let memberinfo = that.memberinfo;
		if (options) {
			app.globalData.activeParams = options; //保存推荐人id
			that.userdata = options;
		}
		if (!memberinfo) {
			await this.juideUserInfo(); //判断用户是否登录
		}
		uni.hideLoading();
		let activityId = await that.getActiveInfo();
		that.activityId = activityId;
		if (memberinfo) {
			that.cheackProfit(); //查看自己的收益
			that.activeDescInfo(); //查询活动详情信息
			if (!memberinfo.name) {
				that.notAuth = true;
			}
		}else{
			
		}
	},
	methods: {
		cancelBtn() {
			this.notAuth = false
		},
		async juideUserInfo() {
			let params = {
				WXOpenID: this.openidinfo.openid,
				interFaces: 'MemberInfoGet'
			};
			try {
				let res = await api.getUserInfo(params); //plus 用户信息
				if (res.Message.length) {
					await getMemberInfo(res.Message[0].strMobilePhone); //vka 会员用户信息
				}
			} catch (err) { }
		},
		//查询活动详情信息
		async activeDescInfo() {
			let data = {
				cardId: this.memberinfo.id,
				activityId: this.activityId
			};
			let res = await api.activityDesc(data, true);
			if (res.code == 200) {
				this.activeDesc = res.data;
			}
		},
		//用户授权信息
		async getUserInfo(e) {
			if (e.detail.errMsg == 'getUserInfo:ok') {
				let userInfo = e.detail.userInfo;
				userInfo.gender = subtr(userInfo.gender, 1);
				let memberinfo = this.memberinfo;
				let data = {
					name: userInfo.nickName,
					headUrl: userInfo.avatarUrl,
					sex: userInfo.gender,
					cardId: memberinfo.id,
				}
				let res = await api.updateMember(data, true);
				this.notAuth = false;
				if (res.code == 200) {} else {
					this.$msg.showToast(res.message)
				}
			} else {
				this.$msg.showToast('取消授权');
				this.notAuth = false;
			}

		},
		async getActiveInfo(bol) {
			let data = {};
			if (this.memberinfo) {
				data.cardId = this.memberinfo.id;
			}
			let res = await api.fissionActive(data, true);
			if (res.code == 200) {
				this.activeinfo = res.data;
				return res.data.id;
			}
		},
		//查看自己的收益
		async cheackProfit() {
			let data = {
				cardId: this.memberinfo.id,
				activityId: this.activityId,
			}
			let res = await api.restulActivity(data);
			if (res.code == 200) {
				this.profitinfo = res.data
			}
		},
		//新用户注册
		async decryptPhoneNumber(res) {
			let that = this;
			if (res.detail.errMsg == 'getPhoneNumber:ok') {
				// let data = {
				// 	encryptedData: encodeURI(res.detail.encryptedData).replace(/\+/g, '%2B'),
				// 	iv: encodeURI(res.detail.iv).replace(/\+/g, '%2B'),
				// }
				let data = {
					encryptedData: res.detail.encryptedData,
					iv: res.detail.iv,
					SessionKey: that.openidinfo.session_key
				};
				try {
					let result = await api.decryptPhoneNumber(data, true); //获取手机号
					let phone = result.Message.phoneNumber;
					let params = {
						HQCode: config.hqcode,
						WXOpenID: that.openidinfo.openid,
						Mobile: phone,
						interFaces: 'MemberInfoRegister'
					};
					await api.getUserInfo(params); //plus 注册会员
					if (this.member) {
						let userdata = {
							mobile: phone,
							openId: that.openidinfo.openid
						};
						await userRegister(userdata);  //vka 注册会员
					    that.notAuth = true;
						that.$msg.showToast('登录成功');
						that.cheackProfit(); //查看自己的收益
						that.activeDescInfo(); //获取活动详情
					}
				} catch(err){
					
				}
				// else if (result.status == 2) {
				// 	that.$store.commit('changeLogin', true);
				// 	that.$msg.showToast(result.msg);
				// 	let memberinfo = await getMemberInfo(true);
				// 	that.memberinfo = memberinfo;
				// }
			}
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: $main-color;
}

.mask {
	@extend %all-mask;

	.popup {
		@include rect(580upx, 400upx);
		position: absolute;
		left: 85upx;
		top: 33%;
		background-color: $bg-white;
		border-radius: 8upx;
		line-height: 48upx;
		font-size: 32upx;

		.title {
			margin-top: 48upx;
			text-align: center;
			font-weight: 700;
		}

		.juide-cont {
			width: 100%;
			@include box-padding(40upx);
			padding-top: 40upx;
			margin-top: 16upx;
			font-size: 32upx;
			color: rgba(0, 0, 0, 0.6);
			max-height: 490upx;
			text-align: center;
		}

		.hide-pop {
			@include rect(100%, 96upx);
			@extend %flex-alcent;
			border-top: 1upx rgba(0, 0, 0, 0.08) solid;
			// @include text-allcenter(96upx);
			color: $main-color;
			position: absolute;
			bottom: 0upx;
			line-height: 96upx;
			font-weight: 700;

			.author-btn {
				@include rect(50%, 96upx);
				text-align: center;
			}

			button {
				@extend %clear-button;
				color: $main-color;
				line-height: 96upx;
			}
		}
	}
}

.content {
	color: $uni-text-color;
	width: $screen-width;
	@extend %flex-column;
	justify-content: cneter;
	padding-top: 1upx;
}

.invitation-tips {
	margin-top: 340upx;
	width: 694upx;
	border-radius: 28upx;
	background-color: #ffffff;
	box-shadow: 0upx 9upx 18upx 0upx rgba(19, 19, 20, 0.2);
	position: relative;
	padding-top: 1upx;

	.top-pic {
		@include rect(400upx, 340upx);
		position: absolute;
		top: -264upx;
		left: 147upx;

		image {
			@include rect(400upx, 340upx);
		}
	}

	.tips-cont {
		width: 575upx;
		margin-top: 157upx;
		margin-left: 60upx;

		.not-login {
			margin-top: 85upx;
			font-size: 35upx;
			text-align: center;

			text {
				text {
					color: rgba(255, 97, 50, 1);
				}
			}
		}

		.cont-head {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.cont-item {
				@extend %flex-column;
				justify-content: cneter;

				image {
					@include rect(70upx, 70upx);
				}

				&:nth-of-type(2) {
					image {
						@include rect(70upx, 70upx);
					}
				}

				&:last-child {
					image {
						@include rect(104upx, 70upx);
					}
				}

				text {
					font-size: $font-md;
					line-height: 40upx;
					margin-top: 30upx;
				}

				text:last-child {
					color: #ff6031;
					margin: 0;
				}
			}
		}
	}

	.invitation-btn {
		@include rect(575upx, 88upx);
		border-radius: 44upx;
		margin: 45upx auto 60upx auto;
		background-color: $main-color;
		@include text-allcenter(88upx);
		color: $text-white;
		font-size: 32upx;
		position: relative;

		.butt_item {
			position: absolute;
			top: 0upx;
			left: 0upx;
			@include rect(575upx, 88upx);
			opacity: 0;
		}
	}
}

.invita-list {
	margin-top: 34upx;
}

.invita-list-tit {
	margin-top: 52upx;
	font-size: 32upx;
	text-align: center;
}

.list-box {
	width: 100%;
	@include box-padding(50upx);
	max-height: 600upx;
	margin-top: 65upx;

	.nodata {
		font-size: 26upx;
		color: #999999;
		text-align: center;
		margin-bottom: 50upx;
	}

	.firends-item {
		width: 100%;
		@extend %flex-alcent;
		justify-content: space-between;
		font-size: $font-md;
		margin-bottom: 36upx;

		.user-pic {
			height: 75upx;
			@extend %flex-alcent;

			image {
				border: 1upx $main-color solid;
				border-radius: 50%;
				@include rect(75upx, 75upx);
				margin-right: 32upx;
			}
		}

		.span {
			color: rgba(50, 50, 50, 0.5);
		}
	}
}

.rules-desc {
	margin: 35upx auto;
	width: 100%;
	@include box-padding(34upx);
	font-size: 25upx;
	color: rgba(138, 138, 138, 1);
}

.blank {
	height: 150upx;
}
</style>
