const app = getApp();
const Timestamp = Date.parse(new Date()) / 1000;
const GetTypes = "Post";   //请求类型 post
const From = "XCX";  //访问的来源
const Ver = 1;
const Token = "";
const APPID = app.globalData.appid;  //品牌appid 凭证
const MachineSN = '';
import md5 from 'blueimp-md5'

const config = {
	Timestamp:Timestamp,
	GetTypes:GetTypes,
	From:From,
	Ver:Ver,
	Token:Token,
	APPID:APPID,
	MachineSN:MachineSN,
	UID: wxuuid()
}

function wxuuid() {
	/*生成UUID */
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid
}


function getSign(InterFaces, MachineSN, Message, Timestamp, Token, UID) {
	let that = this;
	let strsign = app.globalData.appid + From + GetTypes + InterFaces + MachineSN + Message + Timestamp + Token +
		UID + Ver
	let sign = md5(encodeURIComponent(strsign).toUpperCase() + app.globalData.signKeys);
	return sign;
}



module.exports = {
	wxuuid: wxuuid,
	getSign: getSign,
	config:config,
}
