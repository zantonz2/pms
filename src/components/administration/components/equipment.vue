<template>
	<div>
		<div class="row">
			<div class="col s4 center"><h6>Производитель</h6></div>
			<div class="col s4 center"><h6>Линейка</h6></div>
			<div class="col s4 center"><h6>Модель</h6></div>
		</div>
		<div v-if="admin">
			<table>
				<tr v-for="(base, index) in nomenclature.base">
					<td> 
						<change-input :obj="base" keyObj="name" @changeApply="updateName($event,'base',base.id)"></change-input>
						<a class="btn-floating btn-small del waves-effect waves-light grey lighten-3 tooltipped" data-tooltip="Удалить производителя" @click="viewModalDelete('base', base.id)"><i class="material-icons red-text text-darken-4">delete_forever</i></a> 
					</td>
					<td>
						<table>
							<tr v-for="(group, index) in nomenclature.group" v-if="base.id===group.base_id">
								<td>
			        				<change-input :obj="group" keyObj="name" @changeApply="updateName($event,'group',group.id)"></change-input>
			        				<a class="btn-floating btn-small del waves-effect waves-light grey lighten-3 tooltipped" data-tooltip="Удалить группу" @click="viewModalDelete('group', group.id)"><i class="material-icons red-text text-darken-4">delete_forever</i></a></td>
								<td>
									<table>
										<tr v-for="(model,index) in nomenclature.model" v-if="group.id===model.group_id">
										<td> 
											<change-input :obj="model" keyObj="name" @changeApply="updateName($event,'model',model.id)"></change-input>
			        						<a class="btn-floating btn-small del waves-effect waves-light grey lighten-3 tooltipped" data-tooltip="Удалить модель" data-position="left" @click="viewModalDelete('model', model.id)"><i class="material-icons red-text text-darken-4">delete_forever</i></a></td>
										</tr>
										<a class="btn-floating btn-small grey lighten-3" data-position="top" data-tooltip="Добавить модель" @click="viewModalAdd('model', group.id)"><i class="material-icons green-text text-darken-4">add</i></a>
									</table>
								</td>
							</tr>
							<a class="btn-floating btn-small grey lighten-3" data-position="top" data-tooltip="Добавить группу" @click="viewModalAdd('group', base.id)"><i class="material-icons green-text text-darken-4">add</i></a>
						</table>
					</td>
				</tr>
				<tr class="center"><a class="btn-floating btn-small grey lighten-3" data-position="top" data-tooltip="Добавить производителя" @click="viewModalAdd('base')"><i class="material-icons green-text text-darken-4">add</i></a></tr>
			</table>	
		</div>
		<div v-else>
			<table>
				<tr v-for="(base, index) in nomenclature.base" class="row">
					<td class="notAdmin"> {{base.name}} </td>
					<td>
						<table>
							<tr v-for="(group, index) in nomenclature.group" v-if="base.id===group.base_id" class="row">
								<td class="notAdmin2"> {{group.name}} </td>
								<td>
									<table>
										<tr v-for="(model,index) in nomenclature.model" v-if="group.id===model.group_id" class="row">
											<td class="notAdmin3"> {{model.name}} </td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
		


		<div class="modal modalAdd">
		    <div class="modal-content">
		        <h4 class="center">{{modal.add.header}}</h4>
		        <div class="input-field">
		            <input type="text" v-model="modal.name"></input>
		            <label class="active">Введите название</label>
		        </div>
		    </div>
		    <div class="modal-footer">
		        <a class="modal-action modal-close btn-floating btn-large waves-effect waves-light green darken-4 right tooltipped"  data-position="left" data-tooltip="Применить" @click="requestToServer" ><i class="material-icons">done</i></a>
		    </div>
		</div>

		<div class="modal modalDelete">
		    <div class="modal-content">
		        <h4 class="center">{{modal.delete.header}}</h4>
		    </div>
		    <a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
		    <div class="modal-footer">
		        <a class="modal-action modal-close btn-floating btn-large waves-effect waves-light red darken-4 left tooltipped"  data-position="right" data-tooltip="Удалить" @click="requestToServer"><i class="material-icons">delete_forever</i></a>
		    </div>
		</div>


	</div>
</template>

<script>
	import changeInput from './../changeInput.vue'
	
	export default{

		data:function(){
			return{
				modal:{
					action:'',
					key:'',
					name:'',
					base_id:-1,
					group_id:-1,
					model_id:-1,
					add:{
						header:'',
						request:'',
						success:[]
					},
					success:{
						header:''
					},
					delete:{
						header:'',
						request:'',
						success:[]
					}
				},
				nameEdit:'',
				nameEditReset:''
			}
		},

		components:{
			changeInput:changeInput
		},

		computed:{
			nomenclature(){return this.$store.state.nomenclature},
			admin(){return this.$store.state.user.role}
		},

		mounted:function(){
			$('.modalAdd').modal();
			$('.modalDelete').modal();
			$('.btn-small, .tooltipped').tooltip({delay: 50});
		},

		methods:{

			viewModalAdd:function(key, id){
				this.modal.action='add';
				this.modal.key=key;
				switch (key) {
					case 'model':
						this.modal.group_id=id;
						this.modal.add.header='Добавить модель в группу '+this.$options.filters.nomenclature(id,'group');
						this.modal.add.success=['Модель ',' успешно добавлена'];
						break;
					case 'group':
						this.modal.base_id=id;
						this.modal.add.header='Создать группу в '+this.$options.filters.nomenclature(id,'base');
						this.modal.add.success=['Группа ',' успешно добавлена'];
						break;
					case 'base':
						this.modal.add.header='Добавить производителя';
						this.modal.add.success=['Производитель ',' успешно добавлен'];
						break;
				}
				$('.modalAdd').modal('open');
			},

			viewModalDelete:function(key, id){
				this.modal.action='delete';
				this.modal.key=key;
				this.modal.name=this.$options.filters.nomenclature(id,key);
				switch (key) {
					case 'model':
						this.modal.delete.header='Вы действительно хотите удалить модель '+this.modal.name+'?';
						this.modal.model_id=id;
						this.modal.delete.success=['Модель ',' успешно удалена'];
						break;
					case 'group':
						this.modal.delete.header='Вы действительно хотите удалить группу '+this.modal.name+'?';
						this.modal.group_id=id;
						this.modal.delete.success=['Группа ',' успешно удалена'];
						break;
					case 'base':
						this.modal.delete.header='Вы действительно хотите удалить производителя '+this.modal.name+'?';
						this.modal.base_id=id;
						this.modal.delete.success=['Производитель ',' успешно удален'];
						break;
				}
				$('.modalDelete').modal('open');
				
			},

			updateName:function(edit,key,id){
				//console.log('update',arguments);
				var request='database.update';
				var keyS = key[0].toUpperCase() + key.substring(1);
				request+=keyS+'&id='+id+'&name='+edit;
				this.$store.dispatch('getServer', request).
				then((response)=>{
					if (response==="OK") {
						this.$store.state.modal.success='Наименование успешно измененно';
						this.$store.commit('nomenclatureUpdate',key);
						$('.modalSuccess').modal('open');
					} else if (response.message) {
						this.$store.state.modal.error=response.message;
						$('.modalError').modal('open');
					};
				})
			},

			resetEdit:function(key, index){
				this.nameEdit=this.nomenclature[key][index].name;
				this.nomenclature[key][index].name=this.nameEditReset;
			},

			saveNameEdit:function(key, index){
				this.nameEditReset=this.nomenclature[key][index].name;
			},

			requestToServer:function(){
				this.$store.dispatch('getServer', this.request(this.modal.action,this.modal.key)).
				then((response)=>{
					if (response==="OK") {
						this.$store.state.modal.success=this.modal[this.modal.action].success[0]+this.modal.name+this.modal[this.modal.action].success[1],
					    this.$store.commit('nomenclatureUpdate',this.modal.key);
						$('.modalSuccess').modal('open');
					} else if (response.message) {
						this.$store.state.modal.error=response.message;
						$('.modalError').modal('open');
					};
					this.modal.name='';
				}, (err)=>{alert(err)})
			},


			request(action,key){
				switch (action) {
					case 'add':
						switch (key) {
							case 'model':
								return 'database.createModel&name='+this.modal.name+'&group_id='+this.modal.group_id;
							case 'group':
								return 'database.createGroup&name='+this.modal.name+'&base_id='+this.modal.base_id;
							case 'base':
								return 'database.createBase&name='+this.modal.name;
						};
						break;
					case 'delete':
						switch (key) {
							case 'model':
								return 'database.deleteModel&id='+this.modal.model_id;
							case 'group':
								return 'database.deleteGroup&id='+this.modal.group_id;
							case 'base':
								return 'database.deleteBase&id='+this.modal.base_id;
						};
						break;
				}
			}
		},

		created:function(){
			if (!this.$store.state.nomenclature.model.length) {
				this.$store.dispatch('getServer', 'models.get')
    					.then((response)=>{
      						this.$store.state.nomenclature.model=response
    					})
			};
			if (!this.$store.state.nomenclature.group.length) {
				this.$store.dispatch('getServer', 'groups.get')
    					.then((response)=>{
      						this.$store.state.nomenclature.group=response
    					})
			};
			if (!this.$store.state.nomenclature.base.length) {
				this.$store.dispatch('getServer', 'bases.get')
    					.then((response)=>{
      						this.$store.state.nomenclature.base=response
    					})
			}
		}
	}

</script>

<style scoped>
	table {
		border-collapse: collapse;
	}
	
	table, tr, td{
		margin:0;
		padding: 0;
		position: relative;
	}
	
	tr {
		border-bottom: 1px solid black;
		height: 28px;
	}

	table tr:last-child{
		border-bottom: 0;
	}

	td {
		text-align: center;
		border-right: 1px solid black; 
	}

	td:last-child{
		border-right: none;	
	}
	
	.btn-small.del{
		position: absolute;
		right: 0.5rem;
	}

	.row {
		margin-bottom: 0;
		border-bottom: 1px solid black;
	}

	.input-field.name{
		width:calc(100% - 6rem) !important; 
		margin-left:1rem !important; 
	}

	.notAdmin{
		width: 33%
	}

	.notAdmin2{
		width: 50%
	}

	.notAdmin3 {
		width: 100%
	}

</style>
