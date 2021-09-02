<template>
	<view class="content">
		<image
			:style="{ height: imgHeight + 'px' }"
			@load="imageLoad"
			src="https://merchants.oss-cn-hangzhou.aliyuncs.com/409/ticket/be56012277c2eaec1228322a2ff079f8.png"
		></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgHeight: 0
		};
	},
	methods: {
		imageLoad(res) {
			let sw = uni.getSystemInfoSync().windowWidth;
			this.imgHeight = (res.detail.height * sw) / res.detail.width;
		}
	}
};
</script>

<style lang="scss">
.content {
	width: 100%;
	image {
		width: 100%;
	}
}
</style>
