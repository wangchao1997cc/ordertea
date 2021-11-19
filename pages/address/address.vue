<template>
	<view class="content">
		<view class="list">
			<view class="row-box" v-for="(item,index) in addressList" :key="index">
				<view class="address-box" @tap="select(item)" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :style="item.txtStyle"
				 :data-index="index">
					<view class="name-tel">
						<view class="address-descinfo"><text>{{item.receiverAddress+item.appendReceiverAddress}}</text></view>
						<view class="update-ad" @click.stop="prentEvent">
							<image @click="addressEdit(item)" src="../../static/06_icon_编辑.png"></image>
						</view>
					</view>
					<view class="address-desc">
						<text>{{`${item.receiverName} ${item.receiverPhone}`}}</text>
					</view>
				</view>
				<view class="delete-btn" @click="deleteAddress(item.aid,index)">
					删除
				</view>
			</view>
		</view>
		<!-- <view class="nothing" v-if="!addressList.length">暂时没有任何您的地址信息</view> -->
		<view class="add-btn">
			<view class="btn" @tap="addAddress">
				添加新地址
			</view>
		</view>
		<nodata :conf="config"></nodata>
	</view>

</template>
<script>
	const app = getApp();
	import nodata from '../../components/nodata.vue';
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				isSelect: false,
				addressList: [], //用户地址数组
				shopinfo: {}, //当前选择的店铺
				delBtnWidth: 180, //删除按钮的宽度
				startX: ''
			};
		},
		onShow() {
			this.getUserAddress(); //获取用户地址
		},
		computed: {
			
			config() {
				let nodatashow = true;
				if (!this.addressList || !this.addressList.length) {
					nodatashow = false;
				}
				return {
					nodatashow: nodatashow,
					pageType: 'address'
				}
			},
		},
		components: {
			nodata
		},
		onLoad(e) {
			let that = this;
			if (e.type == 'select') {
				that.isSelect = true;
			}
			this.initEleWidth();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
		},
		// components: {
		// 	nodata
		// },
		methods: {
			//删除地址
			deleteAddress(addressId,idx){
				let that = this;
				that.$msg.showModal(async (juide) => {
					if (juide == 1) {
						let data = {
							addressId:addressId
						}
						let res = await api.deleteAdress(data);
						if (res && res.status == 1) {
							that.$msg.showToast('删除成功');
							that.addressList.splice(idx, 1);
						}
					}
				}, '确定要删除该地址吗',false,true)
			},
			
			//获取元素自适应后的实际宽度
			getEleWidth: function(w) {
				var real = 0;
				try {
					var res = wx.getSystemInfoSync().windowWidth;
					var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
					real = Math.floor(res / scale);
					return real;
				} catch (e) {
					return false;
					// Do something when catch error
				}
			},
			initEleWidth: function() {
				let delBtnWidth = this.getEleWidth(this.delBtnWidth);
				this.delBtnWidth = delBtnWidth;
			},
			touchS: function(e) {
				if (e.touches.length == 1) {
					this.startX = e.touches[0].clientX
				}
			},
			touchM: function(e) {
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyle = "";
					if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyle = "left:0px";
					} else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
						txtStyle = "left:-" + disX + "px";
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyle = "left:-" + delBtnWidth + "px";
						}
					}
					//获取手指触摸的是哪一项
					let index = e.currentTarget.dataset.index;
					this.$set(this.addressList[index], 'txtStyle', txtStyle)
				}
			},
			touchE: function(e) {
				console.log(e)
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
					//获取手指触摸的是哪一项
					let index = e.currentTarget.dataset.index;
					this.$set(this.addressList[index], 'txtStyle', txtStyle)
				}
			},
			//阻止默认事件
			prentEvent() {
				return;
			},
			//设为默认地址
			setupDefault(item) {
				if (item.defaultAddress) {
					return
				}
				let that = this;
				that.$msg.showModal(async (res) => {
					if (res == 1) {
						item.defaultAddress = true;
						let res = await that.$api.updateSaveAddress(item, true);
						if (res && res.code == 200) {
							that.addressList = res.data;
						}
					}
				}, '设置此地址为默认地址');
			},
			/**
			 * 获取用户地址
			 */
			async getUserAddress() {
				let res = await api.getUserAddress({});
				if (res.status == 1) {
					if (res.data) {
						this.addressList = res.data;
					} else {
						this.addressList = []
					}
				}
			},
			//修改地址
			addressEdit(item) {
				uni.setStorage({
					key: 'address',
					data: item,
					success() {
						uni.navigateTo({
							url: "edit/edit?type=edit"
						})
					}
				});
			},
			//添加新地址
			addAddress() {
				uni.navigateTo({
					url: "./edit/edit"
				})
			},
			//防止冒泡
			stopDefault() {
				return
			},
			//选择地址
			async select(row) {
				let that = this;
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if (that.isSelect) {
					uni.setStorage({
						key: 'selectAddress',
						data: row,
					})
					let res = await api.getNearStore({
						coordinate: [row.longitude, row.latitude],
						searchName: row.receiverAddress,
						businessType: that.$store.state.businessType,
					}, true);
					if (res.status == 1) {
						let shopinfo = res.data;
						that.shopinfo = res.data;
						let oldshopinfo = app.globalData.storeInfo;
						if (oldshopinfo) {
							if (oldshopinfo.storeId != shopinfo.storeId) {
								that.switchJuide(shopinfo.storeName, shopinfo.storeId)
							} else {
								that.jumpMenu(shopinfo.storeId)
							}
						} else {
							that.switchJuide(shopinfo.storeName, shopinfo.storeId)
						}
					} else {
						that.$msg.showToast('该地址无配送门点，请选择其他地址')
					}
				} else {
					uni.setStorage({
						key: 'address',
						data: row,
						success() {
							uni.navigateTo({
								url: "edit/edit?type=edit"
							})
						}
					});
				}
			},
			//切换地址提示
			switchJuide(storeName, storeId) {
				this.$msg.showModal((res) => {
					if (res == 1) {
						this.jumpMenu(storeId);
					}
				}, `是否将该地址切换到${storeName}店，是否继续`, '温馨提示', true)
			},
			//跳转menu界面
			jumpMenu(storeId) {
				app.globalData.storeInfo = this.shopinfo;
				this.$store.commit('copy', storeId);
				this.$store.commit('changebussiness', [1])
				uni.switchTab({
					url: '../ordermenu/ordermenu'
				})
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8
	}

	view {
		display: flex;
	}

	.content {
		width: $screen-width;
		color: $uni-text-color;
		font-size: $font-md;
	}

	.add-btn {
		position: fixed;
		bottom: 70upx;
		left: 26upx;
		width: 698upx;
		height: 88upx;
		justify-content: center;
		align-items: center;
		border-radius: 44upx;
		overflow: hidden;


		.btn {
			flex: 1;
			height: 100%;
			background: $main-color;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.list {
		flex: 1;
		flex-wrap: wrap;

		.row-box {
			@include rect(698upx, 145upx);
			margin: 30upx auto 0 auto;
			position: relative;
			border-radius: 10upx;
			overflow: hidden;

			.address-box {
				position: absolute;
				@include rect(100%, 100%);
				background: #FFFFFF;
				box-shadow: 5px 4px 6px 0px rgba(0, 0, 0, 0.1);
				flex-wrap: wrap;
				padding: 30upx 0upx 0 40upx;
				box-sizing: border-box;
				font-size: 30upx;
				z-index: 5;
				transition: left 0.2s ease-in-out;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.name-tel {
				color: #000000;
				font-size: $font-md;
				@include rect(100%, 30upx);
				@extend %flex-alcent;
				justify-content: space-between;

				.address-descinfo {
					width: 550upx;
					@include lineOnly();

					text {
						display: block;
						width: 550upx;
						@include lineOnly();
					}
				}

				.update-ad {
					@include rect(108upx, 100upx);
				}

				image {
					margin-top: 34upx;
					margin-left: 31upx;
					@include rect(30upx, 30upx);
				}
			}

			.address-desc {
				min-height: 76upx;
				line-height: 38upx;
				color: #87888B;
				font-size: 24upx;
				margin: 18upx 0;
			}

			.delete-btn {
				position: absolute;
				width: 180upx;
				height: 100%;
				background-color: #e64340;
				z-index: 4;
				top: 0;
				border-top-right-radius: 10upx;
				border-bottom-right-radius: 10upx;
				right: 1upx;
				color: #fff;
				justify-content: center;
				line-height:145upx;
			}
		}
	}

	.nothing {
		width: 100%;
		position: fixed;
		top: 40%;
		justify-content: center;
		font-size: 26upx;
		color: #999999;
	}
</style>
