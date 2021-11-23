<template>
	<view class="content">
		<view class="order-item" v-for="(item,index) in orderList" :key="index" @click="jumpOrderDetail(item)">
			<view class="order-header">
				<view class="order-header-l">
					<view class="order-status">
						{{item.strOrderType}}<!-- {{item.orderType==2?'自取':(item.orderType==3?'堂食':'外卖')}} -->
					</view>
					<text>{{item.strShopName}}</text>
				</view>
				<text class="color-grey">{{item.strTakeMode}}</text>
			</view>
			<view class="order-cont" v-for="(aitem,idx) in item.Detail" :key="idx">
				<view class="order-cont-l" >
					<view class="good-pic">
						<image :src="aitem.strPicUrl"></image>
					</view>
					<text>{{aitem.strProductName}}</text>
				</view>
				<!-- <view class="cont-r">
					x1
				</view> -->
			</view>
			<view class="time-price">
				<text>{{item.datOrderTime}}</text>
				<text>￥{{item.floTotal}}</text>
			</view>
			<view class="order-num-box">
				<view class="order-num">
					{{!item.blnPayed?'待支付':(item.strSelfCode?'取餐号：'+item.strSelfCode:item.strTakeMode)}}
				</view>
			</view>
		</view>
		<nodata :conf="config"></nodata>
	</view>
</template>

<script>
	const app = getApp();
	import api from '../../WXapi/api.js'
	import { goOrderDeatails } from '../../utils/goToPage.js'
	import nodata from '../../components/nodata.vue';
	import {mapGetters} from 'vuex';
	import appConfig from '../../config/index.js'
	
	export default {
		data() {
			return {
				orderList: [],  //订单列表
			}
		},
		onLoad() {
			this.getOrderList();   //获取订单数据
		},
		onShow() {
			let orderRefresh = app.globalData.orderRefresh;
			if(orderRefresh){
				app.globalData.orderRefresh = false;
				this.getOrderList();
			}
		},
		computed:{
			...mapGetters(['memberinfo', 'businessType', 'paymentMode','plusinfo']),
			config() {
				let nodatashow = true;
				if (this.orderList && !this.orderList.length) {
					nodatashow = false;
				}
				return {
					nodatashow: nodatashow,
					pageType: 'order'
				}
			},
		},
		// //页面触底加载分页
		// onReachBottom: function() {
		// 	let that = this;
		// 	if (!that.isNexPage) {
		// 		return
		// 	}
		// 	that.pageNow++;
		// 	that.getOrderList();
		// },
		components:{
			nodata
		},
		methods: {
			//获取订单数据
		    async getOrderList(){
				let that = this;
				let data = {
					HQCode: appConfig.hqcode,
					MemberCode: that.plusinfo.strMemberCode,
					Mobile: that.memberinfo.mobile,
					WXOpenID: that.plusinfo.strWXOpenID,
					GetDetail: false,
					interFaces: 'OrderRecord'
				}
				try{
					let res = await api.shopCarControl(data,true);
					this.orderList = res.Message;
				}catch(err){
					
				}
			},
			//跳转订单详情
			jumpOrderDetail(data){
				app.globalData.orderDetail = data;
				goOrderDeatails(data.strSaleOrderNum)
			}
		}
	}
</script>

<style lang="scss">
	.content{
		font-size: $font-md;
		color: $uni-text-color;
		padding-top: 1upx;
	}
	.color-grey{
		color: #999999;
	}
	.order-item{
		
		background-color: $bg-white;
		border-radius: $radius-md;
		margin: 25upx auto;
		padding-bottom: 80upx;
		@include box-padding(35upx);
		
		.order-header{
			@include rect(100%,99upx);
			border-bottom: 1upx rgba(0,0,0,0.14) solid;
			@extend %flex-alcent;
			justify-content: space-between;
			
			.order-header-l{
				@extend %flex-alcent;
				height: 55upx;
			}
			.order-status{
				@include rect(88upx,55upx);
				margin-right: 23upx;
				background-color: $main-color;
				@include text-allcenter(55upx);
				font-size: 22upx;
				color: $bg-white;
				border-radius: 55upx;
			}
		}
		.order-cont{
			@include rect(100%,95upx);
			margin-top: 24upx;
			display: flex;
			justify-content: space-between;
			.order-cont-l{
				@extend %flex-alcent;
				.good-pic{
					@include rect(95upx,95upx);
					margin-right: 23upx;
					image{
						@include rect(100%,100%);
					}
				}
			}
			.cont-r{
				margin-top: 44upx;
				color: #999999;
			}
		}
		.time-price{
			@include rect(100%,75upx);
			line-height: 75upx;
			@extend %flex-alcent;
			justify-content: space-between;
			color: #000000;
			text:first-child{
				font-size: 24upx;
				color: #999999;
			}
		}
		.order-num-box{
			height: 98upx;
			
		}
		.order-num{
			height: 68upx;
			padding: 0 28upx;
			text-align: center;
			line-height:68upx;
			border:1upx $main-color solid;
			color: $main-color;
			border-radius: 34upx;
			// width: 2upx;
			float: right;
		}
	}
</style>
