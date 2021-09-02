<template>
	<view class="content">
		<view class="list">
			<view class="row-box">
				<view class="name-tel">
					<view>{{address.receiverAddress + address.appendReceiverAddress}}</view>
					<view @click.stop="prentEvent">
						<!-- <image @click="addressEdit(address)" src="../../static/address/edit_icon.png"></image> -->
					</view>
				</view>
				<view class="address-desc">
					<text>{{`${address.receiverName} ${address.receiverPhone}`}}</text>
				</view>
			</view>
		</view>
		<view class="division">
			当前地址可配送门店
		</view>
		<store :type="true" :nearList= "nearList"></store>
	</view>
</template>

<script>
	import store from '../../components/store.vue';
	import api from '../../WXapi/api.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	import {
		conversion,
	} from '../../utils/author.js'
	export default {
		data() {
			return {
				address:{},
				nearList:[]
			}
		},
		components:{
			store,
		},
		computed:{
			...mapState(['businessType'])
		},
		onLoad() {
			let address = uni.getStorageSync('selectAddress');
			this.address = address;
			this.getNearShopList(address)
		},
		methods: {
			// 获取当前附近的门店
			async getNearShopList(row) {
				let that = this;
				let location = that.location;
				let data = {
					coordinate: [row.longitude,row.latitude],
					businessType: that.businessType,
					pageNow: 0,
					pageSize: 10
				}
				let res = await api.getNearStoreList(data);
				if(res && res.status== 1){
					let nearList = res.data.rows;
					nearList.forEach(item => {
						item.newdistance = conversion(item.distance) //换算距离
					})
					that.nearList = nearList;
				}
			},
		},
		
	}
</script>

<style lang="scss">
	.content{
		width: $screen-width;
		.list {
			view:{
				display: flex;
			}
		
			.row-box {
				@include rect(698upx, 145upx);
				background: #FFFFFF;
				box-shadow: 5px 4px 6px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				flex-wrap: wrap;
				padding: 30upx 40upx;
				box-sizing: border-box;
				font-size: 30upx;
				margin: 30upx auto 0 auto;
		
				.name-tel {
					color: #000000;
					font-size: $font-md;
					@include rect(100%, 30upx) @extend %flex-alcent;
					justify-content: space-between;
					view:first-child{
						width: 550upx;
						@include lineOnly();
					}
					image{
						@include rect(30upx,30upx);
						margin-right: 7upx;
					}
				}
		
				.address-desc {
					min-height: 76upx;
					line-height: 38upx;
					color:#87888B;
					font-size: 24upx;
					margin: 18upx 0;
				}
			}
		}
		.division{
			@include rect(100%,106upx);
			background-color: $bg-white;
			@include text-allcenter(106upx);
			font-size:32upx;
			color: #888888;
			margin-top: 24upx;
		}
	}
</style>
