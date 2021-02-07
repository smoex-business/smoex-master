import React from 'react'
import { App } from './App'
import { starter } from '@smoex-web/basic'
import { register } from './serviceWorker'

starter.initial()

starter.render(<App />, document.getElementById('root'))

register()
