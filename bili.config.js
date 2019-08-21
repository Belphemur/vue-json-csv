const {name} = require('./package.json')

module.exports = {
  input: 'src/JsonCSV.vue',
  plugins: {
    vue: true,
  },
  output : {
    minify: false,
    target: "browser"
  }
}
