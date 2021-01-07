<template>
	<!-- 商品详情页 -->
	<view class="content">
		<view class="head-info" v-if="goodsdesc.getWay!=0">
			<view class="cost-item">
				<text>{{goodsdesc.getWay==1?'提货方式':'快递地址'}}</text>
				<text v-if="goodsdesc.getWay==1">门店自提</text>
				<input v-else type="text" placeholder="请输入地址" v-model="params.address" />
			</view>
			<view v-if="goodsdesc.getWay==2 || (goodsdesc.getWay==1 && businessinfo)">
				<view class="cost-item">
					<text>{{goodsdesc.getWay==1?'店铺名称':'姓名'}}</text>
					<text v-if="goodsdesc.getWay==1">{{businessinfo.name?businessinfo.name:''}}</text>
					<input v-else type="text" placeholder="请输入姓名" v-model="params.name" />
				</view>
				<view class="cost-item" :class="{on:goodsdesc.getWay==1}">
					<text>联系电话</text>
					<text v-if="goodsdesc.getWay==1">{{businessinfo.tel?businessinfo.tel:''}}</text>
					<input v-else type="text" placeholder="请输入手机号码" v-model="params.mobile" />
				</view>
			</view>
			<view class="cost-item" v-if="goodsdesc.getWay==1" @click="jumpPointStore">
				<text>地址</text>
				<text>{{businessinfo?businessinfo.address:'点击选择商家'}}</text>
			</view>
		</view>
		<view class="goods-info">
			<view class="goods-desc">
				<view class="goods-pic">
					<image :src="goodsdesc.productPic"></image>
				</view>
				<view class="goods-detail">
					<view class="goods-name">
						{{goodsdesc.productName?goodsdesc.productName:''}}
					</view>
					<view class="goods-price">
						<view class="price-l">
							<view v-if="goodsdesc.payType==2">
								<text>{{goodsdesc.price}}</text>元 + <text class="span">{{goodsdesc.point}}</text>积分
							</view>
							<view v-else>
								<text>{{goodsdesc.payType==0?goodsdesc.point+'积分':goodsdesc.price+'元'}}</text>
							</view>
						</view>
						<text>x1</text>
					</view>
				</view>
			</view>
			<view class="cost-item" v-if="goodsdesc.getWay==2">
				<text>运费</text>
				<text>¥{{needfreight}}</text>
			</view>
			<view class="comput_price">
				<text>共一件商品&nbsp;&nbsp;&nbsp;合计：</text><text class="font-big">{{goodsdesc.payType==2?totalPrice+'元 + '+goodsdesc.point+'积分':(goodsdesc.payType==0?(needfreight?totalPrice+'元 + '+goodsdesc.point+'积分':goodsdesc.point)+'积分':totalPrice+'元')}}</text>
			</view>
		</view>
		<view v-if="totalPrice!=0">
			<view class="balance">
				<text>会员余额支付</text>
				<view class="box-l" @click="switchUseBalance">
					<text>{{balancePay?'已使用余额':'可用余额'}}：<text>{{balancePay?balancePayNums:memberinfo.balance}}</text>元</text>
					<view class="chosebox" :class="{usebalance:balancePay}">
						<image v-if="balancePay" src="../../static/choose_icon.png"></image>
					</view>
				</view>
			</view>
			<view class="balance">
				<text>微信支付</text>
				<view class="box-l" @click="switchUseWxPay">
					<view class="chosebox" :class="{usebalance:wxPay}">
						<image v-if="wxPay" src="../../static/choose_icon.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="pay_btn" @click="begainBuyBtn">
			立即购买
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import api from '../../WXapi/api.js';
	import {
		refreshUserInfo,
		wxPayment
	} from '../../utils/publicApi.js'
	export default {
		data() {
			return {
				businessinfo: null, //商家地址
				goodsdesc: {
					price: 0,
					point: 0,
				},
				wxPay: false, //微信支付
				balancePay: false, //余额支付
				memberinfo: {}, //会员信息
				params: {
					mobile: '',
					name: '',
					address: '',
				}
			};
		},
		onLoad(options) {
			let id = options.id ? options.id : 418;
			this.getGoodsDesc(id);
			this.memberinfo = uni.getStorageSync('memberinfo');
		},
		onShow() {
			if (app.globalData.businessinfo) {
				this.businessinfo = app.globalData.businessinfo;
				app.globalData.businessinfo = null;
			}
		},
		computed: {
			needfreight() {
				let goodsdesc = this.goodsdesc;
				let freight = 0;
				if (goodsdesc.getWay == 2) {
					freight = goodsdesc.freight;
				}
				if (goodsdesc && goodsdesc.freightFreeMoney) {
					if (goodsdesc.price > freightFreeMoney || goodsdesc.price == freightFreeMoney) {
						freight = 0
					}
				}
				return freight
			},
			balancePayNums() {
				let price = 0;
				let goodsdesc = this.goodsdesc;
				let balance = this.memberinfo.balance;
				if (goodsdesc && goodsdesc.payType != 0) {
					if (balance) {
						if (balance > goodsdesc.price || balance == goodsdesc.price) {
							price = goodsdesc.price;
						} else {
							price = balance;
						}
					}
				}
				return price;
			},
			totalPrice() {
				let price = this.goodsdesc.price
				if (this.needfreight) {
					price = accAdd(price, this.needfreight);
				}
				return price;
			}
		},
		methods: {
			//获取商品详情
			async getGoodsDesc(id) {
				let data = {
					cardNo: '18715262316',
					productId: id,
				}
				let res = await api.goodsDetail(data);
				console.log(res)
				if (res.code == 200) {
					this.goodsdesc = res.data;
				}
			},
			//点击使用余额支付
			switchUseBalance() {
				this.balancePay = !this.balancePay;
				if (this.balancePay) {
					this.wxPay = false;
				}
			},
			//点击使用微信支付
			switchUseWxPay() {
				this.wxPay = !this.wxPay;
				if (this.wxPay) {
					this.balancePay = false;
				}
			},
			//点击购买按钮
			async begainBuyBtn() {
				let that = this;
				let goodsdesc = that.goodsdesc;
				if (!goodsdesc.canBuy) {
					this.$msg.showToast('您当前的等级不满')
				}

				let data = {
					getWay: goodsdesc.getWay,
					cardNo: that.memberinfo.cardNo,
					productId: goodsdesc.id
				}
				if (goodsdesc.getWay == 2 && that.needfreight) {
					data.freight = that.needfreight;
				}
				if (goodsdesc.getWay == 1) {
					if (!businessinfo) {
						return that.$msg.showToast('请先选择商家');
					}
					data.name = businessinfo.name;
					data.mobile = businessinfo.tel;
					data.address = businessinfo.address;
				} else if (goodsdesc.getWay == 2) {
					for (let i in that.params) {
						if (that.params[i] === '') {
							return that.$msg.showToast('请先填写您的收件信息')
						}
					}
				}
				switch (goodsdesc.payType) {
					case 0:
						if (!data.freight) {
							data.payType = 3;
						} else {
							if (that.balancePay) {
								data.payType = 4;
							} else if (that.wxPay) {
								data.payType = 5;
							} else {
								return that.$msg.showToast('请先选择支付方式')
							}
						}
						break;
					case 1:
						if (that.balancePay) {
							data.payType = 2;
						} else if (that.wxPay) {
							data.payType = 1;
						} else {
							return that.$msg.showToast('请先选择支付方式')
						}
						break;
					case 2:
						if (that.balancePay) {
							data.payType = 4;
						} else if (that.wxPay) {
							data.payType = 5;
						} else {
							return that.$msg.showToast('请先选择支付方式')
						}
						break;
				}
				let res = await api.shopOrder(data, true);
				if (res.code == 200) {
					if (that.wxPay) { //微信支付
						that.begainWxPay(res.pointExchangeGifts);
					} else {
						that.completeOrder(res.pointExchangeGifts.id)
					}
				}
			},
			//完成订单支付
			async completeOrder(id) {
				let data = {
					id: id,
					cardNo: this.memberinfo.cardNo,
				}
				let res = await api.completeOrder(data, true);
				if (res.code == 200) {
					this.$msg.showToast('购买成功！')
					await refreshUserInfo();
					uni.navigateBack({})
				}
			},
			//获取微信支付参数
			async begainWxPay(params) {
				let data = {
					amount: params.amount*100,
					body: this.goodsdesc.productName,
					openId: this.$store.state.openid,
					curUrl: 'pages/goodsdesc/goodsdesc',
					orderId: params.id
				}
				let res = await api.shopOrderPayParams(data);
				if(res.code==200){
					res.payData.package = res.payData.prepay_id;
					wxPayment(res.payData).then(res => {
						this.$msg.showToast('支付成功');
						uni.navigateBack({});
					}).catch(ret => {
						this.$msg.showToast('支付失败');
					})
				}
				console.log(res)
			},
			//跳转选择店铺
			jumpPointStore() {
				uni.navigateTo({
					url: '../pointstore/pointstore'
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		font-size: $font-md;
		color: $uni-text-color;
		@include box-padding(26upx);
	}

	.pay_btn {
		@include rect(698upx, 88upx);
		position: fixed;
		bottom: 63upx;
		left: 26upx;
		background-color: $main-color;
		@include text-allcenter(88upx);
		border-radius: 44upx;
		color: $text-white;
		font-size: 32upx;
	}

	.balance {
		@include rect(698upx, 104upx);
		@extend %flex-alcent;
		justify-content: space-between;
		margin-top: 25upx;
		background-color: $bg-white;
		@include box-padding(38upx);
		border-radius: $radius-md;
		margin-top: 25upx;

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

				image {
					@include rect(38upx, 38upx);
				}

			}

			.usebalance {
				border: none;
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

	.goods-info {
		width: 698upx;
		background-color: $bg-white;
		@include box-padding(32upx);
		margin-top: 26upx;
		border-radius: $radius-md;

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

	.head-info {
		width: 698upx;
		margin-top: 25upx;
		background-color: $bg-white;
		@include box-padding(38upx);
		border-radius: $radius-md;
		margin-top: 25upx;


	}

	.cost-item {
		@include rect(100%, 108upx);
		@extend %flex-alcent;
		justify-content: space-between;
		border-bottom: 1upx $line-color solid;

		image {
			@include rect(22upx, 36upx)
		}

		input {
			color: #A3A3A3;
			text-align: right;
		}

		&:last-child {
			border: none;
		}

		&.on {
			border-bottom: 1upx $line-color solid;
		}

		text {
			font-size: 32upx;

			&:last-child {
				color: #A3A3A3;
			}
		}
	}
</style>
