<template>
    <v-container fluid>
        
    <v-card color="transparent" elevation="0" class="mx-auto" style="text-align:center; margin-bottom:10px;">

<v-card-text>
    <v-row
        align="center"
        class="mx-0"
      >
      <v-card-title>Accueil</v-card-title>
    </v-row>  
    
 </v-card-text>
       
<v-container>
    <v-row no-gutters>
      <!-- <v-col
        cols="12"
        sm="4"
      >
        <Widget title="37" subTitle="Nombre de machines" icon="mdi-slot-machine" color="blue lighten-1" style="width: 200px;"></Widget>
      </v-col> -->

      <v-col
        class="d-flex justify-center"
      >
        <Widget :title="numberOfMachines" subTitle="Nombre de machines" icon="mdi-slot-machine" color="teal lighten-3" style="width: 200px;"></Widget>
      </v-col>

      <!-- <v-col
        cols="12"
        sm="4"
      >
        <Widget title="37" subTitle="Nombre de machines" icon="mdi-slot-machine" color="orange lighten-2" style="width: 200px;"></Widget>
      </v-col> -->
    </v-row>
  </v-container>

       
    
        <div  style="width:100%; height: 400px; text-align: center; padding-top: 20px;">
            <l-map 
                :zoom="zoom"
                :center="center"
                ref="map"
                style="height: 100%; width: 100%; z-index: 0;"
            >
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-marker v-for="(marker, index) in markers" :lat-lng="marker" :key="index" @click="machineClicked(index)"></l-marker>
                
            </l-map>
        </div>


  </v-card>

    </v-container>
</template>

<script>

import Widget  from "../components/Widget";
import { latLng, LatLngBounds } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {

    components: {
        LMap,
        LTileLayer,
        LMarker,
        Widget
    },
    data: () => ({
        zoom:13,
        center: latLng(47.413220, -1.219482),
        url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //marker: latLng(47.413220, -1.219482),
    }),

    computed: {
        numberOfMachines() {
          return this.$store.getters['machines/machinesNotDeleted'].length.toString();
        },
        markers() {
            let list = [];

            for (let i = 0; i < this.numberOfMachines; i++) {

              // "46.1362835,0.1735382"
              let gps = this.$store.state.machines.list[i].attr.gps;
              const coord = gps.split(',');

              if (coord.length == 2) {
                list.push(latLng(parseFloat(coord[0]), parseFloat(coord[1])));
              }
            }
            return list;
        }
    },

    mounted() {
        if (this.markers.length > 0) {
          let bounds = new LatLngBounds(this.markers);
          this.$refs.map.fitBounds(bounds);
        }
    },

    methods: {
        machineClicked(index) {
          console.log('[MAP] clicked on machine: ' + index);
        }
    }
}
</script>