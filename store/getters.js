const getters = {
	openidinfo: state => state.user.openidinfo,
	configure: state => state.user.configure,
	memberinfo: state => state.user.memberinfo,
	plusinfo : state => state.user.plusinfo,
	goods : state => state.user.goods,
	
	businessType: state => state.control.businessType,
	storeId: state => state.control.storeId,
	paymentMode: state => state.control.paymentMode,
}
export default getters;