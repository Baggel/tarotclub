<template>
<div class="board-container">
  <div id="id-board" class="board">
    <svg viewBox="0 0 700 700" id="svgmain">
      <defs></defs>
      <Card name="01-T" x="200" y="200" />
    </svg>
  </div>
</div>
</template>

<script>
import * as d3 from "d3";
import { nextTick } from 'vue';
import Card from "../components/Card.vue";

export default {
    data: () => ({
        view: { w: 0, h: 0 },
    }),
    
    components: { Card },
    //====================================================================================================================
  methods: {
    createDef: function (xml, id_name) {
      let g = d3.select("#svgmain defs");
      let node = document.importNode(xml.documentElement, true);
      d3.select(node).attr("id", id_name);
      g.node().appendChild(node);
    },
    computeSize: function (ratio) {
      let sizeByHeight = {
        w: this.view.h * ratio,
        h: this.view.h,
      };
      let sizeByWidth = {
        w: this.view.w,
        h: this.view.w / ratio,
      };

      if (sizeByWidth.w <= this.view.w && sizeByWidth.h <= this.view.h) {
        console.log("Fit width");
        return sizeByWidth;
      } else {
        console.log("Fit height");
        return sizeByHeight;
      }
    },
    handleResize() {

        let central_area = d3.select(".board-container");

        if (!central_area.empty()) {
            let size = central_area.node().getBoundingClientRect();
            this.view.w = size.width - 30;
            this.view.h = size.height - 30;
            let boardNewSize = this.computeSize(1.5);

            document.getElementById("id-board").style.width = boardNewSize.w + "px";
            document.getElementById("id-board").style.height = boardNewSize.h + "px";
        } else {
            console.error('[BOARD] Empty container');
        }

    },
    onResize: function () {
      nextTick().then(() => {
        this.handleResize();
      });
    },
    initializeGameView() {
      /* For the drop shadow filter... */
      let defs = d3.select("#svgmain defs");

      let filter = defs.append("filter").attr("id", "dropshadow");

      filter
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2)
        .attr("result", "blur");
      filter
        .append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur");

      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode").attr("in", "offsetBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      let filesToLoad = [d3.xml("./img/table.svg"), d3.xml("./cards/01-T.svg")];

      let names = ["table_bg", "card01-T"];

      // We must wait for all data to be fetched before compute various sizes
      Promise.all(filesToLoad)
        .then((list) => {
          // All other elements are lights
          for (let i = 0; i < list.length; i++) {
            this.createDef(list[i], names[i]);
          }
        })
        .catch(function (error) {
          console.log("Promise get files error: " + error);
        });
    },
  },
  //====================================================================================================================
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  //====================================================================================================================
  mounted() {
    console.log("mounted game view");
    this.initializeGameView();
    window.addEventListener("resize", this.onResize);
    this.handleResize();
  },
};
</script>