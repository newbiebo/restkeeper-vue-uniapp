	import navBar from '../common/Navbar/navbar.vue'
	import { openTable, getTableState, getList,payOrder, actOrderHandle, clearOrder,getMoreNorm,getDishDetail, getDishList, addDish, delDish, getTableOrderDishList } from '../api/api.js'
	// import initWebScoket from '../../utils/webscoket'
	import {mapState, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				openOrderCartList: false,
				allDishDist:[],
				typeListData: [],
				dishListData: [],
				dishListItems: [],
				dishDetailes: {},
				openDetailPop: false,
				openMoreNormPop: false,
				moreNormDataes: null,
				tableInfo:null,
				moreNormDishdata:null,
				moreNormdata:null,
				dishMealData:null,
				openTablePeoPleNumber: 1,
				orderData: 0,
				typeIndex: 0,
				openTablePop: false,
				flavorDataes: [],
				orderDishNumber: 0,
				orderDishPrice: 0,
				orderNo:'',
				params:{
					tableId: '1377921263049117698'
				      },
			}
		},
		computed:{
			orderListDataes:function() {
				return this.orderListData()
			},
			loaddingSt:function() {
				return this.lodding()
			},
			orderAndUserInfo: function() {
				let orderData = []
				// console.log(989898, this.orderListDataes)
				Array.isArray(this.orderListDataes) && this.orderListDataes.forEach((n,i) => {
					let userData = {}
					userData.nickName = n.nickName ?? ''
					userData.avatarUrl = n.avatarUrl ?? ''
					userData.dishList = [n]
					const num = orderData.findIndex(o => o.nickName == userData.nickName)
					if (num != -1){
						orderData[num].dishList.push(n)
					} else {
						orderData.push(userData)
					}
				})
				return orderData
			}
		},
		components: { navBar },
		created() {
			uni.onNetworkStatusChange(function(res) {
				if (res.isConnected == false) {
					uni.navigateTo({url: '/pages/nonet/index'})
				} 
			})
  			// this.getData()
			
			this.setStoreInfo(this.params)
			this.init()
		},
		
		methods: {
			...mapMutations(['setShopInfo','initOrderList', 'initdishListMut', 'setStoreInfo', 'setBaseUserInfo', 'setLodding']),
			...mapState(['shopInfo', 'orderListData', 'baseUserInfo', 'lodding']),
			getData(){
				let res=wx.getMenuButtonBoundingClientRect()
				let _this = this
				this.selectHeight = res.height
				uni.showModal({
					title: '温馨提示',
					content: '亲，授权微信登录后才能正点餐！',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.getUserProfile({
								desc: '登录',
								success(userInfo) {
									_this.setBaseUserInfo(userInfo.rawData)
								},
								fail:function(err){
								   console.log("获取失败: ",err)
								}
							})
						}
					}
				})
			}, 
			
			// 初始化数据
			async init(){
				// 获取用户信息 
				// 扫码进入
				let params = {}
				// 二维码链接内容会以参数q的形式带给页面，在onLoad事件中提取q参数并自行decodeURIComponent一次，即可获取原二维码的完整内容。
				// console.log(this.$router)
				// 格式一：https://canzg-wsl.itheima.net/miniprogram/?shopId=f3deb&storeId=1282344676983062530&tableId=1282346960773238786
				// q = 'https%3a%2f%2fcanzg-wsl.itheima.net%2fminiprogram%2f%3fshopId%3df3deb%26storeId%3d1282344676983062530%26tableId%3d1282346960773238786'
				// 格式二：https://canzg-wsl.itheima.net/miniprogram/f3deb/1282344676983062530/1282346960773238786
				// q = 'https%3a%2f%2fcanzg-wsl.itheima.net%2fminiprogram%2ff3deb%2f1282344676983062530%2f1282346960773238786'
				// 	if (this.$router && this.$router.params.q) {
				// 	  let q = this.$router.params.q
				// 	  q = decodeURIComponent(q)
				// 	  // 格式一
				// 	  let arr = q.split('?')[1].split('&')
				// 	  for (let i = 0; i < arr.length; i++) {
				// 		let temp = arr[i].split('=')
				// 		params[temp[0]] = temp[1]
				// 	  }
				//  //  // 格式二
				//   // let arr = q.split('/')
				//   // params['shopId'] = arr[arr.length - 3]
				//   // params['storeId'] = arr[arr.length - 2]
				//   // params['tableId'] = arr[arr.length - 1]
				// 		this.params = params
				// }
				this.getDishListDataes(this.params)
				// 获取作台初始数据
			    await getTableState(this.params).then(res => {
					if(res.datas){
						// 已经开桌了
						this.getTableOrderDishListes()
					}else{
						// 去开桌
						this.openTablePop = true
					}
					// 如果为开桌,打开开桌流程 （开启开桌弹窗） 开桌则初始化websocket结收购物车信息，首次需要手动获取订单列表
					// if(!res.data.opened){
					// 	this.openTablePop = true
					// } else {
					// 	initWebScoket(this.params)
					// 	this.getTableOrderDishListes()
					// }
				}).catch(err => {
					console.log(err)
				})
				// 获取店铺的详情
				
				
				// 获取菜品分类列表和 第一个分类下的菜品
				// await getList(this.params).then(res => {
				// 	this.typeListData = res.data
				// 	if (res.data.length > 0){
				// 		this.getDishListDataes(res.data[0])
				// 	}
				// }).catch(err => {
				// 	console.log(err)
				// })
			},
			// 开桌操作 开桌
			async openTableHandle(){
				if (this.openTablePeoPleNumber > 0) {
					openTable({tableId: this.params.tableId, personNumbers: this.openTablePeoPleNumber}).then(res => {
						this.openTablePop = false
						// initWebScoket(this.params)
						this.getTableOrderDishListes()
						// this.computOrderInfo()
					}).catch(err => {
						uni.showToast({
							title: "开桌失败请联系管理人员",
							icon: 'false',
						})
						setTimeout(it => uni.navigator.exit(), 1000)
					})
				} else {
					uni.showToast({
						title: "请选择就餐人数",
						icon: 'false',
					})
				}
			},
			// 获取菜品列表
			async getDishListDataes(params, index){
				const param = {tableId:params.tableId}
				await getDishList(param).then(res => {
					const { datas } = res
					this.tableInfo = {
						storeName:datas.storeVo.storeName,
						tableName:datas.tableVo.tableName,
						brandLogo:datas.brandVo.affixVo.pathUrl,
						orderNo: this.orderNo
					}
					console.log(888888, this.tableInfo)
					this.setShopInfo(this.tableInfo)
					// 分类列表数据
					this.typeListData = datas.categoryVos
					// 全部菜品数据
					this.allDishDist = datas.dishVos
					// 要展示的数据处理
					this.getDishListHandle(this.typeListData[0],index)
					// 购物车 订单数据
					// this.this.initdishListMut()
				}).catch(err => {
					console.log(err)
				})
			},
			// 点击分类获取该分类下的列表
			getDishListHandle(item,index){
				const categoryId = item.id || item.categoryId
				this.dishListData = this.allDishDist.filter(item => item.categoryId == categoryId)
				this.typeIndex = index
				this.setOrderNum()
			},
			// 获取购物车订单列表
			async getTableOrderDishListes(){
				await getTableOrderDishList(this.params).then(res => {
					this.orderNo = res.datas.orderNo
					this.setShopInfo({...this.shopInfo(), orderNo: this.orderNo})
					// 写入订单数据
					this.initOrderList(res.datas.orderItemVoStatisticsList)
					// 写入购物车中的数据
					this.initdishListMut(res.datas.orderItemVoTemporaryList)
					const list = res.datas.orderItemVoTemporaryList
					this.orderDishNumber = list.reduce((pro, item) => pro + item.dishNum, 0)
					this.orderDishPrice = res.datas.reducePriceTemporary
					this.setOrderNum()
				}).catch(err => {
					console.log(err)
				})
			},
			// 去订单页面
			goOrder(){
				uni.navigateTo({url: '/pages/order/index'})
			},
			// 支付下单
			async payOrderHandle(){
				const params = {orderNo: this.orderNo}
				payOrder(params).then(async res => {
					await this.getTableOrderDishListes()
					uni.showToast({
						title: "下单成功",
						icon: 'success',
					})
					setTimeout(() => {
						this.goOrder()
					}, 1000)
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'none',
					})
				})
			},
			// 操作购物车 - 加减菜 
			async orderHandle(item, act){
				// opertionType：ADD 添加  REMOVE 删除
				// dishFlavor：dateKey 默认 DEFAULT
				// orderNo 
				// dishId
				const dateKey = this.flavorDataes && this.flavorDataes.length > 0 ? this.flavorDataes[0].dataKey : 'DEFAULT'
				let params = {dishId:item.id, orderNo:this.orderNo, opertionType: act == 'add' ? "ADD" : "REMOVE", dishFlavor: dateKey } 
				await actOrderHandle(params).then(res => {
					if(res.code === "200") {
						this.getTableOrderDishListes()
					} else {
						console.log(res.msg)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 菜品详情加入购物车 调用多规格
			detailAdd(item){
				this.openDetailPop = false
				this.moreNormDataesHandle(item)
			},
			//清空购物车
			clearCardOrder(){
				clearOrder({orderNo: this.orderNo}).then(res => {
					// this.computOrderInfo()
					this.setOrderNum()
					this.openOrderCartList = false
					this.getTableOrderDishListes()
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'error',
					})
				})
			},
			// 打开菜品牌详情
			openDetailHandle(item){
				// console.log(item)
				this.dishDetailes = item
				// if(item.type == 2){
				getDishDetail({dishId:item.id}).then(res => {
					this.openDetailPop = true
					this.dishMealData= res.data
				}).catch(err => {
					console.log(err)
				})
				// } else {
				// 	this.openDetailPop = true
				// }  
				// console.log(item)
			},
			// 多规格数据处理
			moreNormDataesHandle(item){
				this.moreNormDishdata = item
				this.moreNormdata = item.dataDictVos
				// this.flavorDataes = item.dataDictVos
				this.openMoreNormPop = true
				// getMoreNorm({dishId: item.dishId}).then(res => {
				// 	this.openMoreNormPop = true
				// 	this.moreNormdata = res.data
				// }).catch(err => {
				// 	console.log(err)
				// })
				
			},
			// 选规格 处理一行只能选择一种 
			checkMoreNormPop(obj,item){
				let ind
				let findst = obj.some(n => {
					ind = this.flavorDataes.findIndex(o => o.dataKey == n.dataKey) 
					return ind != -1
				})
				const num = this.flavorDataes.findIndex(it => it.dataKey == item.dataKey)
				if (num == -1 && !findst){
					this.flavorDataes.push(item)
				} else if(findst) {
					if (item.dataKey != this.flavorDataes[0].dataKey){
						this.flavorDataes.splice(ind, 1)
						this.flavorDataes.push(item)
					} else {
						this.flavorDataes.splice(ind, 1)
					}
				} else {
					this.flavorDataes.splice(num, 1)
				}
			},
			// 关闭选规格弹窗
			closeMoreNorm(moreNormDishdata){
				this.flavorDataes.splice(0, this.flavorDataes.length)
				this.openMoreNormPop = false
			},
			// 设置开桌人数
			setOpenTableNumber(st){
				if(st == 'add'){
					this.openTablePeoPleNumber+=1
				} else {
					this.openTablePeoPleNumber =  this.openTablePeoPleNumber > 1 ? this.openTablePeoPleNumber-1 : 1
				}
			},
			// 订单里和总订单价格计算
			// computOrderInfo(){
			// 	let oriData = this.orderListDataes
			// 	this.orderDishNumber = this.orderDishPrice = 0;
			// 	oriData.map((n,i) => {
			// 		this.orderDishNumber += n.number
			// 		this.orderDishPrice += n.number * n.price
			// 	})
			// },
			// 处理点餐数量 - 更新菜品已点餐数量
			setOrderNum(){
				let ODate = this.dishListData
				let CData = this.orderListDataes
				ODate && ODate.map((obj, index) => {
					obj.dishNumber = 0
					CData && CData.forEach((tg, ind) => {
						console.log(obj, tg)
						if (obj.id == tg.dishId){
							obj.dishNumber = tg.dishNum || 0
							// obj.flavorRemark = tg.flavorRemark()
						}
					})
				})
				if(this.dishListItems.length == 0){
					this.dishListItems = ODate
				} else {
					this.dishListItems.splice(0, this.dishListItems.length, ...ODate)
				}
			}
		}
	}