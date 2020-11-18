import React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import { testSlice, AppSSR, store } from './App'
import { accountAsyncAction } from '@smoex-logic/user'
import { proxy } from '@smoex-logic/basic'
// import { asyncDispatch } from 'redux-async-kit'
import { xSleep } from '@basic-kits/js'

const dispatch = createDispatchModule([{
  // '*': [[
  //   testSlice.dispatch(accountAsyncAction.getInfo())
  // ]],
  // 'x': [[
  //   testSlice.dispatch(accountAsyncAction.getInfo()),
  // ]],
}])

const { getRefs, render } = createSSRModule(AppSSR, {
  store, proxy,
})

//  = createSSRModule(AppSSR, {
//   store, proxy,
// })


export { getRefs, render, dispatch }

// const fetchMapx = []

// const fetchMap = {
//   '*': () => asyncDispatch(500, [testSlice.dispatch(accountAsyncAction.getInfo())]),
//   x: () =>
//     asyncDispatch(500, [
//       testSlice.dispatch(accountAsyncAction.getInfo()),
//       testSlice.dispatch(accountAsyncAction.getInfo()),
//     ]),
// }

// async function dispatch(url: string) {
//   await fetchMap['*']()
// }

function createDispatchModule(fetchMaps: any[], timeout: number = 0) {
  return async (url: string) => {
    for await (const fetchMap of fetchMaps) {
      const info = fetchMap[url]
      if (info) {
        await asyncDispatch(info[1] || timeout, info[0])
      }
    }
  }
}

type ISSRModuleOpts = {
  store?: any,
  proxy?: any,
  dispatch?: (url: string) => void
}

export function createSSRModule(App: React.FC<any>, opts: ISSRModuleOpts = {} as ISSRModuleOpts) {
  const { store, proxy, dispatch } = opts
  function render(url: string) {
    return renderToStaticNodeStream(<App location={url} />)
  }

  function getRefs() {
    return { store, proxy }
  }
  return { render, getRefs, dispatch }
}

export async function asyncDispatch(timeout: number, promise: any[]) {
  return await Promise.race([Promise.all(promise), xSleep(timeout)])
}
