<template>
	<!-- 积分商城的店铺 -->
	<view class="content">
		<view class="point-item" v-for="(item,index) in storeList" :key="index">
			<view class="store-pic">
				<image :src="item.logo"></image>
			</view>
			<view class="store-info">
				<view class="head-info">
					<view class="store-name">
						{{item.name}}
					</view>
					<text>≤ {{item.distance}}</text>
				</view>
				<view class="store_address">
					{{item.address}}
				</view>
			</view>
			<view class="chosebox" :class="{usebalance:item.choice}" @click="choiceStore(item)">
				<image v-if="item.choice" src="../../static/choose_icon.png"></image>
			</view>
		</view>
		<view class="blank">
			
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	const app = getApp();
	import {
		getLocation,
		conversion,
	} from '../../utils/author.js'
	export default {
		data() {
			return {
				page:0,
				storeList:null,
				totalPageindex:null,
			}
		},
		
		async onLoad() {
			let location = uni.getStorageSync('location');
			if(!location){
				location = await getLocation();
			}
			this.location = location;
			this.getStoreList(location);
		},
		//页面触底加载分页
		onReachBottom: function() {
			let that = this;
			if (that.page == that.totalPageindex) {
				return
			}
			that.page++;
			that.getStoreList();
		},
		methods: {
			//获取附近门店的列表
			async getStoreList(location){
				let that = this;
				location?'':location = that.location;
				let data = {
					distance:'100',
					longitude:location.longitude,
					latitude:location.latitude,
					page:that.page,
					limit:10,
				}
				let res = await api.pointStore(data);
				if(res.code==200){
					res.data.forEach(item => {
						that.$set(item,'choice',false);
						item.distance = conversion(item.distance);
						
					})
					if(that.page==0){
						that.totalPageindex = Math.floor(res.total / 10);
						that.storeList = res.data;
					}else{
						that.storeLis = that.storeLis.concat(res.data)
					}
				}
			},
			choiceStore(item){
				uni.showLoading({
					mask:true
				})
				item.choice = true;
				app.globalData.businessinfo = item;
				setTimeout(() => {
					uni.hideLoading()
					uni.navigateBack({})
				},200)
			},
		}
	}
</script>

<style lang="scss">
	.blank{
		height: 200upx;
	}
	.content {
		color: $uni-text-color;
		font-size: $font-md;
		@include box-padding(28upx);
		padding-top: 1upx;
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

	.point-item {
		width: 698upx;
		@extend %flex-alcent;
		background-color: $bg-white;
		padding: 28upx;
		box-sizing: border-box;
		margin-top: 20upx;
		border-radius: $radius-md;

		.store-pic {
			@include rect(180upx, 180upx);
			// border: 1upx $main-color solid;

			image {
				
				@include rect(100%, 100%);
				border-radius: $radius-md;
			}
		}

		.store-info {
			margin-left: 20upx;
			@include rect(400upx, 180upx);
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			padding: 15upx 0;
			box-sizing: border-box;

			.head-info {
				// margin-top: 15upx;
				width: 100%;
				@extend %flex-alcent;

				.store-name {
					font-size: 32upx;
					margin-right: 20upx;
					max-width: 260upx;
					@include lineOnly();
					line-height: 44upx;
				}

				text {
					color: #999999;
					line-height: 44upx;
				}
			}
			.store_address{
				font-size: 24upx;
				color: #999999;
				line-height: 32upx;
				width: 100%;
				@include lineAny(2);
				margin-top: 30upx;
			}
		}
	}
</style>
