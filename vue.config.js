const path = require('path')
const webpack = require('webpack')

module.exports = {
  productionSourceMap : false,
  chainWebpack: config => {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
  },
}