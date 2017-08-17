import vm from 'vm'
import EventEmitter from 'events'
import isPlainObject from 'lodash/isplainObject'
import defaults from 'lodash/defaults'
import Store from './Store'

const injectModule = function (moduleName) {
  return {}
}

class Container extends EventEmitter {
  constructor(options){
    super()
    defaults(options, {
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
      resolve(
        await vm.runInContext(ql.__fn, this._env, {
          displayErrors: true
        })(new Store(options))
      )
    } catch(e){
      reject(e)
    }
  })
}

export default Container