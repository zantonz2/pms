<template>
	<div class="input-field name">
		<input type="text" class="name" v-model="obj[keyObj]" @blur="resetEdit(keyObj,obj)" @focus="saveEdit(keyObj,obj)" placeholder="..........." @keyup.13="initEmit(true)"></input>
		<a class="btn-floating btn-small edit model waves-effect waves-light grey lighten-3 left tooltipped" data-tooltip="Применить" data-position="top"  @click="initEmit(false)"><i class="material-icons green-text text-darken-4">edit</i></a>
	</div>
</template>

<script>
	/*********************************************************************************
	* После нажатия на кнопку Edit состояние изначальное
	* входные параметры 
	*	obj- объект для отображение
	*	key- свойство объекта	
	* 
	* в родителе лови событие changeApply
	*********************************************************************************/
	export default {
		data(){return{
	    		save:'',
	    		edit:'',
		    }
		},
		methods:{
			saveEdit:function(key,obj){
				this.save=obj[key];
			},

			resetEdit:function(key,obj){
				this.edit=obj[key];
				obj[key]=this.save;
			},

			initEmit:function(enter){
				if (enter) this.save=this.edit=this.obj[this.keyObj];
				this.$emit('changeApply',this.edit);
			}
		},

		props:['obj', 'keyObj']
	}
</script>

<style scoped>
	.btn-floating.btn-small{
		width: 24px;
		height: 24px;
		line-height: 24px;
		margin-top:-3px;
	}

	.btn-floating.btn-small i{
		font-size: 1.2rem;
		line-height: 1.5rem;
	}

	.input-field.name{
		width: calc(100% - 2rem);
		margin:2px auto;
	}

	input[type=text].name{
		border: none;
		margin: 0;
		height: auto;
		z-index: 1;
		padding-right: 25px;
		display: inline-block;
		float:left;
		text-overflow: ellipsis;
	}
	
	.btn-small.edit{
		position:absolute;
		margin-top: -1px;
		right: -24px;
		top:12px;
		z-index: 0;
		width: 0;
		height: 0;
		margin-top:-4px;
	}

	input.name:focus ~.edit, .edit:focus, .edit:active{
		width: 24px ;
		height: 24px ;
		right: -24px;
		top:0px;
		background-color: blue ;
		z-index: 10;
		display: block;
	}
</style>