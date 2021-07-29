<template>
<v-container fluid>

<v-card>

   

<v-card-text>
    <v-row
        align="center"
        class="mx-0"
      >
      <v-card-title>Gestion des utilisateurs</v-card-title>

      <v-text-field style="padding: 10px;"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-row>  
    
 </v-card-text>
<v-divider class="mx-4"></v-divider>


    
<v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="company"
    class="elevation-1"
    dense
  >
    <template v-slot:top>
      <v-toolbar flat>
       
        <v-dialog v-model="dialog" max-width="500px">
          <!-- <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Ajouter un utilisateur</v-btn>
          </template> -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.firstname" label="Prénom"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.lastname" label="Nom"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.company" label="Société"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" label="E-mail"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.tel" label="Téléphone"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.level"
                      :items="levelItems"
                      item-text="text"
                      item-value="value"
                      label="Niveau d'accès"
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

         <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <template v-slot:item.level="{ item }">
      {{getLevelName(item.level)}}
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Refresh</v-btn>
    </template>
  </v-data-table>

    
  </v-card>


</v-container>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      search: '',
      levelItems: [
        { text: 'Nouveau compte', value: 0 },
        { text: 'Exploitant', value: 1 },
        { text: 'Maintenance', value: 2 },
        { text: 'Administrateur', value: 100 }
      ],
      headers: [
        { text: 'Société', value: 'company' },
        { text: 'Nom', value: 'lastname' },
        { text: 'Prénom', value: 'firstname' },
        { text: 'Identifiant', value: 'username' },
        { text: 'E-mail', value: 'email' },
        { text: 'Téléphone', value: 'tel' },
        { text: 'Niveau', value: 'level' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        company: '',
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        tel: '',
        level: 0
      },
      defaultItem: {
        company: '',
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        tel: '',
        level: 0
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouvel utilisateur' : "Édition d'un utilisateur"
      },
      isAdmin() {
        return this.$store.getters['user/isAdmin'];
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize();
    },

    methods: {

      initialize() {
        this.$api.getUsers().then((response) => {

          if (response.success) {
            this.users = response.data.users;

          } else {
            console.log(response.message);
          }
        });
      },

      getLevelName (level) {
        let levelText = 'Inconnu (' + parseInt(level) + ')';
        for (let i = 0; i < this.levelItems.length; i++) {
            if (this.levelItems[i].value == level) {
                levelText = this.levelItems[i].text
            }
        }

        return levelText;
      },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
    
        if (confirm("Voulez-vous vraiment supprimer l'utilisateur : " + item.username + " ?")) {

            this.$api.deleteUser( {username: item.username }).then((response) => {

              if (response.success) {
                this.$eventHub.$emit('setAlert', 'Utilisateur supprimé avec succès', 'success', 3000);
                this.initialize();
              } else {
                this.$eventHub.$emit('setAlert', 'Impossible de supprimer cet utilisateur', 'error', 3000);
              }
            });
        } 

      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          this.$api.setUserProfile(this.editedItem).then((response) => {
              if (response.success) {
                this.$eventHub.$emit('setAlert', 'Utilisateur édité avec succès', 'success', 3000);
                this.initialize();
                this.close();
              } else {
                this.$eventHub.$emit('setAlert', 'Impossible de modifier cet utilisateur, vérifez les champs', 'error', 3000);
              }
          });
          //Object.assign(this.users[this.editedIndex], this.editedItem)
        }
        // Code pour l'ajout, pas utilisé ici
        // } else {
        //   this.users.push(this.editedItem)
        // }
        
      },
    },
  }
</script>
