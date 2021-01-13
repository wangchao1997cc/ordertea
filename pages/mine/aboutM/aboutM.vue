<template>
	<view class="content">
		   <image :style="{height:imgHeight+'px'}" @load="imageLoad" src="https://merchants.oss-cn-hangzhou.aliyuncs.com/409/store/d463c4a7005437a17c7a2e00ea42617f.jpg"></image>
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
