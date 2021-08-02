
<template>
<div>

   <v-card v-show="connection == 0">
    <v-card-title>
      Liste des serveurs
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="servers.length == 0"
      :headers="headers"
      :items="servers"
      :search="search"
    >
    
    <template v-slot:[`item.join`]="{ item }">
      <v-icon v-if="isLogged" medium class="mr-2" @click="joinServer(item)" >mdi-play-network</v-icon>
      <pre v-else>Non connecté!</pre>
    </template>
    
    </v-data-table>
  </v-card>

  <v-card v-show="connection == 1">
    <v-card-title>
      Connexion au serveur ...
      <v-spacer></v-spacer>
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-card-title>
  </v-card>

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
        return this.$store.state.server.list;
      },
      connection() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.server.connection;
      },
      isLogged() {
        return this.$store.getters["user/isLogged"];
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
