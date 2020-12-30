<template>
	<view class="content">
		<view class="order-item" v-for="(item,index) in orderList" :key="index" @click="jumpOrderDetail(item.orderId)">
			<view class="order-header">
				<view class="order-header-l">
					<view class="order-status">
						{{item.orderType==2?'自取':(item.orderType==3?'堂食':'外卖')}}<!-- {{item.orderType==2?'自取':(item.orderType==3?'堂食':'外卖')}} -->
					</view>
					<text>{{item.storeName}}</text>
				</view>
				<text class="color-grey">{{item.statusName}}</text>
			</view>
			<view class="order-cont">
				<view class="order-cont-l">
					<view class="good-pic">
						<image :src="item.brandLogo"></image>
					</view>
					<text>{{item.brandName}}</text>
				</view>
				<view class="cont-r">
					x1
				</view>
			</view>
			<view class="time-price">
				<text>{{item.createTime}}</text>
				<text>￥{{item.totalPrice}}</text>
			</view>
			<view class="order-num">
				{{item.takeMealSn?'取餐号：'+item.takeMealSn:item.statusName}}
				
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import {goOrderDeatails} from '../../utils/goToPage.js'
	export default {
		data() {
			return {
				pageNow:0,   //当前页数
				orderList:[],  //订单列表
				isNexPage:true,   //是否有下一页
			}
		},
		onLoad() {
			this.getOrderList();   //获取订单数据
		},
		//页面触底加载分页
		onReachBottom: function() {
			let that = this;
			if (!that.isNexPage) {
				return
			}
			that.pageNow++;
			that.getOrderList();
		},
		methods: {
			//获取订单数据
		    async getOrderList(){
				let data = {
					pageNow: this.pageNow,
					pageSize: 10,
				}
				let res = await api.getOrderList(data,true);
				if(res.status==1){
					if(!res.data.length){
						return this.isNexPage = false;
					}
					if(res.data.length < 10){
						this.isNexPage = false
					}
					if(this.pageNow==0){
						this.orderList = res.data
					}else{
						this.orderList = this.orderList.concat(res.data)
					}
				}
			},
			//跳转订单详情
			jumpOrderDetail(orderId){
				goOrderDeatails(orderId)
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
		@include rect(698upx,386upx);
		background-color: $bg-white;
		border-radius: $radius-md;
		margin: 25upx auto;
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
			@extend %flex-alcent;
			justify-content: space-between;
			color: #000000;
			text:first-child{
				font-size: 24upx;
				color: #999999;
			}
		}
		.order-num{
			
			height: 68upx;
			// @include box-padding(28upx);
			text-align: center;
			line-height:68upx;
			border:1upx $main-color solid;
			color: $main-color;
			border-radius: 34upx;
			width: 200upx;
			float: right;
		}
	}
</style>
