import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import { expressJQL } from '../../packages/server/src'
import { loadFunctionsFromJSON } from '../../packages/serverless/src'

const funcJsonPath = `${__dirname}/functions.json`
const functions = loadFunctionsFromJSON(JSON.parse(fs.readFileSync(funcJsonPath, 'utf8')))

const createFunction = (functionData) => (dispatch, getState) => {
  const localFunctions = JSON.parse(fs.readFileSync(funcJsonPath, 'utf8'))
  localFunctions[functionData.key] = functionData.value
  functions.put(functionData.key, functionData.value)
  injectActions({
    ...functions.all(), 
    createFunction
  })
  fs.writeFileSync(funcJsonPath, JSON.stringify(localFunctions), 'utf8')
}

const { middleware, injectActions } = expressJQL({
  actions: {
    ...functions.all(), 
    createFunction
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