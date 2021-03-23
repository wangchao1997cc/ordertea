<template>
	<!-- 等级说明 -->
	<view class="content">
		<view class="head-pic">
			<image :src="interest.background"></image>
		</view>
		<view class="interest" v-if="interest.ticketList.length">
			<view class="tit">
				会员权益
			</view>
			<view class="interest-cont">
				<!--  -->
				<view class="interest-item" v-for="(item,index) in interest.ticketList" :key="index">
					<image :src="item.ticketBaceImage?item.ticketBaceImage:'../../static/lv_coupons.png'"></image>
					<text>{{item.ticketName}}</text>
				</view>
			</view>
		</view>
		<view class="interest tow_inter">
			<view class="tit" @click="jumpGradeDesc">
				<text>权益说明</text>
				<view class="tit-r">
					更多
					<image src="../../static/07_icon_right.png"></image>
				</view>
			</view>
			<view class="lv-box">
				<view class="v-item" v-for="(item,index) in gradeinfo" :key="index">
					<image :src="'../../static/my/level'+(index+1)+'.png'"></image>
					<text>{{item.levelName}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				memberinfo:{},
				interest:[],   //当前所享受权益
				gradeinfo:[],   //当前等级信息
				// imgs:['../../static/my/level1.png','../../static/my/level1.png','../../static/my/level1.png','../../static/my/level1.png',]
			}
		},
		onLoad() {
			let memberinfo = uni.getStorageSync('memberinfo');
			this.memberinfo = memberinfo;
			this.getMemberGrade();  //获取会员等级信息
		},
		methods: {
			//获取会员等级信息
			async getMemberGrade() {
				let res = await api.getLevel({},true);
				if (res.code == 200) {
					res.data.forEach(item => {
						if(item.id == this.memberinfo.levelId){
							this.interest = item;
						}
					})
					this.gradeinfo = res.data;
				}
			},
			//前往等级说明
			jumpGradeDesc(){
				uni.navigateTo({
					url:'../interestdesc/interestdesc'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		width: $screen-width;
		color: $uni-text-color;
	}
	
	.head-pic{
		@include rect(750upx,358upx);
		image{
			@include rect(100%,100%);
		}
	}
	.interest{
		width: 698upx;
		margin: 23upx auto;
		padding: 1upx 38upx 43upx 38upx;
		box-sizing: border-box;
		background-color: $bg-white;
		padding-top: 1upx;
		border-radius: $radius-md;
		.tit{
			margin-top: 35upx;
			font-size: 31upx;
			color: #000000;
			display: flex;
			justify-content: space-between;
			.tit-r{
				color: #99989C;
				@extend %flex-alcent;
				margin-left: 20upx;
				image{
					@include rect(11upx,21upx);
					margin-left: 20upx;
				}
			}
		}
		.lv-box{
			@extend %flex-list;
			margin-top: 58upx;
			// @include box-padding(76upx);
			
			
			.v-item{
				image{
					@include rect(80upx,80upx)
				}
				margin-bottom: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 40upx;
				// margin-right: 100upx;
				&:nth-of-type(3n){
					margin-right: 0upx;
				}
				text{
					font-size: 24upx;
					color: $main-color;
					margin-left: -4upx;
					line-height: 44upx;
					// border: 1upx red solid;
				}
			}
		}
	}
	.tow_inter{
		padding-bottom: 0upx;
	}
	.interest-cont{
		width: 100%;
		@extend %flex-list;
		margin-top: 45upx;
		// border: 1upx red solid;
		.interest-item{
			
			height: 100upx;
			// border: 1upx red solid;
			@extend %flex-column;
			margin-right: 20upx;
			margin-bottom: 20upx;
			text{
				font-size: 25upx;
			}
			image{
				@include rect(55upx,37upx);
				margin-bottom: 24upx;
			}
		}
	}
</style>
