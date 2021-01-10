<template>
	<view class="author-mask" @touchmove.stop.prevent="moveHandle" v-if="isauthorPhone">
		<view class="author">
			<view class="author-title">
				提示
			</view>
			<view class="author_cont">
				小程序将申请获取您的信息用于快捷登录，请您同意！
			</view>
			<view class="author-btn-box">
				<view class="author-btn" @click="hidePop">
					取消
				</view>
				<button class="author-btn" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../WXapi/api.js'
	import {refreshUserInfo,userRegister,ajaxUserLogin} from '../utils/publicApi.js'
	export default {
		data() {
			return {
				isauthorPhone: false,
			};
		},
		methods: {
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
				if (res.detail.errMsg == 'getPhoneNumber:ok') {
					let data = {
						encryptedData: encodeURI(res.detail.encryptedData).replace(/\+/g, '%2B'),
						iv: encodeURI(res.detail.iv).replace(/\+/g, '%2B'),
					}
					let result = await api.phoneLogin(data,true,true);
					if(result && result.status==1){
						this.$msg.showToast('登录成功');
						this.$store.commit('changeLogin',true);
						let userinfo = await refreshUserInfo(true);   //刷新用户信息
						let userdata = {
							mobile:userinfo.phone,
							openId:this.$store.state.openid,
						}
						let memberinfo = await userRegister(userdata);
						uni.setStorageSync('memberinfo', memberinfo);
						this.$emit('loginSuccess',memberinfo);
					}
				}
			}
			
		}
	}
</script>

<style lang="scss">
	.author-mask {
		@extend %all-mask;
	}

	.author {
		border-radius: $radius-md;
		width: 600upx;
		margin-left: 10%;
		background: $bg-white;
		position: fixed;
		top: 30%;
		z-index: 20;
	}

	.author-title {
		font-size: 30upx;
		line-height: 80upx;
		text-align: center;
	}

	.author_cont {
		width: 100%;
		@include box-padding(30upx);
		font-size: $font-md;
		margin: 10upx 0 38upx 0;
	}

	.author-btn-box {
		@include rect(560upx, 80upx);
		margin: 20upx auto;
		@extend %flex-alcent;
		justify-content: space-between;
	}

	.author-btn {
		color: $text-white;
		@extend %clear-button;
		@include rect(250upx, 80upx);
		@include text-allcenter(80upx);
		font-size: 32upx;
		border-radius: 10upx;
		background-color: $main-color;
	}
</style>
