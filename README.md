# vue-auto-import-loader

[![Version](https://img.shields.io/npm/v/vue-auto-import-loader.svg?style=flat-square)](https://www.npmjs.com/package/vue-auto-import-loader)
[![License](https://img.shields.io/npm/l/vue-auto-import-loader.svg?style=flat-square)](LICENSE)

> Auto import template / style / script for *.vue file.

## Install

```shell
npm i -D vue-auto-import-loader
```

## webpack config

```js
{
  module: {
      loaders: [
          {
              test: /\.vue$/,
              loader: 'vue!vue-auto-import'
          }
      ]
  },
  vueAutoImport: {
    scoped: false,
    files: {  // relative to *.vue file path
      html: '[name].html',
      css: '[name].css',
      js: '[name].js',
    }
  }
}
```
