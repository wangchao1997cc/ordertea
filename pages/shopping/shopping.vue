<template>
	<view class="content">
		<view class="shopping-head">
			<view class="tit-juide">
				可用积分
			</view>
			<view class="exchange-box">
				<text>0</text>
				<view class="exchange-btn">
					兑换记录
				</view>
			</view>
		</view>
		<view class="goods-box">
			<view class="goods-item" v-for="(item,index) in productList" :key="index">
				<view class="goods-pic">
					<image :src="item.productPic"></image>
				</view>
				<view class="goods-cont">
					<view class="goods-tit-box">
						<view class="goods-tit">
							{{item.productName}}
						</view>
						<view class="goods-label">
							<text>{{item.getWay==0?'领取':(item.getWay==1?'自取':'快递')}}</text>
						</view>
					</view>
					<view class="nums-juide">
						库存{{item.inventory}}
					</view>
					<view class="goods-price">
						<text>30</text>元+<text>100积分</text>
					</view>
					<view class="buy_btn" :class="{nogrady:true}">
						积分不足
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				page:0,   //当前页索引
				productList:[],   //商品列表
			}
		},
		onLoad() {
			this.getGoodsList();
		},
		methods: {
			//获取商品列表
			async getGoodsList(){
				let data = {
					page:this.page,
					limit:10,
				}
				let res = await api.getGoodsList(data);
				if(res.code==200){
					this.productList = res.data;
				}
				console.log(res)
			}

		}
	}
</script>

<style lang="scss">
	.content {
		width: $screen-width;

	}

	.shopping-head {
		@include rect(100%, 223upx);
		@include box-padding(28upx);
		padding-top: 1upx;
		box-sizing: border-box;

		.tit-juide {
			font-size: 30upx;
			margin-top: 50upx;
		}

		.exchange-box {
			// border: 1upx red solid;
			@include rect(100%, 110upx);
			@extend %flex-alcent;
			justify-content: space-between;

			text {
				font-size: 56upx;

			}

			.exchange-btn {
				@include rect(150upx, 49upx);
				background-color: $main-color;
				border-radius: 25upx;
				color: $bg-white;
				font-size: 27upx;
				@include text-allcenter(50upx)
			}
		}
	}

	.goods-box {
		width: 100%;
		@extend %flex-list;

		.goods-item {
			@include rect(334upx, 564upx);
			background-color: $bg-white;
			margin-left: 27upx;
			border-radius: $radius-md;
			overflow: hidden;
			margin-bottom: 25upx;

			.goods-pic {
				@include rect(334upx, 334upx);
				border: 1upx $main-color solid;
			}

			.goods-cont {
				@include box-padding(28upx);
			}

			.goods-tit-box {
				margin-top: 20upx;
				@include rect(100%, 30upx);
				line-height: 30upx;
				@extend %flex-alcent;

				.goods-tit {
					max-width: 210upx;
				}

				.goods-label {
					margin-left: 20upx;
					@include rect(55upx, 28upx);
					@extend %flex-alcent;
					justify-content: center;
					color: $text-white;
					background-color: $main-color;
					text {
						font-size: 20upx;
						transform: scale(0.8);
						
					}
				}
			}
			.nums-juide{
				font-size: 24upx;
				color: #B6B6B6;
				margin-top: 12upx;
			}
			.goods-price{
				margin-top: 10upx;
				font-size: 28upx;
				color: #8D8F91;
				text{
					color: #B6D842;
				}
			}
			.buy_btn{
				@include rect(150upx,50upx);
				background-color: $main-color;
				@include text-allcenter(50upx);
				border-radius: 50upx;
				color: $text-white;
				font-size: 24upx;
				margin-top: 10upx;
				float: right;
				
				&.nogrady{
					background-color: #E4E4E4;
				}
			}
		}
	}
</style>
