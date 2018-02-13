<template>
	<div>
		<div v-if="currentUser.role">
			<table class="bordered">
				<tr class="row">
					<th class="center col s1">№</th>
					<th class="center col s1">ID</th>
					<th class="center col s4">Имя</th>
					<th class="center col s3">Пароль</th>
					<th class="center col s1">Админ</th>
					<th class="center col s1"> </th>
					<th class="center col s1"><a class="btn-floating btn waves-effect waves-light green darken-4 tooltipped" data-position="left" data-tooltip="Добавить пользователя" @click="openModalAdd"><i class="material-icons">add</i></a></th>
				</tr>
				<tr v-for="(user, index) in view" class="row">
					<td class="center col s1">{{currentPage+1+parseInt(index)}}</td>
					<td class="center col s1">{{user.id}}</td>
					<td class="center static col s4"> <change-input :obj="user" keyObj="username" @changeApply="changeUser(user, $event, 'username')"></change-input></td>
					<td class="center col s3"> <change-input :obj="user" keyObj="password" @changeApply="changeUser(user, $event, 'password')" class="center"></change-input> </td>
					<td class="center col s1"> 
						<div class="switch">
					    	<label>
					      		<input type="checkbox" :disabled="user.id==currentUser.id || user.id==999" :checked="user.role" @click="changeUser(user, $event, 'role_id')">
					      		<span class="lever"></span>
					    	</label>
					    </div>
  					</td>
					<td class="center col s1"> <a class="btn-floating btn-small waves-effect waves-green grey lighten-3 tooltipped" @click="goToUserHistory(user.id)" data-tooltip="История пользователя" data-position="left" ><i class="material-icons green-text text-darken-4">more</i></a> </td>
					<td class="center col s1"> <a v-show="user.id!=currentUser.id & user.id!=999" class="btn-floating btn btn-small waves-effect waves-red grey lighten-3 tooltipped" @click="openModalDelete(user)" data-tooltip="Удалить пользователя" data-position="left"><i class="material-icons red-text text-darken-4">delete_forever</i></a> </td>
				</tr>
			</table>
		</div>
		<!--div v-else>
			<table class="bordered notAdmin">
				<tr class="row">
					<th class="center col s2">№</th>
					<th class="center col s2">ID</th>
					<th class="center col s8">Имя</th>
				</tr>
				<tr v-for="(user, index) in view" class="row">
					<td class="center col s2" >{{currentPage+1+parseInt(index)}}</td>
					<td class="center col s2">{{user.id}}</td>
					<td class="center static col s8">{{user.username}}</td>
				</tr>
			</table>
		</div-->
		<pagination @currentPageChange="currentPageChange" :list="users" :maxRows="10"></pagination>


		<div class="modal modalAdd">
		    <div class="modal-content">
		    	<a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
		        <h4 class="center">Добавить пользователя</h4>
		        <div class="form">
			        <div class="input-field">
			            <input type="text" v-model="modal.id" oninput="this.value = this.value.replace(/\D/g, '')"></input>
			            <label class="active">ID</label>
			        </div>
			        <div class="input-field">
			            <input type="text" v-model="modal.username"></input>
			            <label class="active">Имя</label>
			        </div>
			        <div class="input-field">
			            <input type="password" v-model="modal.password"></input>
			            <label class="active">Пароль</label>
			        </div>
		        </div>
		    </div>
		    <div class="modal-footer">
		        <a class="btn-floating btn-large waves-effect waves-light green darken-4 right tooltipped"  data-position="left" data-tooltip="Применить" @click="addUser"><i class="material-icons">done</i></a>
		    </div>
		</div>
		

		<div class="modal modalDelete">
		    <div class="modal-content">
		    	<a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
		        <h4 class="center">Вы действительно хотите удалить пользователя {{modal.username}}?</h4>
		    </div>
		    <a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
		    <div class="modal-footer">
		        <a class="modal-action modal-close btn-floating btn-large waves-effect waves-light red darken-4 left tooltipped"  data-position="right" data-tooltip="Удалить" @click="deleteUser"><i class="material-icons">delete_forever</i></a>
		    </div>
		</div>


	</div>
</template>

<script>
	import pagination from './../../pagination.vue'
	import changeInput from './../changeInput.vue'
	import Vue from 'vue'

	export default {
		
	    data(){return{
	    		users:[],
	    		currentPage:0,
	    		view:[],
	    		modal:{
	    			id:'',
	    			username:'',
	    			password:''
	    		}
		    }
		},

		computed:{
			currentUser(){return this.$store.state.user}
		},

		mounted(){
			$('.modalAdd').modal({
       			startingTop: '0%', // Starting top style attribute
      			endingTop: '15%', // Ending top style attribute
    		});

    		$('.modalDelete').modal({
       			startingTop: '100%', // Starting top style attribute
      			endingTop: '25%', // Ending top style attribute
    		});
		},

		methods:{
			currentPageChange:function(obj){
				this.currentPage=obj.page;
				this.view=obj.view
			},
			goToUserHistory:function(id) {
				$('.tooltipped').tooltip('remove');
        		this.$router.push("/history/user/"+id);
      		},

      		openModalAdd:function(){
      			$('.modalAdd').modal('open');
      		},

      		addUser:function(){
      			if (!this.modal.id | !this.modal.password) {
      				this.$store.state.modal.error='Введите ID и Пароль';
					$('.modalError').modal('open');
      			} else {
      				this.$store.dispatch('getServer', 'database.createUser&id='+this.modal.id+'&username='+this.modal.username+'&password='+this.modal.password).
      				then((response)=>{
      					if (response==="OK") {
							this.$store.state.modal.success='Пользователь успешно добавлен';
							$('.modalSuccess').modal('open');
							$('.modalAdd').modal('close');
							this.users.push(Object.assign({},this.modal));
							this.modal.id=this.modal.password=this.modal.username='';
						} //else if (response.message) {
						//	this.$store.state.modal.error=response.message;
						//	$('.modalError').modal('open');
						//};
					});
      			}
      		},

			changeUser:function(user,edit,key){
				//let request='database.updateUser&id='+user.id+'&'+key+'=';
				/*if (key==='role_id') {
					let event=edit;
					console.log(event.target.checked);
				} else {
				}*/
				let request='database.updateUser&id='+user.id+'&'+key+'='+((key==='role_id')?(edit.target.checked)?1:0:edit);
				this.$store.dispatch('getServer', request).
				then((response)=>{
					if (response==="OK") {
						this.$store.state.modal.success='Данные успешно измененны';
						user[key]=edit;
						$('.modalSuccess').modal('open');
					} 
					if (user.id==this.$store.state.user.id) {
						this.$store.commit('userInfo', user)
					}

				})
			},

			openModalDelete:function(user){
				this.modal=user;
				$('.modalDelete').modal('open');
			},

			deleteUser:function(){
				this.$store.dispatch('getServer', 'database.deleteUser&id='+this.modal.id).
  				then((response)=>{
  					if (response==="OK") {
						this.$store.state.modal.success='Пользователь успешно '+this.modal.username+' удален';
						$('.modalSuccess').modal('open');
						for (var i = 0; i < this.users.length; i++) {
							if (this.users[i].id===this.modal.id) {
								this.users.splice(i,1);
								return;
							} 
						}
						this.modal.id=this.modal.password=this.modal.username='';
					} else if (response.message) {
						this.$store.state.modal.error=response.message;
						$('.modalError').modal('open');
					};
				});
			}
		},
	    components:{
			pagination:pagination,
			changeInput:changeInput
		},
		created:function(user,edit){
			this.$store.dispatch('getServer', 'users.get').
			then((response)=>{
				this.users=response
			}, (err)=>{alert(err)})	
		},

		updated:function(){
			$('.tooltipped').tooltip({delay: 50});
		}

	}
</script>

<style scoped>
	td {
		position: relative;
	}
	td.static{
		width: 10rem;
	}

	.btn-small.add{
		position: absolute;
		margin-left: -1rem ;
	}
	.form {
		width: 50%;
		margin: 0 auto;
	}
	table .row{
		border-bottom:  1px solid black;
		height: 2rem;
		line-height: 2rem;
	}

	.input-field{
		padding-top: 6px;
	}

	.notAdmin{
		cursor: default;
	}

	.switch label input[type=checkbox]:checked + .lever{
		background-color:#1b5e20;
	}
	.switch label input[type=checkbox]:checked + .lever:after {
		background-color:#66bb6a;
	}

	.switch label input[type=checkbox]:checked:disabled + .lever:after{
		background-color:#BDBDBD;
	}
	

</style>