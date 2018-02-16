<template>
	<div class="col s6 offset-s3 m5 offset-m5">
		<form action="" >
	        <div class="input-field row">
	            <i class="material-icons prefix">account_circle</i>
	            <input type="text" class="validate" name="name" v-model="id" oninput="this.value = this.value.replace(/\D/g, '')"  @keyup.13="send"></input>
	            <label>Введите ID пользователя</label>
	        </div>
	        <div class="input-field row">
	            <i class="material-icons prefix">lock</i>
	            <input type="password" class="validate" name="password" v-model="password" @keyup.13="send"></input>
	            <label>Введите пароль</label>
	        </div>
	        <a type="submit" class="btn-floating btn-large waves-effect waves-light green darken-4 pulse right" v-if="input" v-on:click="send">
	        	<i class="material-icons">done</i>
	        </a>
	    </form>
	</div>
</template>


<script>
	
	export default {
	 	data(){
	     	return{
				id:this.$store.state.user.id,
				password:this.$store.state.user.password
	     	}
	    },
	    computed: {
		    input(){return (this.id && this.password)?true:false},
		},
		methods:{
			send:function(){
				if (!this.input) return;
				this.$store.dispatch('getServer', 'users.authorization&id='+this.id+'&password='+this.password)
				.then((response)=>{
					if (response.token) {
						this.$store.commit('logon',response);
						return response.userId
					} else {
						throw new Error('Авторизация не прошла')
					}
				})
				.then((userId)=>{
					return this.$store.dispatch('getServer', 'users.get&id='+userId)
					.then((response)=>{this.$store.commit('userInfo',response); return userId})
				})
				.then(()=>{
					this.$store.commit('nomenclatureUpdate','model');
      				this.$store.commit('nomenclatureUpdate','group');
      				this.$store.commit('nomenclatureUpdate','base');
				})
				.then(()=>{this.$router.push('/history/user/'+this.$store.state.user.id)})
				.catch(error=>{
					alert(error);
				})			
			}
		},

		created:function(){
			if (this.$store.state.user.id && this.$store.state.user.password && this.$store.state.user.token) {this.send()};
		},

		mounted:function(){
			$(this.$parent.$el).addClass('border');
			$(this.$parent.$el).find('.content').addClass('noBorder');
		},

		beforeDestroy:function(){
			$(this.$parent.$el).removeClass('border');
			$(this.$parent.$el).find('.content').removeClass('noBorder');
		}
	}
</script>


<style scoped>
	form {
		padding-top:40%
	}
</style>