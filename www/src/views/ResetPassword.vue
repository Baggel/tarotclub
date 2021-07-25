<template>

    <!-- RESET PASSWORD -->

    <v-card width="400px" class="mx-auto" style="text-align:center; margin-top:100px; margin-bottom:50px">
        <v-col cols="12">
            <v-card class="mx-auto" width="360px" elevation="0">
                <h1 style="padding-bottom:10px">Réinitialisation du mot de passe</h1>
                <p>Entrez votre adresse e-mail, vous recevrez message contenant un lien de réinitialisation.</p>
                
                <!-- RESET PASSWORD FORM -->
                <v-card elevation="0" class="mx-auto" width="300px" style="padding-bottom:10px;">
                    <form style="padding-bottom:50px;" @submit="checkForm">
                       <v-text-field
                            name="username"
                            value=""
                            type="text" 
                            label="Adresse e-mail"
                            v-model="username"
                            required
                        ></v-text-field>

                        <v-checkbox
                            v-model="checkbox"
                            label="Je suis un humain"
                        ></v-checkbox>

                        <v-text-field
                            name="email"
                            type="email" 
                            label="email"
                            v-model="email"
                            autocomplete="off"
                            style="display:none !important; visibility:hidden !important;"
                        ></v-text-field>

                        <v-btn class="mr-4" type="submit">Valider</v-btn>
                        <v-btn >Effacer</v-btn>
                    </form>

                    <p style="display:inline;">Pas de compte ? </p><router-link to="/sign-up"><p style="display:inline;">Créer un compte.</p></router-link>
                </v-card>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        username: '',
        email: '',
        checkbox: false
    }),

    methods: {
        checkForm (e) {
            e.preventDefault();
            if (this.checkbox && this.email === '') {
                this.$api.requestResetPassword( { username: this.username }).then( result => {
                    if (result.success) {
                        this.$eventHub.$emit('setAlert', 'Un email vous a été envoyé', 'success', 3000);
                    } else {
                        this.$eventHub.$emit('setAlert', 'Impossible de vous envoyer un email', 'error', 3000);
                    }

                }).catch(error => {
                    console.error(error);
                    this.$eventHub.$emit('setAlert', 'Impossible de vous envoyer un email', 'error', 3000);
                });
            }
        }
    }
}
</script>