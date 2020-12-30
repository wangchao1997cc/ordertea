<template>
	<view class="content">
		<view class="header_info">
			<!-- <navbar :config="config"></navbar> -->
			<view class="member-code">
				<image src="../../static/member_icon.png"></image>
				会员码
			</view>
			
		</view>
		<view class="member-card">
			<view class="member-head">
				<view class="user-pic">
					<view class="user-label">
						<image src="../../static/grade_pic.png"></image>
						最强王者
					</view>
				</view>
				<view class="user-detail">
					<view class="user-name">
						张嘻嘻
					</view>
					<view class="card-no">
						卡号：12342342353453456
					</view>
					<view class="slider-box">
						<view class="slider">
							<sildermine :config="sliderConfig"></sildermine>
						</view>
						<text class="fl">1001/3001</text>
					</view>
					<view class="upgrade_juide">
						在累计2000经验值就可以升级
					</view>
				</view>
			</view>
			<view class="user-assets">
				<view class="assets-item">
					<text>10000</text>
					<text>商城</text>
				</view>
				<view class="assets-item">
					<text>10000</text>
					<text>优惠卷</text>
				</view>
				<view class="assets-item">
					<text>10000</text>
					<text>钱包</text>
				</view>
			</view>
		</view>
		<view class="min-service-box">
			<view class="head-tit">
				我的服务
			</view>
			<view class="service-box">
				<view class="service-item" v-for="(item,index) in servicearr" :key="index">
					<image :src="item.img"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import navbar from '../../components/nav.vue'
	import sildermine from '../../components/minesilder.vue'
	export default {
		data() {
			return {
				sliderConfig: {
					progresswidth: '320upx',
					progressbar: '50%',
				},
				servicearr:[{
					img:'../../static/my/pay-record.png',
					text:'消费记录'
				},{
					img:'../../static/address_icon.png',
					text:'地址管理'
				},{
					img:'../../static/my/pay-record.png',
					text:'个人资料'
				},{
					img:'../../static/my/blance_icon.png',
					text:'余额充值'
				},{
					img:'../../static/my/shop_icon.png',
					text:'积分商城'
				},{
					img:'../../static/my/active_icon.png',
					text:'裂变活动'
				},{
					img:'../../static/my/lv_icon.png',
					text:'会员等级'
				},{
					img:'../../static/my/about_icon.png',
					text:'关于我们'
				},]
			}
		},
		onLoad() {},
		components: {
			// navbar,
			sildermine
		},
		methods: {}
	}
</script>

<style lang="scss">
	.content {
		font-size: $font-md;
		width: $screen-width;
	}

	.header_info {
		@include rect(750upx, 542upx);
		border: 1upx $main-color solid;
		position: relative;
		background-color: $main-color;
		.member-code{
			position: absolute;
			@include rect(145upx,55upx);
			bottom: 123upx;
			right: 23upx;
			background-color: $bg-white;
			border-radius: 55upx;
			@extend %flex-alcent;
			justify-content: center;
			font-size: 20upx;
			color: $main-color;
			image{
				@include rect(25upx,25upx);
				margin-right: 12upx;
			}
		}
		
	}
	.member-card{
		position: relative;
		@include rect(698upx,328upx);
		background-color: $bg-white;
		border-radius: $radius-md;
		margin: -105upx auto 0 auto;
		z-index: 10;
		@include box-padding(28upx);
		.member-head{
			@include rect(100%,180upx);
			display: flex;
			padding-left:20upx;
			box-sizing: border-box;
			.user-pic{
				position: relative;
				z-index: 20;
				@include rect(160upx,160upx);
				border-radius: 80upx;
				border:1upx $color-red solid;
				margin-top: -40upx;
				.user-label{
					position: absolute;
					@include rect(155upx,40upx);
					bottom: -17upx;
					left: 2.5upx;
					border: 2upx $main-color solid;
					box-sizing: border-box;
					@extend %flex-alcent;
					justify-content: center;
					background-color: $bg-white;
					border-radius: 20upx;
					color: #F5C164;
					font-size: 20upx;
					line-height: 40upx;
					image{
						@include rect(27upx,18upx);
						margin-right: 8upx;
					}
				}
			}
			
			.user-detail{
				margin-left: 23upx;
				.user-name{
					font-size: 32upx;
					color: #28282A;
					font-weight: 700;
					margin-top: 20upx;
				}
				.card-no{
					font-size: 22upx;
					color: #A3A3A3;
					margin-top: 5upx;
				}
				.slider-box{
					width: 430upx;
					font-size: 20upx;
					color: $main-color;
					position: relative;
					.slider{
						width: 320upx;
					}
					.fl{
						position: absolute;
						right: 0upx;
						top: 2upx;
					}
				}
				.upgrade_juide{
					color: #A3A3A3;
					font-size: 20upx;
					font-size: 20upx;
				}
			}
		}
		.user-assets{
			@include rect(100%,114upx);
			display: flex;
			margin-top: 10upx;
			.assets-item{
				flex:1;
				@extend %flex-column;
				justify-content: center;
				font-size: 32upx;
				font-weight: 700;
				text:last-child{
					font-size: 24upx;
					color: #A3A3A3;
					margin-top: 15upx;
				}
				
			}
		}
	}
	.min-service-box{
		
		@include rect(698upx,400upx);
		background-color: $bg-white;
		margin: 25upx auto;
		border-radius: $radius-md;
		@include box-padding(40upx);
		padding-top: 1upx;
		.head-tit{
			font-size: 32upx;
			margin-top: 30upx;
		}
		.service-box{
			width: 100%;
			@extend %flex-list;
			margin-top: 40upx;
			.service-item{
				width: 25%;
				@extend %flex-column;
				margin-bottom: 56upx;
				text{
					font-size: 24upx;
					color: #A3A3A3;
					margin-top: 12upx;
				}
				image{
					@include rect(37upx,48upx);
				}
				&:nth-of-type(2){
					image{
						@include rect(35upx,48upx);
					}
				}
				&:nth-of-type(3){
					image{
						@include rect(45upx,48upx);
					}
				}
				&:nth-of-type(4){
					box-sizing: border-box;
					image{
						@include rect(48upx,48upx);
					}
				}
				&:nth-of-type(n+5){
					image{
						@include rect(40upx,40upx);
					}
				}
			}
			
		}
	}
</style>
