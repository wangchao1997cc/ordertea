const getters = {
	openidinfo: state => state.user.openidinfo,
	configure: state => state.user.configure,
	memberinfo: state => state.user.memberinfo,
	plusinfo : state => state.user.plusinfo,
	
	businessType: state => state.control.businessType,
	storeId: state => state.control.storeId,
	paymentMode: state => state.control.paymentMode,
}
export default getters;