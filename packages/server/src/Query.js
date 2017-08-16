import vm from 'vm'
import isPlainObject from 'lodash/isplainObject'


const injectModule = function (moduleName){
  return {}
}

class Query {
  constructor(options){
    options = Object.assign({
      injectModule: injectModule.bind(this)
    }, options)
    this.injectModule = options.injectModule

    const mockGlobal = {
      Buffer: Buffer,
      Promise: Promise,
      console,
      __dirname: '/var/lib/jql',
      __filename: '/var/lib/jql/index.js',
      clearImmediate,
      clearTimeout,
      clearInterval,
      setImmediate,
      setTimeout,
      setInterval,
      process: {
        env: {},
        nextTick: process.nextTick,
        cwd: () => '/var/lib/jql'
      },
      require: this.require
    }
    mockGlobal.global = mockGlobal
    this._context = vm.createContext(mockGlobal)
  }

  __require_cache = {}

  require = (moduleName) => {
    if (!this.__require_cache[moduleName]) {
      this.__require_cache[moduleName] = this.injectModule(moduleName)
    }
    return this.__require_cache[moduleName]
  }

  createDb = () => ({})

  exec = (ql) => new Promise(async(resolve, reject) => {
    try {
      const db = this.createDb()
      this.script = new vm.Script(ql.__fn)
      const res = this.script.runInContext(this._context)(db)
      return resolve(await res)
    } catch(e){
      reject(e)
    }
  })
}

export default Query