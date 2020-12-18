<template>
	<view class="content">
		<view class="list">
			<view class="row-box" v-for="(item,index) in addressList" :key="index" @tap="select(item)">
				<view class="name-tel">
					<view>{{item.receiverAddress}}</view>
					<view @click.stop="prentEvent">
						<image @click="addressEdit(item)" src="../../static/06_icon_编辑.png"></image>
					</view>
				</view>
				<view class="address-desc">
					<text>{{`${item.receiverName} ${item.receiverPhone}`}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.content{
		width: $screen-width;
		
	}
</style>
