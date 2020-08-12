import React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import { testSlice, AppSSR, store } from './App'
import { accountAsyncAction } from '@smoex-business/user'
import { proxy } from '@smoex-business/basic'
import { sleep } from 'basic-kit-js'

const fetchMap = {
  '*': () => asyncDispatch(500, [testSlice.dispatch(accountAsyncAction.getInfo())]),
  x: () =>
    asyncDispatch(500, [
      testSlice.dispatch(accountAsyncAction.getInfo()),
      testSlice.dispatch(accountAsyncAction.getInfo()),
    ]),
}

export async function dispatch(url: string) {
  await fetchMap['*']()
}

export function render(url: string) {
  return renderToStaticNodeStream(<AppSSR location={url} />)
}

export function getRefs() {
  return { store, proxy }
}

export async function asyncDispatch(timeout: number, promise: any[]) {
  return await Promise.race([Promise.all(promise), sleep(timeout)])
}
