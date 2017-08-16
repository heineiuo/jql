import vm from 'vm'

class Query {
  constructor(scriptText){
    this.script = new vm.Script(scriptText)
    
  }

  exec = () => {
    this.script.runInContext(vm.createContext(mockGlobal))
  }
}

export default Query