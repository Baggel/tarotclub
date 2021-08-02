<template>
<div class="container " style="max-width: 400px;">
    <div class="card p-4">
    <form>
        <div class="field">
            <div class="control">
                <input class="input is-medium" type="email" v-bind:class="{'is-danger': isEmailError }" v-model="email" :placeholder="$t('message.email')">
            </div>
            <p class="help is-danger">{{emailError}}</p>
        </div>

        <div class="field">
            <div class="control">
                <input class="input is-medium" type="password" autocomplete="on" v-bind:class="{'is-danger': isPasswordError }" v-model="password" :placeholder="$t('message.password')">
            </div>
            <p class="help is-danger">{{passwordError}}</p>
            <progress :class="'progress mt-4 ' +  strengthColor" :value="strength" max="100" style="background-color: orange;">{{strength}}%</progress>
            <p>{{strengthLevel}}</p>
        </div>

        <div class="field">
            <div class="control">
                <input type="text" v-model="potmiel" autocomplete="off" style="display:none !important; visibility:hidden !important;">
            </div>
        </div>

        <button class="button is-block is-primary is-fullwidth is-medium" @click="validate">{{$t('message.submit')}}</button>
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
        password: '',
        passwordError: '',
        email: '',
        emailError: '',
        potmiel: '',
        strength: 0,
    }),
    computed: {
        isPasswordError() {
            let err = this.password == undefined || this.password.length == 0;
            this.passwordError = err ? this.$t('message.passwordError') : '';
            this.computePasswordStrength(this.password);
            return err;
        },
        isEmailError() {
            let err = !emailIsValid(this.email);
            this.emailError = err ? this.$t('message.emailError') : '';
            return err;
        },
        strengthColor() {

            if (this.strength < 50) {
                return 'is-danger';
            } else if ((this.strength >= 50) && (this.strength < 70)) {
                return 'is-warning';
            } else if ((this.strength >= 70) && (this.strength < 100)) {
                return 'is-info';
            } else {
                return 'is-success';
            }            
        },
        strengthLevel() {

            if (this.strength < 50) {
                return this.$t('message.bad');
            } else if ((this.strength >= 50) && (this.strength < 70)) {
                return this.$t('message.average');
            } else if ((this.strength >= 70) && (this.strength < 100)) {
                return this.$t('message.good');
            } else {
                return this.$t('message.strong');
            }
        },
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
        computePasswordStrength(password) {
            let score = 0;
            if (password.match(/[a-z]+/)) {
                score += 1;
            }
            if (password.match(/[A-Z]+/)) {
                score += 1;
            }
            if (password.match(/[0-9]+/)) {
                score += 1;
            }
            if (password.match(/[^a-zA-Z\d\s:]+/)) {
                score += 1;
            }

            if (password.length > 25) {
                score += 1;
            }

            this.strength = score * 20; //[0..100]
        },
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