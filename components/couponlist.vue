<template>
	<view class="coupons-box">
		<view class="coupons" :style="{backgroundImage:'url('+(currtab==0?'https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/123487/salesPromotion/f9fa3fb317f15a1c86bd35d5c6969d93.png':'https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/123487/salesPromotion/b3db06cd21c4faf7997d6138f7871f8f.png')+')'}"
		 v-for="(item,index) in coupons" :key="index" @click="checkCouponsDesc(item)" :class="{on:currtab>0}">
			<view class="coupons-l">
				<view class="cou_l_t">
					<view class="coupon_name">
						{{item.name}}
					</view>
				</view>
				<view class="cou_l_b">
					<text v-if="type!=1">可转赠</text>
					{{item.beginTime.slice(0,10) +'  		 '+item.endTime.slice(0,10)}}
				</view>
			</view>
			<view class="coupons-r">
				<text>{{type?(item.canUse==1?'使用':'不可使用'):(currtab==0?'查看\n使用限制':(currtab==1?'已使用':'已过期'))}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {

			};
		},
		props: {
			coupons: {
				type: Array,
				default: () => []
			},
			type: {
				type: Number,
				default: () => ''
			},
			currtab: {
				type: Number,
				default: () => ''
			}
		},
		methods: {
			// controlCoupons(item){
			// 	if(this.type==1){
			// 		if(item.canUse==2){
			// 			return 
			// 		}
			// 		app.globalData.orderinfo.ticketId = item.id;
			// 		uni.navigateBack({})
			// 	}
			// },
			//查看优惠券详情
			checkCouponsDesc(item) {
				if (!this.type) {
					this.$emit('checkCouponsDesc', item)
				} else {
					if (item.canUse == 2) {
						return
					}
					app.globalData.orderinfo.ticketId = item.id;
					uni.navigateBack({})
				}
			}
		}
	}
</script>

<style lang="scss">
	.coupons-box {
		width: $screen-width;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		
	}

	.coupons {
		@include rect(686upx, 226upx);
		margin-top: 25upx;
		// background: url();
		background-size: cover;
		justify-content: space-between;
		align-items: center;
		// align-items: center;
	}
	

	.coupons-l {
		height: 132upx;
		margin-left:60upx;
		color: $text-white;
		display: block;
		// 
		// line-height: 230upx;



	}

	.cou_l_t {
		width: 400upx;
		height: 56upx;
		@extend %flex-alcent;
		margin-bottom: 36upx;
		
	}

	.cou_l_b {
		height: 40upx;
		line-height: 40upx;
		color: #FFFFFF;
		font-size: 24upx;

		text {
			font-size: 28upx;
			margin-right: 16upx;
		}
	}

	.coupon_name {
		height: 56upx;
		@include box-padding(16upx);
		min-width: 182upx;
		font-size: 28upx;
		color: #B2D14E;
		background: #FFFFFF;
		box-shadow: inset 0px -8upx 40upx rgba(178, 209, 78, 0.5);
		border-radius: 8upx;
		line-height: 56upx;
		justify-content: center;
	}

	.coupons-l>text:first-child {
		font-size: 80upx;
		line-height: 200upx;
	}

	.coupons-r {
		width: 112upx;
		height: 80upx;
		align-items: center;
		justify-content: center;
		color: #B2D14E;
		margin-right: 40upx;
		text-align: center;
	}
	.on{
		.coupon_name{
			box-shadow: inset 0px -4px 20px #D3D3D3;
		}
		.coupons-r{
			color: #969CAB;
		}
		.coupon_name {
			color: #969CAB;
		}
	}
</style>
