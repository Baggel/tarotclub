// EXTENSIONS VUE
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n/index';

// APPLICATION
import App from './App.vue'
import Api from './api.js'
import mitt from './mitt.js';
import store from './store.js';
import TarotClient from './tarot-client.js';
import "./style.scss"

// =====================================================================================
// VIEWS
// =====================================================================================
import Home from './views/Home.vue';
import Docs from './views/Docs.vue';
import ResetPassword from './views/ResetPassword.vue';
import Signin from './views/Signin.vue';
import Signup from './views/Signup.vue';
import NewPassword from './views/NewPassword.vue';
import Dashboard from './views/Dashboard.vue';
import GameView from './views/GameView.vue';

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
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
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
      },
      {
        path: '/game',
        name: 'game',
        component: GameView
      },
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
      usernameError: 'User name length must be between 4 and 40 characters',
      emailError: 'E-mail must be valid',
      passwordError: 'Password field cannot be empty',
      bad: 'Bad',
      average: 'Average',
      good: 'Good',
      strong: 'Strong',
      badForm: 'The form still contains errors',
      userOrMail: "Username or e-mail",
      signup: 'Sign up',
      signin: 'Log in',
      resetPassword: "Password reset",
      emailSent: "An e-mail has been sent",
      setNewPass: "New password",
      home: 'Home',
      playOnline: 'Play online',
      docs: "Documentation",
    }
  },
  fr: {
    message: {
      username: "Nom d'utilisateur",
      email: "Adresse e-mail",
      submit: "Valider",
      password: 'Mot de passe',
      usernameError: "Votre nom d'utilisateur doit comporter entre 4 et 40 caractères",
      emailError: "L'adresse e-mail doit être valide",
      passwordError: 'Le mot de passe ne dooit pas être vide',
      bad: 'Mauvais',
      average: 'Moyen',
      good: 'Bon',
      strong: 'Fort',
      badForm: 'Le formulaire contient des erreurs',
      userOrMail: "Nom utilisateur ou e-mail",
      signup: "S'inscrire",
      signin: 'Connexion',
      resetPassword: "Réinitialisation du mot de passe",
      emailSent: "Un email vous a été envoyé",
      setNewPass: "Nouveau mot de passe",
      home: 'Accueil',
      playOnline: 'Jouer en ligne',
      docs: "Documentation",
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

window.ev = {}
const app = createApp(App).use(router).use(i18n);

ev = mitt();
const api = new Api();
const tc = new TarotClient();

app.config.globalProperties.$eventHub = ev;
app.config.globalProperties.$api = api;
app.config.globalProperties.$tc = tc;
app.config.globalProperties.$store = store;
app.mount('#app');
