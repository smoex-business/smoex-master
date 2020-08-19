import * as React from 'react'
import { Route, Link } from 'react-router-dom'
import { configureStore, createSlice } from 'redux-async-kit'
import { StaticRouter, BrowserRouter } from 'react-router-dom'
import { createLazyComponent } from 'react-logic-utils'
import styles from './app.module.scss'
import { Provider } from 'react-redux'
import { accountReducer } from '@smoex-business/user'
import { Container } from '@smoex-web/basic'

const HomePage = createLazyComponent({
  loader: () => import('./containers/HomePage' /* webpackChunkName: "home" */),
})

export const testSlice = createSlice('testx', {
  user: accountReducer,
})

const Home = () => {
  return (
    <div>
      {/* home */}
      <Link to={'/user'}>To User</Link>
    </div>
  )
}
const User = () => {
  const [user] = testSlice.useSelector((state: any) => state.user.payload)
  console.log(JSON.stringify(user))
  const [count, setCount] = React.useState(0)
  return (
    <div className={styles.pos}>
      user: <br />
      {JSON.stringify(user)}
      <Link to={'/'}>To Home {count}</Link>
    </div>
  )
}

// export const Routes: React.FC = () => {
//   const [getInfo] = testSlice.useAction(accountAsyncAction.getInfo)
//   React.useEffect(() => {
//     getInfo()
//     // @ts-ignore
//     const initialState = window.__PRELOAD_STATE__
//     console.log(6666, initialState)
//   }, [])
//   return (
//     <React.Fragment>
      
//     </React.Fragment>
//   )
// }

// @ts-ignore
const initialState = typeof window === 'undefined' ? undefined : window.__PRELOAD_STATE__

export const store = configureStore(
  {
    injector: testSlice.injector,
  },
  initialState,
)

export const App: React.FC<any> = (props) => {
  return (
    <Container>
      <Route exact path="/" component={HomePage} />
      <Route path="/user" component={User} />
    </Container>
  )
}

export const AppSSR: React.FC<any> = (props) => {
  return (
    <Provider store={store}>
      <StaticRouter location={props.location}>
        {/* <Routes /> */}
      </StaticRouter>
    </Provider>
  )
}
