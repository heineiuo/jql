import vm from 'vm'

/**
 * setTimtout, setInterval, setImmediate, process.nextTick, Promise is forbidden
 * because it callback may throw error in container environment
 */
export default vm.createContext({
  Promise: () => { throw new SyntaxError('Promise is disabled in JQL. But async/await is allowed') }
})
