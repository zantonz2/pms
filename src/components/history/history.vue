<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<script>
export default{
	created:function(){
		if (!this.$store.state.user.id) this.$router.push("/"); 
	}
}
</script>

<style>
	.curDef {
		cursor: default;
	}
	td {
		position: relative;
	}
	.itemProd {
		position: relative;
		color:#b71c1c;
		cursor: pointer;

	}
	.itemProd::before{
		content:'';
		position:absolute;
		display: block;
		width: 100%;
		height: 1.5rem;
		//border:1px solid #616161;
		border-radius: 0.75rem;
		z-index:-20;
		background-color: #eeeeee;
		/*Красивая кнопочка получилась*/
		/*background: rgba(183,28,28,1);
		background: -moz-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(183,28,28,1)), color-stop(2%, rgba(255,235,238,1)), color-stop(5%, rgba(250,215,218,1)), color-stop(30%, rgba(211,47,47,1)), color-stop(70%, rgba(183,28,28,1)), color-stop(95%, rgba(247,213,216,1)), color-stop(98%, rgba(255,235,238,1)), color-stop(100%, rgba(183,28,28,1)));
		background: -webkit-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -o-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -ms-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: linear-gradient(to bottom, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b71c1c', endColorstr='#b71c1c', GradientType=0 );*/
		webkit-box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    	box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
	}
	
	table [type="checkbox"]:checked + label:before{
		border-right-color : #b71c1c;
		border-bottom-color: #b71c1c;
	}
</style>