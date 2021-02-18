<template>
	<view class="chose-store" v-if="hiddenChoseStore">
		<view class="order-info" :animation="animationData">
			<view class="chose-store-head">
				选择门店
				<!-- <image  src="../static/cha.png"></image> -->
			</view>
			<scroll-view class="store-box" scroll-y>
				<store @choseStore="choseStore" :nearList="nearList"></store>
			</scroll-view>
			<view class="chose-store-footer">

				<view class="store-footer-item" @click="confirmStore">
					确定
				</view>
				<view class="store-footer-item" @click="chosrOther">
					选择其他门店
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../WXapi/api.js'
	import store from './store.vue'
	import {
		goChoseCity
	} from '../utils/goToPage.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				storeInfo:{},   //选中的店铺
				hiddenChoseStore: false,
				animationData: {},
			};
		},
		components: {
			store
		},
		props: {
			nearList: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			// ...mapState(['businessType'])
		},
		mounted() {
			let that = this;
			let animation = uni.createAnimation({ //定义动画
				duration: 300,
				timingFunction: 'linear',
				delay: 0
			})
			that.animation = animation;
			that.$nextTick(() => { //解决DOM更新异步问题
				animation.translateY(0).step()
				that.animationData = animation.export();
			})
		},
		watch:{
			nearList(){
				this.storeInfo = this.nearList[0];
			}
		},
		methods: {
			choseStore(val){
				this.storeInfo = val;
			},
			openAnimation() {
				let that = this;
				let animation = that.animation;
				that.$nextTick(() => { //解决DOM更新异步问题
					animation.translateY(0).step()
					that.animationData = animation.export();
				})
			},
			
			//展现弹窗
			showChoseprop() {
				// uni.hideTabBar({})
				this.hiddenChoseStore = true;
			},
			//关闭弹窗
			closeChoseprop() {
				uni.showTabBar({})
				let animation = this.animation;
				this.animationData = animation.export();
				this.hiddenChoseStore = false;
			},
			//前往选择城市
			chosrOther() {
				goChoseCity();
			},
			//确认选择所选店铺
			async confirmStore() {
				if(this.storeInfo.isBusy){
					return this.$msg.showToast('门店忙碌中，请选择其他门店')
				}
				this.closeChoseprop();
				this.$emit('switchStore', this.storeInfo);
			},
		}
	}
</script>

<style lang="scss">
	.chose-store {
		font-size: 28upx;
		@extend %all-mask;
		
	}

	.chose-store>.order-info {
		background: #F8F8FA;
	}

	.chose-store-head {
		@include rect(100%, 129upx);
		@include text-allcenter(129upx);
		font-size: 35upx;
		font-weight: 700;
		position: relative;
		border-bottom: 1upx #C0BFBF solid;
		
	}

	.chose-store-head>image {
		position: absolute;
		@include rect(55upx, 55upx);
		top: 37upx;
		right: 33upx;
	}

	.store-box {
		width: 100%;
		max-height: 700upx;
	}

	.chose-store-footer {
		margin: 10upx auto;
		width: 698upx;
	}

	.store-footer-item {
		flex: 1;
		height: 88upx;
		@include text-allcenter(88upx);
		font-size: 32upx;
		margin-top: 10upx
	}

	.store-footer-item:first-child {
		background-color: $main-color;
		color: $text-white;
		border-radius: 44upx;
	}

	.store-item {
		@include rect(100%, 160upx);
		@extend %flex-alcent;
	}

	.store-item>view {
		margin-right: 10upx;
	}

	.ischose {
		@include rect(20upx, 20upx);
		border: 1upx red solid;
		border-radius: 50%;
	}

	.chosed_store {
		background-color: red;
	}

	.store-name {}
</style>
