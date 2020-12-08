<template>
	<!-- 店铺详细信息 -->
	<view class="store_detail" :style="{height:shopBoxHeight + 'rpx'}" :hidden="showdetail">
		<view class="">
			门店告示
			<text>{{}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showdetail:true,
			};
		},
		props:{
			shopBoxHeight:{
				type:String,
				default:'',
			},
			shopinfo:{
				type:Object,
				default:() => ({})
			},
		},
		methods:{
			showDetail(){
				this.showdetail = false;
			},
			hideDetail(){
				this.showdetail = true;
			}
		}
	}
</script>

<style lang="scss">
	.store_detail{
		width: $screen-width;
		padding: 30upx;
		box-sizing: border-box;
	}
</style>
