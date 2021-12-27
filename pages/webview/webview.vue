<template>
	<view class="content">
		<view class="wx_h5_wrap">
			<web-view :src="url"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: null,
				isShare: false,
			}
		},
		onLoad(options) {
			this.url = options.url;
		},

		//页面分享
		onShareAppMessage(res) {
			return {
				title: 'CandySoda',
				desc: 'CandySoda',
				path: '/pages/webview/webview?url=' + res.webViewUrl + '&isShare=' + true,
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.content {
		@include rect(100%, 100%);

		.wx_h5_wrap {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
