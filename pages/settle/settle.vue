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
				<text>优惠卷</text>
				<view class="span">{{interest.canUseTotal?interest.canUseTotal:0}}张可用</view>
			</view>
			<view class="summary">
				实付：<text class="black-text">￥{{interest.afterDiscountTotal?interest.afterDiscountTotal:0}}</text>
			</view>
		</view>
		<view class="balance">
			<text>会员余额支付</text>
			<view class="box-l">
				<text>可用余额：<text>{{interest.card.balance?interest.card.balance:0}}</text>元</text>
				<view class="chosebox"></view>
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
					<text>{{}}</text>
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
		<view class="mask" v-if="maskShow">
			<view class="order-info" :animation="animationData">
				<!-- 选择时间 -->
				<view class="choose-box" v-if="chooseTimeShow">
					<view class="chose-store-head">
						选择送达时间
						<image src="../../static/cha.png"></image>
					</view>
					<view class="choose-cont">
						<view class="date-l">
							<view class="data-l-item" v-for="(item,index) in timeData" :key="index" :class="{on:choosetime==index}" @click="changeTimeFrag(index)">
								{{item.date}}
							</view>
						</view>
					</view>
				</view>
				<!-- 选择餐具 -->
				<view class="choose-box" v-if="chooseWareShow">
					<view class="chose-store-head">
						选择餐具数量
						<image src="../../static/cha.png"></image>
					</view>
				</view>
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
				choosetime:0,   //选中的时间段索引
				maskShow: true, //总幕布
				chooseTimeShow: true, //预约时间幕布
                chooseWareShow: false, //预约餐具幕布
				animationData: {},
				timeData:[],   //预约时间
				// orderparams: {},
				interest: {}, //会员折扣信息
				remark: null, //订单备注
			};
		},
		onLoad() {
			let orderparams = app.globalData.orderinfo;
			// this.orderparams = orderparams;
			let orderInfo = app.globalData.storeInfo
			this.computedTIme(orderInfo.appointmentTime);
			this.memberInterest(orderparams); //会员权益计算
			uni.showLoading({})
			this.renderAnimation(); //定义动画
		},
		onShow() {
			let remark = app.globalData.remark;
			let orderparams = app.globalData.orderinfo;
			if (orderparams.ticketId) { //如果有优惠卷
				this.memberInterest(orderparams); //会员权益计算
				// this.orderparams = orderparams;
			}
			if (remark) {
				this.remark = remark;
			}
		},
		onUnload() {
			app.globalData.remark = '';
		},
		methods: {
			//改变时间段
			changeTimeFrag(index){
				if(this.choosetime==index){
					return;
				}
				this.choosetime = index;
			},
			//定义动画
			renderAnimation() {
				let that = this;
				let animation = uni.createAnimation({ //定义动画
					duration: 300,
					timingFunction: 'linear',
					delay: 0
				})
				that.animation = animation;
				that.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					that.animationData = animation.export();
				})
			},
			//计算预约时间
			computedTIme(timeData) {
				timeData.forEach(item => {
					item.times.forEach(aitem => {
						let timearr = aitem.split('~');
						timearr = this.handerTime(item.date, timearr[0], timearr[1]);
						if (item.timearr) {
							item.timearr.push(...timearr)
						} else {
							item.timearr = timearr;
						}
					})
				})
				this.timeData = timeData;
				console.log(timeData)
			},
			//时间切段   15分钟为一个时间段
			handerTime(date, startTime, endTime) {
				let timerarr = [];
				timerarr.push(startTime);
				startTime = new Date(new Date(date + ' ' + startTime));
				startTime = Date.parse(startTime); //转为时间戳
				endTime = new Date(new Date(date + ' ' + endTime));
				endTime = Date.parse(endTime); //转为时间戳
				let totalnum = Math.floor((endTime - startTime) / 1000 / 60 / 15)
				for (let i = 0; i < totalnum; i++) {
					startTime += (15 * 60000);
					timerarr.push(new Date(startTime).format("hh:mm"))
				}
				return timerarr;
			},
			//前往使用优惠卷页面
			jumpUseCoupons() {
				if (!this.interest.canUseTotal) {
					return;
				}
				uni.setStorageSync('canusecoupons', this.interest.couponInfoResponseList);
				uni.navigateTo({
					url: '../coupons/coupons?type=choose'
				})
			},
			//跳转订单备注
			jumpOrederReark() {
				uni.navigateTo({
					url: '../addremark/addremark'
				})
			},
			async memberInterest(params) { //会员权益计算
				let that = this;
				!params ? params = this.orderparams : '';
				let res = await api.memberInterest(params)
				uni.hideLoading();
				if (res.code == 200 || res.code == 1901) {
					that.interest = res.data;
					if (res.code == 1901) {
						this.$msg.showModal((result) => {
							if (result == 1) {
								console.log('前去充值页面')
							}
						}, '您的可用余额不足，是否前去充值')
					}
				} else {
					that.$msg.showToast(res.message)
				}
			}
		}
	}
</script>

<style lang="scss">
	$line-color: rgba(0, 0, 0, 0.14);

	.mask {
		@extend %all-mask;
	}

	.order-info {
		position: absolute;
		width: 100%;
		bottom: 0;
		height: 53%;
		transform: translateY(100%);
		background-color: #F5F5F5;
		border-top-right-radius: 20upx;
		border-top-left-radius: 20upx;
		overflow: hidden;

		.chose-store-head {
			@include rect(100%, 129upx);
			@include text-allcenter(129upx);
			font-size: 35upx;
			font-weight: 700;
			position: relative;

			image {
				position: absolute;
				@include rect(55upx, 55upx);
				top: 37upx;
				right: 33upx;
			}
		}
		.choose-cont{
			@include rect(100%,84%);
			display: flex;
			.date-l{
				@include rect(272upx,100%);
				.data-l-item{
					@include rect(100%,124upx);
					@include text-allcenter(124upx);
					&.on{
						background-color: $bg-white;
					}
				}
			}
		}
	}

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

				.chosebox {
					@include rect(39upx, 39upx);
					border: 2upx #B2B5B8 solid;
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
