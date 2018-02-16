<template>
	<div>
		<div v-show="LabelLoad">
			<h5 class="center">{{products.length}} изделий за период  <span>{{filter.dateProduct.start}}</span> - <span>{{filter.dateProduct.end}}</span></h5>
			<div class="center">C учетом фильтров {{filtredProduct.length}} изделий</div>
			<br>
			<table>		
				<tr>
					<th>№</th>
					<th>ID изделия</th>
					<th>
						<div class="input-field">
						    <select class="model" multiple>
								<option v-for="(item,key) in filter.model" :value="key" :selected="filter.model[key]">{{+key | nomenclature('model')}}</option>
						    </select>
					   		<label>Модель</label>
					    </div>
					</th>
					<th>
						<div class="input-field">
						    <select class="group" multiple>
								<option v-for="(item,key) in filter.group" :value="key" :selected="filter.group[key]">{{+key | nomenclature('group')}}</option>
						    </select>
					   		<label>Линейка</label>
					    </div>
						</th>
					<th>
						<div class="input-field">
						    <select class="base" multiple>
								<option v-for="(item,key) in filter.base" :value="key" :selected="filter.base[key]">{{+key | nomenclature('base')}}</option>
						    </select>
					   		<label>Производитель</label>
					    </div>
					</th>
					<th>
						<div class="calendar start">	
							<a class="btn-floating btn-small grey lighten-3 left"><i class="material-icons red-text text-darken-4">date_range</i></a>
							<input type="date" class="datepicker tooltipped start" :data-tooltip="filter.date.start" data-position="right">
						</div>
						Дата последнего изменения
						<div class="calendar end">	
							<a class="modal-action modal-close btn-floating btn-small grey lighten-3 right tooltipped"><i class="material-icons red-text text-darken-4">date_range</i></a>
							<input type="date" class="datepicker tooltipped end" :data-tooltip="filter.date.end" data-position="left">
						</div>
					</th>
				</tr>

				<tr v-for="(item, index) in view"> 
					<td>{{currentPage+parseInt(index)+1}}</td>
					<td><div class="itemProd tooltipped center" style="width:80%" data-tooltip="Перейти к истории изделия" @click="viewProductHistory(item.id)">{{item.id}}</div></td>
					<td>{{item.model_id | nomenclature('model')}}</td>
					<td> {{item.group_id | nomenclature('group')}} </td>
					<td> {{item.base_id | nomenclature('base')}} </td>
					<td>{{item.history[item.history.length-1].timestamp | myDate}}</td>
				</tr>
			</table>
			<pagination @currentPageChange="currentPageChange" :list="filtredProduct" :maxRows="9"></pagination>
		</div>
		<div v-show="!LabelLoad">
			<preload></preload>
		</div>
	</div>
</template>

<script>
import pagination from './pagination.vue'
import preload from './preload.vue'
import Vue from 'vue'

	export default{
		data(){
			return {
				view:[],
				filtredProduct:this.$store.state.home.products,
				LabelLoad:false
			}

		},
		computed:{
			products(){return this.$store.state.home.products},
			nomenclature(){return this.$store.state.nomenclature},
			filter(){return this.$store.state.filter},
			//filtredProduct(){return this.filtred()}
		},
		methods:{
			currentPageChange:function(obj){
				this.currentPage=obj.page;
				this.view=obj.view
			},
			viewProductHistory:function(id){
				this.$router.push('/history/product/'+id+'/all')
			},
			filtred:function(){
				var filtred=this.products.slice()	;
				var filter=this.filter;
				for (var i = 0; i < filtred.length; i++) {
					var label=false
					for (var key in filter) {
						if (filtred[i][key+'_id']!=undefined){ 
							switch(key) {
								case 'model':
								case 'group':
								case 'base':
									for (var modelKey in filter[key]){
										if (filtred[i][key+'_id']==modelKey && !filter[key][modelKey]) {
											filtred.splice(i,1);
											i--;
											label=true;
											break;
										}
									}
							}
							if (label) break;
						}
					}
				}
				//console.log(filtred);
				return filtred;
			}
		},
		beforeCreate:function(){
			if (!this.$store.state.nomenclature.model.length) {
				console.log('ERROR NOT Nomenclature');
				this.$store.commit('nomenclatureUpdate','model');
     	 		this.$store.commit('nomenclatureUpdate','group');
      			this.$store.commit('nomenclatureUpdate','base');
			}
		},
		created:function(){
			this.LabelLoad=false;
			var dateStart=this.filter.dateProduct.start.split('.');
			var dateEnd=this.filter.dateProduct.end.split('.');
			var date={
				start:Date.parse(new Date(dateStart[2],+dateStart[1]-1,dateStart[0])),
				end:Date.parse(new Date(dateEnd[2],+dateEnd[1]-1,dateEnd[0]+1)),
			};

			var filter=this.$store.state.filter;

			var alias=this;

			var requestTo=(fun)=>{
				this.LabelLoad=false;
				this.$store.dispatch('getServer', 'products.get&with_history'+
				'&date_start='+this.filter.dateProduct.start.split('.').reverse().join('-')+
				'&date_end='+this.filter.dateProduct.end.split('.').reverse().join('-')).
				then((response)=>{
					
					var nomenclature=alias.$store.state.nomenclature;
					
					for (var i = 0; i < response.length; i++) {
						for (var j = 0; j < nomenclature.model.length; j++) {
							if (response[i].model_id==nomenclature.model[j].id) {
								if (!filter.model[response[i].model_id]) {
									filter.model[response[i].model_id]=true;
								}
								response[i].group_id=nomenclature.model[j].group_id;
								if (!filter.group[response[i].group_id]) {
									filter.group[response[i].group_id]=true;
								}
								for (var ii = 0; ii < nomenclature.group.length; ii++) {
									if (nomenclature.model[j].group_id==nomenclature.group[ii].id) {
										response[i].base_id=nomenclature.group[ii].base_id;
										if (!filter.base[response[i].base_id]) {
											filter.base[response[i].base_id]=true;
										}
										break;
									}
								}
								break;				
							}	
						}
					}

					function sortTime(a,b) {
						if (Date.parse(a.history[a.history.length-1].timestamp)<=Date.parse(b.history[b.history.length-1].timestamp)) return -1;
						return 1;
					};
					//console.log(Date.parse(response[0].history[response[0].history.length-1].timestamp));
					this.filtredProduct=response.sort(sortTime);
					this.$store.commit('home',response.sort(sortTime));
					if (typeof(fun)=='function') fun();
					alias.LabelLoad=true;
				})
			};

			var dateFilterInit=()=>{
				/*date Filter*/
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
				 					if ($('.datepicker.start').pickadate('picker').get()===filter.dateProduct.start) return;
				 					filter.dateProduct.start=$('.datepicker.start').pickadate('picker').get();
				 					alias.$store.commit('filter', filter);
				 					$('.tooltipped.start').attr('data-tooltip',filter.dateProduct.start).tooltip();
			    					$('.datepicker.start').pickadate('picker').set('select',filter.dateProduct.start);
			    					requestTo();
				 				}
				    		} 
			    		})
			    	);
			    	$('.tooltipped.start').attr('data-tooltip',filter.dateProduct.start).tooltip();
			    	$('.datepicker.start').pickadate('picker').set('select',filter.dateProduct.start);
			    	
				 	
			 		
			 		$('.datepicker.end').pickadate(Object.assign(option,{
				    		onClose:function(){
				    			if ($('.datepicker.end').pickadate('picker').get()===filter.dateProduct.end) return;
				 				filter.dateProduct.end=$('.datepicker.end').pickadate('picker').get();
			 					alias.$store.commit('filter', filter);
		    					$('.datepicker.end').pickadate('picker').set('select',filter.dateProduct.end);
			 					$('.tooltipped.end').attr('data-tooltip',filter.dateProduct.end).tooltip();
			 					requestTo();
				    		} 
			    		})
			    	);
			    	$('.tooltipped.end').attr('data-tooltip',filter.dateProduct.end).tooltip();
			    	$('.datepicker.end').pickadate('picker').set('select',filter.dateProduct.end);
			    /**^^^^date filter^^^^*/
			}

			requestTo(dateFilterInit);

		},

		mounted:function(){
			var alias=this
			$('select').on('change',function(ev){
				var filter=alias.filter;
				var keySelect='base';

				var classElem=$(ev.target).parent().attr('class').split(' ');
				for (var i = 0; i < classElem.length; i++) {
					if (classElem[i]=='model' | classElem[i]=='group' | classElem[i]=='base') keySelect=classElem[i];
				}

					for (var key in filter[keySelect]) {
						filter[keySelect][key]=false;
					}

					var value=$(this).val()
					//console.log(value,'value');
					for (var i = 0; i < value.length; i++) {
						filter[keySelect][value[i]]=true;
					}
					
				alias.$store.commit('filter', filter);
				alias.filtredProduct=alias.filtred();
				//console.log('change', alias.filtredProduct);
			});
		},
		updated:function(){
			$('.tooltipped').tooltip({delay: 50});
			var filter=this.filter;
			$('select').material_select();
		    //console.log('filter',filter);
		},
		components:{
			pagination, preload
		}
	}
</script>
