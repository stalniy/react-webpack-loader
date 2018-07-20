# react-loader

**under development**: see [support](https://github.com/stalniy/react-webpack-loader/issues/18) for details

> webpack loader for React Single-File Components

## What is React Loader?

`react-webpack-loader` is a loader for [webpack](https://webpack.js.org/) that allows you to author React components in a format called [Single-File Components (SFCs)](./docs/spec.md):

``` vue
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>
```

There are many cool features provided by `react-webpack-loader`:

- Allows using other webpack loaders for each part of a React component, for example Sass for `<style>` and Pug for `<template>`;
- Allows custom blocks in a `.react` file that can have custom loader chains applied to them;
- Treat static assets referenced in `<style>` and `<template>` as module dependencies and handle them with webpack loaders;
- Simulate scoped CSS for each component;
- Improves rendering performance by localizing static virtual node trees and caching them (thanks to [react-template-compiler](https://github.com/stalniy/react-template-compiler))
- Introduces `r-model` which reduces boilerplate when working with forms;
- Forget about when to use `class` or `className` just use `:class` to bind CSS styles seamlessly;
- Everything inside `methods` object are bound to `this` for you, so, no more code like `this.onClick = this.onClick.bind(this)`;
- State-preserving hot-reloading during development.

In a nutshell, the combination of webpack and `react-webpack-loader` gives you a modern, flexible and extremely powerful front-end workflow for authoring React.js applications.

## Installation

```sh
npm i react-webpack-loader --save-dev
```

Then in your webpack config add few loaders:

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.react$/,
        loader: 'react-webpack-loader'
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
  }
  // ...
}
```

You can use any configuration for your `CSS` files, also you can use JSX together with scoped styles.
