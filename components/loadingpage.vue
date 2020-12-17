<template>
	<view class="loading" :hidden= "loadingState">
		这里展现的是loading.....
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
			
		props:{
			loadingState:{
				type:Boolean,
				default: () => false
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.loading{
		width: 100%;
		height: 100%;
		background-color: $bg-white;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		@extend %flex-alcent;
		justify-content: center;
	}

</style>
