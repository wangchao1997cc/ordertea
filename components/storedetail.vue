<template>
	<!-- 店铺详细信息 -->
	<view class="store_detail" :style="{height:shopBoxHeight + 'rpx'}" :hidden="showdetail">
		<view class="">
			<text>门店告示\n</text>
			<text>{{shopinfo.announcement}}</text>
		</view>
		<view class="">
			<text>配送\n</text>
			<text>满{{shopinfo.reachFee}}元起送\n</text>
			<text>配送费{{shopinfo.fee?shopinfo.fee:0}}元\n</text>
			<text>由顺丰提供配送服务，距门店{{shopinfo.deliveryRanges[0].radius?shopinfo.deliveryRanges[0].radius:'0'}}m范围内起送\n</text>
			<text>(配送范围受地区、天气等多方因素影响，以实际可配送距离为准)\n</text>
		</view>
		<view class="">
			<text>门店信息\n</text>
			<view class="Btime">营业时间：
				<block v-for="(item,index) in shopinfo.businessTimes" :key="index">
					<text>{{` ${item.beginTime}-${item.endTime}`}}</text>
				</block>
			</view>
			<text>门店电话：{{shopinfo.phoneNumberList[0]}}</text>
			<text>门店地址：{{shopinfo.storeAddress}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props: {
			shopBoxHeight: {
				type: String,
				default: '',
			},
			shopinfo: {
				type: Object,
				default: () => ({})
			},
			showdetail: {
				type:Boolean,
				default:() => true,
			},
		},
		methods: {
			showDetail() {
				this.showdetail = false;
			},
			hideDetail() {
				this.showdetail = true;
			}
		}
	}
</script>

<style lang="scss">
	.store_detail {
		width: $screen-width;
		padding: 30upx;
		box-sizing: border-box;
	}
</style>
