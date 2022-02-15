<template>
	<view class="order_content">
		<navBar title="订单详情" source="list"></navBar>
		<view class="restaurant_info_box">
			<view class="restaurant_info">
				<view class="left_info">
					<view class="title">
						{{tableInfo.storeName}}
					</view>
					<view class="position">
						{{tableInfo.tableName}}
					</view>
				</view>
				<view class="restaurant_logo">
					<image class="restaurant_logo_img" :src="tableInfo.brandLogo"></image>
				</view>
			</view>
		</view>
		<view class="order_list_cont">
			<scroll-view class="order_list" scroll-y="true" scroll-top="40rpx">
				<view class="type_item"  v-for="(obj, index) in orderListDataes" :key="index">
					<view class="dish_img">
						<image :src="obj.affixVo.pathUrl" class="dish_img_url" mode=""></image>
					</view>
					<view class="dish_info">
						<view class="dish_name"> {{ obj.dishName }} </view>
						<view class="dish_price">× <text v-if="obj.dishNum && obj.dishNum > 0" class="dish_number">{{obj.dishNum}}</text> </view>
						<view class="dish_active">
							<text class="ico">￥</text> {{ obj.reducePrice || obj.price }} 
						</view>
					</view>
				</view>
				<view class="seize_seat"></view>
			</scroll-view >
		</view>
		<view class="footer_order_buttom order_form">
			<view class="order_price">
				 <text class="ico">￥ </text> {{orderDishPrice}}
			</view>
			<view class="order_but">
				<!-- <view class="order_but_left" @click="goback()">
					继续加菜
				</view> -->
				<view class="order_but_rit"  @click="goback()">
					继续加菜
				</view>
				<!-- <view class="order_but_rit" @click="payOrderHandle()">
					支付下单
				</view> -->
			</view>
		</view>
		<!-- 已有人支付弹窗 - start -->
		<view class="pop_mask " v-show="openPayType">
			<view class="pop">
				<view class="open_table_cont">
					<view class="cont_icon">
						<image class="cont_icon_img" src="../../static/unable_pay.png" mode=""></image>
					</view>
					<view class="cont_tit">
						该餐桌在支付途中
					</view>
					<view class="cont_desc">
						请勿重复支付
					</view>
				</view>
				<view class="butList">
					<view class="define" @click="closeMask()"> 知道了 </view>
				</view>
			</view>
		</view>
		<!-- 已有人支付弹窗 - end -->
	</view>
</template>
<script src="./index.js"></script>
<style src="./../common/Navbar/navbar.scss" lang="scss" scoped></style>
<style src="./style.scss" lang="scss" scoped></style>
