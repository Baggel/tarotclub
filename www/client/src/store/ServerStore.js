

export default {
    namespaced: true,
    state: {
        connection: 0,
        list: [
        ],
        currentServer: null
    },
    mutations: {
        SET_SERVERS: (state, list) => {
            state.list = list;
        },
        CLEAR_SERVERS: (state) => {
            state.list = [];
        },
        SET_CURRENT_SERVER: (state, server) => {
            state.currentServer = server;
            state.connection = 1;
        },
    }
}
