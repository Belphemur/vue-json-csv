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

  export default {
    name: 'JsonCSV',
    props: {
      // Json to download
      'data': {
        type: Array,
        required: true
      },
      // fields inside the Json Object that you want to export
      // if no given, all the properties in the Json are exported
      // Can either be an array or a function
      'fields': {
        required: false
      },
      // filename to export, default: data.csv
      'name': {
        type: String,
        default: 'data.csv'
      }
    },
    computed: {
      // unique identifier
      idName () {
        const now = new Date().getTime()
        return 'export_' + now
      },
      exportableData () {
        if (_.isUndefined(this.fields)) {
          return this.data
        }

        if (_.isArray(this.fields)) {
          return _.map(this.data, (item) => {
            return _.pick(item, this.fields)
          })
        }

        if (_.isFunction(this.fields) || _.isObject(this.fields)) {
          return _.map(this.data, (item) => {
            return _.pickBy(item, this.fields)
          })
        }
        throw new Error('Fields needs to be an array or function(item, key)')
      }
    },
    methods: {
      generate () {
        if (!this.data.length) {
          console.error('No data given')
          return
        }

        const csv = PapaParse.unparse(this.exportableData)
        Download(csv, this.name, 'application/csv')
      }
    }
  }
</script>

<style scoped>

</style>