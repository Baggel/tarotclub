<template>
  <div class="gameview-container">
    <div class="board-area">

           <div style="width: 100%; height: 100%; display: flex;align-items: center; justify-content: center;" v-if="!isReady">
              <div class="loader" style="max-width: 50%;" />

          </div>

        <div style="width: 100%; height: 100%; display: flex;align-items: start; justify-content: center;"  v-else-if="!isIngame">
            <Servers></Servers>
        </div>

        <Board v-else></Board>



    </div>


     

    <div class="lobby-area">
     <Lobby></Lobby>
    </div>
  </div>
</template>

<script>
/*



       

    <v-row class="fill-height" v-if="!isReady">
        <v-progress-circular
            indeterminate
            color="primary"
        ></v-progress-circular>
    </v-row>

    <v-row class="fill-height" v-else-if="!isIngame">
          <v-col>
              <Servers></Servers>
          </v-col>
    </v-row>
    
    <div v-else id="game-board" class="board">
         <svg viewBox="0 0 700 700" id="svgmain">
        <defs>
        </defs>
            <Card name="01-T" x="200" y="200" />

         </svg>
    </div>








// CODE POUR LA VISUALISATION DES TABLES DU SERVEUR

 <svg class="responsive-container"
        viewBox="0 0 330 600"
         id="svgmain">
        <defs>
        </defs>

        <Table  v-for="table in tables" :key="table.id" 
            :x="table.x" 
            :y="table.y" 
            :size="table.size"
            >
        </Table>

        <Card name="01-T" x="200">
        </Card>

    </svg>

*/

import Servers from "../components/Servers.vue";
import Board from "../components/Board.vue";
import Lobby from "../components/Lobby.vue";
import Module from '../../public/tarotclub.js';


export default {
  data: () => ({
    tables: [
      {
        id: 0,
        x: 20,
        y: 20,
        size: 100,
      },
    ],
    view: { w: 0, h: 0 },
    instance: null,
    isReady: false,
  }),
  components: { Servers, Lobby, Board },
  computed: {
    isIngame() {
      return this.$store.state.isIngame;
    },
    // isReady() {
    //   return this.$tc.isReady;
    // },
  },
  created() {
      this.instance = Module();
      
      this.instance.then(() => {
        console.log("[GAMEVIEW] Started");
             // this.result = instance._Add(1,2);
              this.isReady = true;
      });

      this.$eventHub.on('log', (text) => {
          console.log("[GAMEVIEW] " + text);
      });
  }

};
</script>
