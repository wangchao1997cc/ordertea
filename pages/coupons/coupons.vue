<template>
	<view class="content">
		<view class="nav-box">
			<view :class="{changeC:currtab==index}" class="nav-item" v-for="(item,index) in couponsObj" :key="index" @click="tabNav(index)">
				{{item.tit}}
			</view>
		</view>
		<couponlist :coupons="couponsObj[currtab].list" :type="type"></couponlist>
	</view>
</template>

<script>
	import couponlist from '../../components/couponlist.vue'
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				// navarr: [],
				currtab: 0,
				type: 0,
				couponsObj: [],
			}
		},
		components: {
			couponlist
		},
		onLoad(options) {
			let type = options.type;
			let title = '我的优惠卷';
			// let navarr = ['未使用','已使用','已过期'];
			if (type == 'choose') {
				this.type = 1;
				let couponsList = uni.getStorageSync('canusecoupons');
				this.handerCoupons(couponsList);  //处理优惠卷数据
				title = '选择优惠卷'
				// uni.removeStorageSync('canusecoupons');
			}else{
				this.getCoupons();
			}
			// this.navarr = navarr;
			uni.setNavigationBarTitle({
				title: title
			})
			// this.getCoupons();
		},
		methods: {
			//获取我的优惠卷
			async getCoupons(){
				let res = await api.getCoupons({
					cardNo: this.$store.state.cardNo,
					type: this.currtab
				})
				this.handerCoupons(res.data);
			},
			//处理优惠卷数据
			handerCoupons(couponsList) {
				let couponsObj = [];
				switch (this.type) {
					case 1:
						couponsObj = [{
							tit: '可使用',
							list: [],
						}, {
							tit: '不可使用',
							list: [],
						}]
						couponsList.forEach(item => {
							item.beginTime = item.beginTime.slice(0,10);
							item.endTime = item.endTime.slice(0,10);
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
						},{
							tit: '已过期',
							list: [],
						}];
						couponsObj[this.currtab].list = couponsList;
				}
				this.couponsObj = couponsObj;
			},

			tabNav(index) {
				if (index == this.currtab) {
					return;
				}
				this.currtab = index;
				if(this.type==0){
					this.getCoupons();
				}
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
	}
</style>
