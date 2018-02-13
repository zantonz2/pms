<template>
	<div>
		<div v-if="labelLoad">
			<table class="bordered">
				<tr>
					<th class="center">№</th>
					<th class="center"> Статус </th>
					<th class="center"> Дата </th>
					<th class="center"> Комментарий </th>
				</tr>
				<tr v-for="(item, index) in view">
					<td class="center curDef">{{currentPage+parseInt(index)+1}}</td>
					<td class="center curDef">{{item.status | status}}</td>
					<td class="center curDef"><div class="itemProd tooltipped" data-tooltip="Подробно" @click="goItemHistory(item)" >{{item.timestamp | myDate}}</div></td>
					<td class="maxWidth">{{item.comment}}</td>
				</tr>
			</table>
			<pagination @currentPageChange="currentPageChange" :list="history" :maxRows="7"></pagination>
		</div>
		<div v-else>
			<preload></preload>
		</div>
	</div>
</template>

<script>
import preload from './../preload.vue'
import pagination from './../pagination.vue'

	export default {
		
	    data(){return{
	    		historyResponse:[],
	    		view:[],
	    		labelLoad:false
		    }
		},

		computed:{
			history(){return this.historyResponse},
			product_id(){return this.$parent.product_id}
		},

		methods:{
			currentPageChange:function(obj){
				this.currentPage=obj.page;
				this.view=obj.view
			},
			goItemHistory:function(item){
				var pathGo=this.$router.currentRoute.path.slice(0,-4);
				this.$store.state.itemHistory=item;
				this.$router.push(pathGo+'/item')
			}
		},

	    components:{
	    	pagination:pagination,
	    	'preload':preload
		},

		watch: {
    		product_id: function (newID, oldID) {
    			checkProduct(this);
    		}
    	},

		created:function(){
			checkProduct(this);
			$('.tooltipped').tooltip('remove');
		},

		updated:function(){
			$('.tooltipped').tooltip({delay: 50});
		},

		beforeDestroy:function(){
			$('.tooltipped').tooltip('remove');
		}
	}

	function checkProduct(vueEx){
		try {
			//console.log('this.$parent.product_id',vueEx.product_id);
			vueEx.$store.dispatch('getServer', 'products.get&id='+vueEx.product_id).
				then((response)=>{
					if (response.id) {
						vueEx.$store.dispatch('getServer', 'products.get&id='+vueEx.product_id+'&with_history').
						then(
							(response)=>{
								vueEx.$parent.model_id=response.model_id;
								vueEx.historyResponse=response.history;
								vueEx.labelLoad=true; 
							});
						//return true;
					} else {
						vueEx.historyResponse=[];
						vueEx.$store.state.modal.error="Продукт id="+ vueEx.product_id +" не найден";
						vueEx.$parent.model_id=-1; 
						$('.modalError').modal('open');
						vueEx.labelLoad=true;
						//return false;
					}
				})
		}
		catch(err) {
			console.log(err)
		}
	}

</script>

<style scoped>

.itemProd{
	margin:0 auto;
	width: calc(100% - 6rem);
	box-sizing: content-box;
}

/*.itemProd::before{
	width: 50%;
	margin-left: 25%;
}*/
	
</style>