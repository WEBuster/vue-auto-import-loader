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
  var filePathList = resolveFilePathList(filePath, options.files.html)
  var filePathToImport = getImportableFilePath(filePathList)
  return filePathToImport
    ? '<template src="' + filePathToImport + '"></template>'
    : ''
}

function autoImportStyle(filePath, options) {
  var filePathList = resolveFilePathList(filePath, options.files.css)
  var filePathToImport = getImportableFilePath(filePathList)
  var scopedStr = options.scoped ? 'scoped' : ''
  return filePathToImport
    ? '<style src="' + filePathToImport + '" ' + scopedStr + '></style>'
    : ''
}

function autoImportScript(filePath, options) {
  var filePathList = resolveFilePathList(filePath, options.files.js)
  var filePathToImport = getImportableFilePath(filePathList)
  return filePathToImport
    ? '<script src="' + filePathToImport + '"></script>'
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
  options.files.html = getArray(options.files.html || '[name].html')
  options.files.css = getArray(options.files.css || '[name].css')
  options.files.js = getArray(options.files.js || '[name].js')
  return options
}

function getArray (tar) {
  var isArray = Object.prototype.toString.call(tar) === '[object Array]'
  return isArray ? tar : [tar]
}
