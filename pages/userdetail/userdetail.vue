<template>
	<view class="content">
		<view class="update_userinfo">
			<view class="userinfo-item">
				<text>昵称</text>
				<input class="user-r" v-model="userinfo.name"></input>
			</view>
			<view class="userinfo-item">
				<text>手机号</text>
				<view class="user-r" v-if="userinfo.mobile" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">
					{{userinfo.mobile}}
				</view>
				<button class="phone-btn" v-else>获取手机号</button>
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
	const app = getApp();
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import api from '../../WXapi/api.js';
	import { mapGetters } from 'vuex';
	import { getMemberInfo, userRegister } from '../../utils/publicApi.js';
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
		computed:{
			...mapGetters(['memberinfo', 'openidinfo']),
		},
		mounted() {
			this.member = app.globalData.member;
		},
		onLoad() {
			let memberinfo = this.memberinfo;
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
				let that = this;
				if (!that.userinfo.birthday) {
					that.showPicker = true;
				} else {
					that.$msg.showToast('生日只能修改一次哦～')
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
				let that = this;
				let userinfo = that.userinfo;
				if(!userinfo.name){
					return that.$msg.showToast('请填写用户名');
				}
				let data = {
					name: userinfo.name,
					sex: that.value,
					cardId: userinfo.id,
				}
				
				if (!userinfo.birthday && that.birthday) {
					that.$msg.showModal(json => {
						if (json == 1) {
							that.userInfoApi(data);
						}
					}, '生日只能修改一次哦～')
					data.birthday = that.birthday
				} else if(!userinfo.birthday && !that.birthday){
					return this.$msg.showToast('请先选择您的生日哦～')
				}
				that.userInfoApi(data);
			},
			async userInfoApi(data) {
				let that = this,
				    res = await api.updateMember(data, true);
				if (res.code == 200) {
					that.$msg.showToast('保存成功');
					setTimeout(() => {
						uni.navigateBack({})
					},200)
					await getMemberInfo(that.memberinfo.mobile); //vka 会员用户信息
				}else{
					that.$msg.showToast(res.message);
				}
			},
			async decryptPhoneNumber(res) {
				let that = this;
				if (res.detail.errMsg == 'getPhoneNumber:ok') {
					let data = {
						encryptedData: res.detail.encryptedData,
						iv: res.detail.iv,
						SessionKey: that.openidinfo.session_key
					};
					try {
						let result = await api.decryptPhoneNumber(data, true); //获取手机号
						let phone = result.Message.phoneNumber;
						// let params = {
						// 	HQCode: config.hqcode,
						// 	WXOpenID: that.openidinfo.openid,
						// 	Mobile: phone,
						// 	interFaces: 'MemberInfoRegister'
						// };
						// let plusInfo =  await api.getUserInfo(params); //plus 注册会员
						// that.SET_PLUSINFO(plusInfo.Message);  //存储会员code
						if (that.member) {
							let userdata = {
								mobile: phone,
								openId: that.openidinfo.openid
							};
							await userRegister(userdata);  //vka 注册会员
							that.$emit('loginSuccess',true);
						}
					} catch (err) {
					}
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
		
		.phone-btn {
			margin: auto 0;
			height: 60upx;
			line-height: 60upx;
			font-size: 28upx;
			border: 1upx solid #A8D732;
			background-color: #fff;
			color: #A8D732;
			padding: 0 20upx;
		}

		.picker {
			color: #A3A3A3;
		}
	}
</style>
