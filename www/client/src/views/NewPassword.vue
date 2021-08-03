<template>

    <!-- NEW PASSWORD -->
<div class="container " style="max-width: 400px;">
    <div class="card p-4">
    <h1 class="title has-text-centered">{{$t('message.setNewPass')}}</h1>

    <form ref="newPassForm">

        <PassField ref="passField"></PassField>

        <div class="field">
            <label class="checkbox">
                <input type="checkbox" v-model="checkbox"> Je suis un robot
            </label>
        </div>

        <div class="field">
            <div class="control">
                <input type="text" v-model="potmiel" autocomplete="off" style="display:none !important; visibility:hidden !important;">
            </div>
        </div>

        <button class="button is-block is-primary is-fullwidth is-medium" @click.prevent="validate">{{$t('message.submit')}}</button>
        <br />
        <router-link to="/"><p style="display:inline;">Revenir à l'identification.</p></router-link>
        </form>
    </div>
</div>
   
</template>

<script>

import PassField from '../components/PassField.vue'

export default {
    components: {
        PassField
    },
    data: () => ({
        token: '',
        potmiel: '',
        checkbox: true
    }),
    created() {
        this.token = this.$route.params.token;
    },
    beforeRouteUpdate (to) { //, from, next) {
        this.token = to.params.token;
    },
    methods: {
        validate () {
            if (!this.checkbox && this.potmiel === '') {
                this.$api.setNewPassword( {password: this.$refs.passField.password, token: this.token, honeypot: this.potmiel, human: !this.checkbox }).then( result => {
                    if (result.success) {
                        this.$eventHub.emit('setAlert', 'Votre mot de passe a été modifié avec succès', 'success', 3000);
                    } else {
                        this.$eventHub.emit('setAlert', 'Impossible de modifier votre mot de passe', 'error', 3000);
                    }

                    this.$refs.newPassForm.reset();

                }).catch(error => {
                    console.error(error);
                });
            }
        }
    }
}
</script>