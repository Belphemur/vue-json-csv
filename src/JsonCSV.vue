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
  import Download from 'downloadjs'
  import PapaParse from 'papaparse'


  const cleaningData = (data, fields, labels) => {

    if (_.isUndefined(fields) && _.isUndefined(labels)) {
      return data
    }

    let parseLabelsArg = function () {
      if (_.isObject(labels)) {
        const labelBindings = labels
        labels = (item, key) => {
          return labelBindings[key] || key
        }
      }

      if (_.isFunction(labels)) {
        const changeLabel = labels
        labels = (item) => {
          return _.mapKeys(item, changeLabel)
        }
      }

      if (!_.isFunction(labels) && !_.isUndefined(labels)) {
        throw new Error('Labels needs to be an Object or function(item, key)')
      }
    }

    let parseFieldsArg = function () {

      if (_.isFunction(fields) || (_.isObject(fields) && !_.isArray(fields))) {
        const fieldsToKeep = fields
        fields = (item) => {
          return _.pickBy(item, fieldsToKeep)
        }
      }

      if (_.isArray(fields)) {
        const fieldToKeep = fields
        fields = (item) => {
          return _.pick(item, fieldToKeep)
        }
      }

      if (!_.isFunction(fields) && !_.isUndefined(fields)) {
        throw new Error('Fields needs to be an array or function(item, key)')
      }
    }


    parseLabelsArg()
    parseFieldsArg()

    if (_.isUndefined(fields)) {
      fields = (item) => item
    }

    if (_.isUndefined(labels)) {
      labels = (item) => item
    }

    return _.map(data, (item) => labels(fields(item)))

  }

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
       * Labels for columns
       *
       * Object or function
       */
      labels: {
        required: false
      }
    },
    computed: {
      // unique identifier
      idName () {
        const now = new Date().getTime()
        return 'export_' + now
      },
      exportableData () {
        const filteredData = cleaningData(this.data, this.fields, this.labels)
        if (!filteredData.length) {
          return null
        }

        return filteredData

      }
    },
    methods: {
      generate () {
        const dataExport = this.exportableData

        if (!dataExport) {
          console.error('No data to export')
          return
        }

        let csv = PapaParse.unparse(dataExport, {delimiter: this.delimiter})
        if (this.separatorExcel) {
          csv = 'SEP=' + this.delimiter + '\r\n' + csv
        }
        Download(csv, this.name, 'application/csv')
      }
    }
  }
</script>

<style scoped>
    div {
        display: inline;
    }
</style>