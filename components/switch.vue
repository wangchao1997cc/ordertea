<template>
	<!-- 自定义switch开关 -->
	<view class="switch" @click="switchIcon()">
		<view class="toggle" :class="{active:currtab == 1}"></view>
		<text v-for="(item,index) in switcharr" :class="{on:index == currtab}" :key="index">{{item}}</text>
	</view>
</template>

<script>
	import {goUserAddress} from '../utils/goToPage.js'
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				currtab:0,
				switcharr:['自取','外卖'],
			};
		},
		methods:{
			...mapMutations('control', ['SET_BUSINESSTYPE']),
			switchIcon(){
				let that = this,
				    currtab = that.currtab;
				if(currtab==0){
					return goUserAddress('select');
				}else{
					that.SET_BUSINESSTYPE(2)
					currtab = 0;
				}
				that.currtab = currtab;
				// this.$emit('switchTab',currtab);
			}
		}
	}
</script>

<style lang="scss">
	.switch {
		@include rect(174upx, 64upx);
		border-radius: 32upx;
		background: rgb(244, 244, 244);
		@extend %flex-alcent;
		justify-content: space-between;
		position: relative;
		font-size: 22upx;
		@include box-padding(23upx);
		line-height: 64upx;
		color: #B4B7B9;
	}

	.toggle {
		@include rect(86upx, 54upx);
		border-radius: 27upx;
		background: $main-color;
		position: absolute;
		top: 5upx;
		transition: 0.5s;
		left: 5upx;
		text-align: center;
	}
	.switch > text{
		z-index: 9;
	}
	.switch > .on{
		color: $bg-white;
	}
	.switch > .active{
		left: 82upx;
	}
</style>
