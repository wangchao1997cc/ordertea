<template>
	<view class="my-plan-style">
		<!-- 3D轮播 -->
		<swiper @change="intervalChange" class="imageContainer" previous-margin="10rpx" next-margin="70rpx">
			<block v-for="(item,index) in imgList" :key="index">
				<swiper-item class="swiperitem" >
					<view class="swiper-box" :style="{backgroundImage:'url('+ (item.backgroundUrl || 'https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/7622/f9fab2fd32e4d180d0019c400af3651.png')+')'}">
						<view class="recharge-tit">
							<text>{{item.title}}</text>
						</view>
						<!-- <view class="price-box">
							<text>¥ {{item.amount}}</text>
						</view> -->
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>
<script>
	export default {
		data() {
			return {}
		},
		props: {
			imgList: {
				typeof: Array,
				default: () => [],
			}
		},
		methods: {
			intervalChange(e) {
				this.$emit('changeData', this.imgList[e.detail.current]);
			}
		}
	}
</script>
<style lang="scss">
	// 3D轮播样式
	.imageContainer {
		width: 100%;
		height: 310upx;
	}

	.swiperitem {
		height: 310upx;
		@extend %flex-alcent;
		justify-content: center;
		color: #FD960B;
	}

	.swiper-box {
		width: 625rpx;
		height: 310upx;
		position: relative;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 12upx;
	}

	.recharge-tit {
		margin-top: 24upx;
		font-size: 48upx;
		margin-left: 24upx;
		text{
			color:#F5FFD5;
		    box-shadow: 1upx 1upx 2upx 0px #668600 80% inset;
		}
		
	}

	// .itemImg {
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 310upx;
	// 	border-radius: 15rpx;
	// 	z-index: 5;
	// 	opacity: 0.7;
	// 	box-shadow: 0px 4upx 15upx 0px rgba(153, 153, 153, 0.24);
	// }

	// .swiperactive {
	// 	width: 100%;
	// 	height: 310upx;
	// 	opacity: 1;
	// 	z-index: 10;
	// 	transition: all .2s ease-in 0s;
	// }

	.price-box {
		height: 60upx;
		@include box-padding(16upx);
		float: left;
		background-color: #FFFFFF;
		box-shadow: 0px 0px 2upx 0px #81AA00 inset;
		border-radius:  8upx;
		margin-top: 135upx;
		margin-left: 24upx;

		text {
			font-size: 36upx;
			line-height: 60upx;
			box-shadow: 1upx 2upx 2upx 0px #FFFFFF inset;
			color: #B2D14E;
		}
	}
</style>
