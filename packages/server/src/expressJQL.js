import Query from './Query'

export default (options) => {

  const query = new Query({
    
  })

  return async (req, res, next) => {
    try {
      const queryOptions = { 
        reducers: options.reducers,
        actions: options.actions,
        middleware: options.middleware,
        request: req, 
        response: res 
      }
      const {__fn} = req.body
      const result = await query.exec({__fn}, queryOptions)
      res.json(result)
  
    } catch(e){
      next(e)
    }
  }
}