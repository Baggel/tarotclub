<template>
  <div class="gameview-container">
    <div class="board-area"></div>

      <Board></Board>

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
  }),
  components: { Servers, Lobby, Board },
  computed: {
    isIngame() {
      return this.$store.state.isIngame;
    },
    isReady() {
      return this.$tc.isReady;
    },
  },

};
</script>
