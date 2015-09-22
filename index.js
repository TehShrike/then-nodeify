module.exports = function nodeify(fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return nodeifyPromise(fn.apply(this, arguments), callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex)
        })
      } else {
        process.nextTick(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

function nodeifyPromise(promise, callback, ctx) {
  if (typeof callback != 'function') return promise

  promise.then(function (value) {
    process.nextTick(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    process.nextTick(function () {
      callback.call(ctx, err)
    })
  })
}