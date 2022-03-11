<template>
	<view class="content" v-if="orderdetails">
		<view class="order-header-status">
			<view class="status-juide">{{ orderdetails.strTakeMode }}</view>
			<!-- <view v-if="orderdetails.progress[0].status==1"> -->
			<!-- <view class="status-cont">
					剩余支付时间：
				</view> -->
			<view class="status-cont" @click="callTel">
				<!-- {{ orderdetails.progress[0].clientTips || '请耐心等待' }} -->
				{{ setBlnPayed(orderdetails.blnPayed, orderdetails.datOrderTime) ? '请尽快支付哦～' : '请耐心等待' }}
			</view>
			<view class="order-bt-box" v-if="setBlnPayed(orderdetails.blnPayed, orderdetails.datOrderTime) && dateEnd">
				<!-- <view class="order-btn" @click="cancelOrder">取消订单</view> -->
				<view class="order-btn" @click="getPayParams">去支付{{ dateEnd ? '  ' + dateEnd[2] + ':' + dateEnd[3] : '' }}</view>
			</view>
			<!-- </view>
			<view class="status-cont" v-else>
				{{orderdetails.progress[0].clientTips}}
			</view> -->
		</view>
		<view class="times-cont">
			<view class="takemeal-time" v-if="orderdetails.blnPayed && orderdetails.strSelfCode">
				<text>取餐号</text>
				<text>{{ orderdetails.strSelfCode }}</text>
			</view>
			<view class="takemeal-time">
				<text>订餐方式</text>
				<text>{{ orderdetails.strTakeMode }}</text>
			</view>
			<!-- <view class="takemeal-time">
				<text>联系电话</text>
				<text>{{ orderdetails.storePhone }}</text>
			</view> -->
			<view class="takemeal-time" v-if="orderdetails.intBook == 2">
				<text>预定时间</text>
				<text>{{ orderdetails.datTakeTime }}</text>
			</view>
			<view class="takemeal-time">
				<text>
					商家地址
					<!-- {{
						orderdetails.sendType == 1 || orderdetails.sendType == 4
							? '商家地址'
							: '取餐地址'
					}} -->
				</text>
				<text class="ad-txt">{{ orderdetails.strShopAddress }}</text>
			</view>
			<view class="takemeal-time">
				<text>订单编号</text>
				<text>{{ orderdetails.strSaleOrderNum }}</text>
			</view>
			<view class="takemeal-time">
				<text>下单时间</text>
				<text>{{ orderdetails.datOrderTime }}</text>
			</view>
		</view>
		<!-- <view class="list" v-if="orderdetails.sendType == 1 || orderdetails.sendType == 4">
			<view class="row-box">
				<view class="name-tel">
					<view>{{ orderdetails.address }}</view>
					<view>
						配送地址
					</view>
				</view>
				<view class="address-desc">
					<text>{{ `${orderdetails.name} ${orderdetails.phone}` }}</text>
				</view>
			</view>
		</view> -->
		<view class="goods-info">
			<view class="goods-item" v-for="(item, index) in orderdetails.Detail" :key="index">
				<view class="goods-info-t">
					<text>{{ item.strProductName + (item.strStandardName ? '-' + item.strStandardName : '') }}</text>
					<text>￥{{ item.floPrice }}</text>
				</view>
				<view class="goods-info-t">
					<text>{{ item.FlavorName ? item.FlavorName : '常规' }}</text>
					<text>x{{ item.intQuantity }}</text>
				</view>
			</view>
		</view>
		<view class="cost-price">
			<view class="cost-item">
				<text>总价</text>
				<text>{{orderdetails.floTotal}}</text>
			</view>
		</view>
		<!-- <view class="cost-price"> -->
			<!-- <view class="cost-item">
				<text>餐饮费</text>
				<text>￥{{ orderdetails.productPrice ? orderdetails.productPrice : 0 }}</text>
			</view>
			<view class="cost-item">
				<text>餐盒费</text>
				<text>¥{{ orderdetails.mealFee ? orderdetails.mealFee : 0 }}</text>
			</view> -->
			<!-- <block v-for="(item, index) in orderPreferentials" :key="index"> -->
			<!-- <view class="cost-item" v-if="orderdetails.floFree">
				<text>
					优惠活动
					<!-- {{
							item.content == 'promotions'
								? subview && item.sub != 'undefined'
									? item.sub
									: '优惠活动'
								: item.content == 'levelDiscount'
								? '会员等级折扣'
								: item.content == 'card'
								? '余额支付'
								: item.content == '0'
								? '现金券'
								: item.content == '1'
								? '折扣券'
								: item.content == '2'
								? '商品券'
								: item.content == '3'
								? '买N送M券'
								: '活动折扣'
						}} - ->
				</text>
				<text>-¥ {{ orderdetails.floFree }}</text>
			</view>
		</view>	-->
		<view class="cost-price" v-if="orderdetails.VkaJson.coupons.length > 0 || orderdetails.VkaJson.promotions.length > 0">
			<view class="cost-title">
				<text>折扣明细</text>
			</view>
			<block v-for="(item, index) in orderdetails.VkaJson.coupons" :key="index">
				<view class="cost-item1">
					<text>{{ item.name }}</text>
					<text>-¥{{ item.discount ? item.discount : 0 }}</text>
				</view>
			</block>
			<!-- 活动优惠 -->
			<block v-for="(item, index) in orderdetails.VkaJson.promotions" :key="index">
				<view class="cost-item1">
					<text>{{ item.name }}</text>
					<text>-¥{{ item.discount ? item.discount : 0 }}</text>
				</view>
			</block>
		</view>
		<view class="cost-price">
			<view class="cost-title">
				<text>支付明细</text>
			</view>
			<block v-for="(item, index) in orderdetails.VkaJson.payments" :key="index">
				<view class="cost-item1" v-if="item.type == 'weixinpay'">
					<text>微信支付</text>
					<text>¥{{ item.amount ? item.amount : 0 }}</text>
				</view>
				<view class="cost-item1" v-if="item.type == 'card'">
					<text>会员余额支付</text>
					<text>¥{{ item.amount ? item.amount : 0 }}</text>
				</view>
			</block>
			<!-- <view class="summary">
				<block v-for="(item, index) in orderdetails.VkaJson.payments" :key="index">
					<text class="black-title" v-if="item.type == 'weixinpay'">
						微信支付：
						<text class="black-text">
							¥{{ item.amount ? item.amount : 0 }}
						</text>
					</text>
					<text class="black-title" v-else-if="item.type == 'card'">
						会员余额支付：
						<text class="black-text">
							¥{{ item.amount ? item.amount : 0 }}
						</text>
					</text>
				</block>
			</view> -->
		</view>

		<view class="otherinfo">
			<view class="other-item">
				<text>订单备注</text>
				<view class="other-item-r">
					<view class="remark">
						{{ orderdetails.strRemark ? orderdetails.strRemark : '无' }}
					</view>
					<!-- <image src="../../static/07_icon_right.png"></image> -->
				</view>
			</view>
			<!-- <view class="other-item">
				<text>餐具份数</text>
				<view class="other-item-r">
					<text>{{ orderdetails.peopleNum ? orderdetails.peopleNum : '1' }}份</text>
				</view>
			</view> -->
		</view>
		<view class="blank"></view>
	</view>
</template>

<script>
import api from '../../WXapi/api.js';
import { TimeDown } from '../../utils/utils.js'; //时间倒计时
import { wxPayment } from '../../utils/publicApi.js';
import { mapGetters } from 'vuex';
import appConfig from '../../config/index.js';
import { wxuuid } from '../../WXapi/paramsMethod.js';

const app = getApp();
let timer = '';
export default {
	data() {
		return {
			orderdetails: {}, //订单详情数据
			orderPreferentials: [],
			subview: false,
			member: false,
			dateEnd: []
		};
	},
	onLoad(options) {
		let that = this;
		that.member = app.globalData.member;
		that.orderNo = options.orderId;
		let orderDetail = app.globalData.orderDetail;
		if (orderDetail) {
			try{
				orderDetail.VkaJson = JSON.parse(orderDetail.VkaJson)
			}catch(e){
			}
			that.orderdetails = orderDetail;
			app.globalData.orderDetail = null;
			that.timeOut()
			return;
		}
		that.getOrderDetail(); //获取订单详情
	},
	onShow() {},
	computed: {
		...mapGetters(['memberinfo', 'businessType', 'paymentMode', 'openidinfo', 'plusinfo']),
		setBlnPayed() {
			return function(data, time) {
				if (!data) {
					let time1 = new Date().getTime()
					let time2 = new Date(time).getTime() + 15 * 60 * 1000
					// console.log(time1, time2)
					if (time1 < time2) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			}
		}
	},
	methods: {
		async getOrderDetail() {
			let that = this;
			let data = {
				HQCode: appConfig.hqcode,
				MemberCode: that.plusinfo.strMemberCode,
				Mobile: that.memberinfo ? that.memberinfo.mobile : '',
				WXOpenID: that.openidinfo.openid,
				GetDetail: true,
				interFaces: 'OrderRecord'
			};
			try {
				let res = await api.shopCarControl(data, true);
				let orderdetails = res.Message.filter(item => item.strSaleOrderNum == that.orderNo);
				try{
					orderdetails[0].VkaJson = JSON.parse(orderdetails[0].VkaJson)
				}catch(e){
				}
				that.orderdetails = orderdetails[0];
				that.timeOut()
			} catch (err) {}
		},
		timeOut(date) {
			let that = this;
			that.dateEnd = TimeDown(that.orderdetails.datOrderTime);
			timer = setInterval(() => {
				that.dateEnd = TimeDown(that.orderdetails.datOrderTime);
				if (!that.dateEnd) {
					clearInterval(timer)
					return;
				}
			}, 1000);
		},
		//拨打电话
		callTel() {
			uni.makePhoneCall({
				phoneNumber: this.orderdetails.storePhone
			});
		},
		//取消订单
		cancelOrder() {
			let that = this;
			that.$msg.showModal(async json => {
				if (json == 1) {
					let data = {
						orderNo: that.orderNo
					};
					let res = await api.cancelOrder(data);
					if (res.status == 1) {
						that.$msg.showToast('取消成功');
						that.getOrderDetail();
					}
				}
			}, '是否取消该订单');
		},
		//开始支付
		async getPayParams() {
			let that = this;
			let timestamp = Date.now();
			console.log(that.orderdetails);
			let params = {
				Total: that.orderdetails.floTotal,
				Free: that.orderdetails.floFree,
				HQCode: appConfig.hqcode,
				ShopCode: that.orderdetails.strShopCode,
				total_fee: that.orderdetails.floPricePay * 100,
				MemberCode: that.plusinfo.strMemberCode,
				// MemberCode: that.plusinfo.strMemberCode,
				sub_openid: that.openidinfo.openid,
				WXOpenID: that.openidinfo.openid,
				timestamp: timestamp,
				SaleOrderNum: that.orderNo, //订单号
				noncestr: wxuuid().replace(/-/g, ''), //随机字符串
				Mobile: that.memberinfo ? that.memberinfo.mobile : '', //手机号
				Memo: '', //备注
				SaleMode: that.businessType, //售卖模式
				PayMentMode: that.orderdetails.intPayType,
				TakeMode: that.businessType,
				TakeTime: that.orderdetails.takeTime,
				OrderType: 'online', //支付订单的类型online普通订单 groupbuy拼团订单
				PayTotal: that.orderdetails.floPricePay, // 原本取的是that.orderdetails.Detail[0].floPricePay 不清楚之前的逻辑
				interFaces: 'Prepay',
				OrderCreate: true
			};
			console.log(params);
			let data = {
				...params,
				PaymentContent: params
			};
			if (that.member) {
				let VkaJson = that.orderdetails.VkaJson;
				try{
					VkaJson = JSON.parse(VkaJson);
				}catch(e){
					//TODO handle the exception
				}
				data.VkaJson = VkaJson;
			}
			try {
				let res = await api.getPayMentParams(data);
				uni.hideLoading();
				app.globalData.orderSuccess = true;
				app.globalData.orderRefresh = true;
				params.interFaces = 'OrderPayMent';
				if (res.Message.Payed == true) {
					that.checkOutPay(params); //结账动作
				} else {
					wxPayment(res.Message)
						.then(res => {
							that.$msg.showToast('支付成功');
							that.checkOutPay(params); //结账动作
							//生成订单记录
						})
						.catch(ret => {});
				}
			} catch (err) {}
		},
		//发起结账动作
		async checkOutPay(params) {
			try {
				console.log(params)
				let payRes = await api.shopCarControl(params);
				if (payRes.Message[0].strSaleOrderNum) {
					this.getOrderDetail(); //刷新订单
				}
			} catch (err) {}
		}
	}
};
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
		// @include rect(160upx, 60upx);
		border: 2upx #999999 solid;
		border-radius: 8upx;
		@include text-allcenter(60upx);
		color: #999999;
		margin: 0 40upx;
		padding: 0 10upx;

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
			color: #a3a3a3;
			@extend %flex-alcent;

			.remark {
				text-align: right;
				width: 400upx;
				@include lineOnly();
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
	
	.cost-title {
		@include rect(100%, 108upx);
		line-height: 108upx;
		font-size: 28upx;
		color: #333333;
		font-weight: bold;
		border-bottom: 1upx $line-color solid;
		margin-bottom: 20upx;
	}

	.cost-item {
		@include rect(100%, 108upx);
		@extend %flex-alcent;
		justify-content: space-between;
		border-bottom: 1upx $line-color solid;

		text {
			font-size: 32upx;

			&:last-child {
				color: #a3a3a3;
			}
		}
		&:last-child{
			border: none;
			text:last-child {
				color: #333333;
			}
		}
	}
	
	.cost-item1 {
		@include rect(100%, 50upx);
		@extend %flex-alcent;
		justify-content: space-between;
		
		text {
			font-size: 28upx;
			color: #a3a3a3;
		
			&:last-child {
				color: #333333;
			}
		}
		
		&:last-child {
			margin-bottom: 20upx;
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
		.black-title {
			padding-left: 10upx;
			
			.black-text {
				font-size: 32upx;
				color: #000000;
			}
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
					color: #5d5d5d;
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
					color: #a3a3a3;
				}
			}
			.ad-txt {
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
				color: #c2c3c5;
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
		background: #ffffff;
		border-radius: 10px;
		flex-wrap: wrap;
		padding: 30upx 40upx;
		box-sizing: border-box;
		font-size: 30upx;
		margin: 30upx auto 0 auto;

		.name-tel {
			color: #000000;
			font-size: $font-md;
			@include rect(100%, 30upx);
			@extend %flex-alcent;
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
			color: #87888b;
			font-size: 24upx;
			margin: 18upx 0;
		}
	}
}
</style>
