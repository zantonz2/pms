<template>
	<div class="center" v-if="pages>1">
		<ul class="pagination">
			<li v-bind:class="activeArrowFirst" v-if="hideArrow"><a href="#!"><i class="material-icons" @click="clickPage(1)">first_page</i></a></li>
			<li v-bind:class="activeArrowPre" v-if="hideArrow"><a href="#!"><i class="material-icons" v-on:click="clickArrow(0,$event)">chevron_left</i></a></li>
			<li v-bind:class="activePage(page)" v-for="(page, index) in pages">
				<a href="#!" v-if="showNumPage(page)" v-on:click="clickPage(page)">{{page}}</a>
			</li>
			<li v-bind:class="activeArrowPost" v-if="hideArrow"><a href="#!"><i class="material-icons" v-on:click="clickArrow(1,$event)">chevron_right</i></a></li>
			<li v-bind:class="activeArrowLast" v-if="hideArrow"><a href="#!"><i class="material-icons" @click="clickPage(pages)">last_page</i></a></li>
		</ul>
	</div>
</template>

<script>
	/*********************************************************************************
	* входные параметры максимальное количество строк в таблице, массив даных
	* отдает в действии currentPageChange {#номер начала списка, массив для представления}
	*********************************************************************************/
	export default {
		data(){return{
	    		firstPage:1,
				lengthPagination:6, //меньше на 1 
				currentPage:0,	
		    }
		},
		methods:{
			showNumPage: function(num){
				if (num>(this.firstPage+this.lengthPagination)|num<(this.firstPage)) return false;
				return true;
			},
			activePage:function(num){
				return (num===(this.currentPage+1))?'active':'';
			},
			clickPage:function(num){
				if (num===1) this.firstPage=1;
				if (num>Math.floor(this.pages/this.lengthPagination)*this.lengthPagination) this.firstPage=Math.floor(this.pages/this.lengthPagination)*this.lengthPagination;
				this.currentPage=num-1;
			},
			clickArrow:function(operand,ev){
				if($(ev.target).parent().parent().hasClass("disabled")) return;
				if (operand) {
					this.firstPage+=this.lengthPagination+1;
					if (this.firstPage>this.pages) this.firstPage=this.pages;
				} else {
					this.firstPage-=this.lengthPagination+1;
					if (this.firstPage<1) this.firstPage=1;
				};
				this.currentPage=this.firstPage-1;
			}
		},
		computed:{
			activeArrowPre(){
				return (this.firstPage>1)?' ':'disabled';
			},
			activeArrowPost(){
				if ((this.firstPage+this.lengthPagination)<this.pages) return ' ';
				return 'disabled'
			},
			activeArrowFirst(){
				return (this.currentPage<=this.lengthPagination)?'disabled':' ';
			},
			activeArrowLast(){
				return (this.currentPage>Math.floor(this.pages/this.lengthPagination)*this.lengthPagination)?'disabled':' ';
			},
			hideArrow(){
				return (this.pages>=(this.lengthPagination+2))?true:false;
			},
			pages(){
				this.firstPage=1;
				this.currentPage=0;
				return Math.ceil(this.list.length/this.maxRows)
			},
			view(){
      			var startView=(this.currentPage)*this.maxRows;
				var endView=(this.currentPage+1)*this.maxRows;
				if (endView>this.list.length) endView=this.list.length;
				return this.list.slice(startView,endView); 
      		}
		},
		props:['list', 'maxRows'],
		created:function(){
			this.$emit('currentPageChange',{page:this.currentPage*this.maxRows, view:this.view});
		},

		updated:function(){
			this.$emit('currentPageChange',{page:this.currentPage*this.maxRows, view:this.view});
		}
	}
</script>