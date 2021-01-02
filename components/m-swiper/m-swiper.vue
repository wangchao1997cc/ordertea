<template>
	<view class="my-plan-style">
		<!-- 3D轮播 -->
		<swiper class="imageContainer" previous-margin="50rpx" next-margin="50rpx" circular autoplay>
			<block v-for="(item,index) in imgList" :key="index">
				<swiper-item class="swiperitem">
					<view class="recharge-tit">
						充值卡
					</view>
					<view class="price-box">
						{{item.amount}}<text> 元</text>
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// imgList:[
				// '../../static/detail/swiper2.png',
				// '../../static/detail/swiper2.png',
				// '../../static/detail/swiper2.png',
				// '../../static/detail/swiper2.png',
				// '../../static/detail/swiper2.png']
			}
		},
		props: {
			imgList: {
				typeof: Array,
				default: () => [],
			}
		}
	}
</script>
<style lang="scss">
	// 3D轮播样式
	.imageContainer {
		width: 100%;
		height: 338upx;
	}

	.swiperitem {
		height: 338upx;
		box-sizing: border-box;
		position: relative;
		background: url(https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/swiper_bg.png) no-repeat;
		background-size: cover;
		color: #FD960B;


	}

	.recharge-tit {
		margin-top: 50upx;
		font-size: 32upx;
		margin-left: 55upx;
	}

	.itemImg {
		position: absolute;
		width: 100%;
		height: 338upx;
		border-radius: 15rpx;
		z-index: 5;
		opacity: 0.7;
		box-shadow: 0px 4upx 15upx 0px rgba(153, 153, 153, 0.24);
	}

	.swiperactive {
		width: 100%;
		height: 338upx;
		opacity: 1;
		z-index: 10;
		transition: all .2s ease-in 0s;
	}

	.price-box {
		margin-top: 130upx;
		// margin-left: 380upx;
		font-size: 56upx;
		float: right;
		margin-right: 60upx;

		text {
			font-size: 32upx;
			margin-left: 20upx;
		}
	}
</style>
