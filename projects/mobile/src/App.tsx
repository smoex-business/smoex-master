import * as React from 'react'
import { Route } from 'react-router-dom'
import { configureStore } from '@react-kits/redux'
import { createLazyComponent } from '@react-kits/common'
import { PageRouter, Footer } from '@smoex-mobile/basic'
import { userSlice, accountAsyncAction } from '@smoex-logic/user'
import { Provider } from 'react-redux'
import { homeSlice } from '@smoex-master/logic'

const store = configureStore({
  injector: userSlice.injector,
})

window['store'] = store

const HomePage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/HomePage' /* webpackChunkName: "home" */),
})

const SearchPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/SearchPage' /* webpackChunkName: "search" */),
})

const WordPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/WordPage' /* webpackChunkName: "word" */),
})

const WordListPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/WordListPage' /* webpackChunkName: "word-list" */),
})

const WordCardPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/WordCardPage' /* webpackChunkName: "word-card" */),
})

const JPWordCardPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/JPSearchPage' /* webpackChunkName: "word-card" */),
})


// const HomePage: React.FC = () => {
//   return (<div>123465</div>)
// }

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PageRouter>
        <Route exact path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/word/list" component={WordListPage} />
        <Route path="/word/card" component={WordCardPage} />
        <Route path="/word" component={WordPage} />
        <Route path="/jpsearch" component={JPWordCardPage} />
      </PageRouter>
    </Provider>
  )
}

export default App
