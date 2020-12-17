<template>
	<view class="content">
		<view class="nav-box">
			<view :class="{changeC:currtab==index}" class="nav-item" v-for="(item,index) in navarr" :key="index" @click="tabNav(index)">
				{{item}}
			</view>
		</view>
		<view class="addressinfo">
			<view class="address-item" v-for="(item,index) in addressData[currtab]" :key='index' @click="switchRegion(item)">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
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
				citydata: '', //选中的城市数据
				alldata: [], //返回的所有省份和城市数据
			}
		},
		onLoad() {
			this.getProvince();
		},
		methods: {
			//获取开放城市    处理数据 获取省份
			async getProvince() {
				let data = {
					sortType: 0
				}
				let res = await api.getOpenCityList(data, true);
				if (res.status == 1) {
					let province = [];
					let newobj = [];
					province = res.data.reduce((preVal, curVal) => { //省份去重
						newobj[curVal.provinceName] ? '' : newobj[curVal.provinceName] = preVal.push({
							name: curVal.provinceName,
							provinceId: curVal.provinceId
						});
						return preVal
					}, [])
					this.alldata = res.data;
					this.addressData.push(province);
				}
			},
			//切换导航栏
			tabNav(index) {
				if (this.currtab == index) {
					return;
				}
				this.currtab = index;
			},
			//获取省份对应的城市列表
			getCityArr(provinceId) {
				let data = this.alldata;
				let cityarr = []
				data.forEach((item) => {
					item.provinceId == provinceId ? cityarr.push({
						name: item.cityName,
						cityId: item.cityId
					}) : ''
				})
				return cityarr;
			},
			//切换地区
			async switchRegion(item) {
				let that = this;
				let res = null;
				let data = {};
				if (that.currtab != 2) {
					switch (that.currtab) {
						case 0: //通过省份选择城市
							res = this.getCityArr(item.provinceId);
							break;
						case 1: //通过城市id获取对应的区域
							data.cityId = item.cityId;
							that.citydata = {
								cityId: item.cityId,
								cityName: item.name,
							}
							let json = await api.getDistrict(data, true);
							if (json.status == 1) {
								res = json.data;
							}
							break;
					};
					that.navarr[that.currtab] = item.name; //导航栏视图更新
					that.currtab += 1;
					if (that.currtab == 2) { //添加全部区域搜索
						res.unshift({
							name: '全部区域',
							districtId: 0,
						});
					}
					if (that.addressData[this.currtab]) { //如果存在则覆盖
						that.addressData[this.currtab] = res;
					} else { //不存在则添加
						that.addressData.push(res);
					}
				} else {
					that.navarr.splice(2, 1, item.name); //导航栏视图更新
					`?cityId=${that.cityId}&districtId=${item.districtId}`
					let citydata = that.citydata;
					goChoseStore({
						cityId: citydata.cityId,
						cityName: citydata.cityName,
						districtId: item.districtId,
						districtName: item.name,
						chosecity: true,
					}); //前往选择门店
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
				@include nav-line(#FF5856, 60upx, 6upx) color: #9A9A9A;

				&.changeC {
					color: #FF5856;

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
				height: 100upx;
				line-height: 80upx;
			}
		}
	}
</style>
