<template>
	<view class="content">
		<view class="update_userinfo">
			<view class="userinfo-item">
				<text>昵称</text>
				<input class="user-r" v-model="userinfo.name"></input>
			</view>
			<view class="userinfo-item">
				<text>手机号</text>
				<view class="user-r">
					{{userinfo.mobile}}
				</view>
			</view>
			<view class="userinfo-item">
				<text>性别</text>
				<picker :range="columns" @change="chooseSex" :value="value">
					<view class="picker">
						{{columns[value]?columns[value]:'请选择性别'}}
					</view>
				</picker>
			</view>
			<view class="userinfo-item" @click="chooseData">
				<text>生日</text>
				<view class="user-r">
					{{birthday?birthday:'点击选择'}}
				</view>
			</view>
		</view>
		<mx-date-picker :show="showPicker" :type="type" :value="valuedate" :show-tips="true" :show-seconds="true" @confirm="onSelected"
		 @cancel="onSelected" />
		<view class="save_btn" @click="saveUserInfo">
			保存
		</view>
	</view>

</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import api from '../../WXapi/api.js';
	export default {
		data() {
			return {
				userinfo: {},
				columns: ['先生', '女士'],
				value: null,
				birthday: '',
				showPicker: false,
				type: ['1970/01/01', '2020/01/01'],
				valuedate: '2000/01/01',
			}
		},
		onLoad() {
			let memberinfo = uni.getStorageSync('memberinfo');
			this.userinfo = memberinfo;
			this.value = memberinfo.sex;
			this.birthday = memberinfo.birthday;
		},
		components: {
			MxDatePicker
		},
		methods: {
			//选择性别
			chooseSex(e) {
				this.value = e.detail.value;
			},
			//打开日期选择组件
			chooseData() {
				if (!this.userinfo.birthday) {
					this.showPicker = true;
				} else {
					this.$msg.showToast('生日只能修改一次哦～')
				}
			},
			//日期组件 确定或者取消
			onSelected(val) {
				if (val) {
					this.birthday = val.value;
				}
				this.showPicker = false;
			},
			//保存用户信息
			saveUserInfo() {
				let userinfo = this.userinfo;
				let data = {
					name: userinfo.name,
					sex: this.value,
					cardId: userinfo.id,
				}
				if (!userinfo.birthday && this.birthday) {
					this.$msg.showModal(json => {
						if (json == 1) {
							this.userInfoApi(data);
						}
					}, '生日只能修改一次哦～')
					data.birthday = this.birthday
				} else {
					this.userInfoApi(data);
				}
			},
			async userInfoApi(data) {
				let res = await api.updateMember(data, true);
				console.log(res)
				if (res.code == 200) {
					this.$msg.showToast('保存成功');
					setTimeout(() => {
						uni.navigateBack({})
					},200)
				}else{
					this.$msg.showToast(res.message);
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		font-size: 31upx;
		padding-top: 1upx;
	}

	.save_btn {
		@include rect(698upx, 98upx);
		border-radius: 49upx;
		position: fixed;
		bottom: 5.5%;
		left: 26upx;
		background-color: $main-color;
		@include text-allcenter(98upx);
		color: $text-white;
	}

	.update_userinfo {
		margin: 34upx auto;
		width: 698upx;
		background-color: $bg-white;
		@include box-padding(40upx);
		border-radius: $radius-md;
	}

	.userinfo-item {
		@include rect(100%, 108upx);
		border-bottom: 1upx rgba(0, 0, 0, 0.14) solid;
		@extend %flex-alcent;
		justify-content: space-between;

		input {
			text-align: right;
		}

		text {
			color: #000000;
		}

		&:last-child {
			border: none
		}

		.user-r {
			color: #A3A3A3;

		}

		.picker {
			color: #A3A3A3;
		}
	}
</style>
