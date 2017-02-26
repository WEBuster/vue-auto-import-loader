var fs = require('fs')
var path = require('path')
var parse5 = require('parse5')
var rimraf = require('rimraf')
var webpack = require('webpack')
var expect = require('chai').expect

describe('vue-auto-import-loader', function () {

  var outputDir = path.resolve(__dirname, './output')
  var loaderPath = path.resolve(__dirname, '..')
  var globalConfig = {
    output: {
      path: outputDir,
      filename: 'test.build.vue'
    },
    resolveLoader: {
      alias: {
        'vue-auto-import-loader': loaderPath
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: ['raw-loader', 'vue-auto-import-loader']
        }
      ]
    }
  }

  beforeEach(function (done) {
    rimraf(outputDir, done)
  })

  function getFile (file, cb) {
    fs.readFile(path.resolve(outputDir, file), 'utf-8', function (err, data) {
      expect(err).to.be.not.exist
      cb(data)
    })
  }

  function getAttribute (node, name) {
    var attr = node.attrs.filter(function (attr) {
      return attr.name === name
    })[0]
    return attr && attr.value
  }

  function hasAttribute (node, name) {
    var attr = node.attrs.filter(function (attr) {
      return attr.name === name
    })[0]
    return !!attr
  }

  function test (options, assert) {
    var config = Object.assign({}, globalConfig, options)
    webpack(config, function (err, stats) {
      if (stats.compilation.errors.length) {
        stats.compilation.errors.forEach(function (err) {
          console.error(err.message)
        })
      }
      expect(stats.compilation.errors).to.be.empty
      getFile('test.build.vue', function (data) {
        var content = JSON.parse(data.match(/module\.exports = (.+)/)[1])
        var fragment = parse5.parseFragment(content)
        assert(fragment)
      })
    })
  }

  it('blank', function (done) {
    test({
      entry: './test/fixtures/blank/blank.vue'
    }, function (fragment) {
      var typeList = []
      fragment.childNodes.filter(function (node) {
        return node.tagName
      }).forEach(function (node) {
        var src = getAttribute(node, 'src')
        typeList.push(node.tagName)
        switch (node.tagName) {
          case 'template':
            expect(src).to.match(/blank\.html$/)
            break
          case 'style':
            expect(src).to.match(/blank\.css$/)
            break
          case 'script':
            expect(src).to.match(/blank\.js$/)
            break
        }
      })
      expect(typeList).to.include('template')
      expect(typeList).to.include('style')
      expect(typeList).to.include('script')
      done()
    })
  })

  it('blank-specific-name', function (done) {
    test({
      entry: './test/fixtures/blank-specific-name/blank.vue',
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: [
              'raw-loader',
              {
                loader: 'vue-auto-import-loader',
                options: {
                  files: {
                    template: 'template.html',
                    style: 'style.css',
                    script: 'script.js'
                  }
                }
              }
            ]
          }
        ]
      }
    }, function (fragment) {
      var typeList = []
      fragment.childNodes.filter(function (node) {
        return node.tagName
      }).forEach(function (node) {
        var src = getAttribute(node, 'src')
        typeList.push(node.tagName)
        switch (node.tagName) {
          case 'template':
            expect(src).to.match(/template\.html$/)
            break
          case 'style':
            expect(src).to.match(/style\.css$/)
            break
          case 'script':
            expect(src).to.match(/script\.js$/)
            break
        }
      })
      expect(typeList).to.include('template')
      expect(typeList).to.include('style')
      expect(typeList).to.include('script')
      done()
    })
  })

  it('blank-importable', function (done) {
    test({
      entry: './test/fixtures/blank-importable/blank.vue'
    }, function (fragment) {
      var typeList = []
      fragment.childNodes.filter(function (node) {
        return node.tagName
      }).forEach(function (node) {
        typeList.push(node.tagName)
      })
      expect(typeList).to.not.include('template')
      expect(typeList).to.not.include('style')
      expect(typeList).to.not.include('script')
      done()
    })
  })

  it('full', function (done) {
    test({
      entry: './test/fixtures/full/full.vue'
    }, function (fragment) {
      var typeList = []
      fragment.childNodes.filter(function (node) {
        return node.tagName
      }).forEach(function (node) {
        typeList.push(node.tagName)
      })
      expect(typeList).to.have.lengthOf(3)
      done()
    })
  })

  it('scoped', function (done) {
    test({
      entry: './test/fixtures/scoped/scoped.vue',
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: [
              'raw-loader',
              {
                loader: 'vue-auto-import-loader',
                options: {
                  scoped: true
                }
              }
            ]
          }
        ]
      }
    }, function (fragment) {
      var node = fragment.childNodes[0]
      var scoped = hasAttribute(node, 'scoped')
      expect(scoped).to.be.true
      done()
    })
  })
})
