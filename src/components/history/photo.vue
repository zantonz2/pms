<template>
	<div>
	<div class="photo">
		<img class="materialboxed" style="width: 100%" :src="photoDinamicPath">
	</div>
	</div>
</template>

<script>
	
	//import materialbox from 'vue-materialize/material-box'
	
	export default {
		props:['photo'],

		data:function(){
			return {
				photoPath:''
			}
		},

		computed:{
			photoDinamicPath(){return this.photoPath}
		},

		created:function(){
			//console.log(this.photo, this.photoPath);
			var buff=new Int8Array(this.photo).buffer;
			var blob = new Blob([buff], {type : "image/jpg"});
			this.photoPath = URL.createObjectURL(blob);
			//$('.materialboxed').materialbox();
		},
		mounted:function(){
			$('.materialboxed').materialbox();	
		},
	}

</script>

<style>
	.photo {
	box-sizing: border-box;
	display: inline-block;
	padding: 0.5rem;
	margin-left: -4px;
}
</style>