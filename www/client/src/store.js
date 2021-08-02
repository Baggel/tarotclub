import { reactive, readonly } from 'vue'


const state = reactive({
    connection: 0,
    list: [
    ],
    currentServer: null,
    isInitialized: false,

    // User state
    isIngame: true,
    loggedIn: false,

    // User info
    profile: {}
});


const setServers = function(list) {
    state.list = list;
}

const setLoginSuccess = function(profile) {
  state.loggedIn = true;
  state.profile = profile;
}

const setLogout = function() {
  state.loggedIn = false;
  state.profile = {};
}

const setInitialized = function() {
  state.isInitialized = true;
}

export default { 
  state: readonly(state), 
  setServers,
  setLoginSuccess,
  setLogout,
  setInitialized
};


/*
CLEAR_SERVERS: (state) => {
    state.list = [];
},
SET_CURRENT_SERVER: (state, server) => {
    state.currentServer = server;
    state.connection = 1;
},
  
    setMessageAction(newValue) {
      if (this.debug) {
        console.log('setMessageAction triggered with', newValue)
      }
  
      this.state.message = newValue
    },
  
    clearMessageAction() {
      if (this.debug) {
        console.log('clearMessageAction triggered')
      }
  
      this.state.message = ''
    }
  }
  

const state = {
    
}

const mutations = {
    SET_INITIALIZED: (state, status) => {
        state.isinitialized = status;
    }
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user: UserStore, 
        server: ServerStore
    },
    state,
    mutations,
    strict: debug
});
 */
