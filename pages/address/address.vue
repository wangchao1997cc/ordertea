<template>
	<view class="content">
		<view class="list">
			<view class="row-box" v-for="(item,index) in addressList" :key="index" @tap="select(item)">
				<view class="name-tel">
					<text>姓名：{{item.receiverName}}</text>
					<text>{{item.receiverPhone}}</text>
				</view>
				<view class="address-desc">
					<text>{{item.receiverAddress}}</text>
				</view>
				<view class="address-foot" @click.stop="stopDefault">
					<view class="foot-l" :class="{on:item.isDefault}" @click="setupDefault(item)">
						<view class="ad-chose">
							<!-- <image v-if="item.defaultAddress" src="../../static/shopcar_chose.png"></image> -->
						</view>
						{{item.defaultAddress?'已设为默认地址':'设为默认地址'}}
					</view>
					<view class="foot-r">
						<view @click="addressEdit(item)">
							<!-- <image src="../../static/address_update.png"></image> -->
							<text>编辑</text>
						</view>
						<view @click="deleteAddress(item.addrId,index)">
							<!-- <image src="../../static/delete-icon.png"></image> -->
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="nothing" v-if="!addressList.length">暂时没有任何您的地址信息</view> -->
		<view class="add-btn">
			<view class="btn" @tap="addAddress">
				添加新地址
			</view>
		</view>
		<!-- <nodata :conf="config"></nodata> -->
	</view>

</template>
<script>
	const app = getApp();
	// import nodata from '../../components/nodata.vue';
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				isSelect: false,
				addressList: [], //用户地址数组
				shopinfo:{},   //当前选择的店铺
			};
		},
		onShow() {
			this.getUserAddress(); //获取用户地址
		},
		computed: {
			config() {
				let nodatashow = true;
				if (!this.addressList.length) {
					nodatashow = false;
				}
				return {
					nodatashow: nodatashow,
					pageType: 'address'
				}
			},
		},
		onLoad(e) {
			let that = this;
			if (e.type == 'select') {
				that.isSelect = true;
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
		},
		// components: {
		// 	nodata
		// },
		methods: {

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
				if(res.status==1){
					this.addressList = res.data;
				}
				console.log(res)
				// if (res && res.code == 200) {
				// 	this.addressList = res.data;
				// }
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
						coordinate:[row.longitude,row.latitude],
						searchName: row.receiverAddress,
						businessType: that.$store.state.businessType,
					},true);
					if(res.status == 1){
						let shopinfo = res.data;
						that.shopinfo = res.data;
						let oldshopinfo = app.globalData.storeInfo;
						if(oldshopinfo){
							if(oldshopinfo.storeId != shopinfo.storeId){
								that.switchJuide(shopinfo.storeName,shopinfo.storeId)
							}else{
								that.jumpMenu(shopinfo.storeId)
							}
						}else{
							that.switchJuide(shopinfo.storeName,shopinfo.storeId)
						}
					}else{
						that.$msg.showToast('该地址无配送门点，请选择其他地址')
					}
					// uni.showLoading({})
				}
			},
			//切换地址提示
			switchJuide(storeName,storeId){
				this.$msg.showModal((res) =>{
					if(res==1){
						this.jumpMenu(storeId);
					}
				},`是否将该地址切换到${storeName}店，是否继续`,'温馨提示',true)
			},
			//跳转menu界面
			jumpMenu(storeId){
				app.globalData.storeInfo = this.shopinfo;
				console.log(storeId)
				this.$store.commit('copy',storeId);
				this.$store.commit('changebussiness',[1,3])
				uni.switchTab({
					url:'../ordermenu/ordermenu'
				})
			},
			//删除地址
			deleteAddress(id, idx) {
				let that = this;
				that.$msg.showModal(async (juide) => {
					if (juide == 1) {
						let res = await that.$api.deleteAddress(id);
						if (res && res.code == 200) {
							that.addressList.splice(idx, 1);
							that.$msg.showToast('删除成功');
						}
					}
				}, '确定要删除该地址吗')
			}
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
		bottom: 0;
		width: 100%;
		height: 100upx;
		justify-content: center;
		align-items: center;

		.btn {
			flex: 1;
			height: 100%;
			background: linear-gradient(-90deg, rgba(255, 78, 81, 1), rgba(253, 119, 120, 1));
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
		// padding-top: 10upx;
		flex-wrap: wrap;



		.row-box {
			@include rect(690upx, 280upx);
			background: #FFFFFF;
			box-shadow: 5px 4px 6px 0px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			flex-wrap: wrap;
			padding: 30upx;
			box-sizing: border-box;
			font-size: 30upx;
			margin: 30upx auto 0 auto;

			.name-tel {
				@include rect(100%, 30upx) @extend %flex-alcent;
				justify-content: space-between;
			}

			.address-desc {
				min-height: 76upx;
				line-height: 38upx;
				color: #666666;
				font-size: 28upx;
				margin: 30upx 0;
			}

			.address-foot {
				padding-top: 30upx;
				box-sizing: border-box;
				@include rect(100%, 60upx);
				border-top: 1px solid #D7D7D7;
				line-height: 30upx;

				.foot-l {
					width: 300upx;
					font-size: 28upx;
					color: #999999;
					align-items: center;

					.ad-chose {
						border: 2upx #AAAAAA solid;
						@include rect(32upx, 32upx);
						border-radius: 50%;
						margin-right: 20upx;
						box-sizing: border-box;

						image {
							@include rect(32upx, 32upx);
						}
					}

					&.on {
						color: $main-color;

						.ad-chose {
							border: none;
						}
					}
				}

				.foot-r {
					flex: 1;
					justify-content: flex-end;
					font-size: 26upx;
					color: #999999;

					view {
						margin-left: 60upx;

						image {
							@include rect(23upx, 28upx);
							margin-right: 20upx;
						}

						&:first-child {
							image {
								@include rect(28upx, 28upx);
							}
						}
					}
				}

				// justify-content: space-between;
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
