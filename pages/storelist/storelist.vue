<template>
	<!-- 门店列表 -->
	<view class="content">
		<view class="region">
			<text>{{`${address.cityName} ${address.districtName}`}}</text>
			<image src="../../static/my/right.png"></image>
		</view>
		<view class="map">
			
		</view>
	</view>
</template>

<script>
	import {getRouteParams} from '../../utils/goToPage.js'
	import {mapState,mapMutations} from "vuex";
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				// params:{},    //请求suo
				address:{},
				pageindex:1,
				// location:{}
			}
		},
		computed:{
			...mapState(['bussinessType'])
		},
		onLoad() {
			let data = getRouteParams();
			console.log(data);
			this.address = data;
			this.getStoreList(data);   //获取地区对应的门店列表
		},
		methods: {
			//获取地区所对应的门店列表
			async getStoreList(data){
				let location = uni.getStorageSync('location');
				let that = this;
				let params = {
					cityId: data.cityId,
					businessType: [that.bussinessType],
					coordinate:[location.latitude,location.longitude],
					pageNow:that.pageindex,
					pageSize: 5
				}
				data.districtId?params.districtId = data.districtId:'';
				let res = await api.getStoreList(params);
				console.log(res)
			}
		}
	}
</script>

<style lang="scss">
	.content{
		font-size: $font-md;
		width: $screen-width;
		color: $uni-text-color;
		.region{
			height: 130upx;
			@extend %flex-alcent;
			font-size: 32upx;
			margin-left: 30upx;
			
			image{
				@include rect(17upx,24upx);
				margin-left: 20upx;
			}
		}
	}
</style>
