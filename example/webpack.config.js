const path = require('path')
const LoaderPlugin = require('../lib/plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  devServer: {
    stats: 'minimal',
    contentBase: __dirname,
    hot: true,
    watchContentBase: true
  },
  module: {
    rules: [
      // { loader: require.resolve('./debugger') },
      {
        test: /\.react$/,
        loader: 'react-webpack-loader'
      },
      // example to apply loader to a custom block without lang="xxx"
      // this rule applies to <foo> blocks
      {
        resourceQuery: /blockType=foo/,
        loader: 'babel-loader'
      },
      // example configuring preprocessor for <template lang="pug">
      {
        test: /\.pug$/,
        oneOf: [
          // this applies to <template lang="pug"> in Vue components
          {
            resourceQuery: /^\?rea/,
            use: ['pug-plain-loader']
          },
          // this applies to pug imports inside JavaScript
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      },
      // example configuring CSS Modules
      {
        test: /\.css$/,
        oneOf: [
          // this applies to <style module>
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]'
                }
              }
            ]
          },
          // this applies to <style> or <style scoped>
          {
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          }
        ]
      },
      // exmaple configration for <style lang="scss">
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // global data for all components
            // this can be read from a scss file
            options: {
              data: '$color: red;'
            }
          }
        ]
      }
    ]
  },
  resolveLoader: {
    alias: {
      'react-webpack-loader': require.resolve('../lib')
    }
  },
  plugins: [
    new LoaderPlugin()
  ]
}
