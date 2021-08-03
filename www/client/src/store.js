import { reactive, readonly } from 'vue'


const state = reactive({
    connection: 0,
    list: [
    ],
    currentServer: null,
    isInitialized: false,

    // User state
    isIngame: false,
    loggedIn: false,

    // User info
    profile: {}
});

// =====================================================================================
// SERVERS
// =====================================================================================
const setServers = function(list) {
    state.list = list;
}

const setCurrentServer = function(server) {
  state.currentServer = server;
  state.connection = 1;
}

// =====================================================================================
// USER
// =====================================================================================
const setLoginSuccess = function(profile) {
  state.loggedIn = true;
  state.profile = profile;
}

const setLogout = function() {
  state.loggedIn = false;
  state.profile = {};
}

// =====================================================================================
// APP
// =====================================================================================
const setInitialized = function() {
  state.isInitialized = true;
}

export default { 
  state: readonly(state), 
  setServers,
  setCurrentServer,
  setLoginSuccess,
  setLogout,
  setInitialized
};
