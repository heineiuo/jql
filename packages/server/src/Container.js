import vm from 'vm'
import EventEmitter from 'events'
import isPlainObject from 'lodash/isplainObject'
import defaults from 'lodash/defaults'
import Store from './Store'

const acorn = require('acorn')

const injectModule = function (moduleName) {
  return {}
}

class Container extends EventEmitter {
  constructor(options){
    super()
    defaults(options, {
      timeout: 30000,
      injectModule: injectModule.bind(this)
    })

    /**
     * setTimtout, setInterval, setImmediate, process.nextTick, Promise is forbidden
     * because it callback may throw error in container environment
     */
    this._env = vm.createContext({
      Promise: () => { throw new SyntaxError('Promise is disabled in JQL. But async/await is allowed') }
    })
  }

  __require_cache = {}

  require = (moduleName) => {
    if (!this.__require_cache[moduleName]) {
      this.__require_cache[moduleName] = this.injectModule(moduleName)
    }
    return this.__require_cache[moduleName]
  }

  exec = (ql, options) => new Promise(async(resolve, reject) => {
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
      resolve(
        await vm.runInContext(ql.__fn, this._env, {
          displayErrors: false,
          timeout: options.timeout
        })(new Store(options))
      )
    } catch(e){
      e.name = `JQL::${e.name}`
      reject(e)
    }
  })
}

export default Container