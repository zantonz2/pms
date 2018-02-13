<template>
	<div>
		<div class="row content__header">
			<h4 class="nameContent col s12 center"> История действий пользователя {{this.$route.params.id}} </h4>
			<div class="center"><h6>Выполнено {{userHistorySelected.length}} действий пользователем в перирод {{selected.date.start}} - {{selected.date.end}}</h6></div>
		</div>
		<br>
		<div v-if="Array.isArray(userHistory.get)">
			<preload></preload>
		</div>
		<div v-else>
			<table>
			
				<tr>
					<th class="center">№</th>
					<th class="center"> Модель </th>
					<th class="center"> 
						<div class="input-field col s12">
						    <select class="status" multiple>
								<option v-for="(item,key) in selected.status" :value="key" :selected="selected.status[key]">{{key | status}}</option>
						    </select>
					   		<label>Статус</label>
					  </div>
  					</th>
					<th class="center"> № Изделия </th>
					<th class="center"> 
						<div class="calendar start">	
							<a class="btn-floating btn-small grey lighten-3 left"><i class="material-icons red-text text-darken-4">date_range</i></a>
							<input type="date" class="datepicker tooltipped start" :data-tooltip="selected.date.start">
						</div>
						Дата 
						<div class="calendar end">	
							<a class="modal-action modal-close btn-floating btn-small grey lighten-3 right tooltipped"><i class="material-icons red-text text-darken-4">date_range</i></a>
							<input type="date" class="datepicker tooltipped end" :data-tooltip="selected.date.end">
						</div>
					</th>
					<th class="center">Комментарий</th>
				</tr>

				<tr v-for="(item, index) in view">
					<td class="center curDef">{{currentPage+parseInt(index)+1}}</td>
					<td class="center curDef">{{item.model_id | nomenclature('model')}}</td>
					<td class="center curDef">{{item.status | status}}</td>
					<td class="center"><div class="itemProd tooltipped" data-tooltip="Перейти к истории изделия" v-on:click="viewProductHistory(item.product_id)">{{item.product_id}}</div></td>
					<td class="center curDef">{{item.timestamp | myDate}}</td>
					<td class="maxWidth curDef">{{item.comment}}</td>
				</tr>
			</table>
			
			<pagination @currentPageChange="currentPageChange" :list="userHistorySelected" :maxRows="8"></pagination>
		</div>
	</div>
</template>

<script>
	import pagination from './../pagination.vue'
	import preload from './../preload.vue'
	import Vue from 'vue'

	export default {
		
	    computed:{
      		models(){ return this.$store.state.nomenclature.model },
      		userHistory(){return this.$store.state.user.history},
      		userHistorySelected(){return this.filtred(this.userHistory)},
      		selected(){return this.$store.state.filter}
    	},
	    data(){return{
	    		view:[],
	    		filter:{}
		    }
		},

		watch: {
			$route: function(oldData,newData){
				if (oldData!=newData) {
					//reset filter
					this.resetFilter();
					this.$store.dispatch('getServer', 'users.get&id='+this.$route.params.id+'&with_history').
						then((response)=>{
							this.$store.commit('userHistory',response);
						})
				}
			}
		},

		methods:{
			currentPageChange:function(obj){
				this.currentPage=obj.page;
				this.view=obj.view
			},
			viewProductHistory:function(id){
				this.$router.push('/history/product/'+id+'/all')
			},


			filtred:function(history){
				var filtredHistory=[];
				var dateStart=this.selected.date.start.split('.');
				var dateEnd=this.selected.date.end.split('.');
				var date={
							start:Date.parse(new Date(dateStart[2],+dateStart[1]-1,dateStart[0])),
							end:Date.parse(new Date(dateEnd[2],+dateEnd[1]-1,dateEnd[0]+1)),
						};
				for (var i = 0; i < history.length; i++) {
					if( this.selected.status ) {
					
						date.history=Date.parse(history[i].timestamp);
						if (this.selected.status[history[i].status+''] 
							& date.history>=date.start
							& date.history<=date.end) {
								filtredHistory.push(history[i]);
						}
					}
					else filtredHistory=history;
				}
				return filtredHistory;
			},

			resetFilter:function(){
				this.$store.commit('filter',{
          				date:{
            				start:new Date(new Date().setMonth(new Date().getMonth()-12)).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}),
							end:new Date(Date.now()).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})
          				}
        			}
        		);
        		//$('.tooltipped.start').attr('data-tooltip',this.selected.date.start).tooltip();
		    	//$('.datepicker.start').pickadate('picker').set('select',this.selected.date.start);
		    	//$('.tooltipped.end').attr('data-tooltip',this.selected.date.and).tooltip();
		    	//$('.datepicker.end').pickadate('picker').set('select',this.selected.date.end);
			},
		},
	    components:{
			'pagination':pagination,
			'preload':preload
		},

		beforeUpdate:function(){
			if (this.$route.params.id!=this.$store.state.user.id && !this.$store.state.user.role) {
				this.$router.push('/history/user/'+this.$store.state.user.id);
			}
		},

		created:function(){

			this.resetFilter();
			var filter=this.selected;
			var alias=this;

			this.$store.dispatch('getServer', 'users.get&id='+this.$route.params.id+'&with_history').
			then((response)=>{
				if (!response.length | response==undefined) return;
				this.$store.commit('userHistory',response);
				alias.$store.commit('filter', filter);

		 		var option={
		    		selectMonths: true, 
		    		selectYears: 5, 
		    		monthsFull: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
					monthsShort: [ 'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек' ],
					weekdaysFull: [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ],
					weekdaysShort: [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
					weekdaysLetter: [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
					today: 'Сегодня',
					clear: '',
					close: 'выбрать',
		    		format: 'dd.mm.yyyy',
		    		firstDay: 1,
		    	};

		    	$('.datepicker.start').pickadate(Object.assign(option,{
			    		onClose:function(){
			 				if ($('.datepicker.start').pickadate('picker').get()) {
			 					filter.date.start=$('.datepicker.start').pickadate('picker').get();
			 					alias.$store.commit('filter', filter);
			 					$('.tooltipped.start').attr('data-tooltip',filter.date.start).tooltip();
		    					$('.datepicker.start').pickadate('picker').set('select',filter.date.start);
			 				}
			    		} 
		    		})
		    	);
		    	$('.tooltipped.start').attr('data-tooltip',filter.date.start).tooltip();
		    	$('.datepicker.start').pickadate('picker').set('select',filter.date.start);
		    	
			 	
		 		
		 		$('.datepicker.end').pickadate(Object.assign(option,{
			    		onClose:function(){
			 				//console.log('end',filter.date.end);
			 				filter.date.end=$('.datepicker.end').pickadate('picker').get();
		 					alias.$store.commit('filter', filter);
	    					$('.datepicker.end').pickadate('picker').set('select',filter.date.end);
		    				$('.datepicker.end').pickadate('picker').set('select',filter.date.end);
		 					$('.tooltipped.end').attr('data-tooltip',filter.date.end).tooltip();
			    		} 
		    		})
		    	);
		    	$('.tooltipped.end').attr('data-tooltip',filter.date.end).tooltip();
		    	$('.datepicker.end').pickadate('picker').set('select',filter.date.end);

			}, (err)=>{alert(err)})
		},

		mounted:function(){
			$('.tooltipped').tooltip({delay: 50});
			var alias=this;
			var filter=this.$store.state.filter;
			$('select').on('change',function(){
				//console.log( $(this).val(), $(this).parent().hasClass('status') );
				if ($(this).parent().hasClass('status')) {

					for (var key in filter.status) {
						filter.status[key]=false;
					}
					//console.log(alias.selected.status,'alias.selected.status');
					var value=$(this).val()
					for (var i = 0; i < value.length; i++) {
						filter.status[value[i]]=true;
					}
					//alias.userHistorySelected=alias.filtred(alias.userHistory);
					alias.$store.commit('filter', filter);
				}
			});

		},

		updated:function(){
			$('.tooltipped').tooltip({delay: 50});
			$('select').material_select();
		},

	}
</script>

<style scoped>	
	.maxWidth {
		width: 30%
	}
	.wrapCircle{
		top: 45%;
    	left: 59%;
    	position: absolute;
	}
	.datepicker{
		
	}
	/*input[type=text].datepicker{
		border-bottom: none;
		z-index: 10;
		cursor: pointer;
		font-size: 0;
	}
	
	.calendar{
		position: relative;
		width: 1.5rem;
		height: 1.5rem;
	}
	
	.calendar.start{
		float:left;
	}

	.calendar.end{
		float:right;
	}

	.calendar a{
		position: absolute;

	}
	.calendar .datepicker{
		position: absolute;
		margin: 0;
		padding-left: -1.6rem;
		width: 1.5rem;
	}
	/*.curDef {
		cursor: default;
	}
	td {
		position: relative;
	}
	.itemProd {
		color:#b71c1c;
		cursor: pointer;

	}
	.itemProd::before{
		content:'';
		position:absolute;
		display: block;
		width: 93%;
		height: 1.5rem;
		//border:1px solid #616161;
		border-radius: 0.75rem;
		z-index:-20;
		background-color: #eeeeee;
		/***********************************

		/*Красивая кнопочка получилась*/
		
		/*background: rgba(183,28,28,1);
		background: -moz-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(183,28,28,1)), color-stop(2%, rgba(255,235,238,1)), color-stop(5%, rgba(250,215,218,1)), color-stop(30%, rgba(211,47,47,1)), color-stop(70%, rgba(183,28,28,1)), color-stop(95%, rgba(247,213,216,1)), color-stop(98%, rgba(255,235,238,1)), color-stop(100%, rgba(183,28,28,1)));
		background: -webkit-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -o-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: -ms-linear-gradient(top, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		background: linear-gradient(to bottom, rgba(183,28,28,1) 0%, rgba(255,235,238,1) 2%, rgba(250,215,218,1) 5%, rgba(211,47,47,1) 30%, rgba(183,28,28,1) 70%, rgba(247,213,216,1) 95%, rgba(255,235,238,1) 98%, rgba(183,28,28,1) 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b71c1c', endColorstr='#b71c1c', GradientType=0 );
		webkit-box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    	box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
	}

	/*.itemProd:active::before{
		margin-top:3px;
		margin-left:3px;
	}

	.itemProd:active {
		padding-left:6px;
		line-height: 1.8rem
	}*/

</style>