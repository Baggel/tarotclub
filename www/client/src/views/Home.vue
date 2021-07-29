<template>
<div class="w3-main wa-center" style="max-width: 50%">
    <h1>TarotClub, le jeu de Tarot libre !</h1>
    
             <p class="lead">TarotClub est un jeu de Tarot libre (licence GPLv3) fonctionnant sur Windows, Linux et Mac OS X. Le but de ce site est de centraliser les informations autour du développement du jeu.</p>

            <v-img src="img/screenshots/front.png"
           
            ></v-img>

     <v-row class="pa-20">
         <v-col>
         <v-card flat>
            <v-card-title>
                Modes de jeu
            </v-card-title>
            <v-card-text>
                <p>Partie rapide ou enchaînement</p>
                <p>Jeu solo contre l'ordinateur</p>
                <p>Donnes numérotées</p>
            </v-card-text>
         </v-card>
    </v-col>
    <v-col>
         <v-card flat>
            <v-card-title>
                Réseau
            </v-card-title>
            <v-card-text>
                <p>Jeu en réseau</p>
                <p>Réseau local ou distant</p>
                <p>Serveur intégré</p>
            </v-card-text>
         </v-card>
</v-col>
<v-col>
        <v-card flat>
            <v-card-title>
                Outils
            </v-card-title>
            <v-card-text>
                <p>Intelligence artificielle en JavaScript, modifiable</p>
                <p>Éditeur de donne</p>
                <p>Options de jeu (adversaires, jouerie)</p>
                <p>Cartes de Tarot au format vectoriel (SVG)</p>
                <p>>Système de log avancé avec sauvegarde des parties jouées</p>
            </v-card-text>
         </v-card>
</v-col>
     </v-row>

    <v-row>
        <DownloadTile image="img/ubuntu.png"></DownloadTile>
        <DownloadTile image="img/win.png"></DownloadTile>
        <DownloadTile image="img/fedora.png"></DownloadTile>
    </v-row>

</div>

</template>

<script>

import DownloadTile from "../components/DownloadTile.vue";

export default {
    data: () => ({

    }),
    components: { DownloadTile },
    //====================================================================================================================
    methods: {


    },
    //====================================================================================================================
    beforeDestroy() {

    },
    //====================================================================================================================
    mounted() {
        console.log("mounted home")  
    }
}
</script>
