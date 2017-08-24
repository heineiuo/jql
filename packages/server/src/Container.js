import vm from 'vm'
import EventEmitter from 'events'
import isPlainObject from 'lodash/isPlainObject'
import defaults from 'lodash/defaults'
import Store from './Store'
import env from './env'

const acorn = require('acorn')
// require('acorn-es7-plugin')(acorn)

const injectModule = function (moduleName) {
  return {}
}

class Container extends EventEmitter {
  constructor(options) {
    super()
    defaults(options, {
      timeout: 30000,
      injectModule: injectModule.bind(this)
    })
  }

  __require_cache = {}

  require = (moduleName) => {
    if (!this.__require_cache[moduleName]) {
      this.__require_cache[moduleName] = this.injectModule(moduleName)
    }
    return this.__require_cache[moduleName]
  }

  exec = (ql, options) => new Promise(async (resolve, reject) => {
    try {
      const { body } = acorn.parse(ql.__fn, {
        ecmaVersion: 8,
        sourceType: 'script',
        onToken: (token) => {
          if (token.type.label === 'while') {
            throw new SyntaxError('while is disabled')
          }
        }
      })
      const script = new vm.Script(ql.__fn)
      const db = new Store(options)
      resolve(
        await script.runInContext(env, {
          displayErrors: true,
          timeout: options.timeout
        })(db)
      )
    } catch (e) {
      e.name = `JQL::${e.name}`
      reject(e)
    }
  })
}

export default Container
