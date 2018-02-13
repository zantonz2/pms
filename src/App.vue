<template>
  <div id="app">

    <header class="font_tigra whide">
      <nav class="navBar red darken-4 z-depth-0">
        <div class="logoBar valign-wrapper">
          <div class="logo"></div>
          <span class="logo__moto valign">"Automation Systems for Mining"</span>
        </div>
        <ul class="" v-show="user.id">
          <li class="right"><a v-on:click="userOut">Выход</a></li>
          <li class="right"><router-link to="/home">Главная</router-link></li>
          <li class="right"><a v-on:click="goToUserHistory" :class="activLinkHistory()">История</a></li>
          <li class="right"><router-link to="/admin/users" :class="activLinkAdmin()">Администрирование</router-link></li>
        </ul>
      </nav>
    </header>

    <div class="row container_hight">
      <aside class="col s3 userPanel" v-if="user.id">
        <div class="z-depth-3 tabsMy">
         
          <h5 class="center userHeader">Пользователь <i class="material-icons prefix">account_circle</i></h5>  
          <div>
          <table>
            <tr>
              <td>Логин</td>
              <td>{{user.name}}</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>{{user.id}}</td>
            </tr>
            <tr>
              <td colspan="2">
              Выполнено {{totalAction}} действий 
              </td>
            </tr>
            <!--tr>
              <td colspan="2">
              Последний вход: {{expireDate | myDate}} 
              </td>
            </tr-->
          </table>
          </div>
        </div>
       

        <find-product></find-product>
      </aside>
      <section class="col s9 content" :class="{s12:!user.id}">
        <router-view/>
      </section>
    </div>
    
    <!-- Modals window -->

    <!-- Modal Error -->
    <div class="modal modalError" >
        <div class="modal-content">
            <h4 class="center">Ошибка</h4>
            <span class="text_error"> {{modal.error}} </span>
            <a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
        </div>
        <!--div class="modal-footer">
            <a class="modal-action modal-close modalError__button btn-floating btn-large waves-effect waves-light red darken-4 pulse" ><i class="material-icons">done</i></a>
         </div-->
    </div>

    <!-- Modal Success -->
    <div class="modal modalSuccess" >
      <div class="modal-content">
          <h5 class="center">{{modal.success}}</h5>
          <a class="modal-action modal-close modalSuccess__button waves-effect waves-light red-text text-darken-4" ><i class="material-icons">close</i></a>
      </div>
    </div>

  </div>
</template>

<script>
  import find from './components/find.vue'

  export default {
    name: 'app',
    data(){
      return{
       // activHistory:'',
      }
    },
    computed:{
      user(){ return this.$store.state.user },
      modal() {return this.$store.state.modal},
      totalAction() {return this.$store.state.user.totalAction},
      expireDate() { return this.$store.state.user.expireDate},
      activLinkHistory() {
        return function(){ 
          return { 'router-link-active': this.$router.currentRoute.path==="/history/user/"+this.user.id}
        }
      },
      activLinkAdmin() {
        return function(){ 
          return { 'router-link-active': /admin/.test(this.$router.currentRoute.path)}
        }
      }

      
    },
    beforeCreate:function(){
      this.$store.commit('accessPage');
    },
    methods:{
      userOut:function() {
        this.$store.commit('userOut');
      },
      goToUserHistory:function() {
        this.$router.push("/history/user/"+this.user.id);
      } 
    },
    components: {
      findProduct:find
    },
    created:function(){
      this.$store.commit('nomenclatureUpdate','model');
      this.$store.commit('nomenclatureUpdate','group');
      this.$store.commit('nomenclatureUpdate','base');
    },
    mounted(){
      //this.activHistory=(this.$router.currentRoute.path==="/history/user/"+this.user.id)?'router-link-active':'';
      $('.modalError').modal();
      $('.modalError').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            startingTop: '100%', // Starting top style attribute
              endingTop: '30%', // Ending top style attribute
          });
      $('.modalSuccess').modal();
      $('.modalSuccess').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
              startingTop: '0%', // Starting top style attribute
              endingTop: '30%', // Ending top style attribute
          });
    },
  }
</script>

<style type="text/css">

table .select-wrapper input.select-dropdown{
  text-overflow: ellipsis;
}
  .router-link-active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .tabsMy{
    border-radius: 0 2rem 2rem 0;
    margin-bottom: 0
  }

  .userHeader{
    padding-top: 1rem;
  }

  .modalSuccess__button{
    position:absolute;
    top:0;
    right: 0;

  }

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

  input[type=text].datepicker{
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
</style>