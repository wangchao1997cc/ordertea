<template>
	<view class="content">
		   <image :style="{height:imgHeight+'px'}" @load="imageLoad" src="https://fnb-merchants.oss-cn-shanghai.aliyuncs.com/123487/level/b263bf9cd649ba5e21a494d2dab99304.jpg"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgHeight:0,
			}
		},
		methods: {
			imageLoad(res){
				let sw = uni.getSystemInfoSync().windowWidth;
				this.imgHeight= (res.detail.height * sw) / res.detail.width;
			}
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
		image{
			width: 100%;
		}
	}

</style>
