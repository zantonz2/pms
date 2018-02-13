import Vue from 'vue'
import Vuex from 'vuex'
import route from './../router'
import axios from 'axios'


//const server="http://192.168.55.135:8015/?method=";
//const server="http://localhost:8016/?method=";
const server="http://192.168.55.60:8016/?method=";



Vue.use(Vuex);

export default new Vuex.Store({    
    state: {
    	user:{
    		name:localStorage.getItem('_userName'),
    		id:localStorage.getItem('_userId'),
        password:localStorage.getItem('_userPassword'),
    		history:'false',
        totalAction:undefined,
        token:localStorage.getItem('_token'),
        expireDate:'', //срок храннения токена
        role:+localStorage.getItem('_role'),
    	},

      home:{
        products:[]
      },

      filter:{
        status:{},
        date:{
          start:new Date(new Date().setMonth(new Date().getMonth()-12)).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}),
          end:new Date(Date.now()).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})
        },
        dateProduct:{
          start:new Date(new Date().setMonth(new Date().getMonth()-3)).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}),
          end:new Date(Date.now()).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})
        },
        model:{},
        group:{},
        base:{},

      },
      
      nomenclature:{
        model:[],
        group:[],
        base:[]
      },

      modal:{
        error:'error message',
        success:'succcess message'
      }
    },
   	mutations: {

      home(state,products){
        state.home.products=products;
      },
        
      accessPage(state){
      	if (state.user.id===0) route.push("/autorization") 
      },

      logon(state,response){
        localStorage.setItem('_token',response.token);
        localStorage.setItem('_userId',response.userId);
        state.user.token=response.token;
        state.user.expireDate=response.expireDate;
        state.user.id=response.userId;
      },

      userInfo(state,user){
       state.user.name=user.username;
       state.user.password=user.password;
       state.user.role=user.role;
       localStorage.setItem('_userPassword',user.password);
       localStorage.setItem('_userName',user.username);
       localStorage.setItem('_role',user.role);
  	   //route.push("/history/user/"+user.id)
  		},

  		userOut(state){
        //console.log('USER OUT');
  			state.user.id=null;
        state.user.name=null;
        state.user.role=0;
        state.user.history='false';
        localStorage.clear();
  			route.push("/autorization")
  		},

      userHistory(state, history){
        if (history==undefined) return;
        if (state.user.history==='false')  state.user.totalAction=history.length; 
        state.user.history=history;
        var select={}, label=false;
        for (var i = 0; i < history.length; i++) {
          label=true;
          for (var j = 0; j < select.length; j++) {
            if (select[j]===history[i].status) {label=false; break;}
          }
          if (label) select[history[i].status]=true;
          if (select.length===4) break;
        }
        state.filter.status=select;
      },

      filter(state, filter){
        Object.assign(state.filter,filter);
      },

      nomenclatureUpdate(state, key){
        axios.get(server+key+'s.get'+'&token='+state.user.token).
        then(function(response){
          Vue.set(state.nomenclature,key,response.data);
        })
      }
    },
    actions:{
  		getServer(context, request){
        //console.log(server+request+'&token='+context.state.user.token);
  			return axios.get(server+request+'&token='+context.state.user.token)
  			.then(function(response){
  				//console.log(response.data); 
          if (response.data.message) {
            if (response.data.message==="Invalid token") {
              context.commit('userOut');
              throw new Error('Исетк срок действия Tokenа'); 
            };
            throw new Error(response.data.message);
          } else if ($.isEmptyObject(response.data)) {
            //throw new Error('Пустой ответ, не хорошо') //обработка в productHistoryAll.checkProduct
          }
          return response.data
  			}, function(){ throw Error('Нет ответа от сервера, запрос:'+server+request+'&token='+context.state.user.token)})
        .catch( error => {
          context.state.modal.error=error.message;
          console.log(error.message);
          $('.modalError').modal('open');
        })
  		},

    }  
})