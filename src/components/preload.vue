<template>
	<div class="wrapCircle center my">
	    <div class="preloader-wrapper big active">
	    	<div class="spinner-layer my__color darken-2">
	      		<div class="circle-clipper left">
	        		<div class="circle"></div>
	      		</div>
	      		<div class="gap-patch">
	        		<div class="circle"></div>
	      		</div>
		      	<div class="circle-clipper right">
		        	<div class="circle"></div>
		      	</div>
	    	</div>
  		</div>
	</div>
</template>

<style scoped>
	.my{
		position: fixed;
    	top: 50%;
   		left: 62%;
	}	
	.my__color{
		border-color: #b71c1c;
	    border-top-color: rgb(183, 28, 28);
	    border-right-color: rgb(183, 28, 28);
	    border-bottom-color: rgb(183, 28, 28);
	    border-left-color: rgb(183, 28, 28);
	}
</style>