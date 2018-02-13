<template>
	<div>
		<div class="row content__header">
			<h4 class="nameContent col s12 center"> Администрирование </h4>
		</div>
		<header class="font_tigra whide">
			<div v-if="admin">
				<nav class="navBarAdmin white darken-3 z-depth-0">
					<ul class="tabs">
						<li class="tab col s6"><router-link to="/admin/users"  class="red-text text-darken-4">пользователи</router-link></li>
						<li class="tab col s6"><router-link to="/admin/equipment"  class="red-text text-darken-4">оборудование</router-link></li>
					</ul>
				</nav>
			</div>
		</header>
		<router-view></router-view>		
	</div>
</template>

<script>
export default {
	computed:{
		admin(){
			return this.$store.state.user.role}
	},
	beforeCreate:function(){
		if (!this.$store.state.user.role) this.$router.push("/admin/equipment");
		if (!this.$store.state.user.id) this.$router.push("/");
	}
}
</script>

<style type="text/css">
  	.router-link-active {
    	background-color: rgba(0, 0, 0, 0.1);
    }

</style>