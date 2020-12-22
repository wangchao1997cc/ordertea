<template>
	<view>

	</view>
</template>

<script>
	import {formatDate} from '../../utils/utils.js';
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			let appointmentTime = [{
				"date": "2020-12-21",
				"times": [
					"17:30~21:15",
				]
			},{
				"date": "2020-12-22",
				"times": [
					"8:30~12:00",
					"13:00~21:15",
				]
			},];
			appointmentTime.forEach(item => {
				item.times.forEach(aitem => {
					let timearr = aitem.split('~');
					timearr = this.handerTime(item.date,timearr[0], timearr[1]);
					if(item.timearr){
						item.timearr.push(...timearr)
					}else{
						item.timearr = timearr;
					}
				})
			})
		},
		methods: {
			handerTime(date, startTime, endTime) {    //时间切段   15分钟为一个时间段
				let timerarr = [];
				timerarr.push(startTime);
				startTime = new Date(new Date(date + ' ' + startTime));
				startTime = Date.parse(startTime);   //转为时间戳
				endTime = new Date(new Date(date + ' ' + endTime));
				endTime = Date.parse(endTime);  //转为时间戳
				let totalnum = Math.floor((endTime - startTime) / 1000 / 60 / 15)
				for (let i = 0; i < totalnum; i++) {
					startTime+=(15*60000);
					timerarr.push(new Date(startTime).format("hh:mm"))
				}
				return timerarr;
			}
		}
	}
</script>

<style>

</style>
