<template>
  <g v-on:click="clicked()">
      <use href="#table_bg" :x="x" :y="y" :width="size" :height="size"></use>
 </g>
</template>

<script>
export default {
  props: {
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 0
    },
    north: {
      type: String,
      required: false,
      default: 'N'
    },
    east: {
      type: String,
      required: false,
      default: 'E'
    },
    south: {
      type: String,
      required: false,
      default: 'S'
    },
    west: {
      type: String,
      required: false,
      default: 'O'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    clicked() {

    }
  },
  mounted() {

  
  }
}
</script>
















