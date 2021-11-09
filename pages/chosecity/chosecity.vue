<template>
	<view class="content">
		<view class="nav-box">
			<view :class="{changeC:currtab==index}" class="nav-item" v-for="(item,index) in navarr" :key="index" @click="tabNav(index)">
				{{item}}
			</view>
		</view>
		<view class="addressinfo">
			<view class="address-item" v-for="(item,index) in addressData[currtab]" :key='index'>
				{{item.label}}
				<view class="tab-click" @click="switchRegion(item)">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import config from '../../config/index.js'
	import {
		goChoseStore
	} from '../../utils/goToPage.js'
	const app = getApp();
	export default {
		data() {
			return {
				currtab: 0,
				navarr: ['省份', '城市', '区域'],
				addressData: [], //渲染数据
				citydata: {
					Region:'',
					regionName:'',
					City:'',
					cityName:'',
					Area:'',
					areaName:'',
					chosecity:true,
				}, //选中的城市数据
				alldata: [], //返回的所有省份和城市数据
			}
		},
		onLoad() {
			this.getProvince();
		},
		methods: {
			//获取开放城市    处理数据 获取省份
			async getProvince() {
				let params = {
					HQCode:config.hqcode,
					OpenBusiness:true,
					interFaces: 'GetOpenBusiness'
				}
				try{
					let res = await api.getNearStoreList(params,true);
					this.alldata = res.Message;
					this.addressData.push(res.Message);
				}catch(err){
					
				}
			},
			//切换导航栏
			tabNav(index) {
				if (this.currtab == index) {
					return;
				}
				this.currtab = index;
			},
			//切换地区
			async switchRegion(item) {
				let that = this;
				let res = null;
				let data = {};
				if (that.currtab != 2) {
					res = item.children;
					if(that.currtab==0){
						this.citydata.Region = item.value;
						this.citydata.regionName = item.label;
					}else{
						this.citydata.City = item.value;
						this.citydata.cityName = item.label;
					}
					that.navarr[that.currtab] = item.label; //导航栏视图更新
					that.currtab += 1;
					if (that.currtab == 2) { //添加全部区域搜索
						res.unshift({
							label: '全部区域',
						});
					}
					if (that.addressData[this.currtab]) { //如果存在则覆盖
						that.addressData[this.currtab] = res;
					} else { //不存在则添加
						that.addressData.push(res);
					}
					
				} else {
					that.navarr.splice(2, 1, item.label); //导航栏视图更新
					this.citydata.areaName = item.label;
					if(!item.value){
						delete this.citydata.Area
					}else{
						this.citydata.Area = item.value
					}
					
					goChoseStore({
						...this.citydata,
					})
				}
			},
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
			margin-top: 10upx;

			.nav-item {
				flex: 1;
				font-size: 30upx;
				align-items: center;
				justify-content: center;
				@include nav-line($main-color, 60upx, 6upx);
				color: #9A9A9A;

				&.changeC {
					color: $main-color;

					&::after {
						transform: scaleX(1);
					}
				}
			}
		}

		.addressinfo {
			margin-top: 20upx;
			width: 33%;
			flex-direction: column;
			align-items: center;

			.address-item {
				width: 100%;
				justify-content: center;
				height: 100upx;
				line-height: 80upx;
				position: relative;
				.tab-click{
					@include rect(750upx,100%);
					position: absolute;
					top: 0;
					left: 0;
				}
			}
		}
	}
</style>
