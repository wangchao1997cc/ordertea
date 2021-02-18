<template>
	<view class="single-box">
		<view class="single-store" :class="{change_border:currtab==index}" v-for="(item,index) in nearList" :key="index" @click="choseStore(index,item)">
			<view class="single-l-info">
				<view class="single-store-name">
					<view class="single-store-label" v-if="type" :class="{greybg:!item.isServiceTime}">
						{{item.isServiceTime?(item.isBusy?'繁忙中':'营业中'):'休息中'}}
						isServiceTime
					</view>
					<text>{{item.storeName}}</text>
				</view>
				<view class="single-address">
					<image src="../static/address_icon.png"></image>
					<view class="single-address-info">
						<text>{{`${item.provinceName}-${item.districtName}-${item.storeAddress}`}}</text>
					</view>
				</view>
				<view class="time-info" v-if="type">
					<image src="../static/time_icon.png"></image>
					<view class="time-box">
						<block v-for="(time_item,idx) in item.businessTimes" :key="idx">
							<text>{{`${time_item.beginTime}-${time_item.endTime}`}}\n</text>
						</block>
					</view>
					<!-- <text>10:00-24:00</text> -->
				</view>
				<!-- <view class="busy-l">
					<minesilder :config="sliderConfig"></minesilder>
					<text>前面还有<text>8</text>笔订单，预计还要20分钟</text>
				</view> -->
			</view>
			<view class="single_r" :class="{on:type}">
				<view class="go-look" @click="jumpSoreMenu(item)">
					<text v-if="type">去看看\n</text>
					<text>距离您{{item.newdistance}}</text>
				</view>
				<view class="tel-info" v-if="type">
					<image src="../static/tel_icon.png" @click="callPhone(item.phoneNumberList[0])"></image>
					<image src="../static/store_address_icon.png" @click="jumpMap(item)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import minesilder from './minesilder.vue';
	const app = getApp();
	export default {
		data() {
			return {
				currtab:0,
				animationData: {}, //动画
				sliderConfig: {
					progresswidth: '320upx',
					progressbar: '50%',
				},
			};
		},
		props:{
			nearList:{
				type:Array,
				default:() => []
			},
			type:{
				type:Boolean,
				default:false,
			},
			
		},
		components: {
			minesilder,
		},
		methods:{
			//点击选择店铺
			choseStore(index,item) {
				
				if (this.currtab == index) {
					return
				}
				this.currtab = index;
				this.$emit('choseStore',item)
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
				if(item.isBusy){
					return this.$msg.showToast('门店忙碌中，请选择其他门店')
				}
				app.globalData.storeInfo = item;
				if(this.type){
					this.$store.commit('copy', item.storeId);
					uni.switchTab({
						url: '../ordermenu/ordermenu'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.single-box{
		@include rect(100%,100%);
	}
	.single-store {
		width: 698upx;
		margin: 25upx auto;
		@extend %flex-alcent;
		justify-content: space-between;
		padding: 40upx 0 30upx 35upx;
		box-sizing: border-box;
		font-size: 25upx;
		background-color: $bg-white;
		border-radius: $radius-md;
		

	}
	
	.change_border{
		border: 2upx $main-color solid;
	}

	.single-l-info {
		width: 450upx;
	}

	.single_r {
		width: 220upx;
		height: 140upx;
		border-left: 1upx #eeeeee solid;
		@extend %flex-column;
		justify-content: center;
	}
	.on{
		height: 231upx;
	}

	.single-store-name {
		font-size: 31upx;
		@extend %flex-alcent;

	}

	.single-store-label {
		@include rect(80upx, 33upx);
		@include text-allcenter(33upx);
		color: $text-white;
		background-color: $main-color;
		font-size: 21upx;
		margin-right: 23upx;
		&.greybg{
			background-color: #ACACAC;
		}
	}

	.single-address {
		margin: 30upx 0;
		display: flex;
	}

	.time-info {
		@extend %flex-alcent;
	}

	.time-info > image {
		@include rect(26upx, 26upx);
		margin-right: 18upx;
		color: #5D5D5D;
	}
	.time-box{
		width: 340upx;
	}

	.single-address>image {
		@include rect(20upx, 27upx);
		margin-right: 20upx
	}

	.single-address-info {
		max-height: 80upx;
		width: 340upx;
		@include lineAny(2);
		color: #5D5D5D;
	}

	.busy-l {
		width: 320upx;
		margin: 40upx 0 30upx 40upx;
		font-size: 20upx;
		color: #A3A3A3;

	}

	.busy-l>text {
		text {
			color: $color-red;
		}
	}

	.go-look {
		font-size: 28upx;
		text-align: center;
	}

	.go-look>text:last-child {
		font-size: 21upx;
		color: #6C6C6C;
	}

	.tel-info {
		@include rect(160upx, 60upx);
		display: flex;
		justify-content: space-between;
		margin-top: 40upx;
	}

	.tel-info>image {
		@include rect(60upx, 60upx);
	}
</style>
