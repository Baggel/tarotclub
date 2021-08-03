<template>
<div class="field">
    <div class="control">
        <input class="input is-medium" type="password" autocomplete="on" v-bind:class="{'is-danger': isPasswordError }" v-model="password" :placeholder="$t('message.password')">
    </div>
    <p class="help is-danger">{{passwordError}}</p>
    <progress :class="'progress mt-4 ' +  strengthColor" :value="strength" max="100" style="background-color: orange;">{{strength}}%</progress>
    <p>{{strengthLevel}}</p>
</div>
</template>

<script>

export default {
    
    data: () => ({       
        password: '',
        passwordError: '',
        strength: 0,
    }),
    computed: {
        isPasswordError() {
            let err = this.password == undefined || this.password.length == 0;
            this.passwordError = err ? this.$t('message.passwordError') : '';
            this.computePasswordStrength(this.password);
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
        }
    }
}
</script>
