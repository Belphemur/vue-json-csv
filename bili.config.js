const {name} = require('./package.json')

module.exports = {
  js: 'buble',
  input: 'src/JsonCSV.vue',
  format: ['umd-min', 'cjs', 'es'],
  filename: name + '[suffix].js',
  css: true,
  plugins: [
    'vue'
  ],
  'name': 'vue-json-csv'
}
