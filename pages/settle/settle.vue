<template>
	<view class="content" v-if="storeInfo">
		<view class="table-num" v-if="forhere">
			<text>30</text>
			您的桌号
		</view>
		<view class="times-cont" v-if="!forhere">
			<view class="address">
				<text>{{storeInfo.storeName}}\n</text>
				<text>{{storeInfo.cityName+storeInfo.districtName+storeInfo.storeAddress}}</text>
			</view>
			<view class="takemeal-time" @click="openChooseTime">
				<text>{{type==1?'预定送达时间':'取餐时间'}}</text>
				<text>{{serviceTime?serviceTime:''}}</text>
			</view>
			<view class="takemeal-time">
				<text>联系电话</text>
				<text>{{storeInfo.phoneNumberList[0]}}</text>
			</view>
		</view>
		<view class="list" v-if="address">
			<view class="row-box">
				<view class="name-tel">
					<view>{{address.receiverAddress + address.appendReceiverAddress}}</view>
					<view>
						配送地址
						<!-- <image @click="addressEdit(address)" src="../../static/06_icon_编辑.png"></image> -->
					</view>
				</view>
				<view class="address-desc">
					<text>{{`${address.receiverName} ${address.receiverPhone}`}}</text>
				</view>
			</view>
		</view>
		<view class="goods-info">
			<view class="goods-item" v-for="(item,index) in interest.products" :key="index">
				<view class="goods-info-t">
					<text>{{item.name}}</text>
					<text>￥{{item.orderTotal}}</text>
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
			<view class="other-item" @click="choseTableware">
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
		<view class="mask" v-if="maskShow" @catchtouchmove="true">
			<view class="order-info" :class="{on:chooseWareShow}" :animation="animationData">
				<!-- 选择时间 -->
				<view class="choose-box" v-if="chooseTimeShow">
					<view class="chose-store-head">
						选择送达时间
						<image @click="closeMask" src="../../static/cha.png"></image>
					</view>
					<view class="choose-cont">
						<view class="date-l">
							<view class="data-l-item" v-for="(item,index) in timeData" :key="index" :class="{on:choosetime==index}" @click="changeTimeFrag(index)">
								{{item.date}}
							</view>
						</view>
						<scroll-view class="date-r" scroll-y>
							<view class="date-r-item" v-for="(item,index) in timeData[choosetime].timearr" :key="index" @click="chooseServer(item)">
								{{item}}
							</view>
						</scroll-view>
					</view>
				</view>
				<!-- 选择餐具 -->
				<view class="choose-box on" v-if="chooseWareShow">
					<view class="chose-store-head">
						选择餐具
						<image @click="closeMask" src="../../static/cha.png"></image>
					</view>
					<view class="tableware-box">
						<view class="tableware-item" :class="{change_bor:wareCurrtab==index}" v-for="(item,index) in tablewarearr" :key='index'
						 @click="switchWrae(index,item)">
							{{item + '份'}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import {
		wxPayment
	} from '../../utils/publicApi.js'
	import {
		goOrderDeatails
	} from '../../utils/goToPage.js'
	const app = getApp();
	export default {
		data() {
			return {
				useBalance: 1, //是否使用余额   1是0否
				coupons: null,
				wareCurrtab: 0, //选择餐具份数索引
				peopleNum: 1, //就餐人数
				tablewarearr: [1, 2, 3, 4],
				choosetime: 0, //选中的时间段索引
				maskShow: false, //总幕布
				chooseTimeShow: false, //预约时间幕布
				chooseWareShow: false, //预约餐具幕布
				animationData: {},
				timeData: [], //预约时间
				orderparams: {}, //请求的参数
				interest: {}, //会员折扣信息
				remark: null, //订单备注
				serviceTime: null, //选择的预计送达时间
				storeInfo: null, //店铺信息
				type: null,
				location: {}, //用户位置信息
				address: null, //用户地址
				forhere:null,  //堂食
			};
		},
		onLoad(options) {
			let that = this;
			let orderparams = app.globalData.orderinfo;
			this.storeInfo = app.globalData.storeInfo; //先渲染页面
			that.getWxaSubscribeTemplates() //获取微信订阅消息列表
			uni.showLoading({})
			that.orderparams = orderparams;
			that.memberInterest(orderparams); //会员权益计算
			that.type = that.$store.state.businessType[0]; //当前的模式
			that.renderAnimation(); //定义动画
			if(that.type==3){
				this.forhere = app.globalData.forhere;
			}else{
				that.getStore(options.storeId); //获取门店信息
				if (that.type == 1 || that.type == 4) {
					this.address = uni.getStorageSync('selectAddress');
				}
			}
		},
		onShow() {
			let remark = app.globalData.remark;
			let orderparams = app.globalData.orderinfo;
			if (orderparams.ticketId) { //如果有优惠卷
				this.memberInterest(orderparams); //会员权益计算
				this.orderparams = orderparams;
			}
			if (remark) {
				this.remark = remark;
			}
		},
		onUnload() {
			app.globalData.remark = '';
		},
		computed: {
			couponJuide() {
				let tit = '优惠卷';
				let cont = '';
				if (this.coupons) {
					tit = this.coupons.name;
					cont = '-¥' + this.coupons.amount
				} else {
					cont = (this.interest.canUseTotal ? this.interest.canUseTotal : 0) + '张可用'
				}
				return {
					tit: tit,
					cont: cont
				}
			},
		},
		methods: {
			//选择餐具份数
			choseTableware(){
				this.maskShow = true; //总幕布
				this.chooseWareShow = true;
			},
			//获取当前门店信息
			async getStore(storeId) {
				let location = uni.getStorageSync('location');
				this.location = location;
				let data = {
					storeId: storeId,
					businessType: this.$store.state.businessType[0],
					coordinate: [location.longitude, location.latitude],
				}
				let res = await api.getStore(data);
				if (res.status == 1) {
					this.storeInfo = res.data;
					this.computedTIme(res.data.appointmentTime);
				}
			},
			//切换是否使用余额
			switchUseBalance() {
				if (this.useBalance == 1) {
					this.useBalance = 0;
				} else {
					this.useBalance = 1;
				}
				this.orderparams.member.useBalance = this.useBalance;
				this.memberInterest(); //会员权益计算

			},
			async getWxaSubscribeTemplates() {
				let res = await api.getWxaSubscribeTemplates({});
			},
			//切换餐具数量
			switchWrae(index, item) {
				this.wareCurrtab = index;
				this.peopleNum = item;
				this.closeMask();
			},
			//打开选择时间幕布
			openChooseTime() {
				this.maskShow = true;
				this.chooseTimeShow = true;
			},
			//预计送达时间
			chooseServer(item) {
				this.serviceTime = this.timeData[this.choosetime].date + ' ' + item;
				this.closeMask();
			},
			//改变时间段
			changeTimeFrag(index) {
				if (this.choosetime == index) {
					return;
				}
				this.choosetime = index;
			},
			//关闭幕布
			closeMask() {
				setTimeout(() => {
					this.maskShow = false; //总幕布
					this.chooseTimeShow = false; //预约时间幕布
					this.chooseWareShow = false; //预约餐具幕布
				}, 300)
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
				console.log(timeData);
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
				this.serviceTime = timeData[0].date + ' ' + timeData[0].timearr[0];
				this.timeData = timeData;
			},
			//时间切段   15分钟为一个时间段
			handerTime(date, startTime, endTime) {
				let timerarr = [];
				startTime = new Date(new Date(date + ' ' + startTime)); //加上45分钟
				startTime = Date.parse(startTime) + (45 * 60000); //转为时间戳
				timerarr.push(new Date(startTime).format("hh:mm:ss"));
				endTime = new Date(new Date(date + ' ' + endTime));
				endTime = Date.parse(endTime); //转为时间戳
				let totalnum = Math.floor((endTime - startTime) / 1000 / 60 / 15)
				for (let i = 0; i < totalnum; i++) {
					startTime += (15 * 60000);
					timerarr.push(new Date(startTime).format("hh:mm:ss"))
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
					let orderinfo = res.data;
					orderinfo.promotions.forEach((item, index) => {
						if (item.type == 8) {
							orderinfo.promotions.splice(index, 1);
							this.coupons = item;
						}
					})
					that.interest = orderinfo;
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
			},
			//创建订单
			addOrder() {
				let that = this;

				let orderparams = that.orderparams;
				let interest = that.interest;
				let storeInfo = that.storeInfo;
				let type = that.type;
				let params = {
					storeId: storeInfo.storeId,
					longitude: that.location.longitude,
					latitude: that.location.latitude,
					menuId: orderparams.menuId,
					type: type,
					selfGetTime: that.serviceTime,
					payType: 2,
					name: interest.card.name,
					phone: interest.card.mobile,
					address: that.storeInfo.storeAddress,
					randomCode: new Date(new Date()).format("yyyyMMddhhmmss"),
					userNote: that.remark ? that.remark : '无',
					invoiceType: 0,
					isInvoice: false,
					couponId: 0,
					peopleNum: 0,
				}
				// if(type!=3){
				// 	params.
				// }
				let tit = `是否前往【${storeInfo.storeName}】自提`;
				if (type == 1) {
					let address = this.address;
					params.type = 4;
					params.name = address.receiverName;
					params.phone = address.receiverPhone;
					params.address = address.receiverAddress + address.appendReceiverAddress;
					tit = `是否确认配送地址【${address.receiverAddress}${address.appendReceiverAddress}】自提`
				}
				that.$msg.showModal(async json => {
					if (json == 1) {
						uni.showLoading({
							mask: true,
						})
						let products = [];
						let memberPreferentials = [];
						orderparams.order.products.forEach(item => {
							let product = {
								pid: item.product_no,
								num: item.qty,
								typeId: item.typeId,
							}
							if (item.listRequirements.length) {
								product.listRequirements = item.listRequirements;
							}
							products.push(product);
						})

						if (interest.balancePay) {
							memberPreferentials.push({
								content: '余额支付',
								prePrice: -interest.balancePay,
								type: 7,
								childType: 0
							})
						}
						interest.promotions.forEach(item => {
							memberPreferentials.push({
								content: item.name,
								prePrice: -item.amount,
								type: 7,
							})
						})
						params.products = products;
						params.memberPreferentials = memberPreferentials;
						// params = JSON.parse(JSON.stringify(params))
						let res = await api.placeOrder(params);
						uni.hideLoading()
						if (res.status == 1) {
							app.globalData.orderSuccess = true;
							this.getOrderDetail(res.data); //获取订单详情
						} else {
							this.$msg.showToast(res.msg);
						}
					}
					uni.hideLoading()
				}, '订单确认后无法更改', tit)
			},
			//获取订单详情
			async getOrderDetail(orderid) {
				let data = {
					orderId: orderid
				}
				let res = await api.getOrderDetail(data);
				if (res && res.status == 1) {
					let orderinfo = res.data;
					if (orderinfo.progress[0].status == 1) {
						this.getPayParams(orderid); //获取微信支付参数
					} else {
						this.goToOrderDetail(orderid);
					}
				}
			},
			async getPayParams(orderid) {
				let data = {
					payType: 2,
					orderId: orderid,
				};
				let res = await api.wxOrderPay(data);
				if (res.status == 1) {
					wxPayment(res.data).then(res => {
						this.$msg.showToast('支付成功');
						this.goToOrderDetail(orderid)
					}).catch(ret => {
						this.goToOrderDetail(orderid)
					})

				}
			},
			//返回上一层页面
			gobackPage() {
				uni.navigateBack({})
			},
			//前往订单详情页面
			goToOrderDetail(orderid) {
				goOrderDeatails(orderid, true);
			}
		}
	}
</script>

<style lang="scss">
	$line-color: rgba(0, 0, 0, 0.14);

	.mask {
		@extend %all-mask;
	}
	
	.table-num{
		@include rect(145upx,145upx);
		border-radius: 50%;
		background-color: $main-color;
		margin: 42upx auto;
		@extend %flex-column;
		justify-content: center;
		font-size: 20upx;
		color: $text-white;
		text{
			font-size: 44upx;
			margin-bottom: 4upx;
		}
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


		.choose-box {
			height: 100%;
		}

		&.on {
			height: 647upx;

			.choose-box {
				background-color: $bg-white;
			}
		}

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

		.tableware-box {
			// margin-top: 15upx;
			@include rect(100%, 84%);

			.tableware-item {
				@include rect(698upx, 98upx);
				border: 2upx #EDEDED solid;
				margin: 0upx auto 15upx auto;
				border-radius: $radius-md;
				@include text-allcenter(98upx);
			}

			.change_bor {
				border: 2upx $main-color solid;
			}
		}

		.choose-cont {
			@include rect(100%, 84%);
			display: flex;

			.date-l {
				flex: 1;

				.data-l-item {
					@include rect(100%, 124upx);
					@include text-allcenter(124upx);

					&.on {
						background-color: $bg-white;
					}
				}
			}

			.date-r {
				flex: 1.75;
				background-color: $bg-white;

				.date-r-item {
					width: 100%;
					text-align: center;
					margin-bottom: 72upx;

					&:first-child {
						margin-top: 45upx;
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
