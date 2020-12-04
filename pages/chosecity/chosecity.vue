<template>
	<view class="content">
		<view class="nav-box">
			<view :class="{changeC:currtab==index}" class="nav-item" v-for="(item,index) in navarr" :key="index" @click="tabNav(index)">
				{{item}}
			</view>
		</view>
		<view class="addressinfo">
			<view class="address-item" v-for="i in 10">
				
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	const app = getApp();
	export default {
		data() {
			return {
				currtab:0,
				navarr:['省份','城市','区域'],
			}
		},
		onLoad() {
			this.getProvince();   
		},
		methods: {
			//获取省份
			async getProvince(){
				let res = await api.getProvice(false,true);
				console.log(res)
			},
			//切换导航栏
			tabNav(index){
				if(this.currtab == index){
					return;
				}
				this.currtab = index;
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.content {
		flex-wrap: wrap;
		width: $screen-width;
		font-size: 30upx;
		color: $uni-text-color;
	
		.nav-box {
	
			@include rect(100%, 80upx);
			background-color: $bg-white;
	
			.nav-item {
				flex: 1;
				font-size: 30upx;
				align-items: center;
				justify-content: center;
				@include nav-line(#FF5856, 60upx, 6upx) color: #9A9A9A;
	
				&.changeC {
					color: #FF5856;
	
					&::after {
						transform: scaleX(1);
					}
				}
			}
		}
		.addressinfo{
			margin-top: 20upx;
			width: 33%;
			flex-direction: column;
			align-items: center;
			.address-item{
				height: 100upx;
				line-height: 80upx;
			}
		}
	}
	
</style>
