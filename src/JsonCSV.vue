<template>
    <div
            :id="idName"
            @click="generate"
    >
        <slot>
            Download {{name}}
        </slot>
    </div>
</template>

<script>
  import _ from 'lodash'
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
      /**
       * Used only for testing purposes
       */
      testing: {
        required: false,
        default: false
      }
    },
    computed: {
      // unique identifier
      idName () {
        const now = new Date().getTime()
        return 'export_' + now
      },
      exportableData () {
        const filteredData = this.cleaningData()
        if (!filteredData.length) {
          return null
        }

        return filteredData
      }
    },
    methods: {
      labelsFunctionGenerator () {

        if(!_.isUndefined(this.labels) && !_.isFunction(this.labels) && !_.isObject(this.labels)) {
          throw new Error('Labels needs to be a function(value,key) or object.')
        }

        if (_.isFunction(this.labels)) {
          return (item) => {
            let mapKeys = _.mapKeys(item, this.labels)
            return mapKeys
          }
        }

        if (_.isObject(this.labels)) {
          return (item) => {
            return _.mapKeys(item, (item, key) => {
              return this.labels[key] || key
            })
          }
        }

        return (item) => item
      },

      fieldsFunctionGenerator () {
        if(!_.isUndefined(this.fields) && !_.isFunction(this.fields) && !_.isObject(this.fields) && !_.isArray(this.fields)) {
          throw new Error('Fields needs to be a function(value,key) or array.')
        }

        if (_.isFunction(this.fields) || (_.isObject(this.fields) && !_.isArray(this.fields))) {
          return (item) => {
            return _.pickBy(item, this.fields)
          }
        }

        if (_.isArray(this.fields)) {
          return (item) => {
            return _.pick(item, this.fields)
          }
        }
        return (item) => item
      },

      cleaningData () {
        if (_.isUndefined(this.fields) && _.isUndefined(this.labels)) {
          return this.data
        }

        const labels = this.labelsFunctionGenerator()
        const fields = this.fieldsFunctionGenerator()

        return _.map(this.data, (item) => labels(fields(item)))
      },

      generate () {
        this.$emit('export-started')
        const dataExport = this.exportableData

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
