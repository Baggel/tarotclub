<template>
<div style="height:100vh; width=100vw;">

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
        <div class="buttons" v-if="isLogged">

              <router-link class="button" :to="{name: 'dashboard'}">
                  <span class="icon">
                    <i class="mdi mdi-account-circle mdi-24px"></i>
                  </span>
              </router-link>     

              <button class="button" @click="logOut">
                <span class="icon">
                  <i class="mdi mdi-logout mdi-24px"></i>
                </span>
              </button>

        </div>


        <div class="buttons" v-else>

          <router-link class="button is-primary" :to="{name: 'signup'}">
              <strong>{{$t("message.signup")}}</strong>
          </router-link>

           <router-link class="button is-light" :to="{name: 'signin'}">
              <strong>{{$t("message.signin")}}</strong>
          </router-link>

        </div>
      </div>
    </div>
  </div>
</nav>
<div style="padding-top:3.5em;">
<router-view></router-view>
</div>
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
        menuItems: [
          { text: this.$t('message.home'), icon: 'mdi mdi-home', page: 'home', user: true },
          { text: this.$t('message.playOnline'), icon: 'mdi mdi-cards-playing-outline', page: 'game', user: true },
          { text: this.$t('message.docs'), icon: 'mdi mdi-file-document', page: 'docs', user: true },
        ],
        evtSource: null
      }
    },
  computed: {
    isLogged() {
      return this.$store.state.loggedIn;
    },
    isInitialized() {
      // Or whatever criteria you decide on to represent that the
      // app state has finished loading.
      return this.$store.state.isInitialized;
    },
  },

  methods: {
    logOut() {
      console.log('[APP] Logout')
      this.$store.setLogout();
      this.$api.destroyToken();
      this.$router.push({ name: "home" });
    }
  },
    //====================================================================================================================
  beforeCreate: function() {
    this.$api.loadToken();
    this.$api.getMyProfile().then((response) => {

        if (response.success) {
            this.$store.setLoginSuccess(response.data.profile);
        } else {
          console.log("Not logged in.");
          this.$store.setLogout();
        }
        this.$store.setInitialized(true);
    }).catch((error) => {
      console.log("Error getting profile: " + error);
      this.$store.setLogout();
      this.$store.setInitialized(true);
    });
  },
  //====================================================================================================================
  created() {
     this.$eventHub.on('setAlert', (text, type, timeout) => {
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
        this.$store.setServers(JSON.parse(event.data));
    });

    this.evtSource.onopen = function() {
      console.log("EventSource open");
    }

  }
  
};
</script>

