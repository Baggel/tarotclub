<template>

    <!-- SIGN UP -->

    <v-card width="400px" class="mx-auto" style="text-align:center; margin-top:100px; margin-bottom:50px">
        <v-col cols="12">

            <v-card class="mx-auto" width="360px" elevation="0">

                <h1 style="padding-bottom:10px">Créer un compte</h1>

                <!-- SIGN UP FORM -->

                <v-card elevation="0" class="mx-auto" width="300px">
                    <v-form ref="signupForm" style="padding-bottom:30px;" v-model="valid">
      
                        <v-text-field
                            name="username"
                            value=""
                            type="text" 
                            label="User name"
                            :rules="nameRules"
                            v-model="username"
                            required
                        ></v-text-field>

                        <v-text-field
                            name="password"
                            type="password" 
                            label="Password"
                            v-model="password"
                            required
                        ></v-text-field>

                        <v-text-field
                            name="email"
                            type="email" 
                            label="email"
                            :rules="emailRules"
                            v-model="email"
                            required
                            style="padding-bottom:20px;"
                        ></v-text-field>

                        <v-text-field
                            name="potmiel"
                            type="text" 
                            label="potmiel"
                            v-model="potmiel"
                            autocomplete="off"
                            style="display:none !important; visibility:hidden !important;"
                        ></v-text-field>

                        <v-btn type="submit" class="mr-4" :disabled="!valid"  @click="validate">Valider</v-btn>
                        <v-btn @click="reset">Effacer</v-btn>
                    </v-form>
                    
                    <router-link :to="{name: 'signin'}"><p style="display:inline;">Revenir à l'identification.</p></router-link>
                    
                </v-card>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>
import { nextTick } from 'vue'

export default {
    
    data: () => ({
        valid: false,
        password: '',
        username: '',
        email: '',
        potmiel: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => v == undefined || v.length <= 20 || 'Name must be less than 20 characters',
        ],
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
    }),
    created() {
        if (this.$store.state.user.loggedIn) {
          this.returnToHome();
        }
    },
    beforeRouteUpdate (to, from, next) {

        if (this.$store.state.user.loggedIn) {
          this.returnToHome();
        } else {
            next();
        }
    },
    methods: {

        returnToHome() {
            this.$eventHub.$emit('setAlert', 'Vous êtes déjà connecté!', 'error', 3000);
            this.$router.push({ name: 'home' });
        },

        reset() {
            this.$refs.signupForm.reset();
        },
        validate (e) {
            this.$api.signup( {password: this.password, username: this.username, email: this.email, potmiel: this.potmiel }).then( result => {
                if (result.success) {
                    this.$eventHub.$emit('setAlert', 'Compte créé, en attente de validation', 'success', 3000);
                } else {
                    this.$eventHub.$emit('setAlert', 'Erreur lors de la création du compte: ' + result.message, 'error', 3000);
                }

                nextTick(() => {
                    this.reset();
                });

            }).catch(error => {
                console.error(error);
            });

            e.preventDefault();
        }
    }
}
</script>