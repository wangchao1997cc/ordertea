<template>
	<view class="content" v-if="orderdetails.orderProducts">
		<view class="order-header-status">
			<view class="status-juide">
				{{orderdetails.progress[0].statusName}}
			</view>
			<!-- <view v-if="orderdetails.progress[0].status==1"> -->
			<!-- <view class="status-cont">
					剩余支付时间：
				</view> -->
			<view class="status-cont" @click="callTel">
				{{orderdetails.progress[0].clientTips || '请耐心等待'}}
			</view>
			<view class="order-bt-box" v-if="orderdetails.progress[0].status==1">
				<view class="order-btn" @click="cancelOrder">
					取消订单
				</view>
				<view class="order-btn" @click="getPayParams">
					去支付
				</view>
			</view>
			<!-- </view>
			<view class="status-cont" v-else>
				{{orderdetails.progress[0].clientTips}}
			</view> -->
		</view>
		<view class="times-cont">
			<view class="takemeal-time" v-if="orderdetails.takeMealSn">
				<text>取餐号</text>
				<text>{{orderdetails.takeMealSn}}</text>
			</view>
			<view class="takemeal-time">
				<text>订餐方式</text>
				<text>{{orderdetails.orderTypeName}}</text>
			</view>
			<view class="takemeal-time">
				<text>联系电话</text>
				<text>{{orderdetails.storePhone}}</text>
			</view>
			<view class="takemeal-time">
				<text>预定时间</text>
				<text>{{orderdetails.sendTime}}</text>
			</view>
			<view class="takemeal-time">
				<text>{{orderdetails.sendType==1 || orderdetails.sendType==4?'商家地址':'取餐地址'}}</text>
				<text class="ad-txt">{{orderdetails.storeAddress}}</text>
			</view>
			<view class="takemeal-time">
				<text>订单编号</text>
				<text>{{orderdetails.orderNo}}</text>
			</view>
			<view class="takemeal-time">
				<text>下单时间</text>
				<text>{{orderdetails.orderDate}}</text>
			</view>
		</view>
		<view class="list" v-if="orderdetails.sendType==1 || orderdetails.sendType==4">
			<view class="row-box">
				<view class="name-tel">
					<view>{{orderdetails.address}}</view>
					<view>
						配送地址
						<!-- <image @click="addressEdit(address)" src="../../static/address/edit_icon.png"></image> -->
					</view>
				</view>
				<view class="address-desc">
					<text>{{`${orderdetails.name} ${orderdetails.phone}`}}</text>
				</view>
			</view>
		</view>
		<view class="goods-info">
			<view class="goods-item" v-for="(item,index) in orderdetails.orderProducts" :key="index">
				<view class="goods-info-t">
					<text>{{item.name}}</text>
					<text>￥{{item.totalPrice}}</text>
				</view>
				<view class="goods-info-t">
					<text>{{item.propertyItemNameList?item.propertyItemNameList.itemNameCNList:'常规'}}</text>
					<text>x{{item.num}}</text>
				</view>
			</view>
		</view>
		<view class="cost-price">
			<view class="cost-item">
				<text>餐饮费</text>
				<text>￥{{orderdetails.productPrice?orderdetails.productPrice:0}}</text>
			</view>
			<view class="cost-item">
				<text>餐盒费</text>
				<text>¥{{orderdetails.mealFee?orderdetails.mealFee:0}}</text>
			</view>
			<block v-for="(item,index) in orderPreferentials" :key="index">
				<view class="cost-item">
					<text>{{item.content == 'promotions'?(subview && item.sub!='undefined'?item.sub:'优惠活动'):(item.content == 'levelDiscount'?'会员等级折扣':(item.content == 'card'?'余额支付':(item.content == '0'?'现金券':(item.content == '1'?'折扣券':(item.content == '2'?'商品券':(item.content == '3'?'买N送M券':'活动折扣'))))))}}</text>
					<text>-¥ {{-(item.price)}}</text>
				</view>
			</block>
			<view class="summary">
				实付：<text class="black-text">￥{{orderdetails.totalPrice?orderdetails.totalPrice:0}}</text>
			</view>
		</view>

		<view class="otherinfo">
			<view class="other-item">
				<text>订单备注</text>
				<view class="other-item-r">
					<view class="remark">{{orderdetails.userNote?orderdetails.userNote:'无'}}</view>
					<!-- <image src="../../static/07_icon_right.png"></image> -->
				</view>
			</view>
			<view class="other-item">
				<text>餐具份数</text>
				<view class="other-item-r">
					<text>{{orderdetails.peopleNum?orderdetails.peopleNum:'1'}}份</text>
					<!-- <image src="../../static/07_icon_right.png"></image> -->
				</view>	
			</view>
		</view>
		<view class="blank"></view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import {
		TimeDown
	} from '../../utils/utils.js' //时间倒计时
	import {
		wxPayment
	} from '../../utils/publicApi.js'
	const app = getApp();
	export default {
		data() {
			return {
				orderdetails: {}, //订单详情数据
				orderPreferentials: [],
				subview: false,
			};
		},
		onLoad(options) {
			this.orderId = options.orderId;
			this.getOrderDetail(); //获取订单详情
		},
		onShow() {

		},
		// computed: {

		// },
		methods: {
			async getOrderDetail() {
				let data = {
					orderId: this.orderId
				}
				let res = await api.getOrderDetail(data);
				if (res && res.status == 1) {
					this.orderdetails = res.data;
					let orderPreferentials = res.data.orderPreferentials;
					console.log(11111,orderPreferentials)
					for (var i = 0; i < orderPreferentials.length; i++) {
						if (orderPreferentials[i].content) {
							var index = orderPreferentials[i].content.indexOf('#');
							orderPreferentials[i].content = orderPreferentials[i].content.substring(index + 1, orderPreferentials[i].content
								.length);
							var index1 = orderPreferentials[i].content.indexOf('#');
							if (orderPreferentials[i].content.includes('￥') == '' | orderPreferentials[i].content.indexOf('￥') == undefined) {
								this.subview = true;
								orderPreferentials[i].sub = orderPreferentials[i].content.substring(index1 + 1);
							} else if (orderPreferentials[i].content.indexOf('￥') != '' | orderPreferentials[i].content.indexOf('￥') !=
								undefined) {
								this.subview = true;
								var index2 = orderPreferentials[i].content.indexOf('￥');
								orderPreferentials[i].sub = orderPreferentials[i].content.substring(index1 + 1, index2);
								orderPreferentials[i].sub = orderPreferentials[i].content.substring(index1 + 1, index2);
								if (orderPreferentials[i].sub.length > 20) {
									orderPreferentials[i].sub = orderPreferentials[i].sub.substring(0, 20) + '...'
								}
							}
							orderPreferentials[i].content = orderPreferentials[i].content.substring(0, index1);
						}
					}
					this.orderPreferentials = orderPreferentials;
					// if(res.data.progress[0].status==1){
					// 	let createdtime = res.data.progress[0].createTime;
					// 	var enddate = new Date(createdtime) + (15 * 60000);
					// 	console.log(enddate)
					// 	this.timeOut(enddate);
					// }
				}
			},
			timeOut(date) {
				let that = this;
				let dateEnd = TimeDown(date);

				// that.timer = setInterval(() => {
				// 	dateEnd = TimeDown(date);
				// 	if (!dateEnd) {
				// 		clearInterval(that.timer)
				// 		return;
				// 	}
				// }, 1000);
			},
			//拨打电话
			callTel() {
				uni.makePhoneCall({
					phoneNumber: this.orderdetails.storePhone,
				})
			},
			//取消订单
			cancelOrder() {
				this.$msg.showModal(async json => {
					if (json == 1) {
						let data = {
							orderId: this.orderId,
						}
						let res = await api.cancelOrder(data);
						if (res.status == 1) {
							this.$msg.showToast('取消成功')
							this.getOrderDetail();
						}
					}
				}, '是否取消该订单')
			},
			//开始支付
			async getPayParams() {
				let data = {
					payType: 2,
					orderId: this.orderId,
				};
				let res = await api.wxOrderPay(data);
				if (res.status == 1) {
					wxPayment(res.data).then(res => {
						this.$msg.showToast('支付成功');
						this.getOrderDetail();
					}).catch(ret => {
						this.$msg.showToast('取消支付')
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	$line-color: rgba(0, 0, 0, 0.14);

	.blank {
		height: 200upx;
	}

	.order-header-status {
		width: 698upx;
		@extend %box-style;

		.status-juide {
			margin-top: 40upx;
			font-size: 38upx;
			font-weight: 700;
			text-align: center;
		}

		.status-cont {
			font-size: 30upx;
			margin-top: 20upx;
			text-align: center;
			margin-bottom: 42upx;
		}

		.order-bt-box {
			margin-bottom: 40upx;
			height: 60upx;
			@extend %flex-alcent;
			justify-content: center;

		}

		.order-btn {
			@include rect(160upx, 60upx);
			border: 2upx #999999 solid;
			border-radius: 8upx;
			@include text-allcenter(60upx);
			color: #999999;
			margin: 0 40upx;

			&:last-child {
				background-color: $main-color;
				color: $bg-white;
				border: none;
			}
		}
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
			width: 698upx;
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
				width: 100%;
				@extend %flex-alcent;
				font-size: 31upx;
				border-bottom: 1upx $line-color solid;
				justify-content: space-between;
				padding: 35upx 0;
				box-sizing: border-box;

				&:last-child {
					border: none;
				}

				text {
					&:last-child {
						color: #A3A3A3;
					}
				}
				.ad-txt{
					width: 460upx;
					display: block;
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

	.list {
		view: {
			display: flex;
		}

		.row-box {
			@include rect(698upx, 145upx);
			background: #FFFFFF;
			border-radius: 10px;
			flex-wrap: wrap;
			padding: 30upx 40upx;
			box-sizing: border-box;
			font-size: 30upx;
			margin: 30upx auto 0 auto;

			.name-tel {
				color: #000000;
				font-size: $font-md;
				@include rect(100%, 30upx) @extend %flex-alcent;
				justify-content: space-between;

				view:first-child {
					width: 400upx;
					@include lineOnly();
				}

				image {
					@include rect(30upx, 30upx);
					margin-right: 7upx;
				}
			}

			.address-desc {
				min-height: 76upx;
				line-height: 38upx;
				color: #87888B;
				font-size: 24upx;
				margin: 18upx 0;
			}
		}
	}
</style>
