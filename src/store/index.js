import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		storeInfo: {}, // 店铺请求的id信息
		shopInfo:'',  // 店铺详细信息
		orderListData:[] ,// 购物车列表信息
		orderList:[], // 订单信息
		baseUserInfo: '', // 存储获取的用户微信的信息（用户名、头像）
		lodding: false,
	},
	mutations: {
		setStoreInfo(state, provider){
			state.storeInfo = provider;
		},
		setShopInfo(state, provider){
			state.shopInfo = provider;
		},
		initOrderList(state, provider){ // 订单信息
			state.orderList = provider;
		},
		initdishListMut(state, provider){ // 购物车信息
			state.orderListData = provider;
		},
		setBaseUserInfo(state, provider){
			state.baseUserInfo = JSON.parse(provider);
		},
		setLodding(state, provider){
			state.lodding = provider;
		},
	},
	actions: {
		
	}
})

export default store
