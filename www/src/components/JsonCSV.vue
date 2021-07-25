<template>
    <v-btn
            @click="generate"
    >
        <slot>
            Download {{name}}
        </slot>
    </v-btn>
</template>

<script>
  import { saveAs } from 'file-saver';

  import PapaParse from 'papaparse'

  export default {
    name: 'JsonCSV',
    props: {
      /**
       * Json to download
       */
      data: {
        type: Array,
        required: true
      },
      /**
       * fields inside the Json Object that you want to export
       * if no given, all the properties in the Json are exported
       * Can either be an array or a function
       */
      fields: {
        required: false
      },
      /**
       * filename to export, default: data.csv
       */
      name: {
        type: String,
        default: 'data.csv'
      },
      /**
       * Delimiter for the CSV file
       */
      delimiter: {
        type: String,
        default: ',',
        required: false
      },
      /**
       * Should the module add SEP={delimiter}
       *
       * Useful for opening file with Excel
       */
      separatorExcel: {
        type: Boolean,
        default: false
      },
      /**
       * What will be the encoding of the file
       */
      encoding: {
        type: String,
        default: 'utf-8'
      },
      /**
       * Advanced options for Papaparse that is used to export to CSV
       */
      advancedOptions: {
        type: Object,
        default: () => {
        }
      },
      /**
       * Labels for columns
       *
       * Object or function
       */
      labels: {
        required: false
      },
    },

    methods: {

      generate () {
        this.$emit('export-started')
        const dataExport = this.data;

        if (!dataExport) {
          console.error('No data to export')
          return
        }

        let csv = PapaParse.unparse(dataExport, Object.assign({
          delimiter: this.delimiter,
          encoding: this.encoding,
        }, this.advancedOptions));
        if (this.separatorExcel) {
          csv = 'SEP=' + this.delimiter + '\r\n' + csv
        }
        //Add BOM when UTF-8
        if(this.encoding === "utf-8") {
            csv = "\ufeff" + csv
        }
        this.$emit('export-finished')
        if (!this.testing) {
          let blob = new Blob([csv], {type: "application/csv;charset=" + this.encoding})
          saveAs(blob, this.name)
        }
      }
    }
  }
</script>

<style scoped>
    div {
        display: inline;
    }
</style>
