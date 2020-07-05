import React from 'react'
import ReactDOM from 'react-dom'
import { starter } from '@smoex-web/basic'
import { App } from './App'

starter.initial({})

// initWindowWidth()

// const isomorphic =
//   process.env.NODE_ENV === 'production' && process.env.REACT_APP_ISOMORPHIC === 'yes'
// const render = isomorphic ? ReactDOM.hydrate : ReactDOM.render

starter.render(<App />, document.getElementById('root'))

// render(<App />, document.getElementById('root'))

starter.regiser()
// serviceWorker.unregister()
