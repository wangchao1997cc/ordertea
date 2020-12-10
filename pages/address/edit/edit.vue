<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="useraddress.receiverName" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="useraddress.receiverPhone" />
				</view>
			</view>
			<view class="row" @click="jumpMap">
				<view class="nominal">
					选择地址
				</view>
				<view class="input">
					{{useraddress.receiverAddress?useraddress.receiverAddress:'请选择地址'}}
				</view>
				<!-- <adpicker :editaddress="editaddress" @entryAre="entryAre"></adpicker> -->
			</view>
			<view class="row">
				<view class="nominal">
					性别
				</view>
				<picker :range="columns" @change="chooseSex" :value="value">
					<view class="picker">
						{{columns[value]?columns[value]:'请选择性别'}}
					</view>
				</picker>
			</view>
			<view class="row">
				<view class="nominal">
					门牌号
				</view>
				<view class="input">
					<textarea v-model="useraddress.appendReceiverAddress" auto-height="true" placeholder="例: B304"></textarea>
				</view>
			</view>
			<!-- <view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#FF4E51" :checked="useraddress.defaultAddress" @change="defaultAddressChange" />
				</view>
			</view> -->
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
	</view>
</template>

<script>
	// import adpicker from '../../../components/addressPicker.vue';
	import api from '../../../WXapi/api.js';
	import {
		getCityId
	} from '../../../utils/publicApi.js'
	import {
		getCityAddress
	} from '../../../utils/author.js'
	export default {
		data() {
			return {
				value: null,
				columns: ['先生', '女士'],
				editaddress: '',
				useraddress: {
					sex:0,
				},
				editType: false,
			};
		},
		// components: {
		// 	adpicker,
		// },
		onLoad(e) {
			let that = this;
			//获取传递过来的参数
			if (e.type) {
				that.editType = true;
				uni.getStorage({
					key: 'address',
					success(e) {
						e.data.addressId = e.data.aid;
						that.useraddress = e.data;
						// that.editaddress = `${e.data.provinceName}-${e.data.cityName}-${e.data.countyName}`;
						uni.removeStorageSync('address'); //清除本地缓存
					},
				})
			}
		},
		methods: {
			//选择性别
			chooseSex(e) {
				this.value = e.detail.value;
				this.useraddress.sex = e.detail.value + 1;
			},
			//跳转选择地址页面
			jumpMap() {
				let that = this;
				let useraddress = that.useraddress;
				uni.chooseLocation({
					latitude: useraddress.latitude ? useraddress.latitude : undefined,
					longitude: useraddress.longitude ? useraddress.longitude : undefined,
					async complete(res) {
						let addressInfo = await getCityAddress(res.latitude, res.longitude); //获取城市名
						let cityId = await getCityId(addressInfo.address_component.city,true); // 获取城市id
						that.useraddress.cityId = cityId;
						that.useraddress.latitude = res.latitude;
						that.useraddress.longitude = res.longitude;
						that.$set(that.useraddress,'receiverAddress',res.name);   //vue更新视图
					}
				})
			},
			//选择器确定
			// entryAre(val) {
			// 	let that = this;
			// 	that.useraddress = Object.assign(that.useraddress, val)
			// },
			//选择默认地址
			// defaultAddressChange(e) {
			// 	this.useraddress.defaultAddress = e.detail.value;
			// },
			//正则验证手机号码
			checkMobile(data) {
				let checkphone = /^1[3-9]\d{9}$/;
				return checkphone.test(data);
			},
			async save() {
				let that = this;
				let useraddress = that.useraddress;
				if (!useraddress.receiverName) {
					return that.$msg.showToast('请输入收件人姓名');
				}
				if (!useraddress.receiverPhone) {
					return that.$msg.showToast('请输入收件人电话号码');
				}
				if (!useraddress.appendReceiverAddress) {
					return that.$msg.showToast('请输入门牌号');
				}
				if (!useraddress.receiverAddress) {
					return that.$msg.showToast('请选择收件地址');
				}
				if (!that.checkMobile(useraddress.receiverPhone)) {
					return that.$msg.showToast('请正确填写手机号码');
				}
				let res = null
				if(that.editType){
					res = await api.updateAddress(useraddress,true);
				}else{
					res = await api.addUserAddress(useraddress, true);
				}
				if (res.status == 1) {
					if (that.editType) {
						that.$msg.showToast('修改地址成功')
					} else {
						that.$msg.showToast('添加地址成功')
					}
					setTimeout(() => {
						uni.navigateBack();
					}, 1000)
				}
			},
		},
	};
</script>
<style lang="scss">
	.save {
		view {
			display: flex;
		}

		margin-top: 100upx;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx #FF5856;
			width: 80%;
			height: 80upx;
			border-radius: 6upx;
			background: linear-gradient(-90deg, rgba(255, 78, 81, 1), rgba(253, 119, 120, 1));
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		// view{
		// 	display: flex;
		// }
		font-size: 28upx;


		.row {
			width: 100%;
			@include box-padding(30upx);
			@extend %flex-alcent;
			// margin: 0 3%;
			margin-bottom: 2upx;
			background: #FFFFFF;
			border-bottom: 1upx #EBEBEB solid;

			&:last-child {
				padding: $pro-spacing;
				border: none;
			}

			.nominal {
				width: 30%;
				height: 120upx;
				line-height: 120upx;
				color: #333333;
			}

			.juide {
				color: #777777;
			}

			.input {
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				display: flex;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20upx 0;
					min-height: 120upx;
				}
			}

			picker {
				width: 70%;
			}

			.picker {
				width: 100%;
				padding: 20upx 0;
				align-items: center;
				display: flex;
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: #f06c7a;
				background-color: rgba(255, 0, 0, 0.05);
				// border-bottom: solid 1upx #eee;
			}
		}
	}
</style>
