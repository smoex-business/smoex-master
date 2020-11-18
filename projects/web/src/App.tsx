import * as React from 'react'
import { Route, Link, StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import styles from './app.module.scss'
import { configureStore, createSlice } from '@react-kits/redux'
import { createLazyComponent } from '@react-kits/common'
import { accountReducer } from '@smoex-logic/user'
import { PageContainer } from '@smoex-web/basic'

const HomePage = createLazyComponent({
  loader: () => import ('./containers/HomePage' /* webpackChunkName: "home" */),
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
    <PageContainer>
      <Route exact path="/" component={HomePage} />
    </PageContainer>

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
