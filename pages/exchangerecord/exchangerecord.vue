<template>
	<!-- 兑换记录 -->
	<view class="content">
		<view class="goods-info" v-for="(item,index) in records" :key="index">
			<view class="head-time">
				<text>兑换时间：{{item.create}}</text>
				<text>{{item.status==0?'未发放':(item.status==1?'已发放':(item.status==2?'已领取':(item.status==3?'未发货':(item.status==4?'已发货':(item.status==5?'已签收':'已取消')))))}}</text>
			</view>
			<view class="goods-desc">
				<view class="goods-pic">
					<image :src="item.productPic"></image>
				</view>
				<view class="goods-detail">
					<view class="goods-name">
						{{item.productName?item.productName:''}}
					</view>
					<view class="goods-price">
						<view class="price-l">
							<view v-if="item.payType>3">
								<text>{{item.price}}</text>元 + <text class="span">{{item.point}}</text>积分
							</view>
							<view v-else>
								<text>{{item.payType==3?item.point+'积分':item.price+'元'}}</text>
							</view>
						</view>
						<text>x1</text>
					</view>
				</view>
			</view>
			<!-- <view class="cost-item" v-if="item.getWay==2">
				<text>运费</text>
				<text>¥{{needfreight}}</text>
			</view> -->
			<view class="comput_price">
				<text>共一件商品&nbsp;&nbsp;&nbsp;合计：</text><text class="font-big">{{item.payType > 3?item.amount+'元 + '+item.point+'积分':(item.payType==3?(item.freight?item.amount+'元 + '+item.point+'积分':item.point)+'积分':item.amount+'元')}}</text>
			</view>
		</view>
		<view class="no_record" v-if="nodataShow">
			<view class="no-record-pic">
				<image src="../../static/nodata/noRecord.png"></image>
			</view>
			<view class="no-record-juide">暂无兑换记录</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				nodataShow:false,
				page: 0,
				totalPageindex: null, //总页数
				records: [],
			}
		},
		methods: {

		},
		//页面触底加载分页
		onReachBottom: function() {
			let that = this;
			if (that.page == that.totalPageindex) {
				return
			}
			that.page++;
			that.getExchangeRecord();
		},
		onLoad() {
			this.getExchangeRecord(); //获取兑换记录
		},
		methods: {
			async getExchangeRecord() {
				let that = this;
				let data = {
					cardNo: that.$store.state.cardNo,
					page: that.page,
					limit: 8,
				}
				let res = await api.exchangeRecord(data);
				if (res.code == 200) {
					if(that.page == 0){
						that.records = res.data;
						that.totalPageindex = Math.floor(res.total / 10);
					}else{
						that.records = that.records.concat(res.data);
					}
					if(!that.records.length){
						that.nodataShow = true;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		color: $uni-text-color;
		padding-top: 1upx;
		font-size: $font-md;
	}
	
	.no_record{
		width: 100%;
		.no-record-pic{
			@include rect(400upx,384upx);
			margin: 200upx auto 50upx auto;
			image{
				@include rect(100%,100%);
			}
		}
		.no-record-juide{
			color: #343434;
			opacity: 0.5;
			text-align: center;
		}
	}

	.goods-info {
		width: 698upx;
		background-color: $bg-white;
		@include box-padding(32upx);
		margin: 26upx auto;
		border-radius: $radius-md;
		.head-time{
			@include rect(100%,97upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx rgba(0, 0, 0, .14) solid;
			text:last-child{
				color: #AAAAAA;
			}
		}

		.goods-desc {
			@include rect(100%, 205upx);
			@extend %flex-alcent;
			border-bottom: 1upx rgba(0, 0, 0, .14) solid;

			.goods-pic {
				@include rect(136upx, 136upx);

				image {
					@include rect(100%, 100%);
					border-radius: 8upx;
				}
			}

			.goods-detail {
				width: 452upx;
				// margin-top: 45upx;
				margin-left: 34upx;
				.goods-name{
					color: #000000;
				}

				.goods-price {
					width: 100%;
					margin-top: 15upx;
					@extend %flex-alcent;
					justify-content: space-between;

					.price-l {
						font-size: 40upx;
						color: rgba(141, 143, 145, 1);

						text {
							color: rgba(182, 216, 66, 1);
						}

						.span {
							margin-left: 11upx;
						}
					}
				}
			}
		}
	}
	.comput_price {
		@include rect(100%, 104upx);
		@extend %flex-alcent;
		justify-content: flex-end;
	
		.font-big {
			font-size: 32upx;
			font-weight: 700;
		}
	}
	
</style>
