import fetch from 'isomorphic-fetch'

class Client {
  constructor(options){
    options = Object.assign({
      beforeFetch: this.beforeFetch
    }, options)
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
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({__fn: fnText, __params: args})
      })
      const res = await fetch(this.url, fetchOptions)
      resolve(res)
    } catch(e){
      reject(e)
    }
  })
}

export default Client