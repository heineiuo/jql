import vm from 'vm'
import env from './env'

class Functions {
  constructor(options) {
    if (options.internalFunctions) {
      this.loadInternalFunctions(options.internalFunctions)
    }
  }

  maps = {

  }

  put = (key, value) => {
    this.maps[key] = value
  }

  del = (key) => {
    delete this.maps[key]
  }

  loadInternalFunctions = (obj) => {
    Object.keys(obj).forEach(key => {
      this.put(key, obj[key])
    })
  }

  loadExternalFunctions = (obj) => {
    Object.keys(obj).forEach(key => {
      this.put(key, vm.runInContext(`(${String(obj[key])})`, env))
    })
  }

  all = () => {
    return Object.assign({}, this.maps)
  }
}

export default Functions
