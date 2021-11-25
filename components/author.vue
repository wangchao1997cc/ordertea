<template>
	<view class="author-mask" @touchmove.stop.prevent="moveHandle" v-if="isauthorPhone">
		<view class="author">
			<view class="author-title">手机号授权登录</view>
			<view class="author_cont">
				<view class="logo-png"><image src="../../static/logo.png"></image></view>
				<view class="juide-txt">{{ hqName }}点餐小程序</view>
			</view>
			<view class="author-btn-box">
				<view class="author-btn" @click="hidePop">取消</view>
				<button
					class="author-btn clear-button"
					open-type="getPhoneNumber"
					@getphonenumber="decryptPhoneNumber"
				>
					确定
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import api from '../WXapi/api.js';
import { refreshUserInfo, userRegister } from '../utils/publicApi.js';
import { mapGetters,mapMutations } from 'vuex';
import config from '../config/index.js';
export default {
	data() {
		return {
			isauthorPhone: false,
			hqName: config.hqName
		};
	},
	computed: {
		...mapGetters(['openidinfo'])
	},
	mounted() {
		this.member = app.globalData.member;
	},
	methods: {
		...mapMutations('user', ['SET_PLUSINFO']),
		moveHandle() {
			return;
		},
		hidePop() {
			this.isauthorPhone = false;
		},
		showPop() {
			this.isauthorPhone = true;
		},
		async decryptPhoneNumber(res) {
			let that = this;
			if (res.detail.errMsg == 'getPhoneNumber:ok') {
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
					let plusInfo =  await api.getUserInfo(params); //plus 注册会员
					that.SET_PLUSINFO(plusInfo.Message);  //存储会员code
					if (that.member) {
						let userdata = {
							mobile: phone,
							openId: that.openidinfo.openid
						};
						await userRegister(userdata);  //vka 注册会员
						that.$emit('loginSuccess',true);
					}
				} catch (err) {
				}
			}
		}
	}
};
</script>

<style lang="scss">
.author-mask {
	@extend %all-mask;
	z-index: 299;
}

.author {
	border-radius: $radius-md;
	width: 622upx;
	margin-left: 64upx;
	background: $bg-white;
	position: fixed;
	top: 30%;
	z-index: 20;
}

.author-title {
	font-size: 30upx;
	line-height: 114upx;
	text-align: center;
	border-bottom: 1upx #f0f1f5 solid;
}

.author_cont {
	width: 100%;
	height: 234upx;
	font-size: $font-md;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.logo-png {
	@include rect(80upx, 80upx);
	text-align: center;
	background: #f0f1f5;
	border-radius: 40upx;
	margin: 32upx 0 24upx 0;

	image {
		@include rect(64upx, 38upx);
		margin-top: 21upx;
	}
}

.author-btn-box {
	@include rect(100%, 100upx);
	@extend %flex-alcent;
	justify-content: space-between;
	border-top: 1upx #f0f1f5 solid;
}

.author-btn {
	@include rect(50%, 100upx);
	text-align: center;
	line-height: 100upx;
	font-size: 32upx;
	border-right: 1upx #f0f1f5 solid;
}
.clear-button {
	@extend %clear-button;
	border-bottom-right-radius: 16upx;
	color: #73c31c;
}
</style>
