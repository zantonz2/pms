<template>
	<div>
		<table class="bordered">
			<tr>
				<td>Дата изменения статуса:</td>
				<td>{{item.timestamp | myDate}}</td>
			</tr>
			<tr>
				<td>Статус изменен на:</td>
				<td class="left">{{item.status | status}}</td>
			</tr>
			<tr>
				<td>Комментарий:</td>
				<td>{{item.comment}}</td>
			</tr>
		</table>
		<div v-if="labelLoad">
			<div v-for="photo in photos" class="photos"> 
				<photo :photo=photo></photo>			
			</div>
		</div>
		<div v-else>
			<preload></preload>
		</div>
	</div>
</template>

<script>
	import preload from './../preload.vue'
	import photo from './photo.vue'

	export default {
		
	    data(){return{
	    		photos:[],
	    		labelLoad:false,
		    }
		},


		computed:{
			item() {return this.$store.state.itemHistory}
		},

		methods:{

		},

	    components:{
	    	photo:photo,
	    	preload:preload
		},
		created:function(){
				//console.log(this.$route);
				$('.tooltipped').tooltip('remove');
				this.$store.dispatch('getServer', 'photos.get&history_id='+this.item.id).
				then((response)=>{
					this.labelLoad=true;
					if (response.length===0) return;
					this.photos=response;
				}, (err)=>{alert(err)})
		},
	}
</script>

<style>
	.photos{
		width:20%;
		display: inline-block;
	}
	.prefix{

	}
</style>

