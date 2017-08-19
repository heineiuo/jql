import Functions from './Functions'

export default json => {
  const functions = new Functions
  Object.keys(json).forEach(key => {
    functions.put(key, json[key])
  })
  return functions
}