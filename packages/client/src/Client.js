import fetch from 'isomorphic-fetch'

class Client {
  constructor(options){
    options = Object.assign({
      beforeFetch: this.beforeFetch
    }, options)
    this.params = options.params || {}
    this.url = options.url
    this.beforeFetch = options.beforeFetch
  }

  beforeFetch = (options) => new Promise(resolve => resolve(options))

  changeUrl = (url) => {
    this.url = url
  }

  setParams = (params) => {
    Object.assign(this.params, params)
    return this
  }

  exec = (fn, args) => new Promise(async (resolve, reject) => {
    try {
      const fnText = `(${String(fn)})`
      const fetchOptions = await this.beforeFetch({
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({__fn: fnText, __params: this.params})
      })
      const res = await fetch(this.url, fetchOptions)
      resolve(res)
    } catch(e){
      reject(e)
    }
  })
}

export default Client