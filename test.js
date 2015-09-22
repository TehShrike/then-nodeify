var test = require('tape')
var Promise = require('native-promise-only')
var nodeify = require('./index.js')

var sentinel = {}

test('converts a promise returning function into a callback function', function(t) {
	var add = nodeify(function (a, b) {
		return Promise.resolve(a)
			.then(function (a) {
				return a + b
			})
	})
	add(1, 2, function (err, res) {
		if (err) return t.end(err)
		t.equal(res, 3)
		return t.end()
	})
})
test('converts rejected promises into the first argument of the callback', function(t) {
	var add = nodeify(function (a, b) {
		return Promise.resolve(a)
			.then(function (a) {
				throw sentinel
			})
	})
	var add2 = nodeify(function (a, b) {
		throw sentinel
	})
	add(1, 2, function (err, res) {
		t.equal(err, sentinel)
		add2(1, 2, function (err, res){
			t.equal(err, sentinel)
			t.end()
		})
	})
})
test('passes through when no callback is provided', function(t) {
	var add = nodeify(function (a, b) {
		return Promise.resolve(a)
			.then(function (a) {
				return a + b
			})
	})
	add(1, 2)
		.then(function (res) {
			t.equal(res, 3)
			t.end()
		})
})
test('passes through the `this` argument', function(t) {
	var ctx = {}
	var add = nodeify(function (a, b) {
		return Promise.resolve(a)
			.then(function (a) {
				return a + b
			})
	})
	add.call(ctx, 1, 2, function (err, res) {
		t.equal(res, 3)
		t.equal(this, ctx)
		t.end()
	})
})
