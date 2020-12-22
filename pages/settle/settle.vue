<template>
	<view class="content">
		<view class="times-cont">
			<view class="address">
				<text>上海闵行店\n</text>
				<text>上海市闵行区漕河泾XXXX商铺,99号</text>
			</view>
			<view class="takemeal-time">
				<text>取餐时间</text>
				<text>2020-12-08 14:56:59</text>
			</view>
			<view class="takemeal-time">
				<text>联系电话</text>
				<text>13788899999</text>
			</view>
		</view>
		<view class="goods-info">
			<view class="goods-info-t">
				<text>好喝的奶茶</text>
				<text>￥88</text>
			</view>
			<view class="goods-info-t">
				<text>少糖、去冰</text>
				<text>x1</text>
			</view>
			
		</view>
		<view class="cost-price">
			<view class="cost-item">
				<text>餐饮费</text>
				<text>￥10</text>
			</view>
			<view class="cost-item">
				<text>餐盒费</text>
				<text>0</text>
			</view>
			<view class="cost-item">
				<text>优惠卷</text>
				<view class="span">10张可用</view>
			</view>
			<view class="summary">
				<text>会员折扣：<text>10折扣</text>实付：</text><text class="black-text">￥88.00</text>
			</view>
		</view>
		<view class="balance">
			<text>会员余额支付</text>
			<view class="box-l">
				<text>可用余额：<text>0</text>元</text>
				<view class="chosebox"></view>
			</view>
		</view>
		<view class="otherinfo">
			<view class="other-item">
				<text>订单备注</text>
				<view class="other-item-r">
					<text>打包带走</text>
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
			<view class="other-item">
				<text>餐具份数</text>
				<view class="other-item-r">
					<text>2</text>
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
		</view>
		<view class="blank"></view>
		<view class="footer-btn">
			<text>￥99</text>
			<view class="buy-btn">
				下单
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		onLoad() {
			
		},
	}
</script>

<style lang="scss">
	$line-color: rgba(0, 0, 0, 0.14);
	.blank{
		height: 200upx;
	}
	
	.footer-btn{
		@include rect($screen-width,128upx);
		position: fixed;
		background-color: $bg-white;
		bottom: 0upx;
		left: 0upx;
		@extend %flex-alcent;
		justify-content: space-between;
		text{
			color: $color-red;
			margin-left: 30upx;
			font-size: 35upx;
		}
		.buy-btn{
			@include rect(211upx,100%);
			background-color: $main-color;
			@include text-allcenter(128upx);
			font-size: 32upx;
			color: $text-white;
		}
	}
	
	%box-style{
		background-color: $bg-white;
		@include box-padding(38upx);
		border-radius: $radius-md;
		margin-top: 25upx;
	}
	
	.otherinfo{
		width: 698upx;
		@extend %box-style;
		.other-item{
			@include rect(100%,108upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx $line-color solid;
			&:last-child{
				border: none;
			}
			.other-item-r{
				color: #A3A3A3;
				@extend %flex-alcent;
				image{
					@include rect(16upx,29upx);
					margin-left: 32upx;
				}
			}
		}
	}
	
	
	.balance{
		@include rect(698upx,104upx);
		@extend %flex-alcent;
		justify-content: space-between;
		@extend %box-style;
		
		.box-l{
			@extend %flex-alcent;
			text{
				color: #A3A3A3;
				.chosebox{
					@include rect(39upx,39upx);
					border: 2upx #B2B5B8 solid;
				}
			}
			
		}
	}
	.cost-price{
		width: 698upx;
		margin-top: 25upx;
		@extend %box-style;
		.cost-item{
			@include rect(100%,108upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx $line-color solid;
			text{
				font-size: 32upx;
				&:last-child{
					color: #A3A3A3;
				}
			}
		}
		.span{
			color: $main-color;
		}
		.summary{
			@include rect(100%,103upx);
			line-height: 103upx;
			text-align: right;
			text{
				text{
					color: $main-color;
					margin-right: 12upx;
				}
			}
			.black-text{
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
			
			.takemeal-time{
				@include rect(100%,105upx);
				@extend %flex-alcent;
				font-size: 31upx;
				border-bottom: 1upx $line-color solid;
				justify-content: space-between;
				&:last-child{
					border: none;
				}
				text{
					&:last-child {
						
						color: #A3A3A3;
					}
				}
			}
		}
	}
	.goods-info{
		@include rect(698upx,142upx);
		@extend %box-style;
		margin-top: 25upx;
		
		.goods-info-t{
			@extend %flex-alcent;
			justify-content: space-between;
			margin-top: 30upx;
			&:last-child{
				margin-top: 15upx;
				font-size: 24upx;
				color: #C2C3C5;
			}
		}
	}
</style>
