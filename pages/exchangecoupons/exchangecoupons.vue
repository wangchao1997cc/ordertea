<template>
	<view class="content">
		<view class="exchange-box">
			<input placeholder="请输入券码" v-model="ticketCode" />
			<view class="qrcode-btn" @click="scanCode">
				<image src="../../static/scan_code.png"></image>
				扫码
			</view>
		</view>
		
		<view class="exchangeBtn" @click="begainExchange">
			确定兑换
		</view>
	</view>

</template>

<script>
	const app = getApp();
	import api from '../../WXapi/api.js'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				ticketCode:'',
			}
		},
		computed:{
			...mapGetters(['memberinfo']),
		},
		methods: {
			//开始兑换
			async begainExchange(){
				let data = {
					ticketCode:this.ticketCode,
					cardId: this.memberinfo.id,
				}
				let res = await api.codeByTicket(data,true);
				if(res.code==200){
					this.$msg.showToast('恭喜您，兑换成功！');
					app.globalData.exchangeSuccess = true;
					uni.navigateBack({})
				}
			},
			//点击开始扫码
			scanCode(){
				let that = this;
				uni.scanCode({
				    success: function (res) {
						that.ticketCode = res.result;
				    }
				});
			},
		}
	}
</script>

<style lang="scss">
	.content{
		font-size: $font-md;
		color: $uni-text-color;
	}
	.exchange-box{
		@include rect(698upx,106upx);
		background-color: $bg-white;
		margin: 30upx auto;
		@include box-padding(34upx);
		border-radius: $radius-md;
		@extend %flex-alcent;
		justify-content: space-between;
		input{
			@include rect(500upx,100%);
		}
		
	}
	.qrcode-btn {
		@include rect(176upx, 76upx);
		background-color: $main-color;
		@extend %flex-alcent;
		justify-content: center;
		border-radius: 38upx;
	
		image {
			@include rect(30upx, 30upx);
			margin-right: 12upx;
		}
		color: $text-white;
	}
	.exchangeBtn{
		@include rect(698upx, 88upx);
		background-color: $main-color;
		@include text-allcenter(88upx);
		position: fixed;
		left: 27upx;
		bottom: 78upx;
		border-radius: 44upx;
		color: $text-white;
		
	}
</style>
