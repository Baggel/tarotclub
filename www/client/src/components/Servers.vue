
<template>
<div class="table-container pt-4">
      <table class="table">
          <thead>
            <tr>
              <th v-for="(h,i) in headers" :key="i">{{h.text}}</th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="(s, i) in servers" :key="i">
                <th>{{s.name}}</th>
                <th>{{s.nb_players}}</th>
                <th>{{s.nb_tables}}</th>
                <th>{{s.region}}</th>
                <th>{{s.server_type}}</th>
                <th>{{s.privacy}}</th>
                <th>
                    <button v-if="isLogged" @click="joinServer(s)">
                      <span class="icon">
                        <i class="mdi mdi-play-network"></i>
                      </span>
                      <span>GitHub</span>
                    </button>
                    <pre v-else>Non connecté!</pre>
                </th>
              </tr>
          </tbody>
      </table>
</div>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
          { text: 'Server name', value: 'name' },
          { text: 'Number of players', value: 'nb_players' },
          { text: 'Number of tables', value: 'nb_tables' },
          { text: 'Region', value: 'region' },
          { text: 'Server type', value: 'server_type' },
          { text: 'Privacy', value: 'privacy' },
          { text: 'Rejoindre', value: 'join', sortable: false }
        ]
      }
    },
    //====================================================================================================================
    computed: {
      servers() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.list;
      },
      connection() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.connection;
      },
      isLogged() {
        return this.$store.state.loggedIn;
      },
    },
    //====================================================================================================================
    methods: {
      joinServer(server) {
        console.log("[SERVERS] Connect to server: ");
        this.$store.commit('server/SET_CURRENT_SERVER', server);
        this.$api.joinServer(server).then( (result) => {
            console.log("[SERVERS] Received server credentials: " + JSON.stringify(result));
            this.$tc.setSecurity(result.data.webId, result.data.gek, result.data.passPhrase);
            this.$tc.connectToServer();

        }).catch( (e) => {
            console.error("[SERVERS] Failure to join server");
            this.$eventHub.emit('setAlert', 'Erreur: impossible de joindre le serveur', 'error', 3000);

        });
      },
    },
    //====================================================================================================================
    mounted() {
      /*
      this.$api.getAllServers().then( result => {
          if (result.success) {
            console.log(result.data);
            //  this.servers = result.data;
            this.$store.commit('server/SET_SERVERS', result.data);
          } else {
              this.$eventHub.emit('setAlert', 'Impossible de récupérer la liste des serveurs', 'error', 3000);
          }

      }).catch(error => {
          console.error(error);
      });
      */
    }
  }
</script>
