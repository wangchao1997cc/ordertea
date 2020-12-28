<template>
	<view class="content">
		<view class="times-cont">
			<view class="takemeal-time" @click="openChooseTime">
				<text>流水号</text>
				<text></text>
			</view>
			<view class="takemeal-time" @click="openChooseTime">
				<text>联系电话</text>
				<text></text>
			</view>
			<view class="takemeal-time">
				<text>预定时间</text>
				<text>{{storeInfo.phoneNumberList[0]}}</text>
			</view>
			<view class="takemeal-time" @click="openChooseTime">
				<text>送餐地址</text>
				<text></text>
			</view>
			<view class="takemeal-time" @click="openChooseTime">
				<text>订单编号</text>
				<text></text>
			</view>
			<view class="takemeal-time" @click="openChooseTime">
				<text>下单时间</text>
				<text></text>
			</view>
		</view>
		<view class="goods-info">
			<view class="goods-item" v-for="(item,index) in interest.products" :key="index">
				<view class="goods-info-t">
					<text>{{item.name}}</text>
					<text>￥{{item.price}}</text>
				</view>
				<view class="goods-info-t">
					<text>{{item.condiments[0]?item.condiments[0].name:'常规'}}</text>
					<text>x{{item.qty}}</text>
				</view>
			</view>
		</view>
		<view class="cost-price">
			<view class="cost-item">
				<text>餐饮费</text>
				<text>￥{{interest.orderTotal?interest.orderTotal:0}}</text>
			</view>
			<view class="cost-item">
				<text>餐盒费</text>
				<text>¥{{interest.boxFee?interest.boxFee:0}}</text>
			</view>
			<block v-for="(item,index) in interest.promotions" :key="index">
				<view class="cost-item" v-if="item.type!=6">
					<text>{{item.name}}</text>
					<text>¥{{item.amount}}</text>
				</view>
				<view class="cost-item" v-else>
					<text>{{item.name}}</text>
					<text>¥{{item.amount}}</text>
				</view>
			</block>

			<view class="cost-item" @click="jumpUseCoupons">
				<text>{{couponJuide.tit}}</text>
				<view class="span">{{couponJuide.cont}}</view>
			</view>
			<view class="summary">
				实付：<text class="black-text">￥{{interest.afterDiscountTotal?interest.afterDiscountTotal:0}}</text>
			</view>
		</view>
		<view class="balance">
			<text>会员余额支付</text>
			<view class="box-l" @click="switchUseBalance">
				<text>{{interest.balancePay?'已使用余额':'可用余额'}}：<text>{{interest.balancePay?interest.balancePay:(interest.card.balance?interest.card.balance:0)}}</text>元</text>
				<view class="chosebox" :class="{usebalance:interest.balancePay}">
					<image v-if="interest.balancePay" src="../../static/choose_icon.png"></image>
				</view>
			</view>
		</view>
		<view class="otherinfo">
			<view class="other-item" @click="jumpOrederReark">
				<text>订单备注</text>
				<view class="other-item-r">
					<view class="remark">{{remark?remark:'无'}}</view>
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
			<view class="other-item">
				<text>餐具份数</text>
				<view class="other-item-r">
					<text>{{peopleNum?peopleNum+'份':'根据餐量提供'}}</text>
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
		</view>
		<view class="blank"></view>
		<view class="footer-btn">
			<text>¥{{interest.afterDiscountTotal?interest.afterDiscountTotal:0}}</text>
			<view class="buy-btn" @click="addOrder">
				下单
			</view>
		</view>
		
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	const app = getApp();
	export default {
		data() {
			return {
				
			};
		},
		onLoad(options){
			let orderId = options.orderId;
			this.getOrderDetail(orderId);   //获取订单详情
		},
		onShow() {
			
		},
		onUnload() {
			app.globalData.remark = '';
		},
		computed: {
		
		},
		methods: {
			async getOrderDetail(orderId){
				let data = {
					orderId: orderId
				}
				let res = await api.getOrderDetail(data);
				console.log(11111111111111111,res)
				if (res && res.status == 1) {
					
				}
			}
		}
	}
</script>

<style lang="scss">
	$line-color: rgba(0, 0, 0, 0.14);

	.blank {
		height: 200upx;
	}

	.footer-btn {
		@include rect($screen-width, 128upx);
		position: fixed;
		background-color: $bg-white;
		bottom: 0upx;
		left: 0upx;
		@extend %flex-alcent;
		justify-content: space-between;

		text {
			color: $color-red;
			margin-left: 30upx;
			font-size: 35upx;
		}

		.buy-btn {
			@include rect(211upx, 100%);
			background-color: $main-color;
			@include text-allcenter(128upx);
			font-size: 32upx;
			color: $text-white;
		}
	}

	%box-style {
		background-color: $bg-white;
		@include box-padding(38upx);
		border-radius: $radius-md;
		margin-top: 25upx;
	}

	.otherinfo {
		width: 698upx;
		@extend %box-style;

		.other-item {
			@include rect(100%, 108upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx $line-color solid;

			&:last-child {
				border: none;
			}

			.other-item-r {
				color: #A3A3A3;
				@extend %flex-alcent;

				.remark {
					text-align: right;
					width: 400upx;
					@include lineOnly()
				}

				image {
					@include rect(16upx, 29upx);
					margin-left: 32upx;
				}
			}
		}
	}


	.balance {
		@include rect(698upx, 104upx);
		@extend %flex-alcent;
		justify-content: space-between;
		@extend %box-style;

		.box-l {
			@extend %flex-alcent;

			text {
				color: #A3A3A3;

				text {
					color: $main-color;
				}
			}

			.chosebox {
				@include rect(38upx, 38upx);
				border: 2upx #B2B5B8 solid;
				margin-left: 30upx;
				border-radius: 18upx;
				box-sizing: border-box;
				image{
					@include rect(38upx, 38upx);
				}
				
			}
			.usebalance{
				border: none;
			} 
		}
	}

	.cost-price {
		width: 698upx;
		margin-top: 25upx;
		@extend %box-style;

		.cost-item {
			@include rect(100%, 108upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx $line-color solid;

			text {
				font-size: 32upx;

				&:last-child {
					color: #A3A3A3;
				}
			}
		}

		.span {
			color: $main-color;
		}

		.summary {
			@include rect(100%, 103upx);
			line-height: 103upx;
			text-align: right;

			// text {
			// 	text {
			// 		color: $main-color;
			// 		margin-right: 12upx;
			// 	}
			// }

			.black-text {
				font-size: 32upx;
				color: #000000;
			}
		}
	}

	.content {
		width: $screen-width;
		@extend %flex-column;
		padding-top: 1upx;
		font-size: $font-md;
		color: $uni-text-color;

		.times-cont {
			@include rect(698upx, 380upx);
			@extend %box-style;
			margin-top: 26upx;

			.address {
				height: 168upx;
				padding: 38upx 0;
				box-sizing: border-box;
				border-bottom: 1upx $line-color solid;

				text {
					&:first-child {
						font-size: 35upx;
					}

					&:last-child {
						display: block;
						margin-top: 15upx;
						font-size: 25upx;
						color: #5D5D5D;
					}
				}
			}

			.takemeal-time {
				@include rect(100%, 105upx);
				@extend %flex-alcent;
				font-size: 31upx;
				border-bottom: 1upx $line-color solid;
				justify-content: space-between;

				&:last-child {
					border: none;
				}

				text {
					&:last-child {

						color: #A3A3A3;
					}
				}
			}
		}
	}

	.goods-info {
		width: 698upx;
		@extend %box-style;
		padding: 5upx 38upx;

		.goods-item {
			padding: 15upx 0upx;
			border-bottom: 1upx $line-color solid;

			&:last-child {
				border: none;
			}

			.goods-info-t {
				@extend %flex-alcent;
				justify-content: space-between;

				&:last-child {
					margin-top: 15upx;
					font-size: 24upx;
					color: #C2C3C5;
				}
			}
		}
	}
</style>
