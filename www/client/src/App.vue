<template>
<div style="height:100vh; width=100vw;">

<section class="section">
<nav class="navbar is-fixed-top is-link" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://www.tarotclub.fr">
      <img src="./assets/logo.png" width="30" height="50">
    </a>

    <a role="button" @click="burger = !burger" v-bind:class="{'is-active': burger }" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="mainNavbar" class="navbar-menu" v-bind:class="{'is-active': burger }">
    <div class="navbar-start">

      <router-link class="navbar-item is-expanded" v-for="item in menuItems" :key="item.title" :to="{name: item.page}">
        <span class="icon-text">
          <span class="icon ">
            <i :class="'mdi mdi-24px ' + item.icon "></i>
          </span>
          <span>{{ item.text }}</span>
        </span>
      </router-link>

    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">

          <router-link class="button is-primary" :to="{name: 'signup'}">
              <strong>Sign up</strong>
          </router-link>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
</section>

<router-view></router-view>

</div>
</template>


<script>

// Import the toast function
import Toast from './toast.js';

export default {
  name: 'App',
  components: {
 
  },
  data () {
      return {
        burger: false,
        alertType: 'error', // success, info, warning or error
        alertText: '',
        alertEnable: false,
        alertTimeout: 3000,
        drawer: null,
        menuItems: [
          { text: 'Accueil', icon: 'mdi mdi-home', page: 'home', user: true },
          // { text: 'Jouer en ligne', icon: 'mdi mdi-cards-playing-outline', page: 'game', user: true },
          { text: 'Documentation', icon: 'mdi mdi-file-document', page: 'docs', user: true },
        ],
        evtSource: null
      }
    },
  computed: {
    isLogged() {
      return this.$store.getters["user/isLogged"];
    },
    isInitialized() {
      // Or whatever criteria you decide on to represent that the
      // app state has finished loading.
      return this.$store.state.isinitialized;
    },
  },

  methods: {
    logOut() {
      // this.$store.commit("user/LOGOUT");
      this.$api.destroyToken();
      this.$router.push({ name: "signin" });
    }
  },
    //====================================================================================================================
  beforeCreate: function() {
    this.$api.loadToken();
    this.$api.getMyProfile().then((response) => {

        if (response.success) {
          // this.$store.commit('user/LOGIN_SUCCESS', response.data.profile);
        } else {
          console.log("Not logged in.");
          // this.$store.commit('user/LOGIN_FAILURE');
          // this.$store.commit('SET_INITIALIZED', true);
        }
    }).catch((error) => {
      console.log(error);
      console.log("Not logged in.");
      // this.$store.commit('user/LOGIN_FAILURE');
      // this.$store.commit('SET_INITIALIZED', true);
    });
  },
  //====================================================================================================================
  created() {
     this.$eventHub.on('setAlert', (text, type, timeout) => {
        this.alertText = text;
        this.alertType = type;
        this.alertTimeout = timeout;
        this.alertEnable = true;

      console.log('TYPE ' + typeof(timeout))
      Toast({
          text: text,
          duration: timeout,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          style: {
            background: type == 'error' ? 'hsl(348, 86%, 61%)' : type == 'success' ? 'hsl(153, 53%, 53%)' : 'hsl(229, 53%, 53%)'
          },
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
      });

  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.off('setAlert');
  },
  //====================================================================================================================
  mounted() {
    this.evtSource = new EventSource(this.$api.getRESTApiUri() + '/servers/events');

    this.evtSource.onerror = function(err) {
      console.error("[SSE] failure (probaby closed):", err);// fixme: supprimer ?
    }

    this.evtSource.addEventListener('servers', (event) => {
      // this.$store.commit('server/SET_SERVERS', JSON.parse(event.data));
    });

    this.evtSource.onopen = function() {
      console.log("EventSource open");
    }

  }
  
};
</script>

