<template>
	<!-- 门店列表 -->
	<view class="content">
		<view class="region" @click="choseCity">
			<text>{{`${address.cityName} ${address.districtName}`}}</text>
			<image src="../../static/my/right.png"></image>
		</view>
		<map id="store-map" show-location :longitude="maplocation[0]" :latitude="maplocation[1]" :markers="markers"></map>
		<view class="store-cont">
			<view class="store-item" v-for="(item,index) in storeList" @click="choseStore(index)" :key="index">
				<view class="store-info">
					<text>{{item.storeName}} \n</text>
					<text>距离你{{item.distance}}\n</text>
					<text>{{item.storeAddress}}\</text>
					<view class="buss-time">
						营业时间：
						<block v-for="(time_item,idx) in item.businessTimes" :key="idx">
							<text>{{`${time_item.beginTime}-${time_item.endTime}`}}\n</text>
						</block>
					</view>
				</view>
				<view class="store-control">
					<view class="placeorder-btn" @click="jumpSoreMenu(item)">
						去下单
					</view>
					<view class="tel-address">
						<image src="../../static/phone.png" @click="callPhone(item.phoneNumberList[0])"></image>
						<image src="../../static/address.png" @click="jumpMap(item)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		etdistance
	} from '../../utils/author.js'
	import {
		getRouteParams,goChoseCity
	} from '../../utils/goToPage.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				address: {},
				pageindex: 1,
				storeList: [],
				currtab: 0,
				markers: [],
			}
		},
		computed: {
			...mapState(['businessType']),
			maplocation() { //显示的店铺位置
				let location = [113,23];
				if (this.storeList.length) {
					let storedata = this.storeList[this.currtab];
					location = storedata.coordinate;
				}
				return location;
			},
		},
		onLoad() {
			let data = getRouteParams();
			// data ? '' : data = {
			// 	cityId: 11478,
			// 	cityName: "广州市",
			// 	districtId: 0,
			// 	districtName: "全部区域",
			// }
			console.log(data)
			this.address = data;
			this.getStoreList(data); //获取地区对应的门店列表
		},
		methods: {
			//选择店铺
			choseStore(index) {
				if (this.currtab == index) {
					return
				}
				this.currtab = index;
			},
			//获取地区所对应的门店列表
			async getStoreList(data) {
				let location = uni.getStorageSync('location');
				let that = this;
				console.log(that.businessType)
				// console.log(that.$store.state.)
				let params = {
					cityId: data.cityId,
					businessType: that.businessType,
					coordinate: [location.longitude, location.latitude],
					pageNow: that.pageindex,
					pageSize: 5
				}
				data.districtId ? params.districtId = data.districtId : '';
				let res = await api.getStoreList(params);
				if (res.status == 1) {
					let storeList = res.data.rows;
					storeList.forEach(item => {  //换算距离
						item.distance = etdistance(params.coordinate[1], params.coordinate[0], item.coordinate[1], item.coordinate[0]) 
					})
					that.storeList = storeList;
					that.handleMarkers(storeList);   //处理地图标记点
				}
			},
			handleMarkers(storeList) {
				let markers = [];
				let data = null;
				let callout = null;
				if (storeList.length) {
					storeList.forEach((item, index) => {
						callout = {
							content:item.storeName,
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
							id:index,
							iconPath: "../../static/map/shop.png",
							longitude: item.coordinate[0],
							latitude: item.coordinate[1],
							callout: callout
						};
						markers.push(data)
					})
				}
				this.markers = markers;
			},
			//拨打电话
			callPhone(tel) {
				uni.makePhoneCall({
					phoneNumber: tel
				})
			},
			//跳转地图导航
			jumpMap(item) {
				uni.openLocation({
					latitude: item.coordinate[1], // 纬度，范围为-90~90，负数表示南纬
					longitude: item.coordinate[0], // 经度，范围为-180~180，负数表示西经
					scale: 15, // 缩放比例
					name: item.storeName,
					address: item.storeAddress
				})
			},
			//前往此店铺的点餐页
			jumpSoreMenu(item) {
				this.$store.commit('copy', item.storeId);
				uni.switchTab({
					url: '../ordermenu/ordermenu'
				})
			},
			//跳转选择城市
			choseCity() {
				if(this.address.chosecity){
					uni.navigateBack({
					})
				}else{
					goChoseCity(true)
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		font-size: $font-md;
		width: $screen-width;
		color: $uni-text-color;

		.region {
			height: 130upx;
			@extend %flex-alcent;
			font-size: 32upx;
			margin-left: 30upx;

			image {
				@include rect(17upx, 24upx);
				margin-left: 20upx;
			}
		}

		#store-map {
			@include rect(100%, 400upx);
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
