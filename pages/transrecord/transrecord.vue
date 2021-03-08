<template>
	<!-- 消费记录 -->
	<view class="content">
		<view class="nav-box">
			<view class="nav-item" v-for="(item,index) in navarr" :key="index" :class="{changeC:currtab==index}"
			@click="changeNav(index)">
				{{item}}
			</view>
		</view>
		<view class="record-item" v-for="(item,index) in recordData" :key="index">
			<view class="item-head">
				<text>{{item.storeName}}</text>
				<text>{{item.status==1?'成功':(tem.status==2?'已退单':'预结算')}}</text>
			</view>
			<view class="item-bot">
				<text>{{item.type==1?'充值':'消费'}}{{item.total}}元\n</text>
				<text>{{item.createdDate}}</text>
			</view>
		</view>
		<view class="no_record" v-if="nodataShow">
			<view class="no-record-pic">
				<image src="../../static/nodata/noRecord.png"></image>
			</view>
			<view class="no-record-juide">暂无{{currtab?'充值':'消费'}}记录</view>
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	export default {
		data() {
			return {
				navarr: ['消费', '充值'],
				currtab: 0,
				recordData:[],
			};
		},
		onLoad(options) {
			if(options){
				this.currtab = options.type;
			}
			this.getTransRecord();
		},
		computed:{
			nodataShow(){
				let nodata = false;
				if(this.recordData && this.recordData.length == 0){
					nodata = true;
				}
				return nodata;
			}
		},
		methods:{
			async getTransRecord(){
				let type = 2;
				if(this.currtab==1){
					type = 1
				}
				let data = {
					cardNo:this.$store.state.cardNo,
					type:type,
				}
				let res = await api.checkRecord(data)
				if(res.code==200){
					this.recordData = res.data
				}
			},
			//导航栏切换
			changeNav(index){
				if(this.currtab==index){
					return
				}
				this.currtab = index;
				this.getTransRecord();
			}
		}
	}
</script>

<style lang="scss">
	.content {
		font-size: $font-md;
		padding-top: 1upx;
		@include box-padding(28upx);
		color: $uni-text-color;
	}

	.nav-box {
		@include rect(100%, 74upx);
		margin-top: 23upx;
		display: flex;
		margin-bottom: 5upx;

		view {
			display: flex;
		}

		.nav-item {

			flex: 1;
			font-size: 32upx;
			align-items: center;
			justify-content: center;
			@include nav-line($main-color, 57upx, 5upx);
			color: #3E3E3E;

			&.changeC {
				color: $main-color;

				&::after {
					transform: scaleX(1);
				}
			}
		}
	}
	.record-item{
		@include rect(698upx,234upx);
		background-color: $bg-white;
		@include box-padding(35upx);
		border-radius: $radius-md;
		margin-bottom: 20upx;
		.item-head{
			@include rect(100%,99upx);
			@extend %flex-alcent;
			justify-content: space-between;
			border-bottom: 1upx rgba(0,0,0,0.14) solid;
				
			text:last-child{
				color: #AAAAAA;
			}
		}
		.item-bot{
			padding-top: 20upx;
			line-height: 47upx;
			color: #999999;
		}
	}
	.no_record{
		width: 100%;
		.no-record-pic{
			@include rect(400upx,384upx);
			margin: 200upx auto 50upx auto;
			image{
				@include rect(100%,100%);
			}
		}
		.no-record-juide{
			color: #343434;
			opacity: 0.5;
			text-align: center;
			
		}
	}
</style>
