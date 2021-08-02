<template>
<v-container fluid>
    <v-row no-gutters>
        <h1 class="title font-weight-regular pb-6">Mes coordonnées</h1>
    </v-row>
    <v-row no-gutters>
        <!-- PROFILE FORM --> 

        <v-form
        ref="form"
        @submit="checkForm">

            <!-- FIRSTNAME --> 

            <v-text-field
                style="width:49%; display:inline-block"
                name="firstname"
                type="firstname"
                v-model="profile.firstname"
                label="Prénom"
                outlined
                required
            ></v-text-field>

            <!-- LASTNAME --> 

            <v-text-field
                style="width:49%; display:inline-block; float:right;"
                name="lastname"
                type="lastname"
                v-model="profile.lastname"
                label="Nom"
                outlined
                required
            ></v-text-field>

            <!-- TEL 1 --> 

            <v-text-field
                name="tel"
                type="tel"
                style="width:49%; display:inline-block; margin-right:2% "
                v-model="profile.tel"
                label="Téléphone"
                outlined
                required
            ></v-text-field>
 
            <v-text-field
                name="email"
                type="email"
                style="width:49%; display:inline-block; margin-right:2% "
                v-model="profile.email"
                label="E-Mail"
                outlined
                required
            ></v-text-field>

            <!-- COMPANY --> 

            <v-text-field
                name="company"
                type="company"
                style="width:49%; display:inline-block;"
                v-model="profile.company"
                label="Société"
                outlined
            ></v-text-field>

            <v-btn
                color="success"
                class="mr-4"
                type="submit"
            >
                Sauvegarder
            </v-btn>

        </v-form>
    </v-row>
</v-container>
</template>

<script>
export default {

    data: () => ({
        profile: {
            firstname: '',
            lastname: '',
            company: '',
            email: '',
            tel: '',
        }
    }),

    methods: {
        initialize() {
            // We need to perfom this transformation to only keep the object and throw out the Vuex reactive system
            // which is linked to the object
            // Now, profile is a raw local object we can modify
            this.profile = JSON.parse(JSON.stringify(this.$store.getters['user/getProfile']));
        },
        checkForm (e) {

            this.$api.setMyProfile(this.profile).then( result => {
                if (result.success) {
                    this.$api.getMyProfile().then((response) => {

                        if (response.success) {
                            this.$store.commit('user/LOGIN_SUCCESS', response.data.profile);
                            this.initialize();
                            this.$eventHub.emit('setAlert', 'Vos informations ont bien été enregistrées', 'success', 3000);
                        }
                    });
                    
                } else {
                    this.$eventHub.emit('setAlert', 'Erreur lors de la sauvegarde de vos paramètres', 'error', 3000);
                }

            }).catch(error => {
                console.error(error);
            });

            e.preventDefault();
        }

    },

    // initialize local data before template is processed
    beforeMount() {
        this.initialize();
    }
}
</script>
