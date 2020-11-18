import React from 'react'
import { App } from './App'
import { starter } from '@smoex-web/basic'

starter.initial()

starter.render(<App />, document.getElementById('root'))

starter.register()
