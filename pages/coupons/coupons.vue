<template>
	<view class="content">
		<view class="nav-box">
			<view :class="{changeC:currtab==index}" class="nav-item" v-for="(item,index) in couponsObj" :key="index" @click="tabNav(index)">
				{{item.tit}}
			</view>
		</view>
		<couponlist :currtab="currtab" :coupons="couponsObj[currtab].list" :type="type" @checkCouponsDesc="checkCouponsDesc"></couponlist>
		<view class="exchange" @click="jumpExchange">
			兑换优惠券
		</view>
		<view class="mask" v-if="maskShow" @catchtouchmove="true">
			<view class="order-info" :animation="animationData">
				<view class="desc-box">
					<view class="head-tit">
						{{choiceCoupons.name}}
						<view class="close-pic" @click="closeMask">
							<image src="../../static/cha.png"></image>
						</view>
					</view>
					<scroll-view scroll-y="true" class="desc-cont">
						<view class="desc-time">{{choiceCoupons.beginTime.slice(0,10) +'  '+choiceCoupons.endTime.slice(0,10)}}</view>
						<view class="desc-cont-o">
							<jyf-parser :html="choiceCoupons.remark" selectable="true"></jyf-parser>
						</view>
					</scroll-view>
					<button open-type="share" class="turnTo_btn" v-if="currtab==0 && choiceCoupons.isShare">
						转赠
					</button>
				</view>
			</view>
		</view>
		<nodata :conf="config"></nodata>
	</view>
</template>

<script>
	const app = getApp();
	import jyfParser from '@/components/jyf-parser/jyf-parser'; //富文本组件
	import couponlist from '../../components/couponlist.vue'
	import api from '../../WXapi/api.js';
	import nodata from '../../components/nodata.vue';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				// navarr: [],
				choiceCoupons: {}, //选中的优惠券
				currtab: 0,
				type: 0,
				couponsObj: [],
				animationData: {}, //动画控件
				maskShow: false, //幕布显示隐藏
			}
		},
		components: {
			couponlist,
			jyfParser,
			nodata,
		},
		computed: {
			...mapGetters(['memberinfo']),
			config() {
				let that = this;
				let nodatashow = true;
				if (that.couponsObj.length && !that.couponsObj[that.currtab].list.length) {
					nodatashow = false;
				}
				return {
					nodatashow: nodatashow,
					pageType: 'coupon'
				}
			},
		},
		onShareAppMessage(res) {
			let that = this;
			let data = {
				path: '/pages/home/home',
				success: function(res) {}
			}
			if (res.from === 'button') { // 来自页面内分享按钮
				data.path = '/pages/home/home?giveCardId=' + that.memberinfo.id + '&ticketId=' + that.choiceCoupons.id;
				data.title = '我给你分享了一张' + "“" + that.choiceCoupons.name + "”" + ',快来领取吧',
					data.imageUrl = '../../static/share.png';
			}
			that.lockingCoupons(); //锁定优惠券
			return data
		},
		
		onLoad(options) {
			let that = this,
			    type = options.type;
			let title = '我的优惠券';
			// let navarr = ['未使用','已使用','已过期'];
			if (type == 'choose') {
				that.type = 1;
				let couponsList = uni.getStorageSync('canusecoupons');
				that.handerCoupons(couponsList); //处理优惠券数据
				title = '选择优惠券'
				uni.removeStorageSync('canusecoupons');
			} else {
				that.getCoupons();
			}
			uni.setNavigationBarTitle({
				title: title
			})
			that.renderAnimation();
		},
		onShow() {
			if (app.globalData.exchangeSuccess) {
				app.globalData.exchangeSuccess = false;
				this.getCoupons(); //刷新优惠券
			}
		},
		methods: {
			async lockingCoupons() { //锁定优惠券
			    let that = this,
				    data = {
					ticketId: that.choiceCoupons.id,
					giveCardId: that.memberinfo.id
				};
				let res = await api.lockingCoupons(data);
				if (res.code == 200) {
					that.closeMask();
					that.getCoupons();
				} else {
					that.$msg.showToast(res.message)
				}
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
			},
			//获取我的优惠券
			async getCoupons() {
				let that = this;
				let res = await api.getCoupons({
					cardNo: that.memberinfo.cardNo,
					type: that.currtab
				})
				that.handerCoupons(res.data);
			},
			checkCouponsDesc(val) {
				let that = this;
				that.choiceCoupons = val;
				that.maskShow = true;
				let animation = that.animation;
				that.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					that.animationData = animation.export();
				})
			},
			closeMask() {
				let that = this;
				that.maskShow = false;
				let animation = that.animation;
				that.animationData = animation.export();
			},
			//处理优惠券数据
			handerCoupons(couponsList) {
				let that = this,
				    couponsObj = [];
				switch (that.type) {
					case 1:
						couponsObj = [{
							tit: '可使用',
							list: [],
						}, {
							tit: '不可使用',
							list: [],
						}]
						couponsList.forEach(item => {
							item.beginTime = item.beginTime.slice(0, 10);
							item.endTime = item.endTime.slice(0, 10);
							if (item.canUse == 1) {
								couponsObj[0].list.push(
									item
								)
							} else {
								couponsObj[1].list.push(
									item
								)
							}
						})
						break;
					case 0:
						couponsObj = [{
							tit: '未使用',
							list: [],
						}, {
							tit: '已使用',
							list: [],
						}, {
							tit: '已过期',
							list: [],
						}];
						couponsObj[that.currtab].list = couponsList;
				}
				that.couponsObj = couponsObj;
			},

			tabNav(index) {
				let that = this;
				if (index == that.currtab) {
					return;
				}
				that.currtab = index;
				if (that.type == 0) {
					that.getCoupons();
				}
			},
			//跳转兑换优惠券页面
			jumpExchange() {
				uni.navigateTo({
					url: '../exchangecoupons/exchangecoupons'
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}

	.content {
		flex-wrap: wrap;
		width: $screen-width;
		font-size: 26upx;
		color: $uni-text-color;

		.nav-box {
			@include rect(100%, 80upx);
			background-color: $bg-white;

			.nav-item {
				flex: 1;
				font-size: 26upx;
				align-items: center;
				justify-content: center;
				@include nav-line($main-color, 66upx, 6upx) color: #9A9A9A;

				&.changeC {
					color: $main-color;

					&::after {
						transform: scaleX(1);
					}
				}
			}
		}

		.exchange {
			@include rect(698upx, 88upx);
			background-color: $main-color;
			justify-content: center;
			line-height: 88upx;
			position: fixed;
			left: 27upx;
			bottom: 20upx;
			border-radius: 44upx;
			color: $text-white;
			margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			margin-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		}
	}

	.mask {
		@extend %all-mask;

		.order-info {
			position: absolute;
			width: 100%;
			bottom: 0;
			transform: translateY(100%);
			background-color: #F5F5F5;
			border-top-right-radius: 20upx;
			border-top-left-radius: 20upx;
			overflow: hidden;

			.desc-box {
				width: 100%;
				background: #F8F8FA;
				flex-direction: column;
				align-items: center;

				.head-tit {
					@include rect(100%, 100upx);
					font-size: 35upx;
					line-height: 100upx;
					justify-content: center;
					font-weight: 700;
					position: relative;

					.close-pic {
						position: absolute;
						@include rect(100upx, 100upx);
						right: 0upx;
						top: 0upx;

					}

					image {
						@include rect(55upx, 55upx);
						margin: 23upx 33upx 0 0;
					}
				}

				.desc-cont {
					@include rect(698upx, 450upx);
					background-color: $bg-white;
					border-radius: $radius-md;
					flex-direction: column;
					@include box-padding(25upx);
					padding-bottom: 48upx;
					margin-bottom: 40upx;

					.desc-time {
						font-size: 28upx;
						color: black;
						line-height: 108upx;
					}

					.desc-cont-o {
						width: 100%;
						font-size: 25upx;
						color: #8A8A8A;
					}
				}

				.turnTo_btn {
					@include rect(698upx, 88upx);
					justify-content: cneter;
					line-height: 88upx;
					background-color: $main-color;
					color: $text-white;
					font-size: 32upx;
					margin: 0upx auto 40upx auto;
					border-radius: 44upx;
					justify-content: center;
				}
			}
		}
	}
</style>
