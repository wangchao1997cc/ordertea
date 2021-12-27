<template>
	<view class="content">
		<view class="update_password">
			<view class="password-item">
				<text>新密码</text>
				<input type="text" class="password" password maxlength="10" v-model="password" placeholder="请输入新密码" placeholder-class="password-pla"></input>
			</view>
			<view class="password-item">
				<text>确认密码</text>
				<input type="text" class="password" password maxlength="10" v-model="passwordF" placeholder="请再次确认密码" placeholder-class="password-pla"></input>
			</view>
		</view>
		<view class="save_btn" @click="savePassword">
			确认修改
		</view>
		<view class="tips">
			<view class="title">温馨提示</view>
			<view class="content">
				<text>1、</text>
				<text>该密码为会员密码，初始会员密码为随机密码，请自行修改。</text>
			</view>
			<view class="content">
				<text>2、</text>
				<text>在实体门店使用会员时，通过会员手机号来查询使用会员资产时，需要输入此密码验证。（出示会员码来查询使用会员资产时，则不需要输入密码来验证）。</text>
			</view>
			<view class="content">
				<text>3、</text>
				<text>修改密码页面，可直接修改为当前新密码。</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				password: '',
				passwordF: ''
			}
		},
		computed:{
			...mapGetters(['memberinfo']),
		},
		mounted() {
		},
		onLoad() {
		},
		methods: {
			async savePassword() {
				const that = this
				if (!that.password) {
					that.$msg.showToast('请输入密码')
				} else if (!that.passwordF) {
					that.$msg.showToast('请输入确认密码')
				} else if (that.password.length < 6 || that.passwordF.length < 6) {
					that.$msg.showToast('密码最少输入6位！')
				} else if (that.password != that.passwordF) {
					that.$msg.showToast('两次输入的密码不统一，请确认密码！')
				} else {
					console.log(that.password, that.passwordF)
					let data = {
						password: that.password,
						cardId: that.memberinfo.id
					}
					let res = await api.updatePassword(data)
					console.log(res)
					if (res.code) {
						that.$msg.showToast('修改成功')
						that.password = that.passwordF = ''
						// setTimeout(() => {
						// 	uni.navigateBack({
						// 		delta: 1
						// 	})
						// }, 2000)
					} else {
						that.$msg.showToast('修改失败！请稍后重试！')
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.update_password {
		margin-top: 24upx;
		background: $uni-text-color-inverse;
		padding-left: 48upx;
		
		.password-item {
			@include rect(100%, 108upx);
			@extend %flex-alcent;
			font-size: 28upx;
			
			&+.password-item {
				border-top: 1upx #EBEBEB solid;
			}
			
			input {
				text-align: left;
			}
			
			text {
				display: inline-block;
				width: 144upx;
				color: $uni-text-color;
			}
		}
		
		.password-pla {
			color: $uni-text-color-grey;
		}
	}
	
	.save_btn {
		@include rect(698upx, 88upx);
		border-radius: 8upx;
		background-color: $main-color;
		@include text-allcenter(88upx);
		color: $text-white;
		margin: 73upx auto 0;
		font-size: 28upx;
	}
	
	.tips {
		margin: 48upx 32upx 0;
		
		.title {
			color: $text-dark;
			font-size: 28upx;
			line-height: 40upx;
			padding-bottom: 16upx;
		}
		
		.content {
			display: flex;
			font-size: 24upx;
			color: $uni-text-color-grey;
			line-height: 36upx;
		}
	}
</style>
