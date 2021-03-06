import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import Auth0Lock from 'auth0-lock'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink } from 'apollo-link'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.css'
import reducer from './reducer'
import registerServiceWorker from './registerServiceWorker'
import { AUTH0_ID_TOKEN } from './constants'
import ErrorBoudary from './pages/Error/ErrorBoudary'
import Loading from './components/Loading'

const App = lazy(() => import('./pages/App' /* webpackChunkName: "App" */))

const CreateUser = lazy(() =>
  import('./pages/CreateUser' /* webpackChunkName: "Createuser" */)
)

const Login = lazy(() =>
  import('./pages/Login' /* webpackChunkName: "Login" */)
)

// redux
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// apollo-client
const middlewareLink = new ApolloLink((operation, forward) => {
  const auth0IdToken = window.localStorage.getItem(AUTH0_ID_TOKEN)
  operation.setContext({
    headers: {
      authorization: 'Bearer ' + auth0IdToken || null
    }
  })
  return forward(operation)
})
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHCOOL_ENDPOINT
})
const link = middlewareLink.concat(httpLink)
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache().restore({})
})

// auth0
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const domain = process.env.REACT_APP_AUTH0_DOMAIN
const redirectUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://clockup.malloc.tokyo'
const option = {
  auth: {
    redirectUrl: redirectUrl
  }
}
const lock = new Auth0Lock(clientId, domain, option)

const LoginComponent = () => <Login lock={lock} />

ReactDOM.render(
  <ErrorBoudary>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/login" component={LoginComponent} />
              <Route path="/createuser" component={CreateUser} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </ErrorBoudary>,
  document.getElementById('root')
)

registerServiceWorker()
