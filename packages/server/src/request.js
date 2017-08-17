import { match, when } from 'match-when'

const defaultState = {}

export default (state=defaultState, action) => match(action.type, {
  [when('@@request/REQUEST_SET')]: () => {
    return action.payload
  },
  
  [when()]: state
})

export const setRequest = request => ({
  type: '@@request/REQUEST_SET',
  payload: request
})