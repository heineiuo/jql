import Container from './Container'

export default (options) => {

  const container = new Query({
    
  })

  return async (req, res, next) => {
    try {
      const ctxOptions = { 
        reducers: options.reducers,
        actions: options.actions,
        middleware: options.middleware,
        request: req, 
        response: res 
      }
      const {__fn} = req.body
      const result = await container.exec({__fn}, ctxOptions)
      res.json(result)
    } catch(e){
      next(e)
    }
  }
}