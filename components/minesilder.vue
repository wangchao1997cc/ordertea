<template>
	<view class="progressbar" :style="{width:config.progresswidth,height:config.progressheight || '14rpx'}">
		<view class="current" :style="{width: config.progressbar}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		props:{
			config: {
				type: Object,
				default: () => ({
					
				})
			}
		},
	}
</script>

<style lang="scss">
	.progressbar{

		background-color: #F8FAF3;
		border-radius: 14upx;
		position: relative;
		margin: 10upx auto;
	}
	.current{
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		border-radius: 14upx;
		background-color: $main-color;
		transition: all .2s;
	}
</style>
