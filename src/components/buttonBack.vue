<template>
	<div class="center">
		<a class="waves-effect button-back waves-light btn red darken-4 z-depth-1 valign-wrapper" @click="back">< назад</a>
	</div>
</template>

<script>
	export default{
		methods:{
			back:function(){
				//console.log(this.$router.path);
				this.$router.back();
			}
		}
	}
</script>

<style>
	.button-back{
		position:fixed;
		bottom: 10px;
		margin:0 auto;
	}
</style>