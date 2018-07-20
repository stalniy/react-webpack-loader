import React from 'react'
import { installHelpers, installDataHelpers } from './helpers'

installHelpers(React.Component.prototype)
installDataHelpers(React.Component.prototype)
