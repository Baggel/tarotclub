<template>
<div class="container is-max-widescreen">

    <section class="section">
        <h1 class="title">TarotClub, le jeu de Tarot libre !</h1>
        
        <p class="lead">TarotClub est un jeu de Tarot libre (licence GPLv3) fonctionnant sur Windows, Linux et Mac OS X. 
            Le but de ce site est de centraliser les informations autour du développement du jeu.</p>

        <figure class="image m-4" >
            <img src="../assets/screenshots/front.png" style="border-radius: 10px;"/>
        </figure>

    </section>

    <section class="section">

     <div class="columns is-centered" style="padding: 2rem">
        <div class="column">
            <div class="card">
                <div class="card-image">
                    <span class="icon">
                        <i class="mdi mdi-gamepad-square mdi-48px "></i>
                    </span>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">Modes de jeu</p>
                        </div>
                    </div>

                    <div class="content">
                        <ul>
                            <li>Partie rapide ou enchaînement</li>
                            <li>Jeu solo contre l'ordinateur</li>
                            <li>Donnes numérotées</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <div class="card-image">
                    <span class="icon">
                        <i class="mdi mdi-lan mdi-48px "></i>
                    </span>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">Réseau</p>
                        </div>
                    </div>

                    <div class="content">
                        <ul>
                            <li>Jeu en réseau</li>
                            <li>Réseau local ou distant</li>
                            <li>Serveur intégré</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <div class="card-image">
                    <span class="icon">
                        <i class="mdi mdi-tools mdi-48px "></i>
                    </span>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">Outils</p>
                          </div>
                    </div>

                    <div class="content">
                        <ul>
                            <li>Intelligence artificielle en JavaScript, modifiable</li>
                            <li>Éditeur de donne</li>
                            <li>Options de jeu (adversaires, jouerie)</li>
                            <li>Cartes de Tarot au format vectoriel (SVG)</li>
                            <li>Système de log avancé avec sauvegarde des parties jouées</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     </div>

     </section>

<section class="section">
    <div class="columns is-centered" style="padding: 2rem">
        <div class="column">
            <DownloadTile icon="mdi-microsoft-windows" descr="Windows 10 - x64"></DownloadTile>
        </div>
        <div class="column">
            <DownloadTile icon="mdi-linux" descr="Linux AppImage"></DownloadTile>
        </div>
    </div>

    </section>

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
