<template>
	<!-- 钱包页面 -->
	<view class="content">
		<view class="wallet-head">
			<view class="head_tit">
				当前余额
			</view>
			<view class="balance-box">
				<text>{{memberinfo.balance?memberinfo.balance:0}}</text>
				<view class="record-btn" @click="jumpRecord">
					充值记录
				</view>
			</view>
		</view>
		<mswiper :imgList="imgList" @changeData="changeData"></mswiper>
		<view class="recharge-desc">
			充值说明
			<text>
				\n内含{{currtabData.amount}}元储值金、{{currtabData.ticketNames}},额外赠送<text :hidden="!currtabData.give">{{currtabData.give}}元、</text>{{currtabData.point?currtabData.point+'积分':''}}
			</text>
			<text class="span">\n*以下等级可以充值：{{currtabData.lvarr}}</text>
		</view>
		<view class="pay-btn" @click="begainRecharge" >
			立即充值
		</view>
	</view>
</template>

<script>
	import api from '../../WXapi/api.js'
	import mswiper from '../../components/m-swiper/m-swiper.vue'
	import {
		getMemberInfo,
		wxPayment,
		getRecharge
	} from '../../utils/publicApi.js'
	export default {
		data() {
			return {
				memberinfo:{},   //会员信息
				currtabData:{},   //当前选中的充值卡数据
				imgList:[],   //充值卡套餐数据
				// lvarr:''
			}
		},
		components:{
			mswiper
		},
		onLoad() {
			this.init();
		},
		methods: {
			init(){
				this.getMemberInfo();  //获取会员信息
				this.getPackage();   //获取充值套餐
			},
			//swiper  切换数据
			changeData(val){
				this.currtabData = val;
			},
			//获取会员信息
			getMemberInfo(){
				let memberinfo = uni.getStorageSync('memberinfo');
				this.memberinfo = memberinfo;
			},
			async getPackage(){
				let res =  await getRecharge();
				if(res && res.length){
					res.forEach(item => {
						let lvarr = '';
						if(item.needLevel){
							item.needLevel.forEach((aitem,index) => {
								if(index==0){
									lvarr+=aitem.levelName;
								}else{
									lvarr+=('，'+aitem.levelName)
								}
							})
						}else{
							lvarr = '不限制等级哦！'
						}
						item.lvarr = lvarr
					})
					
					this.currtabData = res[0];
					this.imgList = res;
				}
			},
			//点击充值
			async begainRecharge(){
				// let memberinfo = this.memberinfo;
				let currtabData = this.currtabData;
				let data = {
					cardId: this.memberinfo.id,
					amount: currtabData.amount*100,
					body: currtabData.title,
					curUrl: 'pages/wallet/wallet',
					amountConfigId: currtabData.id,
					openId: this.$store.state.openid,
				}
				let res = await api.rechargeApi(data);
				if(res.code==200){
					res.payData.package = res.payData.prepay_id;
					wxPayment(res.payData).then(async res => {
						this.$msg.showToast('充值成功');
						this.memberinfo = await getMemberInfo(true);
					}).catch(ret => {
						console.log(ret)
					})
				}else{
					this.$msg.showToast(res.message)
				}
			},
			//跳转充值记录
			jumpRecord(){
				uni.navigateTo({
					url:'../transrecord/transrecord?type=1'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content{
		font-size: $font-md;
		color: $uni-text-color;
	}
	.wallet-head{
		@include rect(100%,213upx);
		@include box-padding(30upx);
		padding-top: 1upx;
		.head_tit{
			margin-top: 50upx;
			font-size: 31upx;
			
		}
		
		.balance-box{
			margin-top: 30upx;
			height: 60upx;
			@extend %flex-alcent;
			justify-content: space-between;
			text{
				
				font-size: 56upx;
				line-height: 60upx;
				color: black;
			}
			.record-btn{
				@include rect(150upx,50upx);
				background-color: $main-color;
				font-size: 27upx;
				color: $text-white;
				@include text-allcenter(50upx);
				border-radius: 25upx;
			}
		}
	}
	
	.recharge-desc{
		font-size: 32upx;
		width: 100%;
		margin-top: 30upx;
		line-height: 50upx;
		@include box-padding(28upx);
		text{
			font-size: 28upx;
				
			
		}
		.span{
			color: $main-color;
		}
	}
	.pay-btn{
		@include rect(698upx,88upx);
		@include  text-allcenter(88upx);
		color: $text-white;
		background-color: $main-color;
		position: fixed;
		bottom:5.3%;
		left: 26upx;
		border-radius: 44upx;
	}

</style>
