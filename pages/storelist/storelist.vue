<template>
	<!-- 门店列表 -->
	<view class="content">
		<view class="region" @click="choseCity">
			<text>{{`${address.cityName} ${address.areaName}`}}</text>
			<image src="../../static/my/right.png"></image>
		</view>
		<map id="store-map" :style="{height:unfoldStow?'0px':'400rpx'}" show-location :longitude="maplocation[0]" :latitude="maplocation[1]"
		 :markers="markers"></map>
		<view class="unfold_stow" @click="clickControl" :class="{on:unfoldStow}">
			{{unfoldStow?'点击展开':'点击收起'}}
			<image src="../../static/address/bottom.png"></image>
		</view>
		<view class="store-cont">
			<store :type="true" :nearList="storeList" @choseStore="choseStore"></store>
		</view>
	</view>
</template>

<script>
	import {
		conversion
	} from '../../utils/author.js'
	import config from '../../config/index.js'
	import {
		getRouteParams,
		goChoseCity
	} from '../../utils/goToPage.js'
	import store from '../../components/store.vue'
	import {
		mapState,
		mapMutations
	} from "vuex";
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				unfoldStow: false, //地图展开或者收起
				address: {},
				pageindex: 0,
				storeList: [],
				currtab: 0,
				markers: [],
				maplocation: [113, 23],
			}
		},
		computed: {
			...mapState(['businessType']),
			// maplocation() { //显示的店铺位置
			// 	let location = [113,23];
			// 	if (this.storeList.length) {
			// 		let storedata = this.storeList[this.currtab];
			// 		location = storedata.coordinate;
			// 	}
			// 	return location;
			// },
		},
		components: {
			store
		},
		onLoad() {
			let data = getRouteParams();
			// console.log()
			this.address = data;
			this.getStoreList(data); //获取地区对应的门店列表
		},
		methods: {
			//选择店铺
			choseStore(val) {
				this.maplocation = val.coordinate;
				// if(val.)
			},
			//点击展开收起
			clickControl() {
				this.unfoldStow = !this.unfoldStow;
			},
			//获取地区所对应的门店列表
			async getStoreList(data) {
				let location = uni.getStorageSync('location');
				let that = this;
				let params = {
					HQCode: config.hqcode,
					Distance: location, //当前设备的位置
					interFaces: 'getShopList',
					GetType: 'onlyList',
					...data,
				}
				try{
					let res = await api.getNearStoreList(params);
					let storeList = res.Message;
					that.maplocation = {
						latitude: storeList.floLatitude,
						longitude: storeList.floLongitude
					};
					that.storeList = storeList;
					that.handleMarkers(storeList); //处理地图标记点
				}catch(err){
					this.$msg.showToast('当前无营业门店')
				}
			},
			handleMarkers(storeList) {
				let markers = [];
				let data = null;
				let callout = null;
				if (storeList.length) {
					storeList.forEach((item, index) => {
						callout = {
							content: item.strShopName,
							color: "#333333",
							fontSize: 11,
							display: "ALWAYS",
							padding: 6,
							borderRadius: 3,
							borderColor: "#ffc345",
							borderWidth: 1,
							bgColor: "#ffc345",
							height: 25,
							margin: 0,
						};
						data = {
							id: index,
							iconPath: "../../static/map/shop.png",
							longitude: item.floLongitude,
							latitude: item.floLatitude,
							callout: callout
						};
						markers.push(data)
					})
				}
				this.markers = markers;
			},
			//跳转选择城市
			choseCity() {
				if (this.address.chosecity) {
					uni.navigateBack({})
				} else {
					goChoseCity(true)
				}
			}
		}
	}
</script>

<style lang="scss">
	.unfold_stow {
		@include rect(100%, 50upx);
		background-color: $bg-white;
		@extend %flex-alcent;
		justify-content: center;

		image {
			transform: rotate(180deg);
			@include rect(22upx, 22upx);
			margin-left: 12upx;
		}

		&.on {
			image {
				transform: rotate(0deg);
			}
		}
	}

	.content {
		font-size: $font-md;
		width: $screen-width;
		color: $uni-text-color;

		.region {
			height: 107upx;
			@extend %flex-alcent;
			font-size: 32upx;
			padding-left: 32upx;
			box-sizing: border-box;
			background-color: $bg-white;

			image {
				@include rect(17upx, 24upx);
				margin-left: 20upx;
			}
		}

		#store-map {
			@include rect(100%, 400upx);
			transition: all .4s;
		}

		.store-cont {
			width: 100%;

			.store-item {
				@include rect(100%, 300upx);
				border-bottom: 1upx #e0e0e0 solid;
				display: flex;
				justify-content: space-between;
				padding: 30upx;
				box-sizing: border-box;

				&:last-child {
					border: none
				}

				.store-info {
					line-height: 50upx;
				}

				.store-control {

					.placeorder-btn {
						@include rect(140upx, 60upx);
						border: 1upx #C0C0C0 solid;
						@include text-allcenter(60upx);
					}

					.tel-address {
						@include rect(140upx, 60upx);
						margin-top: 40upx;
						@extend %flex-alcent;
						justify-content: space-between;

						image {
							@include rect(40upx, 40upx);

							&:last-child {
								height: 46upx;
							}
						}

					}
				}
			}
		}
	}
</style>
