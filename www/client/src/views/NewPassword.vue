<template>

    <!-- NEW PASSWORD -->

    <v-card width="400px" class="mx-auto" style="text-align:center; margin-top:100px; margin-bottom:50px">
        <v-col cols="12">

            <v-card class="mx-auto" width="360px" elevation="0">

                <h1 style="padding-bottom:10px">Réinitialiser son mot de passe</h1>
                <p>Entrez votre nouveau mot de passe</p>

                <!-- NEW PASSWORD FORM -->

                <v-card elevation="0" class="mx-auto" width="300px">
                    <form ref="signupForm" style="padding-bottom:30px;" @submit="checkForm">
      
                        <v-text-field
                            name="password"
                            type="password" 
                            label="Password"
                            v-model="password"
                            required
                        ></v-text-field>

                        <v-checkbox
                            v-model="checkbox"
                            label="Je suis un humain"
                            style="padding-bottom:20px;"
                        ></v-checkbox>

                        <v-text-field
                            name="email"
                            type="email" 
                            label="email"
                            v-model="email"
                            autocomplete="off"
                            style="display:none !important; visibility:hidden !important;"
                        ></v-text-field>

                        <v-btn type="submit" class="mr-4">Valider</v-btn>
                        <v-btn @click="reset">Effacer</v-btn>
                    </form>
                    
                    <router-link to="/"><p style="display:inline;">Revenir à l'identification.</p></router-link>
                    
                </v-card>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>

export default {
    
    data: () => ({
        password: '',
        token: '',
        email: '',
        checkbox: false
    }),
    created() {
        this.token = this.$route.params.token;
    },
    beforeRouteUpdate (to) { //, from, next) {
        this.token = to.params.token;
    },
    methods: {


        reset() {
            this.password = '';
            this.username = '';
            this.$refs.signupForm.reset();
        },
        checkForm (e) {
            e.preventDefault();

            if (this.checkbox && this.email === '') {
                this.$api.setNewPassword( {password: this.password, token: this.token, honeypot: this.email, human: this.checkbox }).then( result => {
                    if (result.success) {
                        this.$eventHub.$emit('setAlert', 'Votre mot de passe a été modifié avec succès', 'success', 3000);
                    } else {
                        this.$eventHub.$emit('setAlert', 'Impossible de modifier votre mot de passe', 'error', 3000);
                    }

                    this.reset();

                }).catch(error => {
                    console.error(error);
                });
            }

            
        }
    }
}
</script>