const getters = {
    openidinfo: state => state.user.openidinfo,
	configure: state => state.user.configure,
	memberinfo: state => state.user.memberinfo,
	businessType: state => state.control.businessType,
}
export default getters;