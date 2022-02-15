    import navBar from '../common/Navbar/navbar.vue'
	import { openTable, getTableState, getList,payOrder,clearOrder, getDishList, addDish, delDish, getTableOrderDishList } from '../api/api.js'
	import initWebScoket from '../../utils/webscoket'
	import {mapState, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				orderDishPrice: 0,
				openPayType: false,
			}
		},
		computed:{
			tableInfo:function(){
				console.log(this.shopInfo())
				return this.shopInfo()
			},
			orderListDataes:function() {
				return this.orderList()
			}
		},
		components: { navBar },
		onLoad() {
			this.init()
		},
		methods: {
			...mapState(['shopInfo', 'orderList']),
			init(){
				this.computOrderInfo()
			},
			// 订单里和总订单价格计算
			computOrderInfo(){
				let oriData = this.orderListDataes
				this.orderDishPrice = oriData.reduce((pro, item) => (item.reducePrice * item.dishNum || item.price) + pro, 0)
			},
			// 返回上一级
			goback(){
				// uni.navigateBack()
				uni.navigateTo({url: '/pages/index/index'})
			},
			// 
			closeMask(){
				this.openPayType = false
			},
		}
	}