
export default {
    namespaced: true,
    state: { 
        loggedIn: false,
        profile: {}
    },
    mutations: {
        LOGIN_SUCCESS(state, profile) {
            state.loggedIn = true;
            state.profile = profile;
        },
        LOGIN_FAILURE(state) {
            state.loggedIn =  false;
            state.profile.level = -1;
        },
        LOGOUT(state) {
            state.loggedIn = false;
            state.profile.level = -1;
        }
    },
    //====================================================================================================================
    getters: {
        getProfile: state => {
            return state.profile;
        },

        isLogged: state => {
            return state.loggedIn;
        },

        isAdmin: state => {
            let admin = false;

            if (state.profile !== undefined) {
                admin = state.profile.level >= 100 ? true : false;
            }
            return admin;
        },

        isMaintenance: state => {
            let maintenance = false;

            if (state.profile !== undefined) {
                maintenance = state.profile.level == 2 ? true : false;
            }
            return maintenance;
        },

        getFullName: state => {

            if (state.profile !== undefined) {
                return state.profile.firstname + ' ' + state.profile.lastname;
            } else  {
                return '';
            }
        }
    }
}
