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

  <div id="navbarBasicExample2" class="navbar-menu" v-bind:class="{'is-active': burger }">
    <div class="navbar-start">

<!-- 

<a :href="`/` + item.page" class="w3-bar-item w3-button w3-hide-small" >
          <i :class="item.icon"></i>

-->
      <a class="navbar-item" v-for="item in menuItems" :key="item.title">
        {{ item.text }}
      </a>

    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
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
          { text: 'Accueil', icon: 'mdi mdi-cards-playing-outline', page: 'home', user: true },
          { text: 'Jouer en ligne', icon: 'mdi mdi-cards-playing-outline', page: 'game', user: true },
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

