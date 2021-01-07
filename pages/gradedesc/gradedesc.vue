<template>
	<!-- 等级说明 -->
	<view class="content">
		<view class="head-pic">
			<image src="../../static/grade_head.png"></image>
		</view>
		<view class="interest">
			<view class="tit">
				会员权益
			</view>
		</view>
		<view class="interest">
			<view class="tit">
				权益说明
			</view>
			<view class="interest-cont">
				
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.getMemberGrade();  //获取会员等级信息
		},
		methods: {
			//获取当前等级信息
			async getMemberGrade() {
				let res = await api.getLevel({});
				console.log(res)
				if (res.code == 200) {
					
				}
			},
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
		@include rect(698upx,270upx);
		margin: 23upx auto;
		@include box-padding(38upx);
		background-color: $bg-white;
		padding-top: 1upx;
		border-radius: $radius-md;
		.tit{
			margin-top: 35upx;
			font-size: 31upx;
			color: #000000;
		}
	}
</style>
