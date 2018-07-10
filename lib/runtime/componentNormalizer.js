// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

import React from 'react'
import './patch-react'
import {
  setupMethods,
  getDefsOthers,
  DEFS_PROP,
  createElement,
  runHooks,
  renderTree
} from './helpers'

function createComponent (defs) {
  var Parent = defs.pure === false ? React.Component : React.PureComponent
  var other = getDefsOthers(defs)

  function Component () {
    runHooks(defs.beforeCreate)
    Parent.apply(this, arguments)
    this.state = typeof defs.data === 'function' ? defs.data.call(this) : {}
    setupMethods(this, defs.methods)
    Object.assign(this, other.props)
  }

  if (defs.getDerivedStateFromProps) {
    Component.getDerivedStateFromProps = defs.getDerivedStateFromProps
  }

  Component.prototype = Object.create(Parent.prototype)
  Object.assign(Component.prototype, other.methods)
  Component.prototype[DEFS_PROP] = defs
  Component.prototype._c = createElement.bind(null, defs)
  Component.prototype.render = renderTree

  return Component
}

export default function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  if (typeof scriptExports === 'function' && (
    !(scriptExports.prototype instanceof React.Component) ||
      typeof scriptExports.prototype.render === 'function'
  )
  ) {
    return scriptExports
  }

  var options = scriptExports

  if (typeof scriptExports === 'function') {
    options = scriptExports.prototype[DEFS_PROP] = {}
    scriptExports.prototype.render = renderTree
  } else {
    scriptExports = createComponent(options)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
  }

  // functional template
  // TODO: functional stuff
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    // TODO: process React SSR
    // hook = function (context) {
    //   // 2.3 injection
    //   context =
    //     context || // cached call
    //     (this.$vnode && this.$vnode.ssrContext) || // stateful
    //     (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
    //   // 2.2 with runInNewContext: true
    //   if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
    //     context = __VUE_SSR_CONTEXT__
    //   }
    //   // inject component styles
    //   if (injectStyles) {
    //     injectStyles.call(this, context)
    //   }
    //   // register component module identifier for async chunk inferrence
    //   if (context && context._registeredComponents) {
    //     context._registeredComponents.add(moduleIdentifier)
    //   }
    // }
    // // used by ssr in case component is cached and beforeCreate
    // // never gets called
    // options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return scriptExports
}
