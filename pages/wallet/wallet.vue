<template>
	<!-- 钱包页面 -->
	<view class="content">
		<view class="wallet-head">
			<view class="head_tit">
				当前余额
			</view>
			<view class="balance-box">
				<text>55.00</text>
				<view class="record-btn">
					充值记录
				</view>
			</view>
		</view>
		<mswiper :imgList="imgList"></mswiper>
		<view class="recharge-desc">
			充值说明
			<text>
				\n内含100元储值金、折扣券X10,额外赠送10元、10积分
			</text>
			<text>\n*以下等级可以充值：LV1，LV2</text>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import mswiper from '../../components/m-swiper/m-swiper.vue'
	export default {
		data() {
			return {
				imgList:[],   //充值卡套餐数据
			}
		},
		components:{
			mswiper
		},
		onLoad() {
			this.init();
		},
		methods: {
			init(){
				this.getPackage();   //获取充值套餐
			},
			async getPackage(){

				let res =  await api.getRecharge({});
				if(res.code==200){
					console.log(11,res)
					let powerarr = [];
					// res.data.
					this.imgList = res.data;
					
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content{
		font-size: $font-md;
		color: $uni-text-color;
	}
	.wallet-head{
		@include rect(100%,213upx);
		@include box-padding(30upx);
		padding-top: 1upx;
		.head_tit{
			margin-top: 50upx;
			font-size: 31upx;
			
		}
		
		.balance-box{
			margin-top: 30upx;
			height: 60upx;
			@extend %flex-alcent;
			justify-content: space-between;
			text{
				
				font-size: 56upx;
				line-height: 60upx;
				color: black;
			}
			.record-btn{
				@include rect(150upx,50upx);
				background-color: $main-color;
				font-size: 27upx;
				color: $text-white;
				@include text-allcenter(50upx);
				border-radius: 25upx;
			}
		}
	}
	
	.recharge-desc{
		font-size: 32upx;
		width: 100%;
		margin-top: 30upx;
		@include box-padding(28upx);
		text{
			font-size: 28upx;
		}
	}

</style>
