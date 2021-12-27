<template>
	<view class="content">
		<image
			v-for="(item, index) in imgUrlArr"
			:key="index"
			mode="widthFix"
			:src="item.coverUrl"
		></image>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			// imgHeight:0,
			imgUrlArr: []
			// imgUrl:''
		};
	},
	onLoad() {
		this.imgUrlArr = app.globalData.groupImg;
		console.log(this.imgUrlArr);
	},
	methods: {}
};
</script>

<style lang="scss">
.content {
	width: 100%;
	font-size: 0;
	image {
		width: 100%;
	}
}
</style>
