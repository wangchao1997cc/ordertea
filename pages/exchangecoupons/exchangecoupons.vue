<template>
	<view class="content">
		<input class="exchange-box" placeholder="请输入券码" v-model="ticketCode" />
		<view class="exchangeBtn" @click="begainExchange">
			确定兑换
		</view>
	</view>

</template>

<script>
	const app = getApp();
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				memberinfo:null,
				ticketCode:'',
			}
		},
		onLoad() {
			this.memberinfo = uni.getStorageSync('memberinfo');
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
			}
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
