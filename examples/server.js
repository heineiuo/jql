import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { Query } from '../packages/server/src'

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

const query = new Query({

})

app.use('/jql', async (req, res, next) => {
  try {
    const {__fn} = req.body
    const result = await query.exec({__fn}, { request: req, response: res })
    res.json(result)

  } catch(e){
    next(e)
  }
})

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.use(express.static(__dirname))

app.use((req, res) => {
  res.end('Not Found')
})

app.listen(8080, () => console.log('Listening on port 8080'))