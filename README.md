# vue-auto-import-loader

[![Build Status](https://circleci.com/gh/WEBuster/vue-auto-import-loader/tree/master.svg?style=shield)](https://circleci.com/gh/WEBuster/vue-auto-import-loader/tree/master)
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
      template: '[name].html',
      style: '[name].css',
      script: '[name].js'
    },
    langs: {
      template: 'html',
      style: 'css',
      script: 'js'
    }
  }
}
```
