<template>
	<view class="content">
		<scroll-view class="head-scroll" scroll-x>
			<view class="nav_item" :class="{changeC:currtab==index}" v-for="(item,index) in gradeinfo" :key="index" @click="changeNav(index)">
				<image :src="'../../static/my/level'+(index+1)+'.png'"></image> {{item.levelName}}
			</view>
		</scroll-view>
		<view class="lv-pic">
			<image :src="chooseInfo.background" mode="aspectFill"></image>
		</view>
		<view class="desc-cont">
			<jyf-parser :html="chooseInfo.privilegeText" selectable="true"></jyf-parser>
		</view>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser'; //富文本组件
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				currtab:0,
				gradeinfo:[],
			}
		},
		onLoad() {
			this.getMemberGrade();  //获取会员等级信息
		},
		computed:{
			chooseInfo(){
				return this.gradeinfo[this.currtab];
			}
		},
		components:{
			jyfParser
		},
		methods: {
			//获取会员等级信息
			async getMemberGrade() {
				let res = await api.getLevel({},true);
				if (res.code == 200) {
					this.gradeinfo = res.data;
				}
			},
			//改变导航栏
			changeNav(index) {
				if(this.currtab == index){
					return;
				}
				this.currtab = index;
			},
		}
	}
</script>

<style lang="scss">
	.content {
		width: $screen-width;
		@include box-padding(26upx);
		padding-top: 1upx;

		.head-scroll {
			@include rect(100%, 74upx);
			@include box-padding(58upx);
			box-sizing: border-box;
			white-space: nowrap;
			margin-top: 33upx;
			// border: 1upx red solid;
		}
		.lv-pic{
			@include rect(698upx,270upx);
			margin-top: 1upx;
			image{
				@include rect(100%,100%);
				border-radius: $radius-md;
			}
		}
		.desc-cont{
			width: 698upx;
			padding:40upx;
			box-sizing: border-box;
			border-radius: $radius-md;
			font-size: 25upx;
			color: #8A8A8A;
			background-color: $bg-white;
			margin: 26upx auto;
		}
		.richtext{
			width: 100%;
		}

		.nav_item {
			display: inline-block;
			font-size: 32upx;
			@include nav-line($main-color, 56upx, 5upx);
			color: #9A9A9A;
			margin-right: 70upx;
			line-height: 74upx;
			height: 74upx;

			// height: 40upx;
			image{
				vertical-align: middle;
				margin-bottom: 11upx;
				// margin-top: 16upx;
				@include rect(40upx,40upx)
			}
			&.changeC {
				color: $main-color;
			
				&::after {
					transform: scaleX(1);
				}
			}
		}
	}
</style>
