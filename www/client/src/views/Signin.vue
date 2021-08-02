<template>
    <!-- SIGN IN -->

<div class="container " style="max-width: 400px;">
    <div class="card p-4">
    <h1 class="title has-text-centered">Identification</h1>

    <form ref="loginForm">

        <div class="field">
            <div class="control">
                <input class="input is-medium" type="text" autocomplete="on"  v-model="login" :placeholder="$t('message.userOrMail')">
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input class="input is-medium" type="password" autocomplete="on" v-model="password" :placeholder="$t('message.password')">
            </div>
        </div>

        <button class="button is-block is-primary is-fullwidth is-medium" @click="validate">{{$t('message.submit')}}</button>
        <button class="button is-block is-fullwidth is-medium" @click="reset">Effacer</button>
        <br />
        <p style="display:inline;">Mot de passe oublié ? </p><router-link to="/resetpass"><p style="display:inline;">Réinitialisation.</p></router-link>
        <br />
        <p style="display:inline;">Pas de compte ? </p><router-link :to="{ name: 'signup'}"><p style="display:inline;">Créer un compte.</p></router-link>

        </form>
    </div>
</div>
</template>

<script>


export default {
    data: () => ({
        login: '',
        password: ''
    }),
    created() {
        if (this.$store.state.loggedIn) {
          this.returnToHome();
        }
    },
    beforeRouteUpdate (to, from, next) {

        if (this.$store.state.loggedIn) {
          this.returnToHome();
        } else {
            next();
        }
    },

    methods: {
        returnToHome() {
            this.$router.push({ name: 'home' });
        },
        reset () {
            this.password = '';
            this.login = '';
            this.$refs.loginForm.reset();
        },
        validate (e) {
            this.$api.signin( {login: this.login, password: this.password }).then( result => {
                if (result.success) {
                    this.$api.setToken(result.data.token);
                    this.$store.setLoginSuccess(result.data.profile);
                    this.$router.push({ name: 'home' });
                } else {
                    if (result.reason === 'deleted') {
                        this.$eventHub.emit('setAlert', "Compte supprimé", 'error', 3000);
                    } else {
                        this.$eventHub.emit('setAlert', "Erreur de login ou de mot de passe", 'error', 3000);
                    }
                }

            }).catch(error => {
                console.error(error);
            });

            e.preventDefault();
        }
    }
}
</script>
