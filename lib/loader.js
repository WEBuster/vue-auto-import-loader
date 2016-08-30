var fs = require('fs')
var path = require('path')
var parse = require('./parse')

module.exports = function (content) {
  var filePath = this.resourcePath
  var options = resolveOptions(this.options)
  var parts = parse(content, filePath)
  var output = content

  if (!parts.template) {
    output += autoImportTemplate(filePath, options)
  }
  if (!parts.style) {
    output += autoImportStyle(filePath, options)
  }
  if (!parts.script) {
    output += autoImportScript(filePath, options)
  }

  return output
}

function autoImportTemplate(filePath, options) {
  var filePathList = resolveFilePathList(filePath, options.files.template)
  var src = getImportableFilePath(filePathList)
  var lang = options.langs.template
  return src
    ? '<template src="' + src + '" lang="' + lang + '"></template>'
    : ''
}

function autoImportStyle(filePath, options) {
  var filePathList = resolveFilePathList(filePath, options.files.style)
  var src = getImportableFilePath(filePathList)
  var lang = options.langs.style
  var scoped = options.scoped ? ' scoped' : ''
  return src
    ? '<style src="' + src + '" lang="' + lang + '"' + scoped + '></style>'
    : ''
}

function autoImportScript(filePath, options) {
  var filePathList = resolveFilePathList(filePath, options.files.script)
  var src = getImportableFilePath(filePathList)
  var lang = options.langs.script
  return src
    ? '<script src="' + src + '" lang="' + lang + '"></script>'
    : ''
}

function resolveFilePathList (rootFilePath, list) {
  var fileName = path.basename(rootFilePath, '.vue')
  var rootPath = path.dirname(rootFilePath)
  return list.map(function (filePath) {
    return path.resolve(rootPath, filePath.replace(/\[name\]/g, fileName))
  })
}

function getImportableFilePath (filePathList) {
  for (var i = 0; i < filePathList.length; i++) {
    if (fileExistsSync(filePathList[i])) {
      return filePathList[i]
    }
  }
  return null
}

function fileExistsSync (filePath) {
  try {
    fs.statSync(path.resolve(__dirname, filePath))
    return true
  } catch (err) {
    return false
  }
}

function resolveOptions (config) {
  var options = config.vueAutoImport || {}

  options.scoped = !!options.scoped

  options.files = options.files || {}
  options.files.template = getArray(options.files.template || '[name].html')
  options.files.style = getArray(options.files.style || '[name].css')
  options.files.script = getArray(options.files.script || '[name].js')

  options.langs = options.langs || {}
  options.langs.template = options.langs.template || 'html'
  options.langs.style = options.langs.style || 'css'
  options.langs.script = options.langs.script || 'js'

  return options
}

function getArray (tar) {
  var isArray = Object.prototype.toString.call(tar) === '[object Array]'
  return isArray ? tar : [tar]
}
