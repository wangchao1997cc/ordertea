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
					"17:30~21:15"
				]
			},{
				"date": "2020-12-22",
				"times": [
					"8:30~21:15"
				]
			},];
			appointmentTime.forEach(item => {
				
				// let timerarr = item.times[0].split('~');
			})
			
			this.handerTime(appointmentTime[0].date, timerarr[0], timerarr[1]);
		},
		methods: {
			handerTime(date, startTime, endTime) {    //时间切片
				let timerarr = [];
				timerarr.push(startTime);
				startTime = new Date(new Date(date + ' ' + startTime));
				startTime = Date.parse(startTime);
				endTime = new Date(new Date(date + ' ' + endTime));
				endTime = Date.parse(endTime);
				let totalnum = Math.floor((endTime - startTime) / 1000 / 60 / 15)
				for (let i = 0; i < totalnum; i++) {
					startTime+=(15*60000);
					timerarr.push(new Date(startTime).format("hh:mm"))
				}
				console.log(timerarr);
			}
		}
	}
</script>

<style>

</style>
