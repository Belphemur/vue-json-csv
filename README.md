# Vue JSON to CSV file
VueJS component to export Json Data into CSV file and download the resulting file.

## Getting started

Get the package:
```bash
yarn add vue-json-csv
```

Register JsonCSV in your app entrypoint:
```js
import Vue from 'vue'
import JsonCSV from 'vue-json-csv'

Vue.component('downloadCsv', JsonCSV)
```

In your template
```html
<download-csv
    :data   = "json_data">
    Download Data
    <img src="download_icon.png">
</download-csv>
```

## Props List

| Name             | Type  | Description |
| :---             | :---: | ---         |
| data  | Array  | (_required_) Data to be exported |
| fields  | Array/Function(value, key)  | fields inside the Json Object that you want to export. If no given, all the properties in the Json are exported. Use the function to filter the data and only keep the properties you want. |
| name    | string | filename to export, default: data.csv |
| delimiter| string| Default ",". Can be changed to anything.|
| separator-excel| boolean|If true, will prepend `SEP={delimiter}` to the file to make it easily usable with Excel|


## Example

```js
import Vue from 'vue'
import JsonCSV from 'vue-json-csv'

Vue.component('downloadJson', JsonCSV)

const app = new Vue({
    el: '#app',
    data: {     
        json_data: [
            {
                'name': 'Tony Peña',
                'city': 'New York',
                'country': 'United States',
                'birthdate': '1978-03-15',
                'phone': {
                    'mobile': '1-541-754-3010',
                    'landline': '(541) 754-3010'
                }
            },
            {
                'name': 'Thessaloniki',
                'city': 'Athens',
                'country': 'Greece',
                'birthdate': '1987-11-23',
                'phone': {
                    'mobile': '+1 855 275 5071',
                    'landline': '(2741) 2621-244'
                }
            }
        ]
    }
})
```

In your Template call it like

```html
<download-csv
	class   = "btn btn-default"
	:data   = "json_data"
	name    = "filename.csv">

	Download CSV (This is a slot)

</download-csv>
```
REQUIRED
- json_data: Contains the data you want to export


## License
MIT