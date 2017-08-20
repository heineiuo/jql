# jql
JQL is an execution engine use javascript as query language, tied to node.js backend service

* *100% javascript syntax*: No template, no new language. Just use javascript.
* *flexiblily*: Allow or deny keywords and internal functions flexiblily. Inject custom actions safely.

## Examples

We have several examples in the examples folder. Here is the first one to get you started:

```javascript
// client-side
import { HttpClient } from '@jql/client'
const client = new HttpClient({url: 'http://127.0.0.1:8080/jql'})
const res = await client.query(async function example(db){
	return {
		comment: db.params.comment, 
		time: await db.actions.getTime()
	}
}, {comment: 'hello world'})

console.log(await res.json())
// => 
// {
//   "comment": "hello world",
//   "time": "2017-08-20T05:36:23.453Z"
// } 
//

```

## Roadmap

```mermaid
gantt
  
```

## License

MIT License