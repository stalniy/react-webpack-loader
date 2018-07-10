import React from 'react'
import {
  emit,
  setState,
  noop,
  toString,
  toNumber,
  renderList,
  renderStatic,
  looseEqual,
  looseIndexOf,
  resolveFilter,
  checkKeyCodes
} from './helpers'

var proto = React.Component.prototype

proto.$emit = emit
proto.$set = setState
// proto._o = markOnce;
proto._n = toNumber
proto._s = toString
proto._l = renderList
// proto._t = renderSlot;
proto._q = looseEqual
proto._i = looseIndexOf
proto._m = renderStatic
proto._f = resolveFilter
proto._k = checkKeyCodes
// proto._b = bindObjectProps;
proto._e = noop
// proto._u = resolveScopedSlots;
// proto._g = bindObjectListeners;
