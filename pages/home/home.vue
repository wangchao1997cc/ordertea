<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="text-area">
			{{cityid}}
		</view>
	</view>
</template>

<script>
	
	import {
		getLocation
	} from '../../utils/author.js'
	import {
		mapState,
		mapMutations,
	} from "vuex";
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			this.init(); //归纳函数
		},
		onShow() {
			console.log(this.state)
			this.getLocation(); //获取地理位置信息
		},
		computed: {
			...mapState(['cityid'])
		},
		methods: {
			init() {},
			async getLocation() {
				let location = await getLocation();
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
