import {request} from "../../utils/request.js"

// 开桌
export const openTable = (params) => 
	request({
		url: `/shop-swagger/applet/open-table/${params.tableId}/${params.personNumbers}`,
		method: 'POST',
		params
	})

// 获取桌台状态
export const getTableState = (params) => 
	request({
		url: `/shop-swagger/applet/is-open/${params.tableId}`,
		method: 'GET',
		params,
	})
	
// 获取订单列表（包含购物车）
export const getTableOrderDishList = (params) =>
	request({
		url: `/shop-swagger/applet/show-ordervo-table/${params.tableId}`,
		method: 'POST',
		params
	})
// 获取菜品规格
export const getMoreNorm = (params) =>
	request({
		url: `/shop-swagger/dish/flavor/${params.dishId}`,
		method: 'GET',
		params,
	})	
// 查询桌台主体相关信息	
export const getDishList = (params) => 
	request({
		url: `/shop-swagger/applet/table-appletInfo/${params.tableId}`,
		method: 'GET',
		params,
	})
// 提交订单 
export const payOrder = (params) => 
	request({
		url: `/shop-swagger/applet/placeOrder/${params.orderNo}`,
		method: 'POST',
		params
	})	
// 操作购物车
export const actOrderHandle = (params) => 
	request({
		url: `/shop-swagger/applet/opertion-shopping-cart/${params.dishId}/${params.orderNo}/${params.dishFlavor}/${params.opertionType}`,
		method: 'POST',
		params
	})	
// 获取菜品详情	
export const getDishDetail = (params) => 
	request({
		url: `/shop-swagger/applet/dish-details/${params.dishId}`,
		method: 'POST',
		params,
	})	
// 清空购物车
export const clearOrder = (params) => 
	request({
		url: `/shop-swagger/applet/clear-shopping-cart/${params.orderNo}`,
		method: 'post',
		params
	})	
	