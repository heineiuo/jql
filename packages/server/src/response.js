import { match, when } from 'match-when'

const defaultState = {}

export default (state=defaultState, action) => match(action.type, {
  [when('@@response/RESPONSE_SET')]: () => {
    return action.payload
  },
  
  [when()]: state
})

export const setResponse = response => ({
  type: '@@request/RESPONSE_SET',
  payload: response
})