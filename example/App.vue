<template>
    <div class="container is-widescreen">
        <h1 class="title">
            JSON to CSV
        </h1>
        <div class="notification has-text-centered">
            <p class="subtitle">Click on the button to download the following JSON in CSV.</p>
            <p class="subtitle"> The fname and lname will be replaced by First Name and Last Name in the CSV.</p>
            <div>
                <download-csv
                        :data="jsonData"
                        :name="dataFile"
                        :labels="labels"
                        :fields="fields"
                >
                    <button class="button">Download</button>
                </download-csv>
            </div>
        </div>
        <pretty-json
                :data="jsonData"
        ></pretty-json>
    </div>
</template>

<script>
  import JsonCSV from '../src/JsonCSV'
  import JsonPretty from 'vue-json-pretty'

  export default {
    name: 'App',
    components: {'download-csv': JsonCSV, 'pretty-json': JsonPretty},
    data () {
      return {
        jsonData: [
          {'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
          {'id': 2, 'fname': 'John', 'lname': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
          {'id': 3, 'fname': 'Tina', 'lname': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
          {'id': 4, 'fname': 'Clarence', 'lname': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
          {'id': 5, 'fname': 'Anne', 'lname': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female'},
        ],
        dataFile: 'my_export.csv',
        labels: {
          fname: 'First Name',
          lname: 'Last Name'
        },
        fields : ['id', 'fname', 'lname', 'date']
      }
    }
  }
</script>

<style scoped>

</style>