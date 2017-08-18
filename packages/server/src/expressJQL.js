import Container from './Container'
import defaults from 'lodash/defaults'

export default (args={}) => {

  defaults(args, {
    getDefaultState: _getDefaultState
  })

  const container = new Container({
    
  })

  const { getDefaultState } = args

  return async (req, res, next) => {
    try {
      const defaultState = await getDefaultState(req, res)
      const {__fn, __params} = req.body
      const ctxOptions = {
        reducers: args.reducers,
        actions: args.actions,
        middleware: args.middleware,
        request: req, 
        defaultState,
        params: __params,
        response: res 
      }
      const result = await container.exec({__fn}, ctxOptions)
      res.json(result)
    } catch(e){
      next(e)
    }
  }
}

const _getDefaultState = () => new Promise(resolve => resolve({}))