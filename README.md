# react-loader

**under development**

> webpack loader for React Single-File Components

## What is React Loader?

`react-webpack-loader` is a loader for [webpack](https://webpack.js.org/) that allows you to author React components in a format called [Single-File Components (SFCs)](./docs/spec.md):

``` vue
<template>
  <div class="example">{{ msg }}</div>
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

- Allows using other webpack loaders for each part of a Vue component, for example Sass for `<style>` and Pug for `<template>`;
- Allows custom blocks in a `.react` file that can have custom loader chains applied to them;
- Treat static assets referenced in `<style>` and `<template>` as module dependencies and handle them with webpack loaders;
- Simulate scoped CSS for each component;
- Improves rendering performance by localizing static virtual node trees and caching them (thanks to [react-template-compiler](https://github.com/stalniy/react-template-compiler))
- State-preserving hot-reloading during development.

In a nutshell, the combination of webpack and `react-webpack-loader` gives you a modern, flexible and extremely powerful front-end workflow for authoring React.js applications.
