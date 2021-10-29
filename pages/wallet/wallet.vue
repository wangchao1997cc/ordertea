<template>
	<!-- 钱包页面 -->
	<view class="content">
		<view class="wallet-head">
			<view class="head_tit">当前余额</view>
			<view class="balance-box">
				<text>{{ memberinfo.balance ? memberinfo.balance : 0 }}</text>
				<view class="record-btn" @click="jumpRecord">充值记录</view>
			</view>
		</view>
		<mswiper :imgList="imgList" @changeData="changeData"></mswiper>
		<view class="choseStore" :class="{chose_stored:ischoseStore}" @click="openChoseStore"  >
			<text>{{choseStore.name || '选择门店'}}</text>
			<view class="triangle">
			</view>
			<scroll-view class="store-box" scroll-y @tap.stop.preven>
				<view class="store-item" v-for="(item,index) in storeList" :key="index" @click="choseBrandStore(item)">
					{{item.name}}
					<image src="../../static/my/right.png"></image>
				</view>
			</scroll-view>
		</view>
		<view class="recharge-desc">
			充值说明
			<text>
				\n内含{{ currtabData.amount || 0 }}元储值金、{{ currtabData.ticketNames || ''
				}}{{ currtabData.give ? ',赠送' + currtabData.give + '元' : ''
				}}{{ currtabData.give ? ',额外赠送' : '' }}
				<text v-if="currtabData.give">{{ currtabData.give }}元、</text>
				{{ currtabData.point ? currtabData.point + '积分' : '' }}
			</text>
			<text class="span">\n*以下等级可以充值：{{ currtabData.lvarr }}</text>
		</view>
		<view class="pay-btn" @click="begainRecharge">立即充值</view>
	</view>
</template>

<script>
import api from '../../WXapi/api.js';
import mswiper from '../../components/m-swiper/m-swiper.vue';
import { getMemberInfo, wxPayment, getRecharge } from '../../utils/publicApi.js';
const app = getApp();
export default {
	data() {
		return {
			memberinfo: {}, //会员信息
			currtabData: {}, //当前选中的充值卡数据
			imgList: ['', ''] ,//充值卡套餐数据
			storeList:[],
			ischoseStore: false,   //选择充值门店
			choseStore:{	},  //选择的门店信息
			// lvarr:''
		};
	},
	components: {
		mswiper
	},
	onLoad() {
		this.init();
	},
	methods: {
		init() {
			this.getMemberInfo();  //获取会员信息
			this.getPackage();   //获取充值套餐
		},
		//swiper  切换数据
		changeData(val) {
			this.currtabData = val;
		},
		//获取会员信息
		getMemberInfo() {
			let memberinfo = uni.getStorageSync('memberinfo');
			this.memberinfo = memberinfo;
		},
		//打开选择门店
		openChoseStore(){
			this.getStore();
			
		},
		//获取门店列表；
		async getStore(){
			let res =  await api.getStores({
				storeId: app.globalData.brandId
			},true);
			if(res.code == 200){
				this.storeList = res.data;
				this.ischoseStore = !this.ischoseStore;
			}
		},
		async getPackage() {
			let res = await getRecharge();
			if (res && res.length) {
				res.forEach(item => {
					let lvarr = '';
					if (item.needLevel) {
						item.needLevel.forEach((aitem, index) => {
							if (index == 0) {
								lvarr += aitem.levelName;
							} else {
								lvarr += '，' + aitem.levelName;
							}
						});
					} else {
						lvarr = '不限制等级哦！';
					}
					item.lvarr = lvarr;
				});

				this.currtabData = res[0];
				this.imgList = res;
			}
		},
		//选择门店 id
		choseBrandStore(store){
			this.choseStore = store;
			this.ischoseStore = false;
		},
		//点击充值
		 // currtabData.title
		async begainRecharge() {
			let that = this;
			let currtabData = that.currtabData;
			let data = {
				cardId: that.memberinfo.id,
				amount: currtabData.amount * 100,
				body:currtabData.title,
				curUrl: 'pages/wallet/wallet',
				amountConfigId: currtabData.id,
				openId: that.$store.state.openid,
				storeId: that.choseStore.id || app.globalData.brandId,
			};
			console.log(111,data)
			let res = await api.rechargeApi(data);
			if (res.code == 200) {
				res.payData.package = res.payData.prepay_id;
				wxPayment(res.payData)
					.then(async res => {
						this.$msg.showToast('充值成功');
						this.memberinfo = await getMemberInfo(true);
					})
					.catch(ret => {
						console.log(ret);
					});
			} else {
				this.$msg.showToast(res.message);
			}
		},
		//跳转充值记录
		jumpRecord() {
			uni.navigateTo({
				url: '../transrecord/transrecord?type=1'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.content {
	font-size: $font-md;
	color: $uni-text-color;
}
.wallet-head {
	@include rect(100%, 213upx);
	@include box-padding(32upx);
	padding-top: 1upx;
	.head_tit {
		margin-top: 50upx;
		font-size: 31upx;
	}

	.balance-box {
		margin-top: 30upx;
		height: 60upx;
		@extend %flex-alcent;
		justify-content: space-between;
		text {
			font-size: 56upx;
			line-height: 60upx;
			color: black;
		}
		.record-btn {
			@include rect(150upx, 50upx);
			background-color: $main-color;
			font-size: 27upx;
			color: $text-white;
			@include text-allcenter(50upx);
			border-radius: 25upx;
		}
	}
}

.recharge-desc {
	font-size: 32upx;
	width: 100%;
	margin-top: 30upx;
	line-height: 50upx;
	@include box-padding(32upx);
	text {
		font-size: 28upx;
	}
	.span {
		color: $main-color;
	}
}
.pay-btn {
	@include rect(698upx, 88upx);
	@include text-allcenter(88upx);
	color: $text-white;
	background-color: $main-color;
	position: fixed;
	bottom: 5.3%;
	left: 26upx;
	border-radius: 44upx;
}
.choseStore {
	@include rect(686upx, 88upx);
	border: 1px solid #aad548;
	@extend %flex-alcent;
	justify-content: space-between;
	margin: 60upx auto;
	border-radius: 12upx;
	@include box-padding(24upx);
	position: relative;
	// overflow: hidden;
	
	.triangle {
		width: 0;
		height: 0;
		border-width: 12upx 12upx 0upx;
		border-style: solid;
		border-color: $main-color transparent transparent;
		
		
	}
	.store-box{
		position: absolute;
		width: 100%;
		height: 0upx;
		// @include rect(100%,400upx);
		transition: all .3s;
		z-index: 99;
		// border: 1upx red solid;
		background-color: $bg-white;
		top: 104upx;
		left: 0upx;
		
		padding-bottom: 40upx;
		box-sizing: border-box;
		
		.store-item{
			@include rect(100%,80upx);
			line-height: 80upx;
			border-bottom: 1upx #F1F2F2 solid;
			@include box-padding(32upx);
			@extend %flex-alcent;
			justify-content: space-between;
			
			&:last-child{
				border-bottom: none;
			}
			image{
				@include rect(11upx,18upx);
			}
		}
	}
}
.chose_stored{
	overflow: visible;
	.triangle{
		transform: rotate(180deg);
	}
	.store-box{
		box-shadow: 5upx 4upx 6upx 1upx rgba(0, 0, 0, 0.1);
		// transition: all .3s;
		height: 400upx;
	}
}
</style>
