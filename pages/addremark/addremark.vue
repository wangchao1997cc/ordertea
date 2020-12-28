<template>
	<!-- 添加备注 -->
	<view class="content">
		<textarea class="text-write" v-model="remark" placeholder="备注信息" />
		<view class="add-btn" @click="confirmBtn">
			确认添加
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				remark:null,
			}
		},
		methods: {
			confirmBtn(){
				app.globalData.remark = this.remark;
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		width: $screen-width;
		font-size: $font-md;
		.text-write{
			
			border-radius: $radius-md;
			@include rect(689upx,234upx);
			background-color: $bg-white;
			margin: 27upx auto;
			padding: 30upx 28upx;
			box-sizing: border-box;
		}
	}
	.add-btn{
		@include rect(698upx,98upx);
		background-color: $main-color;
		@include text-allcenter(98upx);
		bottom: 68upx;
		left: 26upx;
		position: fixed;
		font-size: 32upx;
		color: $text-white;
	}
</style>
