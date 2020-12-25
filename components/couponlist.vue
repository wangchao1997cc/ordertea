<template>
	<view class="coupons-box">
		<view class="coupons" v-for="(item,index) in coupons" :key="index">
			<view class="coupons-l">
				<view v-if="type!=1">
					<text>{{item.amount}}</text><text>元</text>
				</view>
			</view>
			<view class="coupons-r">
				<view class="coupon-tit">
					{{item.name}}
				</view>
				<view class="gift" >
					<text v-if="type!=1">可转赠</text>
				</view>
				<view class="cou-footer">
					<view class="cou-times">
						<text>{{item.beginTime+' '+item.endTime}}</text>
					</view>
					<view class="cou-btn" :class="{on:item.canUse==2}" @click="controlCoupons(item)">
						{{type?(item.canUse==1?'去使用':'不可使用'):'查看使用限制'}}
					</view>
				</view>
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
		props:{
			coupons:{
				type:Array,
				default:() =>[]
			},
			type:{
				type:Number,
				default:() => ''
			}
		},
		methods:{
			controlCoupons(item){
				if(this.type==1){
					if(item.canUse==2){
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
	.coupons-box{
		width: 100%;
		flex-direction: column;
	}
	.coupons{
		@include rect(700upx,200upx);
		margin: 25upx;
		background: url(https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/coupons_bg.png);
		background-size: cover;
	}
	.coupons-l{
		@include rect(200upx,200upx);
		color: $text-white;
		justify-content: center;
		line-height: 230upx;
		
	}
	.coupons-l>text:first-child{
		font-size: 80upx;
		line-height: 200upx;
	}
	.coupons-r{
		width: 500upx;
		padding: 20upx;
		box-sizing: border-box;
		flex-direction: column;
	}
	.coupon-tit{
		width: 100%;
		@include lineOnly();
		font-size: 35upx;
		margin-top: 10upx;
		height: 40upx;
		line-height: 40upx;
	}
	.gift{
		font-size: 31upx;
		height: 34upx;
		line-height: 34upx;
		margin-top: 20upx;
	}
	.cou-footer{
		@include rect(100%,54upx);
		justify-content: space-between;
		align-items: flex-end;
	}
	.cou-times{
		font-size: 21upx;
		color: rgba(0,0,0,.5);
	}
	.cou-btn{
		height: 54upx;
		@include box-padding(28upx);
		background-color: $main-color;
		color: $text-white;
		line-height: 54upx;
		border-radius: 27upx;
		&.on{
			background-color: $bg-grey;
			color: $text-grey;
		}
	}
</style>
