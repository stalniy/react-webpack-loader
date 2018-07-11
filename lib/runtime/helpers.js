import React from 'react'
import lensPath from 'ramda/es/lensPath'
import set from 'ramda/es/set'

function s (name) {
  return typeof Symbol === 'undefined'
    ? '__' + name + (new Date().getTime())
    : Symbol(name)
}

export var DEFS_PROP = s('cmpDefs')

export var META_PROP = s('cmpMetas')

export function emit (name, event) {
  var eventName = 'on' + name[0].toUpperCase() + name.slice(1)
  var fn = this.props[eventName]

  if (typeof fn === 'function') {
    fn(event)
  }
}

var lookup = cached(lensPath)

export function setState (object, key, value) {
  if (arguments.length === 1) {
    this.setState(object)
  } else if (arguments.length === 2) {
    var path = typeof object === 'string' ? object.split('.') : object

    if (path.length === 1) {
      var state = {}
      state[path[0]] = key
      this.setState(state)
    } else {
      this.setState(set(lookup(path), key))
    }
  } else {
    object[key] = value
  }
}

export function runHooks (fns) {
  if (Array.isArray(fns)) {
    fns.forEach(function (fn) {
      fn()
    })
  } else if (typeof fns === 'function') {
    fns()
  }
}

export function renderTree (defs) {
  var tree = this[DEFS_PROP].render.call(this, this._c)

  return Array.isArray(tree)
    ? React.createElement(React.Fragment, null, ...tree)
    : tree
}

var reserved = [
  'pure',
  'data',
  'methods',
  'render',
  'functional',
  'staticRenderFns',
  'getDerivedStateFromProps'
]
export function getDefsOthers (defs) {
  return Object.keys(defs).reduce((all, key) => {
    if (reserved.indexOf(key) !== -1) {
      return all
    }

    var type = typeof defs[key] === 'function' ? 'methods' : 'props'
    all[type] = all[type] || {}
    all[type][key] = defs[key]

    return all
  }, {})
}

export function identity () {}

export function noop () {}

function flatten (array) {
  return array.reduce(function concat (all, item) {
    if (Array.isArray(item)) {
      return all.concat(item.reduce(concat, []))
    }

    all.push(item)

    return all
  }, [])
}

export function createElement (defs, type, props) {
  var children = Array.prototype.slice.call(arguments, 3)
  var normalizationType = typeof children[children.length - 1] === 'number'
    ? children.pop()
    : 0

  if (Array.isArray(props)) {
    children = children.concat(props)
    props = null
  } else if (props && (React.isValidElement(props) || typeof props !== 'object')) {
    children.unshift(props)
    props = null
  }

  if (normalizationType) {
    children = flatten(children)
  }

  props = props || {}
  props[defs._scopeId] = ''
  children.unshift(
    defs.components && defs.components[type] || type,
    props
  )

  return React.createElement.apply(React, children)
}

export function setupMethods (component, methods) {
  if (!methods) {
    return
  }

  Object.keys(methods).forEach(function (name) {
    component[name] = methods[name].bind(component)
  })
}

export function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

export function toNumber (val) {
  var n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function renderList (val, render) {
  let ret, i, l, keys, key

  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  } else if (val && typeof val === 'object') {
    keys = Object.keys(val)
    ret = new Array(keys.length)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      ret[i] = render(val[key], key, i)
    }
  }

  return ret
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual (a, b) {
  if (a === b) {
    return true
  }

  var isObjectA = a && typeof a === 'object'
  var isObjectB = b && typeof b === 'object'
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a)
      var isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a)
        var keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

export function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i
    }
  }

  return -1
}

export function resolveFilter (id) {
  var filters = this[DEFS_PROP].filters

  return filters && filters[id] ? filters[id] : identity
}

export function renderStatic (index, isInFor) {
  var meta = this[META_PROP]
  var defs = this[DEFS_PROP]
  var cached = meta._staticTrees || (meta._staticTrees = [])
  var tree = cached[index]

  if (!tree || isInFor) {
    cached[index] = tree = defs.staticRenderFns[index].call(this, null, this)
  }

  return tree
}

export function renderOnce (el) {
  var meta = this[META_PROP]
  var cached = meta._onceTrees || (meta._onceTrees = {})
  var key = el.key

  if (!cached[key]) {
    // TODO: place of potential memory leaks
    cached[key] = el
  }

  return cached[key]
}

export function renderSlot (name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name]
  console.log(this.props.scopedSlots, name)
  var nodes
  if (scopedSlotFn) {
    props = props || {}
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && (!bindObject || bindObject.constructor !== Object)) {
        console.warn(
          'slot r-bind without argument expects an Object',
          this
        )
      }
      props = Object.assign({}, bindObject, props)
    }
    nodes = scopedSlotFn(props) || fallback
  } else {
    nodes = this.$slots[name] || fallback
  }

  return nodes
}

export function resolveComponentSlots () {
  var slots = this[META_PROP].slots = this[META_PROP].slots ||
    resolveSlots(React.Children.toArray(this.props.children))
  return slots
}

export function resolveSlots (children) {
  var slots = {}

  if (!children || children.length === 0) {
    return slots
  }

  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    var slot = child.props && child.props.slot || 'default'

    if (slot) {
      slots[slot] = slots[slot] || []
      slots[slot].push(child)
    }
  }

  return slots
}

export function resolveScopedSlots (fns, res) {
  res = res || {}
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res)
    } else {
      res[fns[i].key] = fns[i].fn
    }
  }
  return res
}

export function resolveComponentScopedSlots () {
  return this.props.scopedSlots
}

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

function cached (fn) {
  var cache = Object.create(null)
  return function cachedFn (str) {
    var hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

var hyphenateRE = /\B([A-Z])/g
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

export function checkKeyCodes (eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = builtInKeyCode

  if (builtInKeyName && eventKeyName) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

export function installHelpers (object) {
  object.$emit = emit
  object.$set = setState
  object._o = renderOnce
  object._n = toNumber
  object._s = toString
  object._l = renderList
  object._t = renderSlot
  object._q = looseEqual
  object._i = looseIndexOf
  object._m = renderStatic
  object._f = resolveFilter
  object._k = checkKeyCodes
  // object._b = bindObjectProps;
  object._e = noop
  object._u = resolveScopedSlots
  // object._g = bindObjectListeners;
  // object._p = function composition
}
