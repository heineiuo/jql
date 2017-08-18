import vm from 'vm'

class Functions {
  constructor () {

    /**
     * setTimtout, setInterval, setImmediate, process.nextTick, Promise is forbidden
     * because it callback may throw error in container environment
     */
    this._env = vm.createContext({
      Promise: () => { throw new SyntaxError('Promise is disabled in JQL. But async/await is allowed') }
    })

  }

  maps = {

  }

  put = (key, value) => {
    this.maps[key] = vm.runInContext(`(${String(value)})`, this._env)
  }

  all = () => {
    return Object.assign({}, this.maps)
  }
}

export default Functions