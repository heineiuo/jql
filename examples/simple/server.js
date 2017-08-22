import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { expressJQL } from '../../packages/server/src'

const { middleware } = expressJQL({
  actions: {
    getTime: () => (dispatch, getState) => new Promise(resolve => {
      resolve(new Date())
    }) 
  }
})

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())


app.use('/jql', middleware)

app.use(express.static(__dirname))

app.use((err, req, res, next) => {
  res.write(err.stack)
  res.end()
})

app.use((req, res) => {
  res.end('Not Found')
})

app.listen(8080, () => console.log('Listening on port 8080'))