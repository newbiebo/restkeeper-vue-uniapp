<template>
	<view class="home_content">
		<navBar source="index"></navBar>
		<view class="restaurant_info_box">
			<view class="restaurant_info" v-if="tableInfo">
				<view class="left_info" >
					<view class="title">
						{{tableInfo.storeName || ''}}
					</view>
					<view class="position">
						{{tableInfo.tableName || ''}}
					</view>
				</view>
				<view class="restaurant_logo">
					<image class="restaurant_logo_img" :src="tableInfo.brandLogo"></image>
				</view>
			</view>
		</view>
		<view class="restaurant_menu_list">
			<scroll-view class="type_list" scroll-y="true" scroll-top="0rpx" v-if="typeListData.length > 0 ">
				<view class="type_item" :class="{active: typeIndex == index}" v-for="(item, index) in typeListData" :key="index" @click="getDishListHandle(item, index)">
					{{ item.categoryName }} 
				</view>
				<view class="seize_seat"></view>
			</scroll-view>
			<scroll-view class="vegetable_order_list" scroll-y="true" scroll-top="0rpx" v-if="dishListItems && dishListItems.length >0">
				<view class="type_item"  v-for="(item, index) in dishListItems" :key="index" >
					<view class="dish_img" @click="openDetailHandle(item)">
						<image v-if="item.affixVo" :src="item.affixVo.pathUrl" class="dish_img_url" mode=""></image>
					</view>
					<view class="dish_info">
						<view class="dish_name" @click="openDetailHandle(item)"> {{ item.dishName }} </view>
						<view class="dish_label" @click="openDetailHandle(item)"> {{ item.desc || item.dishName }} </view>
						<!-- <view class="dish_num"> {{ item.dishName }} </view> -->
						<view class="dish_price"> <text class="ico">￥</text> {{ item.reducePrice == 0 ? item.price : item.reducePrice }} </view>
						<view class="dish_active" v-if="Array.isArray(item.dataDictVos) && item.dataDictVos.length == 0 || item.dishNumber > 0">
							<image v-if="item.dishNumber > 0" src="../../static/btn_red.png"  @click="orderHandle(item, 'red')" class="dish_red" mode=""></image>
							<text v-if="item.dishNumber > 0" class="dish_number">{{item.dishNumber}}</text>
							<image src="../../static/btn_add.png" class="dish_add" @click="orderHandle(item, 'add')" mode=""></image>
						</view>
						<view class="dish_active" v-else>
							<view class="check_but" @click="moreNormDataesHandle(item)"> 选规格 </view>
						</view>
					</view>
				</view>
				<view class="seize_seat"></view>
			</scroll-view >
			<view class="no_dish" v-else>
				该分类下暂无菜品！
			</view>	
		</view>
		<view class="footer_order_buttom" v-if="orderListData().length == 0">
			<view class="order_number">
				<image src="../../static/btn_waiter_nor.png" class="order_number_icon" mode=""></image>
			</view>
			<view class="order_price">
				 <text class="ico">￥</text> 0
			</view>
			<view class="order_but">
				<view class="orderHandle" >去下单</view>
				<view class="goOrder" @click="goOrder()">已下单</view>
			</view>
		</view>
		<view class="footer_order_buttom order_form" v-else>
			<view class="order_number" @click="() => openOrderCartList = !openOrderCartList">
				<image src="../../static/btn_waiter_sel.png" class="order_number_icon" mode=""></image>
				<view class="order_dish_num"> {{orderDishNumber}} </view>
			</view>
			<view class="order_price">
				 <text class="ico">￥ </text> {{orderDishPrice}}
			</view>
			<view class="order_but">
					<view class="orderHandle" @click="payOrderHandle()">去 下 单</view>
					<view class="goOrder" @click="goOrder()">已 下 单</view>
			</view>
		</view>
		<!-- 开桌弹框 - start -->
		<view class="pop_mask " style="z-index: 9999;" v-show="openTablePop">
			<view class="pop">
				<view class="open_table_cont">
					<view class="cont_tit">
						就餐人数
					</view>
					<view class="people_num_act">
						<image src="../../static/btn_red.png" class="red" @click="setOpenTableNumber('red')" mode=""></image>
						<text class="people_num"> {{ openTablePeoPleNumber }} </text>
						<image src="../../static/btn_add.png" class="add" @click="setOpenTableNumber('add')" mode=""></image>
					</view>
				</view>
				<view class="butList">
					<view class="define" @click="openTableHandle()"> 确定 </view>
				</view>
			</view>
		</view>
		<!-- 开桌弹框 - end -->
		<!-- 多规格 - start -->
		<view class="pop_mask " v-show="openMoreNormPop">
			<view class="more_norm_pop" v-if="moreNormDishdata">
				<view class="title">
					{{moreNormDishdata.dishName}}
				</view>
				<view class="items_cont">
					<view class="item_row" v-for="(obj, index) in moreNormdata" :key="index">
						<view :class="{item: true, act: flavorDataes.findIndex(it => obj.dataKey === it.dataKey) != -1}"  @click="checkMoreNormPop(moreNormdata,obj)">
							{{obj.discriptioin}}
						</view>
					</view>
				</view>
				<view class="but_item">
					<view class="price">
						 <text class="ico"> ￥ </text> {{moreNormDishdata.reducePrice == 0 ? moreNormDishdata.price : moreNormDishdata.reducePrice}}
					</view>
					<view class="active" v-if="moreNormDishdata.dishNumber && moreNormDishdata.dishNumber > 0">
						<image src="../../static/btn_red.png"  @click="orderHandle(moreNormDishdata, 'red')" class="dish_red" mode=""></image>
						<text class="dish_number">{{moreNormDishdata.dishNumber}}</text>
						<image src="../../static/btn_add.png" class="dish_add" @click="orderHandle(moreNormDishdata, 'add')" mode=""></image>
					</view>
					<view class="active" v-else-if="moreNormDishdata.dishNumber == 0">
						<view class="dish_card_add" @click="orderHandle(moreNormDishdata, 'add')"> 加入购物车 </view>
					</view>
				</view>
				<view class="close" @click="closeMoreNorm(moreNormDishdata)">
					<image class="close_img" src="../../static/but_close.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 多规格 - end -->
		<!-- 菜品详情 - start -->
		<view class="pop_mask " v-show="openDetailPop" style="z-index: 9999;" >
			<view class="dish_detail_pop" v-if="dishDetailes">
				<image class="div_big_image" v-if="dishDetailes.affixVo" :src="dishDetailes.affixVo.pathUrl" mode=""></image>
				<view class="title">
					{{dishDetailes.dishName}}
				</view>
				<view class="desc">
					{{dishDetailes.description}}
				</view>
				<view class="but_item">
					<view class="price">
						 <text class="ico"> ￥ </text> {{dishDetailes.reducePrice || dishDetailes.price}}
					</view>
					<view class="active" v-if="dishDetailes.dishNumber && dishDetailes.dishNumber > 0">
						<image src="../../static/btn_red.png"  @click="orderHandle(dishDetailes, 'red')" class="dish_red" mode=""></image>
						<text class="dish_number">{{dishDetailes.dishNumber}}</text>
						<image src="../../static/btn_add.png" class="dish_add" @click="orderHandle(dishDetailes, 'add')" mode=""></image>
					</view>
					<view class="active" v-else-if="dishDetailes.dishNumber == 0">
						<view class="dish_card_add" @click="detailAdd(dishDetailes)"> 加入购物车 </view>
					</view>
				</view>
				<view class="close" @click="() => openDetailPop = false">
					<image class="close_img" src="../../static/but_close.png" mode=""></image>
				</view>
			</view>
			<!-- <view class="dish_detail_pop" v-else>
				<scroll-view class="dish_items" scroll-y="true" scroll-top="0rpx">
					<view class="dish_item" v-for="(item, index) in dishMealData" :key="index">
						<image class="div_big_image" :src="item.imageUrl" mode=""></image>
						<view class="title">
							{{item.dishName}}
						</view>
						<view class="desc">
							{{item.desc}}
						</view>
					</view>
				</scroll-view>
				<view class="but_item">
					<view class="price">
						 <text class="ico"> ￥ </text> {{dishDetailes.price}}
					</view>
					<view class="active" v-if="dishDetailes.dishNumber && dishDetailes.dishNumber > 0">
						<image src="../../static/btn_red.png"  @click="redDishAction(dishDetailes)" class="dish_red" mode=""></image>
						<text class="dish_number">{{dishDetailes.dishNumber}}</text>
						<image src="../../static/btn_add.png" class="dish_add" @click="orderHandle(dishDetailes, 'red')" mode=""></image>
					</view>
					<view class="active" v-else-if="dishDetailes.dishNumber == 0">
						<view class="dish_card_add" @click="orderHandle(dishDetailes, 'add')"> 加入购物车 </view>
					</view>
				</view>
				<view class="close" @click="() => openDetailPop = false">
					<image class="close_img" src="../../static/but_close.png" mode=""></image>
				</view>
			</view> -->
		</view>
		<!-- 菜品详情 - end -->
		<!-- 购物车弹框 - start -->
		<view class="pop_mask " v-show="openOrderCartList"  >
			<view class="cart_pop" v-if="orderListDataes">
				<view class="top_title">
					<view class="tit"> 购物车 </view>
					<view class="clear" @click="clearCardOrder()"> 
					<image class="clear_icon" src="../../static/clear.png" mode=""></image> 
						<text>清空 </text>	
					</view>
				</view>
				<scroll-view class="card_order_list" scroll-y="true" scroll-top="40rpx">
					<!-- <view class="type_item_cont"  v-for="(item, ind) in orderAndUserInfo" :key="ind"> -->
						<!-- <view class="user_info">
							<view class="user_avatar">
								<image class="user_avatar_icon" :src="item.avatarUrl" mode=""></image>
							</view>
							<view class="user_name">{{item.nickName}}</view>
						</view> -->
						<view class="type_item"  v-for="(obj, index) in orderListDataes" :key="index">
							<view class="dish_img">
								<image :src="obj.affixVo.pathUrl" class="dish_img_url" mode=""></image>
							</view>
							<view class="dish_info">
								<view class="dish_name"> {{ obj.dishName }} </view>
								<view class="dish_price"> <text class="ico">￥</text> {{ obj.reducePrice || obj.price }} </view>
								<view class="dish_active">
									<image v-if="obj.dishNum && obj.dishNum > 0" src="../../static/btn_red.png"  @click="orderHandle(obj, 'red')" class="dish_red" mode=""></image>
									<text v-if="obj.dishNum && obj.dishNum > 0" class="dish_number">{{obj.dishNum}}</text>
									<image src="../../static/btn_add.png" class="dish_add" @click="orderHandle(obj, 'add')" mode=""></image>
								</view>
							</view>
						</view>
					<!-- </view> -->
					<view class="seize_seat"></view>
				</scroll-view >
			</view>
		</view>
		<!-- 购物车弹框 - end -->
		<view class="pop_mask" v-show="loaddingSt">
			<view class="lodding">
				<image class="lodding_ico" src="../../static/lodding.gif" mode=""></image>
			</view>
		</view>
	</view>
</template>
<script src="./index.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
