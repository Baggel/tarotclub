// EXTENSIONS VUE
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n/index';

// APPLICATION
import App from './App.vue'
import Api from './Api.js'

import TarotClient from './tarot-client.js'


// =====================================================================================
// VIEWS
// =====================================================================================
import Home from './views/Home.vue';
import Docs from './views/Docs.vue';
import ResetPassword from './views/ResetPassword.vue';
import Signin from './views/Signin.vue';
import Signup from './views/Signup.vue';
import NewPassword from './views/NewPassword.vue';
// import GameView from './views/GameView.vue';


// =====================================================================================
// ROUTER
// =====================================================================================
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/signin',
        name: 'signin',
        component: Signin
      },
      {
        path: '/signup',
        name: 'signup',
        component: Signup
      },
      {
        path: '/newpassword/:token',
        name: 'newpassword',
        component: NewPassword
      },
      {
        path: '/resetpass',
        name: 'resetpass',
        component: ResetPassword
      },/*
      {
        path: '/game',
        name: 'game',
        component: GameView
      },*/
      {
        path: '/docs',
        name: 'docs',
        component: Docs
      },
      { 
        path: "/:catchAll(.*)",
        redirect: '/'
      }
      
    ]
});

// =====================================================================================
// TRANSLATIONS
// =====================================================================================
const messages = {
  en: {
    message: {
      username: "User name",
      email: "Email",
      submit: "Submit",
      password: 'Password',
      usernameError: 'Name must be less than 20 characters',
      emailError: 'E-mail must be valid',
      passwordError: 'Password field cannot be empty',
      bad: 'Bad',
      average: 'Average',
      good: 'Good',
      strong: 'Strong',
      badForm: 'The form still contains errors',
    }
  },
  fr: {
    message: {
      username: "Nom d'utilisateur",
      email: "Adresse e-mail",
      submit: "Valider",
      password: 'Mot de passe',
      usernameError: 'Votre nom doit comporter maximum 20 caractères',
      emailError: "L'adresse e-mail doit être valide",
      passwordError: 'Le mot de passe ne dooit pas être vide',
      bad: 'Mauvais',
      average: 'Moyen',
      good: 'Bon',
      strong: 'Fort',
      badForm: 'Le formulaire contient des erreurs',
    }
  }
}


const i18n = createI18n({
  // something vue-i18n options here ...
  locale: 'fr', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});


// =====================================================================================
// VUE INSTANCE AND GLOBAL OBJECTS
// =====================================================================================
const app = createApp(App).use(router).use(i18n);

import mitt from './mitt.js';
import store from './Store.js';

const eventHub = mitt();
const api = new Api();
const tc = new TarotClient();

app.config.globalProperties.$eventHub = eventHub;
app.config.globalProperties.$api = api;
app.config.globalProperties.$tc = tc;
app.config.globalProperties.$store = store;
app.mount('#app');
