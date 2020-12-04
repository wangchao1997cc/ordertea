<template>
	<view class="chose-store" :hidden="hiddenChoseStore">
		<view class="chose-cont">
			<view class="store-item" v-for="(item,index) in nearList" :key = "index" @click="choseStore(index)">
				<view class="ischose" :class="{chosed_store:currtab == index}">
				</view>
				<view class="store-name">
					{{item.storeName}}
				</view>
				<view class="store-address">
					{{`${item.provinceName}-${item.districtName}-${item.storeAddress}`}}
				</view>
				<view class="">
					{{item.distance}}
				</view>
			</view>
			<view class="chose-store-footer">
				<view class="store-footer-item" @click="chosrOther">
					选择其他门店
				</view>
				<view class="store-footer-item" @click="confirmStore">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../WXapi/api.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				currtab:0,
				hiddenChoseStore:true,
			};
		},
		props:{
			nearList: {
				type:Array,
				default:() => []
			}
		},
		computed: {
			...mapState(['bussinessType'])
		},
		methods:{
			//点击选择店铺
			choseStore(index){
				if(this.currtab == index){
					return
				}
				this.currtab = index;
			},
			showChoseprop(){
				this.hiddenChoseStore = false;
			},
			//前往选择城市
			chosrOther(){
				goChoseCity();
			},
			//确认选择所选店铺
			async confirmStore(){
				this.hiddenChoseStore = true;
				this.$emit('switchStore', this.nearList[this.currtab].storeId);
			},
		}
	}
</script>

<style lang="scss">
	.chose-store{
		font-size: 28upx;
		@include rect(100%,100%);
		position: fixed;
		top: 0;
		left: 0;
		background-color: $bg-mask;
	}
	.chose-cont{
		@include rect(620upx,800upx);
		background-color: $bg-white;
		margin: 20% auto;
		border-radius: 10upx;
		position: relative;
	}
	.chose-store-footer{
		position: absolute;
		@include rect(100%,120upx);
		@extend %flex-alcent;
		bottom: 0upx;
	}
	.store-footer-item{
		flex:1;
		@include text-allcenter(200upx)
	}
	.store-item{
		@include rect(100%,160upx);
		@extend %flex-alcent;
	}
	.store-item>view{
		margin-right: 10upx;
	}
		
	.ischose{
		@include rect(20upx,20upx);
		border: 1upx red solid;
		border-radius: 50%;
	}
	.chosed_store{
		background-color: red;
	}
	.store-name{
		
	}
</style>
