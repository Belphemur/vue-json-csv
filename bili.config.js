const {name} = require('./package.json')
const vue = require('rollup-plugin-vue').default

module.exports = {
  js: 'buble',
  input: 'src/JsonCSV.vue',
  format: ['umd-min', 'cjs', 'es'],
  filename: name + '[suffix].js',
  css: true,
  plugins: [
    vue({css: true})
  ],
  'name': 'vue-json-csv'
}
