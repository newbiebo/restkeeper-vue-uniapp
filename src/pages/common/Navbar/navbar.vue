<template>
	<view class="navBar" :style="{paddingTop: ht + 'rpx'}">
		<view class="leftNav" v-if="source == 'index'">
			<image class="logo" src="/static/logo.png"></image>
		</view>
		<view class="leftNav" @click="goback()" v-if="source == 'list'">
			<image class="back" src="../../../static/btn_back.png" mode=""></image>
		</view>
		<view class="centerNav" v-if="source == 'list'">
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		props:['source', 'title'],
		computed:{
			ht: function(){
				let res = uni.getMenuButtonBoundingClientRect()
				if(!res){
					res = {top: 20}
				}
				let num = 24
				if(/iPhone.*/.test(uni.getSystemInfoSync().model)){
					 num = res.top * 1.6
				} else {
					num = res.top * 2
				}
				return num
			}
		},
		methods:{
			// 返回上一级
			goback(){
				uni.navigateBack()
			},
		}
	}
</script>

<style src="./navbar.scss" lang="scss"> </style>
