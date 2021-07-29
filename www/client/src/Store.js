import { reactive, readonly } from 'vue'


const state = reactive({
        connection: 0,
        list: [
        ],
        currentServer: null,
        isinitialized: false,
        isIngame: true,
});


const setServers = function(list) {
    state.list = list;
}

export default { state: readonly(state), setServers };


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
