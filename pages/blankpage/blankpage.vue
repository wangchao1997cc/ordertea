<template>
	<view class="content">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				computedHeight:null
			}
		},
		onLoad() {
			const sysinfo = uni.getSystemInfoSync();
			console.log(sysinfo)
			let windowHeight = sysinfo.windowHeight;
			this.computedHeight = windowHeight * (750 / sysinfo.windowWidth);  //系统高度rpx
			console.log(this.computedHeight)
		},
		methods: {
			
		}
	}
</script>

<style>
.content{
	width: 750upx;
	height: 1448upx;
	border: 1upx red solid;
}
</style>
