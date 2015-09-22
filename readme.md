Copied straight from https://github.com/then/promise/blob/master/src/node-extensions.js but without anything else attached.

Converts a function that returns a promise into one that calls an error-first callback when the promise is resolved.

```js
var nodeify = require('nodeify')

var doThing = nodeify(functionThatReturnsAPromise)

doThing('/tmp/butts', function(err, results) {

})
```
