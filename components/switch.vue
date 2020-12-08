<template>
	<!-- 自定义switch开关 -->
	<view class="switch" @click="switchIcon()">
		<view class="toggle" :class="{active:currtab == 1}"></view>
		<text v-for="(item,index) in switcharr" :class="{on:index == currtab}" :key="index">{{item}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currtab:0,
				switcharr:['自取','外卖'],
			};
		},
		methods:{
			switchIcon(){
				let currtab = this.currtab;
				if(currtab==0){
					currtab += 1;
				}else{
					currtab = 0;
				}
				this.currtab = currtab;
			}
		}
	}
</script>

<style lang="scss">
	.switch {
		@include rect(160upx, 64upx);
		border-radius: 40upx;
		background: rgb(244, 244, 244);
		@extend %flex-alcent;
		justify-content: space-between;
		position: relative;
		font-size: 26upx;
		@include box-padding(18upx);
		line-height: 64upx;
		color: #aaaaaa;
		font-weight: 100;
	}

	.toggle {
		@include rect(75upx, 50upx) border-radius: 40upx;
		background: rgb(202, 162, 132);
		position: absolute;
		top: 7upx;
		transition: 0.5s;
		left: 8upx;
		text-align: center;
	}
	.switch>text{
		z-index: 9;
	}
	.switch > .on{
		color: $bg-white;
	}
	.switch > .active{
		left: 77upx;
	}
</style>
