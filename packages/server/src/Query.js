import vm from 'vm'
import EventEmitter from 'events'
import isPlainObject from 'lodash/isplainObject'
import Context from './Context'

const injectModule = function (moduleName) {
  return {}
}

class Query extends EventEmitter {
  constructor(options){
    super()
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
      setImmediate: (fn, timeout) => setImmediate(() => {
        try {
          fn()
        } catch(e){
          this.emit('error', e)
        }
      }),
      setTimeout: (fn, timeout) => setTimeout(() => {
        try {
          fn()
        } catch(e){
          this.emit('error', e)
        }
      }),
      setInterval: (fn, timeout) => setInterval(() => {
        try {
          fn()
        } catch(e){
          this.emit('error', e)
        }
      }),
      process: {
        env: {},
        nextTick: (fn) => process.nextTick(() => {
          try {
            fn()
          } catch(e){
            this.emit('error', e)
          }
        }),
        cwd: () => '/var/lib/jql'
      },
      require: this.require
    }
    mockGlobal.global = mockGlobal
    this._vmcontext = vm.createContext(mockGlobal)
  }

  __require_cache = {}

  require = (moduleName) => {
    if (!this.__require_cache[moduleName]) {
      this.__require_cache[moduleName] = this.injectModule(moduleName)
    }
    return this.__require_cache[moduleName]
  }

  exec = (ql, options) => new Promise(async(resolve, reject) => {
    this.on('error', (e) => {
      // console.log(e)
      reject(e)
    })
    
    try {
      this.script = new vm.Script(ql.__fn)
      const proc = this.script.runInContext(this._vmcontext, {
        displayErrors: false
      })
      const db = new Context(options)
      const res = await proc(db)
      return resolve(res)
    } catch(e){
      reject(e)
    }
  })
}

export default Query