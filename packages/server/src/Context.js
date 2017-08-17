import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { match, when } from 'match-when'
import defaults from 'lodash/defaults'

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') console.warn(action)
  return next(action)
}

const jqlReducer = (state={}, action) => match(action.type, {
  [when()]: state
})

class Context {
  constructor(args){
    const { reducers={}, actions={}, initialState={}, request, response, middleware={} } = args
    
    defaults(middleware, {
      thunkMiddleware,
      loggerMiddleware
    })

    const middlewareArray = Object.values(middleware)

    const createStoreWithMiddleware = applyMiddleware.apply(this, middlewareArray)(createStore)

    const store = createStoreWithMiddleware(combineReducers({
      ...reducers,
      jql: jqlReducer
    }), initialState)

    const actionCreators = bindActionCreators(actions, store.dispatch)

    this.dispatch = (...args) => store.dispatch(...args)
    this.getState = () => {
      return Object.assign({}, store.getState())
    }
    this.actions = actionCreators
  }
}

export default Context