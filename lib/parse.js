var parse5 = require('parse5')
var cache = require('lru-cache')(1000)
var hash = require('hash-sum')

module.exports = function (content, filePath) {
  var cacheKey = hash(content, filePath)
  var output = cache.get(cacheKey)
  if (output) { return output }

  output = {}

  var fragment = parse5.parseFragment(content)

  fragment.childNodes.forEach(function (node) {
    output[node.tagName] = true
  })

  cache.set(cacheKey, output)
  return output
}
