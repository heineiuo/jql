import fetch from 'isomorphic-fetch'

class Client {
  constructor(options){
    this.url = options.url
    this.beforeFetch = options.beforeFetch
  }

  beforeFetch = (options) => new Promise(resolve => resolve(options))

  changeUrl = (url) => {
    this.url = url
  }

  exec = (fn, args) => new Promise(async (resolve, reject) => {
    try {
      const fnText = `(${String(fn)})`
      const fetchOptions = await this.beforeFetch({
        body: JSON.stringify({__fn: fnText})
      })
      const res = await fetch(this.url, fetchOptions)
    } catch(e){
      reject(e)
    }
  })
}

export default Client