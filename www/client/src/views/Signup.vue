<template>
<div class="container " style="max-width: 400px;">
    <div class="card p-4">
    <h1 class="title has-text-centered">Créer un compte</h1>

    <form ref="signupForm">

        <div class="field">
            <div class="control">
                <input class="input is-medium" type="text" v-bind:class="{'is-danger': isUsernameError }" v-model="username" :placeholder="$t('message.username')">
            </div>
            <p class="help is-danger">{{usernameError}}</p>
        </div>

        <div class="field">
            <div class="control">
                <input class="input is-medium" type="email" v-bind:class="{'is-danger': isEmailError }" v-model="email" :placeholder="$t('message.email')">
            </div>
            <p class="help is-danger">{{emailError}}</p>
        </div>

        <PassField ref="passField"></PassField>

        <div class="field">
            <div class="control">
                <input type="text" v-model="potmiel" autocomplete="off" style="display:none !important; visibility:hidden !important;">
            </div>
        </div>

        <button class="button is-block is-primary is-fullwidth is-medium" @click.prevent="validate">{{$t('message.submit')}}</button>
        <br />
        <router-link :to="{name: 'signin'}"><p>Revenir à l'identification.</p></router-link>
        </form>
    </div>
</div>
</template>

<script>

function emailIsValid (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

import { nextTick } from 'vue'

export default {
    
    data: () => ({       
        email: '',
        emailError: '',
        username: '',
        usernameError: '',
        potmiel: '',
    }),
    computed: {
        isEmailError() {
            let err = !emailIsValid(this.email);
            this.emailError = err ? this.$t('message.emailError') : '';
            return err;
        },
        isUsernameError() {
            let err = !/^[a-zA-Z0-9_]{4,40}$/.test(this.username);
            this.usernameError = err ? this.$t('message.usernameError') : '';
            return err;
        },
        isValid() {
            if (this.$refs.passField.isPasswordError || this.isEmailError) {
                return false;
            } else {
                return true;
            }
        }
    },
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
            this.$eventHub.emit('setAlert', 'Vous êtes déjà connecté!', 'error', 3000);
            this.$router.push({ name: 'home' });
        },

        reset() {
            this.$refs.signupForm.reset();
        },
        validate (e) {
            if (this.isValid) {
                this.$api.signup( {password: this.$refs.passField.password, username: this.username, email: this.email, potmiel: this.potmiel }).then( result => {
                    if (result.success) {
                        this.$eventHub.emit('setAlert', 'Compte créé, en attente de validation', 'success', 3000);
                    } else {
                        this.$eventHub.emit('setAlert', 'Erreur lors de la création du compte: ' + result.message, 'error', 3000);
                    }

                    nextTick(() => {
                        this.reset();
                    });

                }).catch(error => {
                    console.error(error);
                });
            } else {
                this.$eventHub.emit('setAlert', this.$t('message.badForm'), 'error', 3000);
            }
        }
    }
}
</script>