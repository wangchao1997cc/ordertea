<template>
	<view class="nav-box">
		<view class="nav-fixed" :style="{backgroundColor:!scollbg || conf.bgcolor,color:!scollbg || conf.color}">
			<view class="status" :style="{paddingTop:statusBarHeight+'px'}">
			</view>
			<view class="topnav">
				<view class="nav_img" @click="goBackPage" v-if="conf.hiddentit">
					<!--  -->
					<image :src="scollbg?'../static/nav_arrow.png':'../static/left_white_arrow.png'"></image>
				</view>
				<text>{{conf.title}}</text>
			</view>
		</view>
		<view class="fillblank" :style="{height:statusBarHeight+44+'px'}" v-if="conf.hiddentit">
		</view>
	</view>
</template>

<script>
	export default {
		name: 'comment',
		data() {
			return {
				conf: {
					color: '', //滚动后字体颜色
					bgcolor: '', //滚动后背景颜色
					title: '', //标题
					hiddentit: true, //是否是tabar页面 
					slideHeight: 300, //滑动距离 单位按设计稿要求rpx
				},
				scollbg: false, //改变背景色以及返回按钮
			};
		},

		props: {
			config: {
				type: Object,
				default: () => ({})
			},
		},
		created() {
			this.init();
		},
		mounted() {},

		computed: {
			//获取系统状态栏高度
			statusBarHeight() {
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			scrolltop() {
				let sysinfo = uni.getSystemInfoSync();
				return this.conf.slideHeight / (750 / sysinfo.windowWidth) - (sysinfo.statusBarHeight + 44);
			}

		},
		methods: {
			init() {
				var that = this;
				that.conf = Object.assign(that.conf, that.config);
			},
			//滚动页面处罚变换导航栏背景色
			pageScroll(e) {
				var that = this;
				let sysinfo = uni.getSystemInfoSync();
				const st = parseFloat(e.scrollTop.toFixed(2));
				if (that.scollbg === (st > that.scrolltop))  return;
				that.scollbg = (st > that.scrolltop);
				if(that.scollbg){
					uni.setNavigationBarColor({
						frontColor: '#000000',
						backgroundColor: '#ffffff'
					}) 
				}else{
					uni.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: '#ffffff'
					}) 
				}
			},
			//返回页面
			goBackPage() {
				uni.navigateBack({})
			}
		},
	}
</script>

<style lang="scss">
	.nav-box {
		width: $screen-width;
		color: $text-white;

		.nav-fixed {
			width: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 200;
		}

		.topnav {
			// border: 1px blue solid;
			@include rect(100%, 44px);
			@extend %flex-alcent;
			font-size: 32upx;
			justify-content: center;
			font-weight: 700;
			position: relative;

			.nav_img {
				@include rect(50upx, 80upx);
				position: absolute;
				top: 0upx;
				left: 30upx;
				image {
					margin: 22upx 0 0 0;
					@include rect(20upx, 36upx);
				}
			}

		}
	}
</style>
