<template>
	<div>
		<div class="content__header">
			<h4 class="nameContent col s8 center"> Изделие № {{product_id}} </h4>
		</div>
		<div>
			<h6> Произведено: {{base_id | nomenclature('base')}}</h6>
			<h6> Линейка: {{group_id | nomenclature('group')}}</h6> 
			<h6> Модель: {{model_id | nomenclature('model')}}</h6>
				<br>
		</div>
		<router-view product_id="product_id"></router-view>
		<button-back></button-back>
	</div>
</template>

<script>
	
	import pagination from './../pagination.vue'
	import buttonBack from './../buttonBack.vue'

	export default {
		
	    data(){return{
	    		nomenclature:this.$store.state.nomenclature,
	    		model_id:0
		    }
		},


		computed:{
			product_id(){return this.$route.params.product_id},
			group_id(){
				for (var i = 0; i < this.nomenclature.model.length; i++) {
					if (this.nomenclature.model[i].id===this.model_id) {
						return this.nomenclature.model[i].group_id;
					}
				}
			},
			base_id(){
				for (var i = 0; i < this.nomenclature.group.length; i++) {
					if (this.nomenclature.group[i].id===this.group_id) {
						return this.nomenclature.group[i].base_id;
					}
				}
			}
		},

		created:function(){
				this.$store.dispatch('getServer', 'products.get&id='+this.product_id).
				then((response)=>{
					this.model_id=response.model_id;
				}, (err)=>{alert(err)})
		},

		 components:{
	    	buttonBack:buttonBack
		},
	}
</script>

<style>	
	.maxWidth {
		width: 30%
	}
	.wrapCircle{
		top: 45%;
    	left: 59%;
    	position: absolute;
	}

</style>