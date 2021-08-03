<template>

    <!-- RESET PASSWORD -->
<div class="container " style="max-width: 400px;">
    <div class="card p-4">
    <h1 class="title has-text-centered">{{$t('message.resetPassword')}}</h1>

    <form>
        <p class="mb-5">Entrez votre adresse e-mail, vous recevrez message contenant un lien de réinitialisation.</p>
                
        <div class="field">
            <div class="control">
                <input class="input is-medium" type="email" autocomplete="on"  v-model="email" :placeholder="$t('message.email')">
            </div>
        </div>

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

        <button class="button is-block is-primary is-fullwidth is-medium" @click="validate">{{$t('message.submit')}}</button>

        <br />
        <p style="display:inline;">Pas de compte ? </p><router-link to="/sign-up"><p style="display:inline;">Créer un compte.</p></router-link>

        </form>
    </div>
</div>

</template>

<script>

export default {
    data: () => ({
        potmiel: '',
        email: '',
        checkbox: true
    }),

    methods: {
        validate (e) {
            e.preventDefault();
            if (!this.checkbox && this.potmiel === '') {
                this.$api.requestResetPassword( { email: this.email }).then( result => {
                    if (result.success) {
                        this.$eventHub.emit('setAlert', this.$t('message.emailSent'), 'success', 3000);
                    } else {
                        this.$eventHub.emit('setAlert', 'Impossible de vous envoyer un email', 'error', 3000);
                    }

                }).catch(error => {
                    console.error(error);
                    this.$eventHub.emit('setAlert', 'Impossible de vous envoyer un email', 'error', 3000);
                });
            }
        }
    }
}
</script>