<template>
	<!-- 没有数据展示组件 -->
	<view class="noshopcar" :hidden="conf.nodatashow">
		<view class="nodata-pic">
			<image :src="config.img"></image>
			<text>{{config.juide}}</text>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		name: 'noshopcar',
		data() {
			return {
				nodatashow : true
			}
		},
		props: {
			conf:{
				type: Object,
				default: () => ({}),
			},
		},
		computed:{
			config(){
				let img = '';
				let juide = '';
				switch(this.conf.pageType){
					case 'order':
						img = '../static/nodata/no_order.png';
						juide = '暂无此订单数据～';
					break;
					
					case 'address':
						img = '../static/nodata/no_address.png';
						juide = '暂无收货地址～';
					break;
					
					case 'coupon':
						img = '../static/nodata/no_coupons.png';
						juide = '暂无此类优惠券～';
					break;

				}
				return {
					img: img,
					juide: juide
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.noshopcar {
		width: $screen-width;

		.nodata-pic {
			@extend %flex-column;
			width: 100%;
			// @include rect(500upx, 500upx);
			text-align: center;
			// border: 1upx red solid;

			image {
				@include rect(500upx, 500upx);
				margin-bottom: 40upx;
			}
			text {
				color: #343434;
				opacity: 0.5;
			}
		}
	}
</style>
