<template>
	<view class="content">

		<view class="memberinfo">
			<view class="header-pic">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<view class="user-name">
				{{memberinfo.name}}
			</view>
			<view class="assets-info">
				<view class="assets-item" @click="jumpShopping">
					<text>{{memberinfo.point?memberinfo.couponsCount:0}}</text>
					<text>商城</text>
				</view>
				<view class="assets-item" @click="jumpCoupons">
					<text>{{memberinfo.couponsCount?memberinfo.couponsCount:0}}</text>
					<text>优惠券</text>
				</view>
				<view class="assets-item" @click="jumpWallet">
					<text>{{memberinfo.balance?memberinfo.balance:0}}</text>
					<text>钱包</text>
				</view>
			</view>
			<view class="qr-code">
				<canvas canvas-id="qrcode" />
			</view>
			<view class="bar-code">
				<canvas canvas-id="barcode" />
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import {
		toBarcode,
		toQrcode
	} from '../../utils/membercode.js';

	export default {
		data() {
			return {
				memberinfo: {},
				widthInfo: {

				},
				timer:null
			}
		},
		onLoad() {
			this.memberinfo = uni.getStorageSync('memberinfo');
			this.computeCanW(); //计算页面canvas 宽高
			this.getCodeParams(); //获取会员码
			this.interTime(); //创建定时器
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods: {
			//获取会员码
			async getCodeParams() {
				let memberinfo = this.memberinfo;
				let data = {
					cardNo: memberinfo.cardNo,
				}
				let res = await api.getCodeParams(data);
				console.log(res)
				if (res.code == 200) {
					let widthInfo = this.widthInfo;
					toQrcode('qrcode', res.data.code, widthInfo.qrcodew, widthInfo.qrcodew);
					toBarcode('barcode', res.data.code, widthInfo.barcodew, widthInfo.barcodeh);
				}
			},
			interTime(){
				this.timer = setInterval(() => {
					this.getCodeParams();
				},60000)
			},
			computeCanW() {
				let prefix = wx.getSystemInfoSync().windowWidth / 750;
				this.widthInfo = {
					qrcodew: 340 * prefix,
					barcodew: 284 * prefix,
					barcodeh: 134 * prefix,
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: $screen-width;
		padding-top: 1upx;


	}

	.memberinfo {
		@include rect(698upx, 900upx);
		margin: 130upx auto;
		background-color: $bg-white;
		border-radius: $radius-md;
		@include box-padding(26upx);
		padding-top: 1upx;
		

		.header-pic {
			border-radius: 80upx;
			overflow: hidden;
			@include rect(160upx, 160upx);
			margin: -80upx auto 0 auto;
		}

		.user-name {
			margin-top: 35upx;
			text-align: center;
		}

		.assets-info {
			width: 100%;
			margin-top: 65upx;
			display: flex;

			.assets-item {
				flex: 1;
				@extend %flex-column;
				justify-content: center;
				font-size: 32upx;
				font-weight: 700;

				text:last-child {
					font-size: 24upx;
					color: #A3A3A3;
					margin-top: 15upx;
				}
			}
		}
		
	}

	.qr-code {
		@include rect(340upx, 340upx);
		margin: -6upx auto 0 auto;

		#qrcode {
			@include rect(340upx, 340upx);

		}
	}

	.bar-code {
		@include rect(288upx, 140upx);
		margin: 40upx auto 0 auto;

		#barcode {
			@include rect(286upx, 135upx);
		}
	}
</style>
