// EXTENSIONS VUE
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

// APPLICATION
import App from './App.vue'
import Api from './Api.js'

import TarotClient from './tarot-client.js'

//============================  VIEWS ============================
import Home from './views/Home.vue';
import Docs from './views/Docs.vue';
/*
import ResetPassword from './views/ResetPassword.vue';
import Signin from './views/Signin.vue';
import Signup from './views/Signup.vue';
import NewPassword from './views/NewPassword.vue';
import GameView from './views/GameView.vue';
*/
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },/*
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


const app = createApp(App).use(router);

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
