<template>
	<view class="content">
		<view class="invitation-tips">
			<view class="top-pic">
				<image src="../../static/active/active_head.png"></image>
			</view>
			<view class="tips-cont">
				<view class="cont-head">
					<view class="cont-item">
						<image src="../../static/active/invitation_coupons.png"></image>
						<text>获得优惠卷</text>
						<text>100张</text>
					</view>
					<view class="cont-item">
						<image src="../../static/active/invita_money.png"></image>
						<text>实际收益</text>
						<text>200.00元</text>
					</view>
					<view class="cont-item">
						<image src="../../static/active/invita_fir.png"></image>
						<text>累计邀请</text>
						<text>32位</text>
					</view>
				</view>
			</view>
			<button class="invitation-btn">立即邀请</button>
		</view>
		<view class="invitation-tips invita-list">
			<view class="invita-list-tit">
				邀请记录
			</view>
			<scroll-view class="list-box" scroll-y>
				<view class="firends-item">
					<view class="user-pic">
						<image></image>
						<text>张嘻嘻</text>
					</view>
					<text class="span">3天前</text>
				</view>
			</scroll-view>
		</view>
		<view class="invitation-tips invita-list">
			<view class="invita-list-tit">
				活动规则
			</view>
			<view class="rules-desc">
				<text>
					请您务必审慎阅读、充分理解本协议、预付卡章程及隐私权政策各条款内容,特别是免除或限制责任的相应条款,并选择接受或不接受。免除或限制责任条款可能以加粗形式提示您注意。除非您已阅读井接受本协议及预付卡章程所有条款,否则您将无法使用会员服务。您成功注册成为会员,即视为您已阅读并同意受本协议、预付卡章程、隐私权政策的约束。
					请您务必审慎阅读、充分理解本协议、预付卡章程及隐私权政策各条款内容,特别是免除或限制责任的相应条款,并选择接受或不接受。免除或限制责任条款可能以加粗形式提示您注意。除非您已阅读井接受本协议及预付卡章程所有条款,否则您将无法使用会员服务。您成功注册成为会员,即视为您已阅读并同意受本协议、预付卡章程、隐私权政策的约束。
					请您务必审慎阅读、充分理解本协议、预付卡章程及隐私权政策各条款内容,特别是免除或限制责任的相应条款,并选择接受或不接受。免除或限制责任条款可能以加粗形式提示您注意。除非您已阅读井接受本协议及预付卡章程所有条款,否则您将无法使用会员服务。您成功注册成为会员,即视为您已阅读并同意受本协议、预付卡章程、隐私权政策的约束。
					请您务必审慎阅读、充分理解本协议、预付卡章程及隐私权政策各条款内容,特别是免除或限制责任的相应条款,并选择接受或不接受。免除或限制责任条款可能以加粗形式提示您注意。除非您已阅读井接受本协议及预付卡章程所有条款,否则您将无法使用会员服务。您成功注册成为会员,即视为您已阅读并同意受本协议、预付卡章程、隐私权政策的约束。
				</text>
			</view>
		</view>
		<view class="blank"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page {
		background-color: $main-color;
	}

	.content {
		color: $uni-text-color;
		width: $screen-width;
		@extend %flex-column;
		justify-content: cneter;
		padding-top: 1upx;
	}

	.invitation-tips {
		margin-top: 340upx;
		width: 694upx;
		border-radius: 28upx;
		background-color: #FFFFFF;
		box-shadow: 0upx 9upx 18upx 0upx rgba(19, 19, 20, 0.2);
		position: relative;
		padding-top: 1upx;

		.top-pic {
			@include rect(400upx, 340upx);
			position: absolute;
			top: -264upx;
			left: 147upx;

			image {
				@include rect(400upx, 340upx);
			}
		}

		.tips-cont {
			width: 575upx;
			margin-top: 157upx;
			margin-left: 60upx;

			.cont-head {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.cont-item {
					@extend %flex-column;
					justify-content: cneter;

					image {
						@include rect(70upx, 70upx)
					}

					&:nth-of-type(2) {
						image {
							@include rect(70upx, 70upx)
						}
					}

					&:last-child {
						image {
							@include rect(104upx, 70upx)
						}
					}

					text {
						font-size: $font-md;
						line-height: 40upx;
						margin-top: 30upx;
					}

					text:last-child {
						color: #FF6031;
						margin: 0;
					}
				}
			}
		}

		.invitation-btn {
			@extend %clear-button;
			@include rect(575upx, 88upx);
			border-radius: 44upx;
			margin: 45upx auto 60upx auto;
			background-color: $main-color;
			@include text-allcenter(88upx);
			color: $text-white;
			font-size: 32upx;
		}

	}

	.invita-list {
		margin-top: 34upx;
	}

	.invita-list-tit {
		margin-top: 52upx;
		font-size: 32upx;
		text-align: center;
	}

	.list-box {
		width: 100%;
		@include box-padding(50upx);
		max-height: 600upx;
		margin-top: 65upx;

		.firends-item {
			width: 100%;
			@extend %flex-alcent;
			justify-content: space-between;
			font-size: $font-md;
			margin-bottom: 36upx;

			.user-pic {
				height: 75upx;
				@extend %flex-alcent;

				image {
					border: 1upx $main-color solid;
					border-radius: 50%;
					@include rect(75upx, 75upx);
					margin-right: 32upx;
				}
			}

			.span {
				color: rgba(50, 50, 50, .5)
			}
		}
	}

	.rules-desc {
		margin: 35upx auto;
		width: 100%;
		@include box-padding(34upx);
		font-size: 25upx;
		color: rgba(138, 138, 138, 1);
	}
	.blank{
		height: 150upx;
	}
</style>
