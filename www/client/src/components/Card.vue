<template>
 
      <use :href="'#card' + name" 
            v-on:click="clicked()" 
            style="pointer-events: bounding-box; filter: url(#dropshadow)"
      ></use>
 
</template>

<script>
import * as d3 from 'd3';

export default {
    props: {
      // 01-T
      name: {
        type: String,
        required: true
      },
    },
    data () {
      return {
      }
    },
    mounted() {
        // var svg = d3.select("#card" + this.name)
        //   .attr("preserveAspectRatio", "xMinYMin meet")
        //   .attr("width", "0 0 50 50")


   
    },
    methods: {

      clicked() {
        console.log("[CARD][" + this.name + "] Clicked");
      }

    }
}
</script>

