import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux'
import thunkMiddleware from 'redux-thunk'
import defaults from 'lodash/defaults'
import requestReducer, { setRequest } from './request'
import responseReducer, { setResponse } from './response'

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') console.warn(action)
  return next(action)
}


class Store {
  constructor(args){
    const { reducers={}, actions={}, defaultState={}, request, params={}, response, middleware={} } = args
    
    defaults(middleware, {
      thunkMiddleware,
      // loggerMiddleware
    })

    const middlewareArray = Object.values(middleware)

    const createStoreWithMiddleware = applyMiddleware.apply(this, middlewareArray)(createStore)

    const store = createStoreWithMiddleware(combineReducers({
      ...reducers,
      request: requestReducer,
      response: responseReducer
    }), defaultState)

    store.dispatch(setRequest(request))
    store.dispatch(setResponse(response))

    // this.dispatch = (...args) => store.dispatch(...args)

    this.getState = () => {
      return Object.assign({}, store.getState())
    }

    this.params = params

    this.actions = bindActionCreators(actions, store.dispatch)
  }
}

export default Store
