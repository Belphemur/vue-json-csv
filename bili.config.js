const { name } = require('./package.json')
const vue = require('rollup-plugin-vue').default

module.exports = {
  js: 'buble',
  input: 'src/JsonCSV.vue',
  banner: true,
  format: ['umd-min', 'cjs', 'es'],
  filename: name + '[suffix].js',
  plugins: [
    vue({ css: false })
  ],
  "name": "vue-json-csv"
}