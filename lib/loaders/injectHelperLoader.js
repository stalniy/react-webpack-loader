const loaderUtils = require('loader-utils')
const helpersPath = require.resolve('../runtime/helpers')

module.exports = function (source) {
  const { id } = loaderUtils.getOptions(this)

  return `import { createElement } from "${helpersPath}"\n` +
    `const h = createElement.bind(null, { _scopeId: ${JSON.stringify(`data-${id}`)} })\n` +
    `${source.replace(/import\s+\{\s*h\s*\}\s+from\s+["']react-template-compiler\/helpers["'];?/g, '')}`
}
