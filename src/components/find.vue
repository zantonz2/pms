<template>
	<div class="find">
		<div class="find__wrap">
			<div class="input-field col s9">
		  		<input type="text" class="validate" v-model="input" oninput="this.value = this.value.replace(/\D/g, '')" @keyup.13="findProduct"></input>
		  		<label>Поиск изделия</label>
			</div>
			<div class="col s3 find__btn">
				<div class="find__btn_block"></div>
				<a class="waves-effect btn-floating btn waves-effect waves-light" :class="computedClass" @click="findProduct"><i class="material-icons">done</i></a> 
			</div>
		</div>
	</div>
</template>
<script>

	export default{
		data:function(){
			return {
				input:'',
			}
		},
		computed:{
			userAction(){return (this.input)?true:false},
			computedClass(){
				return {
					find__btn_nonActive:!this.userAction,
					find__btn_active:this.userAction
				}
			}
		},
		methods:{
			findProduct:function(){
				if (!this.userAction) return;
				$(document).find('.find label').removeClass('active');
				$(document).find('.find input').removeClass('valid');
				this.$router.push('/history/product/'+this.input+'/all');
				this.input='';
			}
		},
		mounted:function(){
		},
	}
</script>

<style scoped>
	.find{
		position: relative;
	}

	.find__wrap:before{
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		height: 5rem;
		border-radius: 0 2rem 2rem 0;
		box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.3);
	}

	.find__btn{
		position: relative;
		margin-top: 1.3rem
	}

	.find__btn_nonActive {
		background-color: #DEDEDE;
		z-index: 1;
	}

	.find__btn_block{ /*блок от нажатия на кнопку*/
		width: 5rem;
		height: 5rem;
		z-index: 10;
		position: absolute;
		right: 0;
	}

	.find__btn_active {
		background-color: #1b5e20;
		z-index: 11;
	}

</style>