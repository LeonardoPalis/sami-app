(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _Zapt = require('../src/app/Zapt');

var _Zapt2 = _interopRequireDefault(_Zapt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Zapt = _Zapt2.default;
window.Zapt = _Zapt2.default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../src/app/Zapt":4}],2:[function(require,module,exports){
(function (process,global){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = logger.getLogger("zaptControllerLogger");

var gpsOptionsProduction = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var orientationOptionsProduction = {
  frequency: 500
};

var DRAW_CURSOR_INTERVAL = 500;
var TIME_DISPLAY_POPUP = 20000;

var AVOID_INVALID_PATH = false;

var Zapt = function () {
  function Zapt() {
    _classCallCheck(this, Zapt);

    this.accuracy = null;
    this.map = null;
    this.canScroll = null;
    this.destinationX = null;
    this.destinationY = null;
    this.currentPosition = null;
    this.currentPath = null;
    this.maxWidth = null;
    this.maxHeight = null;
    this.transformedDestination = null;
    this.printedPaths = null;
    this.lastMarker = null;
    var imageObj = null;
    this.popupsShown = {};
    this.key = null;
    this.mapContainerId = null;
    this.interestCircles = [];
    this.cardsCache = {};
    this.lastHighlightNearestPlace = null;
    this.positionQueue = [];
    this.positionQueueInterval = null;
    this.monitoringFenceService = null;
    this.initZoom = 0;
    this.opts = null;
    this.initTime = new Date().getTime();
  }

  _createClass(Zapt, [{
    key: 'initializeMap',
    value: function initializeMap(key, opts, callback) {
      if (typeof opts === "string") {
        var mapContainerId = opts;
        this.opts = {};
      } else {
        var mapContainerId = opts.mapContainerId;
        this.opts = opts;
      }
      this.key = key;
      this.mapContainerId = mapContainerId;

      this.initializeMapUI(mapContainerId, function () {
        if (callback) {
          callback();
        }
      });
    }

    // Common part for all maps initializations

  }, {
    key: 'initializeMapUI',
    value: function initializeMapUI(mapContainerId, callback) {
      var _this = this;

      var width = getWidth();
      var height = getHeight();
      height -= height * 0.15;

      this.currentOrientation = this.getCurrentOrientation();
      jQuery("#" + mapContainerId).css("width", width + "px");
      jQuery("#" + mapContainerId).css("height", height + "px");

      this.getCurrentLocal(this.key).then(function (currentLocalObj) {
        _async2.default.parallel([_async2.default.asyncify(_this.initializeLocationAlgorithms.bind(_this)), _async2.default.asyncify(_this.initializeMaterialIcons.bind(_this)), mapFirebaseDAO.cloudMapRetrieve.bind(mapFirebaseDAO, _this.key)], function (err, results) {

          if (err) {
            log.error(err);
          }

          var savedImage = results[2];

          window.imageObj = new Image(); //TODO Bruno - remove from global scope
          if (AVOID_INVALID_PATH) {
            _this.positionQueueInterval = setInterval(function () {
              _this.drawEachValidPosition();
            }, DRAW_CURSOR_INTERVAL);
          }
          _this.initializeFences(currentLocalObj);
          _this.drawCurrentPositionMapListener = function (event) {
            log.debug("Zapt - drawCurrentPositionMapListener");

            if (_this.currentPosition == null || !AVOID_INVALID_PATH) {
              var xyLeaflet = transformCoordinatesToLeaflet(event.detail.xy);
              _this.drawCurrentPositionMap(xyLeaflet, event.detail.accuracy);
              if (_this._isCoordsValid(xyLeaflet)) {
                _this.currentPosition = xyLeaflet;
                setTimeout(function () {
                  return _this.showHighlightNearestPlace({ latlng: { lat: xyLeaflet[1], lng: xyLeaflet[0] } });
                }, 200);
              }
            } else {
              var zaptCurrentPosition = transformCoordinatesToLeaflet(_this.currentPosition);
              _this.findShortestPath([[zaptCurrentPosition[0], zaptCurrentPosition[1]], event.detail.xy]).then(function (validPath) {
                if (validPath.length > 0) {
                  _this.currentPosition = [parseFloat(validPath[validPath.length - 1].split("_")[0]), parseFloat(validPath[validPath.length - 1].split("_")[1])];
                  _this.positionQueue = _this.positionQueue.concat(validPath);
                } else {
                  var xyLeaflet = transformCoordinatesToLeaflet(event.detail.xy);
                  _this.drawCurrentPositionMap(xyLeaflet, event.detail.accuracy);
                  if (_this._isCoordsValid(xyLeaflet)) {
                    _this.currentPosition = xyLeaflet;
                    setTimeout(function () {
                      return _this.showHighlightNearestPlace({ latlng: { lat: xyLeaflet[1], lng: xyLeaflet[0] } });
                    }, 200);
                  }
                }
              });
            }
            _this.checkMonitoringFence(event.detail.xy);
          };

          if (savedImage != null) {
            imageObj.src = savedImage;
          } else {
            imageObj.src = './img/' + currentLocalObj.mapUrl;
          }
          imageObj.crossOrigin = "Anonymous";

          imageObj.onload = function () {

            L.Icon.Default.imagePath = './img/';
            var bounds = [[0, 0], [imageObj.height, imageObj.width]];
            _this.canScroll = true;

            //TODO Bruno refactor this to remove global scope
            global.map = _this.map = L.map(mapContainerId, {
              crs: L.CRS.Simple,
              maxBounds: bounds,
              attributionControl: false,
              center: window.currentLocalObj ? window.currentLocalObj.mapCenterCoords || [imageObj.height / 2, imageObj.width / 2] : [imageObj.height / 2, imageObj.width / 2],
              minZoom: window.currentLocalObj ? window.currentLocalObj.mapMinZoom || -3 : -3,
              maxZoom: window.currentLocalObj ? window.currentLocalObj.mapMaxZoom || 1.5 : 1.5,
              zoomDelta: window.currentLocalObj ? window.currentLocalObj.mapZoomDelta || 0.1 : 0.1,
              zoomSnap: window.currentLocalObj ? window.currentLocalObj.mapZoomSnap || 0.1 : 0.1,
              zoomAnimation: true,
              bounceAtZoomLimits: true,
              zoomControl: false
            });

            _this.map.on('load', function (e) {
              if (window.currentLocalObj != null && window.currentLocalObj.mapInitZoom != null) {
                window.map.setZoom(window.currentLocalObj.mapInitZoom);
                _this.initZoom = window.currentLocalObj.mapInitZoom;
              } else {
                _this.initZoom = _this.map.getZoom();
              }
            }, _this);

            var image = L.imageOverlay(imageObj.src, bounds).addTo(_this.map);
            _this.map.fitBounds(bounds);
            jQuery("#refreshIndicator").hide();

            _this.map.on('move', function (e) {
              if (e.originalEvent && (e.originalEvent.constructor === window.PointerEvent || e.originalEvent.constructor === window.TouchEvent)) {
                _this.canScroll = false;
              }
            }, _this);

            _this.map.on('zoomstart', function (e) {
              _this.onZoom = true;
              _this.canScroll = false;
              if (_this.currentPosition) {
                _this.drawNavigationCursor(_this.currentPosition[0], _this.currentPosition[1]);
              }
              _this.zoomClearedCircles = _this.clearInterestsCircles();
              if (_this.currentPath != null && _this.destinationX != null && _this.destinationY != null) {
                _this.zoomClearedMarker = _this.clearMarker();
                _this.zoomClearedPaths = _this.clearPaths();
              }
              jQuery("svg .zapt-zoom-control").hide();
              jQuery(".zapt-circle-marker-control").hide();
            }, _this);

            _this.map.on('zoomend', function (e) {

              if (!_this.getMap()) {
                return;
              }
              _this.getMap().setView(map.getCenter());
              jQuery("svg .zapt-zoom-control").show();
              jQuery(".zapt-circle-marker-control").show();
              if (_this.zoomClearedCircles) {
                _this.drawInterestsCircles();
                _this.zoomClearedCircles = false;
              }
              if (_this.zoomClearedMarker) {
                _this.drawMarker();
                _this.zoomClearedMarker = false;
              }
              if (_this.zoomClearedPaths && _this.currentPath != null && _this.destinationX != null && _this.destinationY != null) {
                _this.drawPath(_this.currentPath, !_this.canScroll);
                _this.drawMarker();
                _this.zoomClearedPaths = false;
              }
              setTimeout(function () {
                if (_this.currentPosition) {
                  _this.drawNavigationCursor(_this.currentPosition[0], _this.currentPosition[1], true);
                }
              }, 400);

              _this.onZoom = false;
            }, _this);

            _this.map.on('click', function (event) {
              _this.drawInterestsCircles(event);
            }, _this);

            _this.map.on('popupclose', function (event) {
              _this.mapPopup = null;
            }, _this);

            var zaptControlsStyle = _this.getCurrentOrientation() === "portrait" ? "left: 80%; top: 80%;" : "left: 89%; top: 62%;";

            jQuery("#map-canvas").append('<div id="zapt-map-controls" class="leaflet-control-zoom leaflet-bar leaflet-control navigation-control" style="' + zaptControlsStyle + '">' + '<a id="zapt-currentPosition" class="leaflet-control-zoom-out" href="javascript:void(0);" title="Posição atual"><i class="material-icons small-icon where-i-am">gps_fixed</i></a>' + '<a id="zapt-cancelNavigation" class="leaflet-control-zoom-out" href="javascript:void(0);"  title="Cancelar Navegação">x</a>' + '</div>');

            jQuery("#zapt-currentPosition").click(function () {
              _this.scrollToCurrentLocation();
              return false;
            });
            jQuery("#zapt-cancelNavigation").click(function () {
              _this.cancelNavigation();
              return false;
            });

            setTimeout(_this.scrollToCurrentLocation.bind(_this), 50);
            jQuery("#" + mapContainerId).fadeIn("slow");
            _this.initializeDeviceOrientation();
            window.addEventListener('drawCurrentPositionMap', _this.drawCurrentPositionMapListener);
            if (callback) {
              callback();
            }
          };
        });
      });
    }
  }, {
    key: 'initializeMaterialIcons',
    value: function initializeMaterialIcons() {
      return new Promise(function (resolve, reject) {
        var contains = false;
        jQuery("link").each(function (i, link) {
          var href = jQuery(link).attr("href").toLowerCase();

          if (contains || href.indexOf("material") >= 0 && href.indexOf("icons") >= 0) {
            contains = true;
          } else {
            contains = false;
          }
        });

        if (contains) {
          resolve();
        } else {
          var ss = document.createElement("link");
          ss.type = "text/css";
          ss.rel = "stylesheet";
          ss.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
          ss.addEventListener('load', function (e) {
            resolve();
          });
          document.getElementsByTagName("head")[0].appendChild(ss);
        }
      });
    }
  }, {
    key: 'initializeDeviceOrientation',
    value: function initializeDeviceOrientation() {
      var _this2 = this;

      this.onOrientationChange = function (e) {
        var currentOrientation = _this2.getCurrentOrientation();
        if (_this2.currentOrientation != currentOrientation) {
          console.log("Orientation changed");
          _this2.stopListeners();
          setTimeout(function () {
            _this2.initializeMapUI(_this2.mapContainerId);
          }, 400);
        }
      };
      window.addEventListener("orientationchange", this.onOrientationChange);
    }
  }, {
    key: 'getCurrentOrientation',
    value: function getCurrentOrientation() {

      var currentOrientation = "";

      if (window.orientation == 0) {
        currentOrientation = "portrait";
      } else if (window.orientation == 90) {
        currentOrientation = "landscape";
      } else if (window.orientation == -90) {
        currentOrientation = "landscape";
      } else if (window.orientation == 180) {
        currentOrientation = "portrait";
      }

      return currentOrientation;
    }
  }, {
    key: 'drawEachValidPosition',
    value: function drawEachValidPosition() {
      var _this3 = this;

      if (this.positionQueue.length > 0) {
        var xyLeaflet = this.positionQueue.shift().split("_");
        xyLeaflet[0] = parseFloat(xyLeaflet[0]), xyLeaflet[1] = parseFloat(xyLeaflet[1]);
        this.drawCurrentPositionMap(xyLeaflet, 0); //accuracy);
        setTimeout(function () {
          return _this3.showHighlightNearestPlace({ latlng: { lat: xyLeaflet[1], lng: xyLeaflet[0] } });
        }, 200);
      }
    }
    // Initialize Sensors.

  }, {
    key: 'initializeLocationAlgorithms',
    value: function initializeLocationAlgorithms() {
      var _this4 = this;

      return new Promise(function (resolv, reject) {
        _this4.getCurrentLocal().then(function (place) {
          _this4.ipsService = getIPSService(place);
          _this4.ipsService.initialize().then(function () {
            resolv();
          }).catch(function (err) {
            log.error("Error when tried to initialized location algorithm.", err);
          });
        });
      });
    }
  }, {
    key: 'initializeFences',
    value: function initializeFences(currentLocalObj) {
      this.monitoringFenceService = new MonitoringFenceService(currentLocalObj.name, currentLocalObj.scaleM);
      this.monitoringFenceService.initialize();
      this.preloadedMap = this.preloadedMap || {};
      this.switchedMap = this.switchedMap || {};
    }
  }, {
    key: 'checkMonitoringFence',
    value: function checkMonitoringFence(xy) {
      var _this5 = this;

      var nextAction = this.monitoringFenceService.decideNextAction(xy[0], xy[1]);
      if (nextAction && nextAction.action === MONITORING_FENCE_ACTIONS.LOAD_MAP) {
        //loading before switching
        if (!this.preloadedMap[nextAction.mapId]) {
          mapFirebaseDAO.cloudMapAndMetadataRetrieve(nextAction.mapId, function () {
            log.info("Pre loaded next map " + nextAction.mapId);
          });
          this.preloadedMap[nextAction.mapId] = true;
        }
      } else if (nextAction && nextAction.action === MONITORING_FENCE_ACTIONS.SWITCH_MAP) {
        var now = new Date().getTime();
        if (!this.switchedMap[nextAction.mapId] || now - this.switchedMap[nextAction.mapId] > MAP_BETWEEN_TRANSITION_TIME) {
          this.switchedMap[nextAction.mapId] = now;
          this.switchedMap[currentLocalObj.name] = now;
          this.stopListeners();
          setTimeout(function () {
            _this5.initializeMap(nextAction.mapId, "map-canvas");
          }, 400);
        }
      }
    }
  }, {
    key: 'stopListeners',
    value: function stopListeners() {
      var _this6 = this;

      if (this.ipsService) {
        this.ipsService.cancel();
      }
      window.removeEventListener('drawCurrentPositionMap', this.drawCurrentPositionMapListener);
      window.removeEventListener("orientationchange", this.onOrientationChange);
      this.destinationX = null;
      this.destinationY = null;
      this.canScroll = true;
      this.currentPath = null;
      this.clearMarker();
      this.lastMarker = null;
      this.lastCircleMarker = null;
      this.destinationX = null;
      this.destinationY = null;
      this.currentPosition = null;
      this.currentPath = null;
      this.maxWidth = null;
      this.maxHeight = null;
      this.transformedDestination = null;
      this.printedPaths = null;
      this.positionQueue = [];
      this.positionQueueInterval = null;
      this.spaces = null;
      this.cardsCache = {};
      global.currentLocalObj = null;

      if (window.shortestPathInterval) {
        clearInterval(shortestPathInterval);
      }
      if (window.wifiIntervalId) {
        clearInterval(window.wifiIntervalId);
      }
      if (this.positionQueueInterval) {
        clearInterval(this.positionQueueInterval);
      }

      jQuery("#" + this.mapContainerId).fadeOut("slow");
      setTimeout(function () {
        var instaceMap = _this6.getMap();
        if (instaceMap != null) {
          _this6.getMap().remove();
        }
        _this6.map = null;
        global.map = null;
        var mapContainerParent = jQuery("#" + _this6.mapContainerId).parent();
        jQuery("#" + _this6.mapContainerId).remove();
        mapContainerParent.append('<div id="map-canvas"></div>').css(getMapCanvasStyle());
      }, 200);

      jQuery("#zapt-map-controls").fadeOut().remove();
    }

    //Use global "direction" to plot

  }, {
    key: 'drawCurrentPositionMap',
    value: function drawCurrentPositionMap(xy, accuracyPixels) {

      if (!this._isCoordsValid(xy)) {
        if (this.currentPosition == null || this.currentPosition.length < 2) {
          this.drawMsgPopup("position_not_available", "Não foi possível te localizar nesse mapa.");
        }
        return;
      }
      //removing not inside msg because will plot user position.
      if (this.notInsideMsgPopup != null) {
        this.notInsideMsgPopup.remove();
        this.notInsideMsgPopup = null;
      }

      //same point
      if (this.currentPosition != null && xy != null && this.currentPosition[0] == xy[0] && this.currentPosition[1] == xy[1]) {
        return;
      }

      if (accuracyPixels != null) {
        this.accuracy = accuracyPixels;
      } else {
        this.accuracy = 0;
      }

      if (!this.maxWidth) {
        this.maxWidth = parseInt(currentLocalObj.gridHeight);
        this.maxHeight = parseInt(currentLocalObj.gridWidth);
      }

      if (this.currentPath) {
        this.drawPath(this.currentPath, true);
      }

      if (this.transformedDestination) {
        this.drawMarker(this.transformedDestination[0], this.transformedDestination[1]);
      }

      this.drawNavigationCursor(xy[0], xy[1]);

      this.mapScrollTo(xy[0], xy[1]);
    }
  }, {
    key: 'cancelNavigation',
    value: function cancelNavigation() {
      clearInterval(this.shortestPathInterval);
      this.shortestPathInterval = null;
      this.currentPath = null;
      this.destinationX = null;
      this.destinationY = null;
      this.canScroll = true;
      this.clearPaths();
      this.clearMarker();
      this.clearInterestsCircles();
      this.transformedDestination = null;
      this.drawCurrentPositionMap(this.currentPosition);
      this.map.setZoom(this.initZoom);
    }
  }, {
    key: 'scrollToCurrentLocation',
    value: function scrollToCurrentLocation() {
      var shouldReturnCanScroll = !this.canScroll;
      this.canScroll = true;
      if (this.currentPosition) {
        this.mapScrollTo(this.currentPosition[0], this.currentPosition[1]);
      }
    }
  }, {
    key: 'mapScrollTo',
    value: function mapScrollTo(x, y) {
      if (this.canScroll) {
        this.map.setView(new L.LatLng(y, x));
      }
    }
  }, {
    key: 'findShortestPathBasedCurrentLocation',
    value: function findShortestPathBasedCurrentLocation(x, y) {
      var _this7 = this;

      //wait first time gps
      this.shortestPathInterval = setInterval(function () {
        if (_this7.currentPosition) {
          _this7.drawCurrentPositionMap(_this7.currentPosition);
          var zaptCurrentPosition = transformCoordinatesToLeaflet(_this7.currentPosition);
          var path = [[zaptCurrentPosition[0], zaptCurrentPosition[1]], [x, y]];
          _this7.canScroll = true;
          _this7.destinationX = path[1][0] + Math.floor(currentLocalObj.gridWidth / 2);
          _this7.destinationY = path[1][1] + Math.floor(currentLocalObj.gridHeight / 2);
          _this7.transformedDestination = transformCoordinatesToLeaflet([_this7.destinationX, _this7.destinationY]);
          _this7.findShortestPath(path).then(function (resultPath) {
            _this7.currentPath = resultPath;
            _this7.drawPath(_this7.currentPath);
            _this7.drawMarker();
            _this7.clearInterestsCircles();
            clearInterval(_this7.shortestPathInterval);
            _this7.shortestPathInterval = null;
            _this7.canScroll = false;
          });
        }
      }, 200);
    }
  }, {
    key: 'findShortestPath',
    value: function findShortestPath(path) {
      var _this8 = this;

      return new Promise(function (resolv, reject) {
        _this8.getCurrentLocal().then(function (place) {
          _this8.getSpaces(place.name).then(function (spaces) {
            _this8.getPaths(place.name).then(function (paths) {

              var destinationX = path[1][0] + Math.floor(place.gridWidth / 2);
              var destinationY = path[1][1] + Math.floor(place.gridHeight / 2);
              var transformedDestination = transformCoordinatesToLeaflet([destinationX, destinationY]);
              var tXY = transformedDestination;
              var originX = path[0][0];
              var originY = path[0][1];
              var g = new Graph();
              spaces = spaces || [];

              //sort by the nearest path from the origin
              paths = paths.sort(function (p1, p2) {
                p1.originDistanceDiff = Math.abs(getDistanceInPixel(p1[0][0], p1[0][1], p1[1][0], p1[1][1]) - (getDistanceInPixel(p1[0][0], p1[0][1], originX, originY) + getDistanceInPixel(originX, originY, p1[0][0], p1[0][1])));
                p2.originDistanceDiff = Math.abs(getDistanceInPixel(p2[0][0], p2[0][1], p2[1][0], p2[1][1]) - (getDistanceInPixel(p2[0][0], p2[0][1], originX, originY) + getDistanceInPixel(originX, originY, p2[0][0], p2[0][1])));

                p1.originDistanceP1 = getDistanceInPixel(p1[0][0], p1[0][1], originX, originY);
                p1.originDistanceP2 = getDistanceInPixel(p1[1][0], p1[1][1], originX, originY);
                p1.originDistanceP1 < p1.originDistanceP2 ? p1.nearestPathPoint = p1.originDistanceP1 : p1.nearestPathPoint = p1.originDistanceP2;

                p2.originDistanceP1 = getDistanceInPixel(p2[0][0], p2[0][1], originX, originY);
                p2.originDistanceP2 = getDistanceInPixel(p2[1][0], p2[1][1], originX, originY);
                p2.originDistanceP1 < p2.originDistanceP2 ? p2.nearestPathPoint = p2.originDistanceP1 : p2.nearestPathPoint = p2.originDistanceP2;

                p1.rate = p1.originDistanceDiff + p1.nearestPathPoint;
                p2.rate = p2.originDistanceDiff + p2.nearestPathPoint;

                return p1.rate - p2.rate;
              });

              var originPath = paths[0];

              //sort by the nearest path from the destination
              paths = paths.sort(function (p1, p2) {
                p1.destinationDistanceDiff = Math.abs(getDistanceInPixel(p1[0][0], p1[0][1], p1[1][0], p1[1][1]) - (getDistanceInPixel(p1[0][0], p1[0][1], destinationX, destinationY) + getDistanceInPixel(destinationX, destinationY, p1[1][0], p1[1][1])));
                p2.destinationDistanceDiff = Math.abs(getDistanceInPixel(p2[0][0], p2[0][1], p2[1][0], p2[1][1]) - (getDistanceInPixel(p2[0][0], p2[0][1], destinationX, destinationY) + getDistanceInPixel(destinationX, destinationY, p2[1][0], p2[1][1])));

                p1.destinationDistanceP1 = getDistanceInPixel(p1[0][0], p1[0][1], destinationX, destinationY);
                p1.destinationDistanceP2 = getDistanceInPixel(p1[1][0], p1[1][1], destinationX, destinationY);
                p1.destinationDistanceP1 < p1.destinationDistanceP2 ? p1.nearestPathPoint = p1.destinationDistanceP1 : p1.nearestPathPoint = p1.destinationDistanceP2;

                p2.destinationDistanceP1 = getDistanceInPixel(p2[0][0], p2[0][1], destinationX, destinationY);
                p2.destinationDistanceP2 = getDistanceInPixel(p2[1][0], p2[1][1], destinationX, destinationY);
                p2.destinationDistanceP1 < p2.destinationDistanceP2 ? p2.nearestPathPoint = p2.destinationDistanceP1 : p2.nearestPathPoint = p2.destinationDistanceP2;

                p1.rate = p1.destinationDistanceDiff + p1.nearestPathPoint;
                p2.rate = p2.destinationDistanceDiff + p2.nearestPathPoint;

                return p1.rate - p2.rate;
              });

              var destinationPath = paths[0];

              spaces.forEach(function (space, i) {
                var edges = {};
                paths.forEach(function (p2) {
                  if (p2[0][0] == space.coords[0] && p2[0][1] == space.coords[1]) {
                    edges[p2[1][0] + "_" + p2[1][1]] = getDistanceInPixel(p2[0][0], p2[0][1], p2[1][0], p2[1][1]);
                  } else if (p2[1][0] == space.coords[0] && p2[1][1] == space.coords[1]) {
                    edges[p2[0][0] + "_" + p2[0][1]] = getDistanceInPixel(p2[0][0], p2[0][1], p2[1][0], p2[1][1]);
                  }
                });
                g.addVertex(space.coords[0] + "_" + space.coords[1], edges);
              });

              var endPoint;
              if (destinationPath.destinationDistanceP1 < destinationPath.destinationDistanceP2) {
                endPoint = destinationPath[0][0] + "_" + destinationPath[0][1];
              } else {
                endPoint = destinationPath[1][0] + "_" + destinationPath[1][1];
              }

              var currentPath = g.shortestPath(originPath[0][0] + "_" + originPath[0][1], endPoint);

              //removing path that contains currentPoint
              if (currentPath.length >= 2) {
                var p1 = currentPath[currentPath.length - 1].split("_");
                var p2 = currentPath[currentPath.length - 2].split("_");
                if (getDistanceInPixel(p1[0], p1[1], originX, originY) + getDistanceInPixel(originX, originY, p2[0], p2[1]) - getDistanceInPixel(p1[0], p1[1], p2[0], p2[1]) <= 5) {
                  currentPath.length = currentPath.length - 1;
                }
              }

              currentPath = currentPath.concat([originX + "_" + originY]).reverse();

              if (currentPath.length === 1) {
                currentPath.push(destinationX + "_" + destinationY);
              }

              currentPath = currentPath.map(function (p) {
                p = p.split("_");
                p = transformCoordinatesToLeaflet([p[0], p[1]]);
                return p[0] + "_" + p[1];
              });
              return resolv(currentPath);
            });
          });
        });
      });
    }
  }, {
    key: 'showHighlightNearestPlace',
    value: function showHighlightNearestPlace(e, cameByClick) {
      var _this9 = this;

      if (e.latlng == null || this.lastHighlightNearestPlace != null && e != null && e.latlng != null && this.lastHighlightNearestPlace[0] == e.latlng.lng && this.lastHighlightNearestPlace[1] == e.latlng.lat) {
        return;
      }

      var xy = transformCoordinatesToLeaflet([e.latlng.lng, e.latlng.lat]);
      this.getSpaces().then(function (spaces) {
        if (!spaces || spaces.length === 0 || !currentLocalObj) {
          return;
        }

        var MIN_PIXELS_IDENTIFY_PLACE = currentLocalObj.numPxToShowPopup || 120;
        var coords,
            space,
            foundCoords = [];

        for (var i = 0; i < spaces.length; i++) {
          space = spaces[i];
          coords = space.coords;

          if (space.type === "I" && coords && space.category !== "Sanitário e Apoio" && space.category !== "Sanitário") {
            coords.distance = Math.sqrt(Math.pow(coords[0] - xy[0], 2) + Math.pow(coords[1] - xy[1], 2));
            if (coords.distance < MIN_PIXELS_IDENTIFY_PLACE) {
              foundCoords.push(coords);
            }
          }
        }

        if (foundCoords.length > 0) {
          foundCoords.sort(function (c1, c2) {
            return c1.distance - c2.distance;
          });
          log.debug('Identified space', foundCoords);
          _this9.findCardByLatLng(foundCoords[0][0], foundCoords[0][1], cameByClick);
        }

        _this9.lastHighlightNearestPlace = [e.latlng.lng, e.latlng.lat];
      });
    }
  }, {
    key: 'clearPaths',
    value: function clearPaths() {
      this.printedPaths = this.printedPaths || [];
      if (this.printedPaths.length > 0) {
        this.printedPaths.forEach(function (path) {
          path.remove();
        });
        return true;
      }
      return false;
    }
  }, {
    key: 'clearMarker',
    value: function clearMarker() {
      if (this.marker) {
        this.marker.remove();
        this.marker = null;
        if (this.lastCircleMarker) {
          this.lastCircleMarker.remove();
          this.lastCircleMarker = null;
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'drawNavigationCursor',
    value: function drawNavigationCursor(x1, y1, redrawCircle) {
      var _this10 = this;

      if (this.onZoom) {
        return;
      }

      if (this.map == null) {
        this.map = global.map;
      }

      var arrowZoomRatio = this.map.getZoom() < 0 ? 1 / Math.abs(this.map.getZoom()) * (currentLocalObj.arrowZoomRatio || 0.5) : this.map.getZoom() * (currentLocalObj.arrowZoomRatio || 0.5);
      var initArrowWidth = 38,
          arrowWidth = 38,
          initArrowHeight = 40,
          arrowHeight = 40;
      var ARROW_MIN_HEIGHT = 16,
          ARROW_MIN_WIDTH = 12;
      var CIRCLE_MIN_HEIGHT = 78,
          CIRCLE_MIN_WIDTH = 78,
          CIRCLE_MAX_HEIGHT = 85,
          CIRCLE_MAX_WIDTH = 85;

      x1 += parseFloat(currentLocalObj.gridWidth);
      y1 -= parseFloat(currentLocalObj.gridHeight);

      if (!window.angle) {
        window.angle = 0;
      }
      var angle = Math.round(window.angle);
      log.debug("Drawing arrow in " + angle + " degrees");

      if (!window.currentLocalObj || !window.currentLocalObj.navigationCursor || window.currentLocalObj.navigationCursor.toLowerCase() === 'arrow') {
        arrowWidth = arrowWidth + arrowWidth * arrowZoomRatio < ARROW_MIN_WIDTH ? ARROW_MIN_WIDTH : arrowWidth + arrowWidth * arrowZoomRatio;
        arrowHeight = arrowHeight + arrowHeight * arrowZoomRatio < ARROW_MIN_HEIGHT ? ARROW_MIN_HEIGHT : arrowHeight + arrowHeight * arrowZoomRatio;
        this.drawNavigationSvgArrow(x1, y1, arrowWidth);
      } else {
        arrowWidth = arrowWidth + arrowWidth * arrowZoomRatio < CIRCLE_MIN_WIDTH ? CIRCLE_MIN_WIDTH : arrowWidth + arrowWidth * arrowZoomRatio;
        arrowHeight = arrowHeight + arrowHeight * arrowZoomRatio < CIRCLE_MIN_HEIGHT ? CIRCLE_MIN_HEIGHT : arrowHeight + arrowHeight * arrowZoomRatio;
        if (arrowWidth > CIRCLE_MAX_WIDTH) {
          arrowWidth = CIRCLE_MAX_WIDTH;
        }
        if (arrowHeight > CIRCLE_MAX_HEIGHT) {
          arrowHeight = CIRCLE_MAX_HEIGHT;
        }
        var userPointer = L.icon({
          iconUrl: './img/navigation-cursor-circle.png',
          iconSize: [arrowWidth, arrowHeight],
          className: "location-marker"
        });

        if (this.lastMarker == null) {
          this.lastMarker = L.marker(L.latLng([y1, x1]), { icon: userPointer, rotationAngle: angle, rotationOrigin: "center center", interactive: false }).addTo(this.map);
        } else {
          this.lastMarker.setLatLng(L.latLng([y1, x1]));
        }

        // accuracy circle
        if (redrawCircle && this.lastCircleMarker != null) {
          this.lastCircleMarker.remove();
          this.lastCircleMarker = null;
        }

        if (this.lastCircleMarker == null) {
          this.lastCircleMarker = L.circle(L.latLng([y1, x1]), {
            radius: this.accuracy || 80,
            opacity: 0.4,
            fillColor: '#3180ba',
            color: '#3180ba',
            stroke: false,
            interactive: false,
            className: "zapt-circle-marker-control"
          }).addTo(map);
        } else {
          jQuery(".zapt-circle-marker-control").hide();
          setTimeout(function () {
            if (_this10.lastCircleMarker == null) {
              _this10.lastCircleMarker = L.circle(L.latLng([y1, x1]), {
                radius: _this10.accuracy || 80,
                opacity: 0.4,
                fillColor: '#3180ba',
                color: '#3180ba',
                stroke: false,
                interactive: false,
                className: "zapt-circle-marker-control"
              }).addTo(map);
            } else {
              if (_this10._isCoordsValid([x1, y1])) {
                jQuery(".zapt-circle-marker-control").hide();
                _this10.lastCircleMarker.setLatLng(L.latLng([y1, x1]));
                if (_this10.accuracy) {
                  _this10.lastCircleMarker.setRadius(_this10.accuracy);
                }
                jQuery(".zapt-circle-marker-control").show();
              }
            }
          }, 560);
        }
      }
    }
  }, {
    key: 'drawMarker',
    value: function drawMarker(x, y, callback) {

      if (x == null) {
        x = this.transformedDestination[0];
      }
      if (y == null) {
        y = this.transformedDestination[1];
      }
      callback = callback || function () {};
      var p = new L.LatLng(y, x);

      if (this.marker) {
        this.marker.remove();
      }

      this.marker = L.marker(p).addTo(this.map);
      this.mapScrollTo(x, y);
      callback();
    }
  }, {
    key: 'drawPath',
    value: function drawPath(path, dontDoZoom) {
      var _this11 = this;

      var lastPoint;
      var beforeLastPoint;
      var minX;
      var maxX;
      var minY;
      var maxY;
      var x1;
      var x2;
      var y1;
      var y2;
      this.clearPaths();
      this.clearMarker();
      this.printedPaths = [];
      var minX = 2000;
      var maxX = 0;
      var minY = 2000;
      var maxY = 0;

      path.forEach(function (point, count) {

        point = point.split("_");

        if (lastPoint) {

          _this11.printedPaths.push(_this11.drawLine([[parseFloat(lastPoint[0]), parseFloat(lastPoint[1])], [parseFloat(point[0]), parseFloat(point[1])]], currentLocalObj.gridWidth, currentLocalObj.gridHeight, currentLocalObj.pathColor, currentLocalObj.pathWidth));
          _this11.printedPaths = _this11.printedPaths.concat(_this11.drawPathArrow([[parseFloat(point[0]), parseFloat(point[1])], [parseFloat(lastPoint[0]), parseFloat(lastPoint[1])]], currentLocalObj.gridWidth, currentLocalObj.gridHeight, currentLocalObj.pathColor, currentLocalObj.pathWidth));

          // Calculate path area
          x2 = parseInt(point[0]) + currentLocalObj.gridWidth / 2;
          y2 = parseInt(point[1]) + currentLocalObj.gridHeight / 2;
          x1 = parseInt(lastPoint[0]) + currentLocalObj.gridWidth / 2;
          y1 = parseInt(lastPoint[1]) + currentLocalObj.gridHeight / 2;
          if (x1 < minX) {
            minX = x1;
          };
          if (x2 < minX) {
            minX = x2;
          };
          if (x1 > maxX) {
            maxX = x1;
          };
          if (x2 > maxX) {
            maxX = x2;
          };
          if (y1 < minY) {
            minY = y1;
          };
          if (y2 < minY) {
            minY = y2;
          };
          if (y1 > maxY) {
            maxY = y1;
          };
          if (y2 > maxY) {
            maxY = y2;
          };

          // Take a point in the line 10 pixels ahead
          var angle = Math.atan2(y2 - y1, x2 - x1);
          var sin = Math.sin(angle) * 25;
          var cos = Math.cos(angle) * 25;
          var x = x1 + cos;
          var y = y1 + sin;
        } else {
          if (!dontDoZoom) {
            _this11.mapScrollTo(parseFloat(point[0]), parseFloat(point[1]));
          }
        }
        beforeLastPoint = lastPoint;
        lastPoint = point;
      });

      // Draw the final arrow
      x1 = parseInt(beforeLastPoint[0]) + currentLocalObj.gridWidth / 2;
      y1 = parseInt(beforeLastPoint[1]) + currentLocalObj.gridHeight / 2;
      x2 = parseInt(lastPoint[0]) + currentLocalObj.gridWidth / 2;
      y2 = parseInt(lastPoint[1]) + currentLocalObj.gridHeight / 2;
      var angle = Math.atan2(y2 - y1, x2 - x1);
      var sin = Math.sin(angle) * 20;
      var cos = Math.cos(angle) * 20;
      x2 = x2 + cos;
      y2 = y2 + sin;

      if (!dontDoZoom) {
        this.zoomToPath(parseInt(minX), parseInt(minY), parseInt(maxX), parseInt(maxY));
      }
    }
  }, {
    key: 'zoomToPath',
    value: function zoomToPath(x1, y1, x2, y2) {
      var _this12 = this;

      setTimeout(function () {
        _this12.canScroll = true;
        _this12.scrollToCurrentLocation();
        _this12.map.fitBounds([[y1 - 70, x1 - 100], [y2 + 60, x2 + 100]]);
        _this12.canScroll = false;
      }, 300);
    }
  }, {
    key: 'drawLine',
    value: function drawLine(onePath, space_width, space_height, color, lineWidth) {

      if (!lineWidth || lineWidth === "undefined") {
        lineWidth = 12;
      }
      if (!color || color === "undefined") {
        color = "white";
      }

      var x1 = onePath[0][0] + space_width / 2;
      var y1 = onePath[0][1] + space_height / 2;

      var x2 = onePath[1][0] + space_width / 2;
      var y2 = onePath[1][1] + space_height / 2;

      var points = [new L.LatLng(y2, x2), new L.LatLng(y1, x1)];
      var options = {
        color: color,
        weight: lineWidth,
        opacity: 0.7
      };

      return L.polyline(points, options).addTo(this.map);
    }
  }, {
    key: 'drawPathArrow',
    value: function drawPathArrow(path, space_width, space_height, color, lineWidth) {
      currentLocalObj.scaleM = currentLocalObj.scaleM || 1;
      var polygons = [];
      var pxDistance = currentLocalObj.scaleM * 0.4;
      var point1 = transformCoordinatesToLeaflet(path[0]);
      var point2 = transformCoordinatesToLeaflet(path[1]);
      var angle = adjustAngle(calculateAngleCartesian(point1[0], point1[1], point2[0], point2[1]) * 180 / Math.PI) * Math.PI / 180;
      var posLat0 = Math.cos(angle + 90 * Math.PI / 180) * currentLocalObj.scaleM * 0.15;
      var posLong0 = Math.sin(angle + 90 * Math.PI / 180) * currentLocalObj.scaleM * 0.15;
      angle += 62 * Math.PI / 180;
      var posLat1 = Math.cos(angle) * pxDistance;
      var posLong1 = Math.sin(angle) * pxDistance;
      angle += 60 * Math.PI / 180;
      var posLat2 = Math.cos(angle) * pxDistance;
      var posLong2 = Math.sin(angle) * pxDistance;

      path[0][0] += space_width / 2;
      path[0][1] += space_height / 2;
      path[1][0] += space_width / 2;
      path[1][1] += space_height / 2;

      var points = [new L.LatLng(path[1][1] - posLat0 * 1.4, path[1][0] - posLong0 * 1.4), new L.LatLng(path[1][1] - posLat0 * 1.4 + posLat1, path[1][0] + posLong1 - posLong0 * 1.4), new L.LatLng(path[1][1] - posLat0 * 1.4 + posLat2, path[1][0] + posLong2 - posLong0 * 1.4)];

      var options = {
        color: currentLocalObj.pathArrowColor || "grey",
        fillColor: currentLocalObj.pathArrowColor || "grey",
        fill: true,
        fillOpacity: 0.7,
        opacity: 0.7,
        stroke: false
      };

      var pointsLine = [new L.LatLng(path[1][1] + posLat0 * 1.3, path[1][0] + posLong0 * 1.3), new L.LatLng(path[1][1] + posLat0 * 2.2, path[1][0] + posLong0 * 2.2)];
      polygons.push(L.polyline(pointsLine, {
        color: currentLocalObj.pathArrowColor || "grey",
        weight: lineWidth / 3.5,
        opacity: 0.7
      }).addTo(this.map));
      polygons.push(L.polygon(points, options).addTo(this.map));
      return polygons;
    }
  }, {
    key: 'drawNavigationSvgArrow',
    value: function drawNavigationSvgArrow(x, y, arrowWidth) {

      var pxDistance = currentLocalObj.scaleM * 0.4;
      pxDistance < arrowWidth ? pxDistance = arrowWidth : pxDistance = pxDistance;
      var angle = !isNaN(parseFloat(global.angle)) ? adjustAngle(global.angle + 90) : adjustAngle(+90);
      angle = adjustAngle(angle + 60);
      var posLat1 = y + Math.cos(angle * Math.PI / 180) * pxDistance;
      var posLong1 = x + Math.sin(angle * Math.PI / 180) * pxDistance;
      angle = adjustAngle(angle + 60);
      var posLat2 = y + Math.cos(angle * Math.PI / 180) * pxDistance;
      var posLong2 = x + Math.sin(angle * Math.PI / 180) * pxDistance;
      angle = adjustAngle(global.angle + 90 + 90) * Math.PI / 180;
      var posLat3 = y - Math.cos(angle) * (pxDistance + pxDistance / 7);
      var posLong3 = x - Math.sin(angle) * (pxDistance + pxDistance / 7);

      var points = [new L.LatLng(y, x), new L.LatLng(posLat1, posLong1), new L.LatLng(posLat3, posLong3), new L.LatLng(posLat2, posLong2), new L.LatLng(y, x)];

      var defaultArrowColor = "#4286f4";
      var options = {
        color: global.currentLocalObj.arrowColor || defaultArrowColor,
        fillColor: global.currentLocalObj.arrowColor || defaultArrowColor,
        fill: true,
        fillOpacity: 0.8,
        opacity: 0.8,
        stroke: false
      };

      if (this.lastMarker != null) {
        this.lastMarker.remove();
      }
      this.lastMarker = L.polyline(points, options).addTo(this.map);
    }
  }, {
    key: 'drawInterestsCircles',
    value: function drawInterestsCircles(e) {
      var _this13 = this;

      var map = this.getMap();

      if (this.clearInterestsCircles()) {
        return;
      }

      this.getSpaces().then(function (spaces) {
        var space,
            foundSpaces = [];

        for (var i = 0; i < spaces.length; i++) {
          space = spaces[i];
          if (space.type === "I" && space.coords && space.category !== "Sanitário e Apoio" && space.category !== "Sanitário") {
            foundSpaces.push(space.coords);
          }
        }

        _this13.interestCircles = [];
        foundSpaces.forEach(function (coords) {
          var leafletCoords = transformCoordinatesToLeaflet(coords);
          _this13.interestCircles.push(L.circle(L.latLng([leafletCoords[1], leafletCoords[0]]), {
            radius: currentLocalObj.scaleM * 1.7 || 40,
            opacity: 0.4,
            fillColor: '#8d02ff',
            color: '#8d02ff',
            stroke: false,
            className: "zapt-zoom-control"
          }).on('click', function (event) {
            _this13.clickInterestCircle(coords);
          }, _this13).addTo(map));
        });

        if (e) {
          _this13.showHighlightNearestPlace(e, true);
        }
      });
    }
  }, {
    key: 'clearInterestsCircles',
    value: function clearInterestsCircles() {
      if (this.interestCircles && this.interestCircles.length > 0) {
        this.interestCircles.forEach(function (circle) {
          circle.remove();
        });
        this.interestCircles = [];
        return true;
      }
      return false;
    }
  }, {
    key: 'clickInterestCircle',
    value: function clickInterestCircle(coords) {
      var _this14 = this;

      this.getSpaces().then(function (spaces) {
        mapLocalStorageDAO.retrieveSpace(currentLocalObj.name, coords[0], coords[1], spaces).then(function (space) {
          if (space != null) {
            log.debug('Identified space', coords[0], coords[1]);
            _this14.findCardByLatLng(coords[0], coords[1], true);
          }
          return false;
        });
      });
      this.getMap().originalEvent.preventDefault(); //intentional error to break leaflet event chain
    }
  }, {
    key: 'findCardByLatLng',
    value: function findCardByLatLng(x, y, cameByClick) {
      var _this15 = this;

      if (Object.keys(this.cardsCache).length === 0) {
        regionService.listRegions(this.key).then(function (regions) {
          if (regions != null && regions.regionsMap != null) {
            _this15.cardsCache = regions.regionsMap;
          }
        });
      } else {
        var cachedRegion = regionService._findNearestRegionByXY(x, y, this.key, this.cardsCache);
        if (cachedRegion != null) {
          return this.openPopup(cachedRegion, cameByClick);
        }
      }

      regionService.findNearestRegionByXY(x, y, this.key).then(function (region) {
        if (region) {
          _this15.cardsCache[region.id] = region; //caching
          _this15.openPopup(region, cameByClick);
        }
      }, function (err) {
        log.error("Error when findCardByLatLng", err);
      });
    }
  }, {
    key: 'openPopup',
    value: function openPopup(region, cameByClick) {
      var _this16 = this;

      //should not open popup when path is shown.
      if (!cameByClick && (this.currentPath != null || this.opts.initWithoutPopup && new Date().getTime() - this.initTime < TIME_DISPLAY_POPUP)) {
        return;
      }

      var coords = transformCoordinatesToLeaflet([region.x, region.y]);
      if (region) {
        var key = region.x + "_" + region.y;
        if (!this.popupsShown[key] || cameByClick) {
          this.popupsShown[key] = new Date().getTime();
          imageService.downloadImage(region.id, region.media).then(function (url) {
            var title = region.title || region.headerTitle || region.headerSubtitle;
            log.debug("Opening popup id " + region.id + " title " + title);
            var html = '<div class="interest-popup"><img src="' + url + '"/>' + '<span class="interest-popup-title" ' + (title.length > 25 ? 'style="font-size: 14px !important"' : '') + '>' + title + '</span><div>' + '<span><a class="interest-popup-actions" href="#/card/' + region.id + '" style="' + muiTheme.palette.primary2Color + '">Ver mais</a></span>' + '<span><a class="interest-popup-actions" href="javascript:void(0);" onclick="zapt.clearPopup(); zapt.findShortestPathBasedCurrentLocation(' + region.x + ',' + region.y + ')" style="' + muiTheme.palette.primary2Color + '">Ir para</a></span>';
            html += '</div>';
            _this16.drawPopup(coords[0], coords[1], html);
          });
        }

        var key = region.x + "_" + region.y + "_ads";
        var now = new Date().getTime();
        var timeAds = this.popupsShown[key] || now - SAME_ADS_INTERVAL_TIME;
        if (!cameByClick && region.adsPopup != null && now - timeAds >= SAME_ADS_INTERVAL_TIME) {
          this.popupsShown[key] = new Date().getTime();
          setTimeout(function () {
            var html = '<div class="interest-popup">' + '<span class="interest-popup-title">' + (region.title || region.headerTitle || region.headerSubtitle) + '</span><div>' + '<span>' + region.adsContent + '</span><br/>' + '<span><a class="interest-popup-actions" href="#" style="padding-left: 0px;">Quero pedir!</a></span>' + '</div>';

            _this16.clearAdsPopup();
            var xAdsPos = _this16.map.getSize().x < _this16.currentPosition[1] ? _this16.currentPosition[0] : _this16.map.getSize().x / 2 - 150;
            var yAdsPos = _this16.map.getSize().y < _this16.currentPosition[1] ? _this16.currentPosition[1] + _this16.map.getSize().y * 2 / 3 : 50;
            _this16.oldCanScroll = _this16.canScroll;
            _this16.canScroll = false;
            _this16.adsMapPopup = L.popup({
              className: "nearby-ads-popup"
            }).setLatLng(_this16.map.getCenter()).setContent(html).openOn(_this16.map);

            setTimeout(function () {
              _this16.canScroll = true;
              _this16.clearAdsPopup();
            }, MAP_AUTOCLOSE_POPUP_TIMEOUT * 1.5);
            return _this16.adsMapPopup;
          }, 2000);
        }
      }
    }
  }, {
    key: 'drawPopup',
    value: function drawPopup(x, y, message, options) {
      var _this17 = this;

      if (this.mapPopup == null) {

        var popup = L.popup(options).setLatLng(new L.LatLng(y, x)).setContent(message);

        this.oldCanScroll = this.canScroll;
        this.canScroll = false;
        options = options || {};
        this.mapPopup = popup.openOn(this.map);
        this.zoomPopup();
        //autoclose
        setTimeout(function () {
          _this17.clearPopup(message);
          _this17.canScroll = _this17.oldCanScroll;
        }, MAP_AUTOCLOSE_POPUP_TIMEOUT);
        return this.mapPopup;
      }
    }
  }, {
    key: 'drawMsgPopup',
    value: function drawMsgPopup(id, msg) {
      var _this18 = this;

      if (this.notInsideMsgPopup != null && this.notInsideMsgPopup.zaptId != id) {
        this.notInsideMsgPopup.remove();
        this.notInsideMsgPopup = null;
      } else if (this.notInsideMsgPopup != null && this.notInsideMsgPopup.zaptId === id) {
        return;
      }

      var html = '<div class="interest-popup">' + '<span>' + msg + '</span><br/>' + '</div>';

      this.oldCanScroll = this.canScroll;
      this.canScroll = false;
      this.notInsideMsgPopup = L.popup({
        className: "nearby-ads-popup"
      }).setLatLng(this.map.getCenter()).setContent(html).openOn(this.map);

      this.notInsideMsgPopup.zaptId = id;

      setTimeout(function () {
        _this18.canScroll = _this18.oldCanScroll;
        if (_this18.notInsideMsgPopup != null) {
          _this18.notInsideMsgPopup.remove();
        }
      }, MAP_AUTOCLOSE_POPUP_TIMEOUT * 1.5);
      return this.notInsideMsgPopup;
    }
  }, {
    key: 'zoomPopup',
    value: function zoomPopup() {
      var _this19 = this;

      var zoomLevels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      setTimeout(function () {
        if (!_this19.mapPopup) {
          return;
        }

        var MAX_ZOOM_LEVELS = 3;
        var map = _this19.map,
            marginBottom = parseInt(L.DomUtil.getStyle(_this19.mapPopup._container, 'marginBottom'), 10) || 0,
            containerHeight = _this19.mapPopup._container.offsetHeight + marginBottom,
            containerWidth = _this19.mapPopup._container.offsetHeight,
            layerPos = new L.Point(_this19.mapPopup._containerLeft, -containerHeight - _this19.mapPopup._containerBottom);

        layerPos._add(L.DomUtil.getPosition(_this19.mapPopup._container));

        var containerPos = map.layerPointToContainerPoint(layerPos),
            padding = L.point(_this19.mapPopup.options.autoPanPadding),
            paddingTL = L.point(_this19.mapPopup.options.autoPanPaddingTopLeft || padding),
            paddingBR = L.point(_this19.mapPopup.options.autoPanPaddingBottomRight || padding),
            size = map.getSize(),
            dx = 0,
            dy = 0;

        if (containerPos.x + containerWidth + paddingBR.x > size.x) {
          // right
          dx = containerPos.x + containerWidth - size.x + paddingBR.x;
        }
        if (containerPos.x - dx - paddingTL.x < 0) {
          // left
          dx = containerPos.x - paddingTL.x;
        }
        if (containerPos.y + containerHeight + paddingBR.y > size.y) {
          // bottom
          dy = containerPos.y + containerHeight - size.y + paddingBR.y;
        }
        if (containerPos.y - dy - paddingTL.y < 0) {
          // top
          dy = containerPos.y - paddingTL.y;
        }

        if (dy < 0 && zoomLevels < MAX_ZOOM_LEVELS) {
          _this19.map.zoomOut(_this19.map.options.zoomDelta * 4, { animate: false, duration: 0.1 });
          _this19.zoomPopup(++zoomLevels);
        }
        if (dx < 0 && zoomLevels < MAX_ZOOM_LEVELS) {
          _this19.map.zoomIn(_this19.map.options.zoomDelta * 4, { animate: false, duration: 0.1 });
          _this19.map.setView(_this19.mapPopup.getLatLng());
          _this19.zoomPopup(++zoomLevels);
        }
      }, 350);
    }
  }, {
    key: 'clearPopup',
    value: function clearPopup(content) {
      if (this.mapPopup != null) {
        //specific popup
        if (content != null && content == this.mapPopup.getContent()) {
          this.mapPopup.remove();
          this.mapPopup = null;
        } else if (content == null) {
          //any popup
          this.mapPopup.remove();
          this.mapPopup = null;
        }
      }
    }
  }, {
    key: 'clearAdsPopup',
    value: function clearAdsPopup() {
      if (this.adsMapPopup != null) {
        this.adsMapPopup.remove();
        this.adsMapPopup = null;
      }
    }
  }, {
    key: 'findNearestRestroom',
    value: function findNearestRestroom() {
      this._findUtilitySpace(['Sanitário e Apoio', 'Sanitário']);
    }
  }, {
    key: 'findNearestExit',
    value: function findNearestExit() {
      this._findUtilitySpace(['Saída']);
    }
  }, {
    key: '_findUtilitySpace',
    value: function _findUtilitySpace(utilityKeys) {
      var _this20 = this;

      this.getSpaces().then(function (spaces) {
        var foundSpaces = [];

        spaces.forEach(function (space) {
          if (utilityKeys.indexOf(space.category) >= 0) {
            foundSpaces.push(space);
          }
        });

        if (foundSpaces.length > 0) {
          var calcDistanceFn = function calcDistanceFn(foundSpaces) {
            if (!_this20.currentPosition) {
              return setTimeout(function () {
                return calcDistanceFn(foundSpaces);
              }, 200);
            }
            var nearestCoords = _this20._findNearestSpace(foundSpaces).coords;
            _this20.findShortestPathBasedCurrentLocation(parseFloat(nearestCoords[0]), parseFloat(nearestCoords[1]));
          };
          calcDistanceFn(foundSpaces);
        }
      });
    }
  }, {
    key: '_findNearestSpace',
    value: function _findNearestSpace(spaces) {
      var _this21 = this;

      var nearestDistance = Number.MAX_SAFE_INTEGER,
          nearestCoords = null,
          spaceDistance;
      spaces.forEach(function (space) {
        var spaceTransformedDistance = transformCoordinatesToLeaflet(space.coords);
        spaceDistance = getDistanceInPixel(spaceTransformedDistance[0], spaceTransformedDistance[1], _this21.currentPosition[0], _this21.currentPosition[1]);
        if (spaceDistance < nearestDistance) {
          nearestDistance = spaceDistance;
          nearestCoords = space;
        }
      });
      return nearestCoords;
    }
  }, {
    key: '_isCoordsValid',
    value: function _isCoordsValid(xy) {
      var maxBounds = this.getMap().options.maxBounds;
      var acceptableRange = 30;
      return !(!xy || !xy[0] || !xy[1] || xy[0] < 0 || xy[1] < 0 || xy[0] < maxBounds._southWest.lng || xy[1] < maxBounds._southWest.lat || xy[0] > maxBounds._northEast.lng || xy[1] > maxBounds._northEast.lat);
    }
  }, {
    key: 'getMap',
    value: function getMap() {
      if (this.map == null) {
        this.map = global.map;
      }
      return this.map;
    }
  }, {
    key: 'getSpaces',
    value: function getSpaces(name) {
      var _this22 = this;

      return new Promise(function (resolv, reject) {
        if (_this22.spaces == null || _this22.spaces.length === 0) {
          if (currentLocalObj == null) {
            resolv(null);
          }
          name = name || _this22.key;
          mapLocalStorageDAO.retrieveSpaces(name).then(function (spaces) {
            _this22.spaces = spaces;
            if (_this22.spaces == null || _this22.spaces.length === 0) {
              mapFirebaseDAO.cloudSpacesRetrieve(name).then(function (spaces) {
                resolv(spaces);
              });
            } else {
              resolv(spaces || []);
            }
          });
        } else {
          resolv(_this22.spaces);
        }
      });
    }
  }, {
    key: 'getPaths',
    value: function getPaths(name) {
      var _this23 = this;

      return new Promise(function (resolv, reject) {
        if (_this23.paths == null || _this23.paths.length === 0) {
          if (currentLocalObj == null) {
            resolv(null);
          }
          name = name || _this23.key;
          mapLocalStorageDAO.retrievePaths(name).then(function (paths) {
            _this23.paths = paths;
            if (_this23.paths == null || _this23.paths.length === 0) {
              mapFirebaseDAO.cloudPathsRetrieve(name).then(function (paths) {
                resolv(paths);
              });
            } else {
              resolv(paths || []);
            }
          });
        } else {
          resolv(_this23.paths);
        }
      });
    }
  }, {
    key: 'getCurrentLocal',
    value: function getCurrentLocal() {
      var _this24 = this;

      return new Promise(function (resolv, reject) {
        if (!_this24.currentLocal || _this24.currentLocal.name != _this24.key) {
          mapLocalStorageDAO.retrieveLocal(_this24.key).then(function (currentPlace) {
            global.currentLocalObj = currentPlace;
            mapLocalStorageDAO.saveCurrentLocal(currentPlace).then(function () {
              _this24.currentLocal = currentPlace;
              resolv(currentPlace);
            });
          }).catch(function (err) {
            log.error(err);
            reject(err);
          });
        } else {
          resolv(_this24.currentLocal);
        }
      });
    }
  }]);

  return Zapt;
}();

function getMapCanvasStyle() {
  return {
    width: getWidth() + "px",
    height: getHeight() - 49 + "px"
  };
}

exports.default = Zapt;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./constants":5,"async":2}],5:[function(require,module,exports){
(function (global){
"use strict";

global.MIN_TIME_CHANGE_CURRENT_STATE = 4 * 1000; //in miliseconds
global.TIME_TO_CONFIRM_CHANGE_STATE = 2 * 1000;
global.TIME_REFRESH_PROGRESS_NEXT_CARD = 300;
global.TAP_TIME = 1300;
global.NUM_DISPLAYED_CHARS_LISTING_TEXT = 82;
global.MAX_DISTANCE_PLACE_CURRENT_LOCATION_IN_MTS = 10000;
global.PLACE_DISTANCE_TO_SHOW_MAP = 1000;
global.MAX_PLACES_HOME = 10;
global.MAX_VELOCITY = 7; //km/h
global.MAX_VELOCITY_IPS = 5; //km/h
global.MAX_VELOCITY_METERS_PER_SECOND = 3;
global.AVG_VELOCITY_METERS_PER_SECOND = 1.3;
global.DEFAULT_LANGUAGE = "pt-br";
global.GPS_REUSE_MAX_AGE = 500; //ms
global.GPS_TIMEOUT = 1500;
global.MAX_WAIT_TIMEOUT = 35000;
global.MAX_WAIT_TOUR_TIMEOUT = 90000;
global.REFRESH_DISTANCE_TIME = 500;
global.NOTIFICATIONS_CLEAN_INTERVAL = 600000; //10 MINUTES
global.MAX_DISTANCE_FIND_PLACE_TOUR = 20; //20 METERS
global.TOUR_MAX_TIME_IGNORE_BEACONS = 5 * 1000; //5 SECONDS
global.MIN_TIME_SHOW_POPUP_WHEN_GO_TO = 20000; //20 SECONDS
global.MAX_INDOOR_ACCURACY = 10; //10m
global.MAX_TIME_INACTIVE_NAVIGATION = 1500; //in ms
global.ACCELEROMETER_FREQUENCY = 200; //in ms
global.COMPASS_FREQUENCY = 80; //in ms
global.PEDOMETER_FREQUENCY = 100; //in ms
global.METERS_TO_FEET = 3.28084;
global.STEP_SIZE = 0.5; //in meters
global.IS_WALKING_MAGNITUDE = 0.6;
global.GRAVITY = 9.8;
global.SHADOW_DEVIATION = -0.9;
global.PATH_LOSS = 2.4;
global.LIMIT_THRESHOLD = 3.3; //meters
global.WALKING_BEACON_AVG = 1100;
global.MAP_AUTOCLOSE_POPUP_TIMEOUT = 3350; //miliseconds
global.MIN_MT_ACCURACY = 2.2;
global.STOPPED_MIN_MT_ACCURACY = 1.2;
global.SAME_ADS_INTERVAL_TIME = 90000; //ms
global.TIME_UPDATE_POSITION_AFTER_STOP = 10000;
global.MONITORING_FENCE_INTERVAL = 1000; //ms
global.MAP_BETWEEN_TRANSITION_TIME = 60000; //ms
global.MAX_ITEMS_PER_PAGE = 15; //ms
global.REFRESH_METADATA_TIME = 5 * 60 * 1000; //ms
global.MAX_DISTANCE_CONSIDER = 20; //meters
global.MAX_TIME_CONSIDER_PLACE_LIST_LOCATION_CACHE = 60 * 5 * 1000; //ms

if (Number.MAX_SAFE_INTEGER == null) {
  Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if (Number.MIN_SAFE_INTEGER == null) {
  Number.MIN_SAFE_INTEGER = -9007199254740991;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJndWxwL2V4cG9ydC16YXB0LWFwaS5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9saWIvYXN5bmMuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2FwcC9aYXB0LmpzIiwic3JjL2FwcC9jb25zdGFudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7Ozs7O0FBQ0EsT0FBTyxJQUFQO0FBQ0EsT0FBTyxJQUFQOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTNCO0FBQ0EsT0FBTyxTQUFQLEdBQW1CLEdBQW5CO0FBQ0EsT0FBTyxlQUFQLEdBQXlCLEdBQXpCLEMsQ0FBOEI7QUFDOUIsT0FBTyxrQkFBUCxHQUE0QixJQUE1QjtBQUNBLE9BQU8sMkJBQVAsR0FBcUMsSUFBckMsQyxDQUEyQztBQUMzQyxPQUFPLGVBQVAsR0FBeUIsR0FBekI7QUFDQSxPQUFPLHVCQUFQLEdBQWlDLEdBQWpDO0FBQ0EsT0FBTyxzQkFBUCxHQUFnQyxLQUFoQyxDLENBQXVDO0FBQ3ZDLE9BQU8sK0JBQVAsR0FBeUMsS0FBekM7QUFDQSxPQUFPLHlCQUFQLEdBQW1DLElBQW5DLEMsQ0FBeUM7QUFDekMsT0FBTywyQkFBUCxHQUFxQyxLQUFyQyxDLENBQTRDO0FBQzVDLE9BQU8sa0JBQVAsR0FBNEIsRUFBNUIsQyxDQUFnQztBQUNoQyxPQUFPLHFCQUFQLEdBQStCLElBQUksRUFBSixHQUFTLElBQXhDLEMsQ0FBOEM7QUFDOUMsT0FBTyxxQkFBUCxHQUErQixFQUEvQixDLENBQW1DO0FBQ25DLE9BQU8sMkNBQVAsR0FBcUQsS0FBSyxDQUFMLEdBQVMsSUFBOUQsQyxDQUFvRTs7QUFFcEUsSUFBRyxPQUFPLGdCQUFQLElBQXlCLElBQTVCLEVBQWlDO0FBQy9CLFNBQU8sZ0JBQVAsR0FBMEIsZ0JBQTFCO0FBQ0Q7O0FBRUQsSUFBRyxPQUFPLGdCQUFQLElBQXlCLElBQTVCLEVBQWlDO0FBQy9CLFNBQU8sZ0JBQVAsR0FBMEIsQ0FBQyxnQkFBM0I7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgWmFwdCBmcm9tICcuLi9zcmMvYXBwL1phcHQnO1xuZ2xvYmFsLlphcHQgPSBaYXB0O1xud2luZG93LlphcHQgPSBaYXB0O1xuIiwiLyohXG4gKiBhc3luY1xuICogaHR0cHM6Ly9naXRodWIuY29tL2Nhb2xhbi9hc3luY1xuICpcbiAqIENvcHlyaWdodCAyMDEwLTIwMTQgQ2FvbGFuIE1jTWFob25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGFzeW5jID0ge307XG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XG4gICAgZnVuY3Rpb24gaWRlbnRpdHkodikge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9Cb29sKHYpIHtcbiAgICAgICAgcmV0dXJuICEhdjtcbiAgICB9XG4gICAgZnVuY3Rpb24gbm90SWQodikge1xuICAgICAgICByZXR1cm4gIXY7XG4gICAgfVxuXG4gICAgLy8gZ2xvYmFsIG9uIHRoZSBzZXJ2ZXIsIHdpbmRvdyBpbiB0aGUgYnJvd3NlclxuICAgIHZhciBwcmV2aW91c19hc3luYztcblxuICAgIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIChgc2VsZmApIGluIHRoZSBicm93c2VyLCBgZ2xvYmFsYFxuICAgIC8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbiAgICAvLyBpbnN0ZWFkIG9mIGB3aW5kb3dgIGZvciBgV2ViV29ya2VyYCBzdXBwb3J0LlxuICAgIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XG4gICAgICAgICAgICB0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICB0aGlzO1xuXG4gICAgaWYgKHJvb3QgIT0gbnVsbCkge1xuICAgICAgICBwcmV2aW91c19hc3luYyA9IHJvb3QuYXN5bmM7XG4gICAgfVxuXG4gICAgYXN5bmMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm9vdC5hc3luYyA9IHByZXZpb3VzX2FzeW5jO1xuICAgICAgICByZXR1cm4gYXN5bmM7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG9ubHlfb25jZShmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoZm4gPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC5cIik7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgZm4gPSBudWxsO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9vbmNlKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChmbiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLy8vIGNyb3NzLWJyb3dzZXIgY29tcGF0aWJsaXR5IGZ1bmN0aW9ucyAvLy8vXG5cbiAgICB2YXIgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuICAgIHZhciBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuXG4gICAgLy8gUG9ydGVkIGZyb20gdW5kZXJzY29yZS5qcyBpc09iamVjdFxuICAgIHZhciBfaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2lzQXJyYXlMaWtlKGFycikge1xuICAgICAgICByZXR1cm4gX2lzQXJyYXkoYXJyKSB8fCAoXG4gICAgICAgICAgICAvLyBoYXMgYSBwb3NpdGl2ZSBpbnRlZ2VyIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgICAgICAgdHlwZW9mIGFyci5sZW5ndGggPT09IFwibnVtYmVyXCIgJiZcbiAgICAgICAgICAgIGFyci5sZW5ndGggPj0gMCAmJlxuICAgICAgICAgICAgYXJyLmxlbmd0aCAlIDEgPT09IDBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXJyYXlFYWNoKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbaW5kZXhdLCBpbmRleCwgYXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9tYXAoYXJyLCBpdGVyYXRvcikge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGFyci5sZW5ndGgsXG4gICAgICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0b3IoYXJyW2luZGV4XSwgaW5kZXgsIGFycik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmFuZ2UoY291bnQpIHtcbiAgICAgICAgcmV0dXJuIF9tYXAoQXJyYXkoY291bnQpLCBmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gaTsgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlZHVjZShhcnIsIGl0ZXJhdG9yLCBtZW1vKSB7XG4gICAgICAgIF9hcnJheUVhY2goYXJyLCBmdW5jdGlvbiAoeCwgaSwgYSkge1xuICAgICAgICAgICAgbWVtbyA9IGl0ZXJhdG9yKG1lbW8sIHgsIGksIGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZvckVhY2hPZihvYmplY3QsIGl0ZXJhdG9yKSB7XG4gICAgICAgIF9hcnJheUVhY2goX2tleXMob2JqZWN0KSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaXRlcmF0b3Iob2JqZWN0W2tleV0sIGtleSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmRleE9mKGFyciwgaXRlbSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHZhciBfa2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9rZXlJdGVyYXRvcihjb2xsKSB7XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciBrZXlzO1xuICAgICAgICBpZiAoX2lzQXJyYXlMaWtlKGNvbGwpKSB7XG4gICAgICAgICAgICBsZW4gPSBjb2xsLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleXMgPSBfa2V5cyhjb2xsKTtcbiAgICAgICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8ga2V5c1tpXSA6IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2ltaWxhciB0byBFUzYncyByZXN0IHBhcmFtIChodHRwOi8vYXJpeWEub2ZpbGFicy5jb20vMjAxMy8wMy9lczYtYW5kLXJlc3QtcGFyYW1ldGVyLmh0bWwpXG4gICAgLy8gVGhpcyBhY2N1bXVsYXRlcyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIGFuIGFycmF5LCBhZnRlciBhIGdpdmVuIGluZGV4LlxuICAgIC8vIEZyb20gdW5kZXJzY29yZS5qcyAoaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL3B1bGwvMjE0MCkuXG4gICAgZnVuY3Rpb24gX3Jlc3RQYXJhbShmdW5jLCBzdGFydEluZGV4KSB7XG4gICAgICAgIHN0YXJ0SW5kZXggPSBzdGFydEluZGV4ID09IG51bGwgPyBmdW5jLmxlbmd0aCAtIDEgOiArc3RhcnRJbmRleDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KGFyZ3VtZW50cy5sZW5ndGggLSBzdGFydEluZGV4LCAwKTtcbiAgICAgICAgICAgIHZhciByZXN0ID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICByZXN0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCArIHN0YXJ0SW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChzdGFydEluZGV4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIHJlc3QpO1xuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIHJlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ3VycmVudGx5IHVudXNlZCBidXQgaGFuZGxlIGNhc2VzIG91dHNpZGUgb2YgdGhlIHN3aXRjaCBzdGF0ZW1lbnQ6XG4gICAgICAgICAgICAvLyB2YXIgYXJncyA9IEFycmF5KHN0YXJ0SW5kZXggKyAxKTtcbiAgICAgICAgICAgIC8vIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0SW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIC8vICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBhcmdzW3N0YXJ0SW5kZXhdID0gcmVzdDtcbiAgICAgICAgICAgIC8vIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF93aXRob3V0SW5kZXgoaXRlcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3IodmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLy8vIGV4cG9ydGVkIGFzeW5jIG1vZHVsZSBmdW5jdGlvbnMgLy8vL1xuXG4gICAgLy8vLyBuZXh0VGljayBpbXBsZW1lbnRhdGlvbiB3aXRoIGJyb3dzZXItY29tcGF0aWJsZSBmYWxsYmFjayAvLy8vXG5cbiAgICAvLyBjYXB0dXJlIHRoZSBnbG9iYWwgcmVmZXJlbmNlIHRvIGd1YXJkIGFnYWluc3QgZmFrZVRpbWVyIG1vY2tzXG4gICAgdmFyIF9zZXRJbW1lZGlhdGUgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIHNldEltbWVkaWF0ZTtcblxuICAgIHZhciBfZGVsYXkgPSBfc2V0SW1tZWRpYXRlID8gZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgLy8gbm90IGEgZGlyZWN0IGFsaWFzIGZvciBJRTEwIGNvbXBhdGliaWxpdHlcbiAgICAgICAgX3NldEltbWVkaWF0ZShmbik7XG4gICAgfSA6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHR5cGVvZiBwcm9jZXNzLm5leHRUaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGFzeW5jLm5leHRUaWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgICB9IGVsc2Uge1xuICAgICAgICBhc3luYy5uZXh0VGljayA9IF9kZWxheTtcbiAgICB9XG4gICAgYXN5bmMuc2V0SW1tZWRpYXRlID0gX3NldEltbWVkaWF0ZSA/IF9kZWxheSA6IGFzeW5jLm5leHRUaWNrO1xuXG5cbiAgICBhc3luYy5mb3JFYWNoID1cbiAgICBhc3luYy5lYWNoID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBhc3luYy5lYWNoT2YoYXJyLCBfd2l0aG91dEluZGV4KGl0ZXJhdG9yKSwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5mb3JFYWNoU2VyaWVzID1cbiAgICBhc3luYy5lYWNoU2VyaWVzID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBhc3luYy5lYWNoT2ZTZXJpZXMoYXJyLCBfd2l0aG91dEluZGV4KGl0ZXJhdG9yKSwgY2FsbGJhY2spO1xuICAgIH07XG5cblxuICAgIGFzeW5jLmZvckVhY2hMaW1pdCA9XG4gICAgYXN5bmMuZWFjaExpbWl0ID0gZnVuY3Rpb24gKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX2VhY2hPZkxpbWl0KGxpbWl0KShhcnIsIF93aXRob3V0SW5kZXgoaXRlcmF0b3IpLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLmZvckVhY2hPZiA9XG4gICAgYXN5bmMuZWFjaE9mID0gZnVuY3Rpb24gKG9iamVjdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gX29uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG4gICAgICAgIG9iamVjdCA9IG9iamVjdCB8fCBbXTtcblxuICAgICAgICB2YXIgaXRlciA9IF9rZXlJdGVyYXRvcihvYmplY3QpO1xuICAgICAgICB2YXIga2V5LCBjb21wbGV0ZWQgPSAwO1xuXG4gICAgICAgIHdoaWxlICgoa2V5ID0gaXRlcigpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG9iamVjdFtrZXldLCBrZXksIG9ubHlfb25jZShkb25lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcGxldGVkID09PSAwKSBjYWxsYmFjayhudWxsKTtcblxuICAgICAgICBmdW5jdGlvbiBkb25lKGVycikge1xuICAgICAgICAgICAgY29tcGxldGVkLS07XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNrIGtleSBpcyBudWxsIGluIGNhc2UgaXRlcmF0b3IgaXNuJ3QgZXhoYXVzdGVkXG4gICAgICAgICAgICAvLyBhbmQgZG9uZSByZXNvbHZlZCBzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBudWxsICYmIGNvbXBsZXRlZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuZm9yRWFjaE9mU2VyaWVzID1cbiAgICBhc3luYy5lYWNoT2ZTZXJpZXMgPSBmdW5jdGlvbiAob2JqLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBfb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgICAgICAgb2JqID0gb2JqIHx8IFtdO1xuICAgICAgICB2YXIgbmV4dEtleSA9IF9rZXlJdGVyYXRvcihvYmopO1xuICAgICAgICB2YXIga2V5ID0gbmV4dEtleSgpO1xuICAgICAgICBmdW5jdGlvbiBpdGVyYXRlKCkge1xuICAgICAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZXJhdG9yKG9ialtrZXldLCBrZXksIG9ubHlfb25jZShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gbmV4dEtleSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3luYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShpdGVyYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGl0ZXJhdGUoKTtcbiAgICB9O1xuXG5cblxuICAgIGFzeW5jLmZvckVhY2hPZkxpbWl0ID1cbiAgICBhc3luYy5lYWNoT2ZMaW1pdCA9IGZ1bmN0aW9uIChvYmosIGxpbWl0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgX2VhY2hPZkxpbWl0KGxpbWl0KShvYmosIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9lYWNoT2ZMaW1pdChsaW1pdCkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gX29uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG4gICAgICAgICAgICBvYmogPSBvYmogfHwgW107XG4gICAgICAgICAgICB2YXIgbmV4dEtleSA9IF9rZXlJdGVyYXRvcihvYmopO1xuICAgICAgICAgICAgaWYgKGxpbWl0IDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHJ1bm5pbmcgPSAwO1xuICAgICAgICAgICAgdmFyIGVycm9yZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgKGZ1bmN0aW9uIHJlcGxlbmlzaCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUgJiYgcnVubmluZyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAocnVubmluZyA8IGxpbWl0ICYmICFlcnJvcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBuZXh0S2V5KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3Iob2JqW2tleV0sIGtleSwgb25seV9vbmNlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGVuaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZG9QYXJhbGxlbChmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oYXN5bmMuZWFjaE9mLCBvYmosIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvUGFyYWxsZWxMaW1pdChmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGZuKF9lYWNoT2ZMaW1pdChsaW1pdCksIG9iaiwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9TZXJpZXMoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmosIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGZuKGFzeW5jLmVhY2hPZlNlcmllcywgb2JqLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9hc3luY01hcChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gX29uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG4gICAgICAgIGFyciA9IGFyciB8fCBbXTtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBfaXNBcnJheUxpa2UoYXJyKSA/IFtdIDoge307XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih2YWx1ZSwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jLm1hcCA9IGRvUGFyYWxsZWwoX2FzeW5jTWFwKTtcbiAgICBhc3luYy5tYXBTZXJpZXMgPSBkb1NlcmllcyhfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcExpbWl0ID0gZG9QYXJhbGxlbExpbWl0KF9hc3luY01hcCk7XG5cbiAgICAvLyByZWR1Y2Ugb25seSBoYXMgYSBzZXJpZXMgdmVyc2lvbiwgYXMgZG9pbmcgcmVkdWNlIGluIHBhcmFsbGVsIHdvbid0XG4gICAgLy8gd29yayBpbiBtYW55IHNpdHVhdGlvbnMuXG4gICAgYXN5bmMuaW5qZWN0ID1cbiAgICBhc3luYy5mb2xkbCA9XG4gICAgYXN5bmMucmVkdWNlID0gZnVuY3Rpb24gKGFyciwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2hPZlNlcmllcyhhcnIsIGZ1bmN0aW9uICh4LCBpLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IobWVtbywgeCwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgICAgIG1lbW8gPSB2O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBtZW1vKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLmZvbGRyID1cbiAgICBhc3luYy5yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIChhcnIsIG1lbW8sIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBfbWFwKGFyciwgaWRlbnRpdHkpLnJldmVyc2UoKTtcbiAgICAgICAgYXN5bmMucmVkdWNlKHJldmVyc2VkLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gaXRlcmF0b3I7XG4gICAgICAgICAgICBpdGVyYXRvciA9IG1lbW87XG4gICAgICAgICAgICBtZW1vID0gX2lzQXJyYXkoYXJyKSA/IFtdIDoge307XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYy5lYWNoT2YoYXJyLCBmdW5jdGlvbih2LCBrLCBjYikge1xuICAgICAgICAgICAgaXRlcmF0b3IobWVtbywgdiwgaywgY2IpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWVtbyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfZmlsdGVyKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGluZGV4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe2luZGV4OiBpbmRleCwgdmFsdWU6IHh9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhfbWFwKHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYy5zZWxlY3QgPVxuICAgIGFzeW5jLmZpbHRlciA9IGRvUGFyYWxsZWwoX2ZpbHRlcik7XG5cbiAgICBhc3luYy5zZWxlY3RMaW1pdCA9XG4gICAgYXN5bmMuZmlsdGVyTGltaXQgPSBkb1BhcmFsbGVsTGltaXQoX2ZpbHRlcik7XG5cbiAgICBhc3luYy5zZWxlY3RTZXJpZXMgPVxuICAgIGFzeW5jLmZpbHRlclNlcmllcyA9IGRvU2VyaWVzKF9maWx0ZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlamVjdChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9maWx0ZXIoZWFjaGZuLCBhcnIsIGZ1bmN0aW9uKHZhbHVlLCBjYikge1xuICAgICAgICAgICAgaXRlcmF0b3IodmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICBjYighdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBhc3luYy5yZWplY3QgPSBkb1BhcmFsbGVsKF9yZWplY3QpO1xuICAgIGFzeW5jLnJlamVjdExpbWl0ID0gZG9QYXJhbGxlbExpbWl0KF9yZWplY3QpO1xuICAgIGFzeW5jLnJlamVjdFNlcmllcyA9IGRvU2VyaWVzKF9yZWplY3QpO1xuXG4gICAgZnVuY3Rpb24gX2NyZWF0ZVRlc3RlcihlYWNoZm4sIGNoZWNrLCBnZXRSZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYikge1xuICAgICAgICAgICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IpIGNiKGdldFJlc3VsdChmYWxzZSwgdm9pZCAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBpdGVyYXRlZSh4LCBfLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmICghY2IpIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYiAmJiBjaGVjayh2KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IoZ2V0UmVzdWx0KHRydWUsIHgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiID0gaXRlcmF0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgZWFjaGZuKGFyciwgbGltaXQsIGl0ZXJhdGVlLCBkb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2IgPSBpdGVyYXRvcjtcbiAgICAgICAgICAgICAgICBpdGVyYXRvciA9IGxpbWl0O1xuICAgICAgICAgICAgICAgIGVhY2hmbihhcnIsIGl0ZXJhdGVlLCBkb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYy5hbnkgPVxuICAgIGFzeW5jLnNvbWUgPSBfY3JlYXRlVGVzdGVyKGFzeW5jLmVhY2hPZiwgdG9Cb29sLCBpZGVudGl0eSk7XG5cbiAgICBhc3luYy5zb21lTGltaXQgPSBfY3JlYXRlVGVzdGVyKGFzeW5jLmVhY2hPZkxpbWl0LCB0b0Jvb2wsIGlkZW50aXR5KTtcblxuICAgIGFzeW5jLmFsbCA9XG4gICAgYXN5bmMuZXZlcnkgPSBfY3JlYXRlVGVzdGVyKGFzeW5jLmVhY2hPZiwgbm90SWQsIG5vdElkKTtcblxuICAgIGFzeW5jLmV2ZXJ5TGltaXQgPSBfY3JlYXRlVGVzdGVyKGFzeW5jLmVhY2hPZkxpbWl0LCBub3RJZCwgbm90SWQpO1xuXG4gICAgZnVuY3Rpb24gX2ZpbmRHZXRSZXN1bHQodiwgeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgYXN5bmMuZGV0ZWN0ID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2YsIGlkZW50aXR5LCBfZmluZEdldFJlc3VsdCk7XG4gICAgYXN5bmMuZGV0ZWN0U2VyaWVzID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2ZTZXJpZXMsIGlkZW50aXR5LCBfZmluZEdldFJlc3VsdCk7XG4gICAgYXN5bmMuZGV0ZWN0TGltaXQgPSBfY3JlYXRlVGVzdGVyKGFzeW5jLmVhY2hPZkxpbWl0LCBpZGVudGl0eSwgX2ZpbmRHZXRSZXN1bHQpO1xuXG4gICAgYXN5bmMuc29ydEJ5ID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLm1hcChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKGVyciwgY3JpdGVyaWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7dmFsdWU6IHgsIGNyaXRlcmlhOiBjcml0ZXJpYX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBfbWFwKHJlc3VsdHMuc29ydChjb21wYXJhdG9yKSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNvbXBhcmF0b3IobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYSwgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLmF1dG8gPSBmdW5jdGlvbiAodGFza3MsIGNvbmN1cnJlbmN5LCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gY29uY3VycmVuY3kgaXMgb3B0aW9uYWwsIHNoaWZ0IHRoZSBhcmdzLlxuICAgICAgICAgICAgY2FsbGJhY2sgPSBjb25jdXJyZW5jeTtcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayA9IF9vbmNlKGNhbGxiYWNrIHx8IG5vb3ApO1xuICAgICAgICB2YXIga2V5cyA9IF9rZXlzKHRhc2tzKTtcbiAgICAgICAgdmFyIHJlbWFpbmluZ1Rhc2tzID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGlmICghcmVtYWluaW5nVGFza3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IHJlbWFpbmluZ1Rhc2tzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICAgICAgdmFyIHJ1bm5pbmdUYXNrcyA9IDA7XG5cbiAgICAgICAgdmFyIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcihmbikge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnVuc2hpZnQoZm4pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGZuKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gX2luZGV4T2YobGlzdGVuZXJzLCBmbik7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDApIGxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0YXNrQ29tcGxldGUoKSB7XG4gICAgICAgICAgICByZW1haW5pbmdUYXNrcy0tO1xuICAgICAgICAgICAgX2FycmF5RWFjaChsaXN0ZW5lcnMuc2xpY2UoMCksIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghcmVtYWluaW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgX2FycmF5RWFjaChrZXlzLCBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgaWYgKGhhc0Vycm9yKSByZXR1cm47XG4gICAgICAgICAgICB2YXIgdGFzayA9IF9pc0FycmF5KHRhc2tzW2tdKSA/IHRhc2tzW2tdOiBbdGFza3Nba11dO1xuICAgICAgICAgICAgdmFyIHRhc2tDYWxsYmFjayA9IF9yZXN0UGFyYW0oZnVuY3Rpb24oZXJyLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgcnVubmluZ1Rhc2tzLS07XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNhZmVSZXN1bHRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIF9mb3JFYWNoT2YocmVzdWx0cywgZnVuY3Rpb24odmFsLCBya2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1tya2V5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNhZmVSZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgc2FmZVJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSh0YXNrQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHJlcXVpcmVzID0gdGFzay5zbGljZSgwLCB0YXNrLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgLy8gcHJldmVudCBkZWFkLWxvY2tzXG4gICAgICAgICAgICB2YXIgbGVuID0gcmVxdWlyZXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRlcDtcbiAgICAgICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgICAgICAgIGlmICghKGRlcCA9IHRhc2tzW3JlcXVpcmVzW2xlbl1dKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhcyBub25leGlzdGVudCBkZXBlbmRlbmN5IGluICcgKyByZXF1aXJlcy5qb2luKCcsICcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5KGRlcCkgJiYgX2luZGV4T2YoZGVwLCBrKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSGFzIGN5Y2xpYyBkZXBlbmRlbmNpZXMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZ1Rhc2tzIDwgY29uY3VycmVuY3kgJiYgX3JlZHVjZShyZXF1aXJlcywgZnVuY3Rpb24gKGEsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICYmIHJlc3VsdHMuaGFzT3duUHJvcGVydHkoeCkpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpICYmICFyZXN1bHRzLmhhc093blByb3BlcnR5KGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlYWR5KCkpIHtcbiAgICAgICAgICAgICAgICBydW5uaW5nVGFza3MrKztcbiAgICAgICAgICAgICAgICB0YXNrW3Rhc2subGVuZ3RoIC0gMV0odGFza0NhbGxiYWNrLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RlbmVyKCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdUYXNrcysrO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tbdGFzay5sZW5ndGggLSAxXSh0YXNrQ2FsbGJhY2ssIHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICBhc3luYy5yZXRyeSA9IGZ1bmN0aW9uKHRpbWVzLCB0YXNrLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgREVGQVVMVF9USU1FUyA9IDU7XG4gICAgICAgIHZhciBERUZBVUxUX0lOVEVSVkFMID0gMDtcblxuICAgICAgICB2YXIgYXR0ZW1wdHMgPSBbXTtcblxuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIHRpbWVzOiBERUZBVUxUX1RJTUVTLFxuICAgICAgICAgICAgaW50ZXJ2YWw6IERFRkFVTFRfSU5URVJWQUxcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBwYXJzZVRpbWVzKGFjYywgdCl7XG4gICAgICAgICAgICBpZih0eXBlb2YgdCA9PT0gJ251bWJlcicpe1xuICAgICAgICAgICAgICAgIGFjYy50aW1lcyA9IHBhcnNlSW50KHQsIDEwKSB8fCBERUZBVUxUX1RJTUVTO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiB0ID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgYWNjLnRpbWVzID0gcGFyc2VJbnQodC50aW1lcywgMTApIHx8IERFRkFVTFRfVElNRVM7XG4gICAgICAgICAgICAgICAgYWNjLmludGVydmFsID0gcGFyc2VJbnQodC5pbnRlcnZhbCwgMTApIHx8IERFRkFVTFRfSU5URVJWQUw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgYXJndW1lbnQgdHlwZSBmb3IgXFwndGltZXNcXCc6ICcgKyB0eXBlb2YgdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCA8IDEgfHwgbGVuZ3RoID4gMykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cyAtIG11c3QgYmUgZWl0aGVyICh0YXNrKSwgKHRhc2ssIGNhbGxiYWNrKSwgKHRpbWVzLCB0YXNrKSBvciAodGltZXMsIHRhc2ssIGNhbGxiYWNrKScpO1xuICAgICAgICB9IGVsc2UgaWYgKGxlbmd0aCA8PSAyICYmIHR5cGVvZiB0aW1lcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB0YXNrO1xuICAgICAgICAgICAgdGFzayA9IHRpbWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGltZXMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHBhcnNlVGltZXMob3B0cywgdGltZXMpO1xuICAgICAgICB9XG4gICAgICAgIG9wdHMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgb3B0cy50YXNrID0gdGFzaztcblxuICAgICAgICBmdW5jdGlvbiB3cmFwcGVkVGFzayh3cmFwcGVkQ2FsbGJhY2ssIHdyYXBwZWRSZXN1bHRzKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZXRyeUF0dGVtcHQodGFzaywgZmluYWxBdHRlbXB0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNlcmllc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2soZnVuY3Rpb24oZXJyLCByZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ2FsbGJhY2soIWVyciB8fCBmaW5hbEF0dGVtcHQsIHtlcnI6IGVyciwgcmVzdWx0OiByZXN1bHR9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgd3JhcHBlZFJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJldHJ5SW50ZXJ2YWwoaW50ZXJ2YWwpe1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzZXJpZXNDYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0NhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9LCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKG9wdHMudGltZXMpIHtcblxuICAgICAgICAgICAgICAgIHZhciBmaW5hbEF0dGVtcHQgPSAhKG9wdHMudGltZXMtPTEpO1xuICAgICAgICAgICAgICAgIGF0dGVtcHRzLnB1c2gocmV0cnlBdHRlbXB0KG9wdHMudGFzaywgZmluYWxBdHRlbXB0KSk7XG4gICAgICAgICAgICAgICAgaWYoIWZpbmFsQXR0ZW1wdCAmJiBvcHRzLmludGVydmFsID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIGF0dGVtcHRzLnB1c2gocmV0cnlJbnRlcnZhbChvcHRzLmludGVydmFsKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYy5zZXJpZXMoYXR0ZW1wdHMsIGZ1bmN0aW9uKGRvbmUsIGRhdGEpe1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgKHdyYXBwZWRDYWxsYmFjayB8fCBvcHRzLmNhbGxiYWNrKShkYXRhLmVyciwgZGF0YS5yZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBhIGNhbGxiYWNrIGlzIHBhc3NlZCwgcnVuIHRoaXMgYXMgYSBjb250cm9sbCBmbG93XG4gICAgICAgIHJldHVybiBvcHRzLmNhbGxiYWNrID8gd3JhcHBlZFRhc2soKSA6IHdyYXBwZWRUYXNrO1xuICAgIH07XG5cbiAgICBhc3luYy53YXRlcmZhbGwgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gX29uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG4gICAgICAgIGlmICghX2lzQXJyYXkodGFza3MpKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byB3YXRlcmZhbGwgbXVzdCBiZSBhbiBhcnJheSBvZiBmdW5jdGlvbnMnKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB3cmFwSXRlcmF0b3IoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVzdFBhcmFtKGZ1bmN0aW9uIChlcnIsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIFtlcnJdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh3cmFwSXRlcmF0b3IobmV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbnN1cmVBc3luYyhpdGVyYXRvcikuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgd3JhcEl0ZXJhdG9yKGFzeW5jLml0ZXJhdG9yKHRhc2tzKSkoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX3BhcmFsbGVsKGVhY2hmbiwgdGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgbm9vcDtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBfaXNBcnJheUxpa2UodGFza3MpID8gW10gOiB7fTtcblxuICAgICAgICBlYWNoZm4odGFza3MsIGZ1bmN0aW9uICh0YXNrLCBrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0YXNrKF9yZXN0UGFyYW0oZnVuY3Rpb24gKGVyciwgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRzW2tleV0gPSBhcmdzO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jLnBhcmFsbGVsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoYXN5bmMuZWFjaE9mLCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5wYXJhbGxlbExpbWl0ID0gZnVuY3Rpb24odGFza3MsIGxpbWl0LCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoX2VhY2hPZkxpbWl0KGxpbWl0KSwgdGFza3MsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuc2VyaWVzID0gZnVuY3Rpb24odGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9wYXJhbGxlbChhc3luYy5lYWNoT2ZTZXJpZXMsIHRhc2tzLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLml0ZXJhdG9yID0gZnVuY3Rpb24gKHRhc2tzKSB7XG4gICAgICAgIGZ1bmN0aW9uIG1ha2VDYWxsYmFjayhpbmRleCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrc1tpbmRleF0uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpbmRleCA8IHRhc2tzLmxlbmd0aCAtIDEpID8gbWFrZUNhbGxiYWNrKGluZGV4ICsgMSk6IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYWtlQ2FsbGJhY2soMCk7XG4gICAgfTtcblxuICAgIGFzeW5jLmFwcGx5ID0gX3Jlc3RQYXJhbShmdW5jdGlvbiAoZm4sIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIF9yZXN0UGFyYW0oZnVuY3Rpb24gKGNhbGxBcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoXG4gICAgICAgICAgICAgICAgbnVsbCwgYXJncy5jb25jYXQoY2FsbEFyZ3MpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIF9jb25jYXQoZWFjaGZuLCBhcnIsIGZuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBpbmRleCwgY2IpIHtcbiAgICAgICAgICAgIGZuKHgsIGZ1bmN0aW9uIChlcnIsIHkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHkgfHwgW10pO1xuICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMuY29uY2F0ID0gZG9QYXJhbGxlbChfY29uY2F0KTtcbiAgICBhc3luYy5jb25jYXRTZXJpZXMgPSBkb1NlcmllcyhfY29uY2F0KTtcblxuICAgIGFzeW5jLndoaWxzdCA9IGZ1bmN0aW9uICh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wO1xuICAgICAgICBpZiAodGVzdCgpKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IF9yZXN0UGFyYW0oZnVuY3Rpb24oZXJyLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVzdC5hcHBseSh0aGlzLCBhcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRvcihuZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBbbnVsbF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG5leHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuZG9XaGlsc3QgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWxscyA9IDA7XG4gICAgICAgIHJldHVybiBhc3luYy53aGlsc3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKytjYWxscyA8PSAxIHx8IHRlc3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMudW50aWwgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBhc3luYy53aGlsc3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRlc3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuZG9VbnRpbCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jLmRvV2hpbHN0KGl0ZXJhdG9yLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGVzdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLmR1cmluZyA9IGZ1bmN0aW9uICh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wO1xuXG4gICAgICAgIHZhciBuZXh0ID0gX3Jlc3RQYXJhbShmdW5jdGlvbihlcnIsIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goY2hlY2spO1xuICAgICAgICAgICAgICAgIHRlc3QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjaGVjayA9IGZ1bmN0aW9uKGVyciwgdHJ1dGgpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cnV0aCkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKG5leHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0ZXN0KGNoZWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuZG9EdXJpbmcgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWxscyA9IDA7XG4gICAgICAgIGFzeW5jLmR1cmluZyhmdW5jdGlvbihuZXh0KSB7XG4gICAgICAgICAgICBpZiAoY2FsbHMrKyA8IDEpIHtcbiAgICAgICAgICAgICAgICBuZXh0KG51bGwsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZXN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9xdWV1ZSh3b3JrZXIsIGNvbmN1cnJlbmN5LCBwYXlsb2FkKSB7XG4gICAgICAgIGlmIChjb25jdXJyZW5jeSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjb25jdXJyZW5jeSA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25jdXJyZW5jeSBtdXN0IG5vdCBiZSB6ZXJvJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2luc2VydChxLCBkYXRhLCBwb3MsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhc2sgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcS5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICghX2lzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gW2RhdGFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoZGF0YS5sZW5ndGggPT09IDAgJiYgcS5pZGxlKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjYWxsIGRyYWluIGltbWVkaWF0ZWx5IGlmIHRoZXJlIGFyZSBubyB0YXNrc1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3luYy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHEuZHJhaW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9hcnJheUVhY2goZGF0YSwgZnVuY3Rpb24odGFzaykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YXNrLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2sgfHwgbm9vcFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAocG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIHEudGFza3MudW5zaGlmdChpdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBxLnRhc2tzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHEudGFza3MubGVuZ3RoID09PSBxLmNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICAgICAgICAgIHEuc2F0dXJhdGVkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUocS5wcm9jZXNzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBfbmV4dChxLCB0YXNrcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd29ya2VycyAtPSAxO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICBfYXJyYXlFYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgICAgICAgICBfYXJyYXlFYWNoKHdvcmtlcnNMaXN0LCBmdW5jdGlvbiAod29ya2VyLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmtlciA9PT0gdGFzayAmJiAhcmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtlcnNMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhc2suY2FsbGJhY2suYXBwbHkodGFzaywgYXJncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHEudGFza3MubGVuZ3RoICsgd29ya2VycyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBxLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHEucHJvY2VzcygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3b3JrZXJzID0gMDtcbiAgICAgICAgdmFyIHdvcmtlcnNMaXN0ID0gW107XG4gICAgICAgIHZhciBxID0ge1xuICAgICAgICAgICAgdGFza3M6IFtdLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IGNvbmN1cnJlbmN5LFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbm9vcCxcbiAgICAgICAgICAgIGVtcHR5OiBub29wLFxuICAgICAgICAgICAgZHJhaW46IG5vb3AsXG4gICAgICAgICAgICBzdGFydGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHBhdXNlZDogZmFsc2UsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAga2lsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHEuZHJhaW4gPSBub29wO1xuICAgICAgICAgICAgICAgIHEudGFza3MgPSBbXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bnNoaWZ0OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIHRydWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUoIXEucGF1c2VkICYmIHdvcmtlcnMgPCBxLmNvbmN1cnJlbmN5ICYmIHEudGFza3MubGVuZ3RoKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFza3MgPSBxLnBheWxvYWQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgcS50YXNrcy5zcGxpY2UoMCwgcS5wYXlsb2FkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxLnRhc2tzLnNwbGljZSgwLCBxLnRhc2tzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfbWFwKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhc2suZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHEudGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd29ya2VycyArPSAxO1xuICAgICAgICAgICAgICAgICAgICB3b3JrZXJzTGlzdC5wdXNoKHRhc2tzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNiID0gb25seV9vbmNlKF9uZXh0KHEsIHRhc2tzKSk7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcihkYXRhLCBjYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlbmd0aDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxLnRhc2tzLmxlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBydW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlcnM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya2Vyc0xpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2Vyc0xpc3Q7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaWRsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEudGFza3MubGVuZ3RoICsgd29ya2VycyA9PT0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHEucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocS5wYXVzZWQgPT09IGZhbHNlKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHEucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VtZUNvdW50ID0gTWF0aC5taW4ocS5jb25jdXJyZW5jeSwgcS50YXNrcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gY2FsbCBxLnByb2Nlc3Mgb25jZSBwZXIgY29uY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHdvcmtlciB0byBwcmVzZXJ2ZSBmdWxsIGNvbmN1cnJlbmN5IGFmdGVyIHBhdXNlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdyA9IDE7IHcgPD0gcmVzdW1lQ291bnQ7IHcrKykge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUocS5wcm9jZXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxO1xuICAgIH1cblxuICAgIGFzeW5jLnF1ZXVlID0gZnVuY3Rpb24gKHdvcmtlciwgY29uY3VycmVuY3kpIHtcbiAgICAgICAgdmFyIHEgPSBfcXVldWUoZnVuY3Rpb24gKGl0ZW1zLCBjYikge1xuICAgICAgICAgICAgd29ya2VyKGl0ZW1zWzBdLCBjYik7XG4gICAgICAgIH0sIGNvbmN1cnJlbmN5LCAxKTtcblxuICAgICAgICByZXR1cm4gcTtcbiAgICB9O1xuXG4gICAgYXN5bmMucHJpb3JpdHlRdWV1ZSA9IGZ1bmN0aW9uICh3b3JrZXIsIGNvbmN1cnJlbmN5KSB7XG5cbiAgICAgICAgZnVuY3Rpb24gX2NvbXBhcmVUYXNrcyhhLCBiKXtcbiAgICAgICAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9iaW5hcnlTZWFyY2goc2VxdWVuY2UsIGl0ZW0sIGNvbXBhcmUpIHtcbiAgICAgICAgICAgIHZhciBiZWcgPSAtMSxcbiAgICAgICAgICAgICAgICBlbmQgPSBzZXF1ZW5jZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgd2hpbGUgKGJlZyA8IGVuZCkge1xuICAgICAgICAgICAgICAgIHZhciBtaWQgPSBiZWcgKyAoKGVuZCAtIGJlZyArIDEpID4+PiAxKTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFyZShpdGVtLCBzZXF1ZW5jZVttaWRdKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJlZyA9IG1pZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbmQgPSBtaWQgLSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiZWc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfaW5zZXJ0KHEsIGRhdGEsIHByaW9yaXR5LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXNrIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHEuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoIV9pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCBkcmFpbiBpbW1lZGlhdGVseSBpZiB0aGVyZSBhcmUgbm8gdGFza3NcbiAgICAgICAgICAgICAgICByZXR1cm4gYXN5bmMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBxLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfYXJyYXlFYWNoKGRhdGEsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFzayxcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gY2FsbGJhY2sgOiBub29wXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHEudGFza3Muc3BsaWNlKF9iaW5hcnlTZWFyY2gocS50YXNrcywgaXRlbSwgX2NvbXBhcmVUYXNrcykgKyAxLCAwLCBpdGVtKTtcblxuICAgICAgICAgICAgICAgIGlmIChxLnRhc2tzLmxlbmd0aCA9PT0gcS5jb25jdXJyZW5jeSkge1xuICAgICAgICAgICAgICAgICAgICBxLnNhdHVyYXRlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUocS5wcm9jZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgd2l0aCBhIG5vcm1hbCBxdWV1ZVxuICAgICAgICB2YXIgcSA9IGFzeW5jLnF1ZXVlKHdvcmtlciwgY29uY3VycmVuY3kpO1xuXG4gICAgICAgIC8vIE92ZXJyaWRlIHB1c2ggdG8gYWNjZXB0IHNlY29uZCBwYXJhbWV0ZXIgcmVwcmVzZW50aW5nIHByaW9yaXR5XG4gICAgICAgIHEucHVzaCA9IGZ1bmN0aW9uIChkYXRhLCBwcmlvcml0eSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIF9pbnNlcnQocSwgZGF0YSwgcHJpb3JpdHksIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZW1vdmUgdW5zaGlmdCBmdW5jdGlvblxuICAgICAgICBkZWxldGUgcS51bnNoaWZ0O1xuXG4gICAgICAgIHJldHVybiBxO1xuICAgIH07XG5cbiAgICBhc3luYy5jYXJnbyA9IGZ1bmN0aW9uICh3b3JrZXIsIHBheWxvYWQpIHtcbiAgICAgICAgcmV0dXJuIF9xdWV1ZSh3b3JrZXIsIDEsIHBheWxvYWQpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY29uc29sZV9mbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBfcmVzdFBhcmFtKGZ1bmN0aW9uIChmbiwgYXJncykge1xuICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW19yZXN0UGFyYW0oZnVuY3Rpb24gKGVyciwgYXJncykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY29uc29sZVtuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2FycmF5RWFjaChhcmdzLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGVbbmFtZV0oeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMubG9nID0gX2NvbnNvbGVfZm4oJ2xvZycpO1xuICAgIGFzeW5jLmRpciA9IF9jb25zb2xlX2ZuKCdkaXInKTtcbiAgICAvKmFzeW5jLmluZm8gPSBfY29uc29sZV9mbignaW5mbycpO1xuICAgIGFzeW5jLndhcm4gPSBfY29uc29sZV9mbignd2FybicpO1xuICAgIGFzeW5jLmVycm9yID0gX2NvbnNvbGVfZm4oJ2Vycm9yJyk7Ki9cblxuICAgIGFzeW5jLm1lbW9pemUgPSBmdW5jdGlvbiAoZm4sIGhhc2hlcikge1xuICAgICAgICB2YXIgbWVtbyA9IHt9O1xuICAgICAgICB2YXIgcXVldWVzID0ge307XG4gICAgICAgIHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgICBoYXNoZXIgPSBoYXNoZXIgfHwgaWRlbnRpdHk7XG4gICAgICAgIHZhciBtZW1vaXplZCA9IF9yZXN0UGFyYW0oZnVuY3Rpb24gbWVtb2l6ZWQoYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoaGFzLmNhbGwobWVtbywga2V5KSkgeyAgIFxuICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIG1lbW9ba2V5XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChoYXMuY2FsbChxdWV1ZXMsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZXNba2V5XS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXVlc1trZXldID0gW2NhbGxiYWNrXTtcbiAgICAgICAgICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzLmNvbmNhdChbX3Jlc3RQYXJhbShmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBtZW1vW2tleV0gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcSA9IHF1ZXVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcXVldWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHFbaV0uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1lbW9pemVkLm1lbW8gPSBtZW1vO1xuICAgICAgICBtZW1vaXplZC51bm1lbW9pemVkID0gZm47XG4gICAgICAgIHJldHVybiBtZW1vaXplZDtcbiAgICB9O1xuXG4gICAgYXN5bmMudW5tZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGZuLnVubWVtb2l6ZWQgfHwgZm4pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF90aW1lcyhtYXBwZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjb3VudCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBtYXBwZXIoX3JhbmdlKGNvdW50KSwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYy50aW1lcyA9IF90aW1lcyhhc3luYy5tYXApO1xuICAgIGFzeW5jLnRpbWVzU2VyaWVzID0gX3RpbWVzKGFzeW5jLm1hcFNlcmllcyk7XG4gICAgYXN5bmMudGltZXNMaW1pdCA9IGZ1bmN0aW9uIChjb3VudCwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gYXN5bmMubWFwTGltaXQoX3JhbmdlKGNvdW50KSwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnNlcSA9IGZ1bmN0aW9uICgvKiBmdW5jdGlvbnMuLi4gKi8pIHtcbiAgICAgICAgdmFyIGZucyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIF9yZXN0UGFyYW0oZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgYXJncy5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBub29wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYy5yZWR1Y2UoZm5zLCBhcmdzLCBmdW5jdGlvbiAobmV3YXJncywgZm4sIGNiKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgbmV3YXJncy5jb25jYXQoW19yZXN0UGFyYW0oZnVuY3Rpb24gKGVyciwgbmV4dGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZXJyLCBuZXh0YXJncyk7XG4gICAgICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoYXQsIFtlcnJdLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLmNvbXBvc2UgPSBmdW5jdGlvbiAoLyogZnVuY3Rpb25zLi4uICovKSB7XG4gICAgICAgIHJldHVybiBhc3luYy5zZXEuYXBwbHkobnVsbCwgQXJyYXkucHJvdG90eXBlLnJldmVyc2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBfYXBwbHlFYWNoKGVhY2hmbikge1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbihmbnMsIGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBnbyA9IF9yZXN0UGFyYW0oZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlYWNoZm4oZm5zLCBmdW5jdGlvbiAoZm4sIF8sIGNiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KFtjYl0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdvLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYy5hcHBseUVhY2ggPSBfYXBwbHlFYWNoKGFzeW5jLmVhY2hPZik7XG4gICAgYXN5bmMuYXBwbHlFYWNoU2VyaWVzID0gX2FwcGx5RWFjaChhc3luYy5lYWNoT2ZTZXJpZXMpO1xuXG5cbiAgICBhc3luYy5mb3JldmVyID0gZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZG9uZSA9IG9ubHlfb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgICAgICAgdmFyIHRhc2sgPSBlbnN1cmVBc3luYyhmbik7XG4gICAgICAgIGZ1bmN0aW9uIG5leHQoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2sobmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBlbnN1cmVBc3luYyhmbikge1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICBpZiAoc3luYykge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgaW5uZXJBcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgaW5uZXJBcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYy5lbnN1cmVBc3luYyA9IGVuc3VyZUFzeW5jO1xuXG4gICAgYXN5bmMuY29uc3RhbnQgPSBfcmVzdFBhcmFtKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICB2YXIgYXJncyA9IFtudWxsXS5jb25jYXQodmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXN5bmMud3JhcFN5bmMgPVxuICAgIGFzeW5jLmFzeW5jaWZ5ID0gZnVuY3Rpb24gYXN5bmNpZnkoZnVuYykge1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgcmVzdWx0IGlzIFByb21pc2Ugb2JqZWN0XG4gICAgICAgICAgICBpZiAoX2lzT2JqZWN0KHJlc3VsdCkgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLm1lc3NhZ2UgPyBlcnIgOiBuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBOb2RlLmpzXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gYXN5bmM7XG4gICAgfVxuICAgIC8vIEFNRCAvIFJlcXVpcmVKU1xuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3luYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGluY2x1ZGVkIGRpcmVjdGx5IHZpYSA8c2NyaXB0PiB0YWdcbiAgICBlbHNlIHtcbiAgICAgICAgcm9vdC5hc3luYyA9IGFzeW5jO1xuICAgIH1cblxufSgpKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgY29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcblxuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJztcbnZhciBsb2cgPSBsb2dnZXIuZ2V0TG9nZ2VyKFwiemFwdENvbnRyb2xsZXJMb2dnZXJcIik7XG5cbmNvbnN0IGdwc09wdGlvbnNQcm9kdWN0aW9uID0ge1xuICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gIHRpbWVvdXQ6IDUwMDAsXG4gIG1heGltdW1BZ2U6IDBcbn07XG5cbmNvbnN0IG9yaWVudGF0aW9uT3B0aW9uc1Byb2R1Y3Rpb24gPSB7XG4gIGZyZXF1ZW5jeTogNTAwXG59O1xuXG5jb25zdCBEUkFXX0NVUlNPUl9JTlRFUlZBTCA9IDUwMDtcbmNvbnN0IFRJTUVfRElTUExBWV9QT1BVUCA9IDIwMDAwO1xuXG5jb25zdCBBVk9JRF9JTlZBTElEX1BBVEggPSBmYWxzZTtcblxuY2xhc3MgWmFwdCB7XG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLmFjY3VyYWN5ID0gbnVsbDtcbiAgICB0aGlzLm1hcCA9IG51bGw7XG4gICAgdGhpcy5jYW5TY3JvbGwgPSBudWxsO1xuICAgIHRoaXMuZGVzdGluYXRpb25YID0gbnVsbDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uWSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgIHRoaXMubWF4V2lkdGggPSBudWxsO1xuICAgIHRoaXMubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zZm9ybWVkRGVzdGluYXRpb24gPSBudWxsO1xuICAgIHRoaXMucHJpbnRlZFBhdGhzID0gbnVsbDtcbiAgICB0aGlzLmxhc3RNYXJrZXIgPSBudWxsO1xuICAgIHZhciBpbWFnZU9iaiA9IG51bGw7XG4gICAgdGhpcy5wb3B1cHNTaG93biA9IHt9O1xuICAgIHRoaXMua2V5ID0gbnVsbDtcbiAgICB0aGlzLm1hcENvbnRhaW5lcklkID0gbnVsbDtcbiAgICB0aGlzLmludGVyZXN0Q2lyY2xlcyA9IFtdO1xuICAgIHRoaXMuY2FyZHNDYWNoZSA9IHt9O1xuICAgIHRoaXMubGFzdEhpZ2hsaWdodE5lYXJlc3RQbGFjZSA9IG51bGw7XG4gICAgdGhpcy5wb3NpdGlvblF1ZXVlID0gW107XG4gICAgdGhpcy5wb3NpdGlvblF1ZXVlSW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMubW9uaXRvcmluZ0ZlbmNlU2VydmljZSA9IG51bGw7XG4gICAgdGhpcy5pbml0Wm9vbSA9IDA7XG4gICAgdGhpcy5vcHRzID0gbnVsbDtcbiAgICB0aGlzLmluaXRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxuICBpbml0aWFsaXplTWFwKGtleSwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKHR5cGVvZiBvcHRzID09PSBcInN0cmluZ1wiKXtcbiAgICAgIHZhciBtYXBDb250YWluZXJJZCA9IG9wdHM7XG4gICAgICB0aGlzLm9wdHMgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1hcENvbnRhaW5lcklkID0gb3B0cy5tYXBDb250YWluZXJJZDtcbiAgICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgfVxuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMubWFwQ29udGFpbmVySWQgPSBtYXBDb250YWluZXJJZDtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZU1hcFVJKG1hcENvbnRhaW5lcklkLCAoKT0+e1xuICAgICAgaWYoY2FsbGJhY2spe1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gQ29tbW9uIHBhcnQgZm9yIGFsbCBtYXBzIGluaXRpYWxpemF0aW9uc1xuICBpbml0aWFsaXplTWFwVUkobWFwQ29udGFpbmVySWQsIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgd2lkdGggPSBnZXRXaWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBnZXRIZWlnaHQoKTtcbiAgICBoZWlnaHQgLT0gaGVpZ2h0ICogMC4xNTtcblxuICAgIHRoaXMuY3VycmVudE9yaWVudGF0aW9uID0gdGhpcy5nZXRDdXJyZW50T3JpZW50YXRpb24oKTtcbiAgICBqUXVlcnkoXCIjXCIrbWFwQ29udGFpbmVySWQpLmNzcyhcIndpZHRoXCIsIHdpZHRoICsgXCJweFwiKTtcbiAgICBqUXVlcnkoXCIjXCIrbWFwQ29udGFpbmVySWQpLmNzcyhcImhlaWdodFwiLCBoZWlnaHQgKyBcInB4XCIpO1xuXG4gICAgdGhpcy5nZXRDdXJyZW50TG9jYWwodGhpcy5rZXkpLnRoZW4oKGN1cnJlbnRMb2NhbE9iaik9PntcbiAgICAgIGFzeW5jLnBhcmFsbGVsKFtcbiAgICAgICAgYXN5bmMuYXN5bmNpZnkodGhpcy5pbml0aWFsaXplTG9jYXRpb25BbGdvcml0aG1zLmJpbmQodGhpcykpLFxuICAgICAgICBhc3luYy5hc3luY2lmeSh0aGlzLmluaXRpYWxpemVNYXRlcmlhbEljb25zLmJpbmQodGhpcykpLFxuICAgICAgICBtYXBGaXJlYmFzZURBTy5jbG91ZE1hcFJldHJpZXZlLmJpbmQobWFwRmlyZWJhc2VEQU8sIHRoaXMua2V5KVxuICAgICAgXSwgKGVyciwgcmVzdWx0cyk9PntcblxuICAgICAgICBpZihlcnIpe1xuICAgICAgICAgIGxvZy5lcnJvcihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNhdmVkSW1hZ2UgPSByZXN1bHRzWzJdO1xuXG4gICAgICAgIHdpbmRvdy5pbWFnZU9iaiA9IG5ldyBJbWFnZSgpOyAvL1RPRE8gQnJ1bm8gLSByZW1vdmUgZnJvbSBnbG9iYWwgc2NvcGVcbiAgICAgICAgICBpZihBVk9JRF9JTlZBTElEX1BBVEgpe1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblF1ZXVlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKT0+e1xuICAgICAgICAgICAgICB0aGlzLmRyYXdFYWNoVmFsaWRQb3NpdGlvbigpO1xuICAgICAgICAgICAgfSwgRFJBV19DVVJTT1JfSU5URVJWQUwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmluaXRpYWxpemVGZW5jZXMoY3VycmVudExvY2FsT2JqKTtcbiAgICAgICAgICB0aGlzLmRyYXdDdXJyZW50UG9zaXRpb25NYXBMaXN0ZW5lciA9IChldmVudCk9PiB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJaYXB0IC0gZHJhd0N1cnJlbnRQb3NpdGlvbk1hcExpc3RlbmVyXCIpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRQb3NpdGlvbj09bnVsbCB8fCAhQVZPSURfSU5WQUxJRF9QQVRIKXtcbiAgICAgICAgICAgICAgdmFyIHh5TGVhZmxldCA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KGV2ZW50LmRldGFpbC54eSk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhd0N1cnJlbnRQb3NpdGlvbk1hcCh4eUxlYWZsZXQsIGV2ZW50LmRldGFpbC5hY2N1cmFjeSk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX2lzQ29vcmRzVmFsaWQoeHlMZWFmbGV0KSl7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSB4eUxlYWZsZXQ7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+dGhpcy5zaG93SGlnaGxpZ2h0TmVhcmVzdFBsYWNlKHtsYXRsbmc6e2xhdDogeHlMZWFmbGV0WzFdLCBsbmc6IHh5TGVhZmxldFswXX19KSwgMjAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIHphcHRDdXJyZW50UG9zaXRpb24gPSB0cmFuc2Zvcm1Db29yZGluYXRlc1RvTGVhZmxldCh0aGlzLmN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuZmluZFNob3J0ZXN0UGF0aChbW3phcHRDdXJyZW50UG9zaXRpb25bMF0semFwdEN1cnJlbnRQb3NpdGlvblsxXV0sZXZlbnQuZGV0YWlsLnh5XSkudGhlbigodmFsaWRQYXRoKT0+e1xuICAgICAgICAgICAgICAgIGlmKHZhbGlkUGF0aC5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IFtwYXJzZUZsb2F0KHZhbGlkUGF0aFt2YWxpZFBhdGgubGVuZ3RoLTFdLnNwbGl0KFwiX1wiKVswXSkscGFyc2VGbG9hdCh2YWxpZFBhdGhbdmFsaWRQYXRoLmxlbmd0aC0xXS5zcGxpdChcIl9cIilbMV0pXTtcbiAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25RdWV1ZSA9IHRoaXMucG9zaXRpb25RdWV1ZS5jb25jYXQodmFsaWRQYXRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdmFyIHh5TGVhZmxldCA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KGV2ZW50LmRldGFpbC54eSk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmRyYXdDdXJyZW50UG9zaXRpb25NYXAoeHlMZWFmbGV0LCBldmVudC5kZXRhaWwuYWNjdXJhY3kpO1xuICAgICAgICAgICAgICAgICAgaWYodGhpcy5faXNDb29yZHNWYWxpZCh4eUxlYWZsZXQpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSB4eUxlYWZsZXQ7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PnRoaXMuc2hvd0hpZ2hsaWdodE5lYXJlc3RQbGFjZSh7bGF0bG5nOntsYXQ6IHh5TGVhZmxldFsxXSwgbG5nOiB4eUxlYWZsZXRbMF19fSksIDIwMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tNb25pdG9yaW5nRmVuY2UoZXZlbnQuZGV0YWlsLnh5KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHNhdmVkSW1hZ2UhPW51bGwpIHtcbiAgICAgICAgICAgIGltYWdlT2JqLnNyYz1zYXZlZEltYWdlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbWFnZU9iai5zcmM9Jy4vaW1nLycrY3VycmVudExvY2FsT2JqLm1hcFVybDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1hZ2VPYmouY3Jvc3NPcmlnaW4gPSBcIkFub255bW91c1wiO1xuXG4gICAgICAgICAgaW1hZ2VPYmoub25sb2FkID0gKCk9PntcblxuICAgICAgICAgICAgTC5JY29uLkRlZmF1bHQuaW1hZ2VQYXRoID0gJy4vaW1nLyc7XG4gICAgICAgICAgICB2YXIgYm91bmRzID0gW1swLDBdLCBbaW1hZ2VPYmouaGVpZ2h0LCBpbWFnZU9iai53aWR0aF1dO1xuICAgICAgICAgICAgdGhpcy5jYW5TY3JvbGwgPSB0cnVlO1xuXG4gICAgICAgICAgICAvL1RPRE8gQnJ1bm8gcmVmYWN0b3IgdGhpcyB0byByZW1vdmUgZ2xvYmFsIHNjb3BlXG4gICAgICAgICAgICBnbG9iYWwubWFwID0gdGhpcy5tYXAgPSBMLm1hcChtYXBDb250YWluZXJJZCwge1xuICAgICAgICAgICAgICBjcnM6IEwuQ1JTLlNpbXBsZSxcbiAgICAgICAgICAgICAgbWF4Qm91bmRzOiBib3VuZHMsXG4gICAgICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICAgIGNlbnRlcjogd2luZG93LmN1cnJlbnRMb2NhbE9iaiA/ICh3aW5kb3cuY3VycmVudExvY2FsT2JqLm1hcENlbnRlckNvb3JkcyB8fCBbaW1hZ2VPYmouaGVpZ2h0LzIsIGltYWdlT2JqLndpZHRoLzJdKSA6IFtpbWFnZU9iai5oZWlnaHQvMiwgaW1hZ2VPYmoud2lkdGgvMl0sXG4gICAgICAgICAgICAgIG1pblpvb206IHdpbmRvdy5jdXJyZW50TG9jYWxPYmogPyAod2luZG93LmN1cnJlbnRMb2NhbE9iai5tYXBNaW5ab29tIHx8IC0zKSA6IC0zLFxuICAgICAgICAgICAgICBtYXhab29tOiB3aW5kb3cuY3VycmVudExvY2FsT2JqID8gKHdpbmRvdy5jdXJyZW50TG9jYWxPYmoubWFwTWF4Wm9vbSB8fCAxLjUpIDogMS41LFxuICAgICAgICAgICAgICB6b29tRGVsdGE6IHdpbmRvdy5jdXJyZW50TG9jYWxPYmogPyAod2luZG93LmN1cnJlbnRMb2NhbE9iai5tYXBab29tRGVsdGEgfHwgMC4xKSA6IDAuMSxcbiAgICAgICAgICAgICAgem9vbVNuYXA6IHdpbmRvdy5jdXJyZW50TG9jYWxPYmogPyAod2luZG93LmN1cnJlbnRMb2NhbE9iai5tYXBab29tU25hcCB8fCAwLjEpIDogMC4xLFxuICAgICAgICAgICAgICB6b29tQW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBib3VuY2VBdFpvb21MaW1pdHM6IHRydWUsXG4gICAgICAgICAgICAgIHpvb21Db250cm9sOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubWFwLm9uKCdsb2FkJywgKGUpPT57XG4gICAgICAgICAgICAgIGlmKHdpbmRvdy5jdXJyZW50TG9jYWxPYmogIT0gbnVsbCAmJiB3aW5kb3cuY3VycmVudExvY2FsT2JqLm1hcEluaXRab29tICE9IG51bGwpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5tYXAuc2V0Wm9vbSh3aW5kb3cuY3VycmVudExvY2FsT2JqLm1hcEluaXRab29tKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRab29tID0gd2luZG93LmN1cnJlbnRMb2NhbE9iai5tYXBJbml0Wm9vbVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFpvb20gPSB0aGlzLm1hcC5nZXRab29tKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBMLmltYWdlT3ZlcmxheShpbWFnZU9iai5zcmMsIGJvdW5kcykuYWRkVG8odGhpcy5tYXApO1xuICAgICAgICAgICAgdGhpcy5tYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgICAgICBqUXVlcnkoXCIjcmVmcmVzaEluZGljYXRvclwiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMubWFwLm9uKCdtb3ZlJywgKGUpPT57XG4gICAgICAgICAgICAgIGlmKGUub3JpZ2luYWxFdmVudCAmJiAoZS5vcmlnaW5hbEV2ZW50LmNvbnN0cnVjdG9yID09PSB3aW5kb3cuUG9pbnRlckV2ZW50IHx8IGUub3JpZ2luYWxFdmVudC5jb25zdHJ1Y3RvciA9PT0gd2luZG93LlRvdWNoRXZlbnQpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNhblNjcm9sbCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5tYXAub24oJ3pvb21zdGFydCcsIChlKT0+e1xuICAgICAgICAgICAgICB0aGlzLm9uWm9vbSA9IHRydWU7XG4gICAgICAgICAgICAgIHRoaXMuY2FuU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFBvc2l0aW9uKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdOYXZpZ2F0aW9uQ3Vyc29yKHRoaXMuY3VycmVudFBvc2l0aW9uWzBdLHRoaXMuY3VycmVudFBvc2l0aW9uWzFdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnpvb21DbGVhcmVkQ2lyY2xlcyA9IHRoaXMuY2xlYXJJbnRlcmVzdHNDaXJjbGVzKCk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFBhdGghPW51bGwgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25YIT1udWxsICYmIHRoaXMuZGVzdGluYXRpb25ZIT1udWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21DbGVhcmVkTWFya2VyID0gdGhpcy5jbGVhck1hcmtlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuem9vbUNsZWFyZWRQYXRocyA9IHRoaXMuY2xlYXJQYXRocygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGpRdWVyeShcInN2ZyAuemFwdC16b29tLWNvbnRyb2xcIikuaGlkZSgpO1xuICAgICAgICAgICAgICBqUXVlcnkoXCIuemFwdC1jaXJjbGUtbWFya2VyLWNvbnRyb2xcIikuaGlkZSgpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubWFwLm9uKCd6b29tZW5kJywgKGUpPT57XG5cbiAgICAgICAgICAgICAgaWYoIXRoaXMuZ2V0TWFwKCkpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmdldE1hcCgpLnNldFZpZXcobWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICAgICAgalF1ZXJ5KFwic3ZnIC56YXB0LXpvb20tY29udHJvbFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgIGpRdWVyeShcIi56YXB0LWNpcmNsZS1tYXJrZXItY29udHJvbFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuem9vbUNsZWFyZWRDaXJjbGVzKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdJbnRlcmVzdHNDaXJjbGVzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tQ2xlYXJlZENpcmNsZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZih0aGlzLnpvb21DbGVhcmVkTWFya2VyKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21DbGVhcmVkTWFya2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYodGhpcy56b29tQ2xlYXJlZFBhdGhzICYmIHRoaXMuY3VycmVudFBhdGghPW51bGwgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25YIT1udWxsICYmIHRoaXMuZGVzdGluYXRpb25ZIT1udWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQYXRoKHRoaXMuY3VycmVudFBhdGgsICF0aGlzLmNhblNjcm9sbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TWFya2VyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tQ2xlYXJlZFBhdGhzID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFBvc2l0aW9uKXtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd05hdmlnYXRpb25DdXJzb3IodGhpcy5jdXJyZW50UG9zaXRpb25bMF0sdGhpcy5jdXJyZW50UG9zaXRpb25bMV0sIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgNDAwKTtcblxuICAgICAgICAgICAgICB0aGlzLm9uWm9vbSA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubWFwLm9uKCdjbGljaycsIChldmVudCk9PntcbiAgICAgICAgICAgICAgdGhpcy5kcmF3SW50ZXJlc3RzQ2lyY2xlcyhldmVudCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5tYXAub24oJ3BvcHVwY2xvc2UnLCAoZXZlbnQpPT57XG4gICAgICAgICAgICAgIHRoaXMubWFwUG9wdXAgPSBudWxsO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHZhciB6YXB0Q29udHJvbHNTdHlsZSA9IHRoaXMuZ2V0Q3VycmVudE9yaWVudGF0aW9uKCk9PT1cInBvcnRyYWl0XCIgPyBcImxlZnQ6IDgwJTsgdG9wOiA4MCU7XCIgOiBcImxlZnQ6IDg5JTsgdG9wOiA2MiU7XCI7XG5cbiAgICAgICAgICAgIGpRdWVyeShcIiNtYXAtY2FudmFzXCIpLmFwcGVuZChcbiAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ6YXB0LW1hcC1jb250cm9sc1wiIGNsYXNzPVwibGVhZmxldC1jb250cm9sLXpvb20gbGVhZmxldC1iYXIgbGVhZmxldC1jb250cm9sIG5hdmlnYXRpb24tY29udHJvbFwiIHN0eWxlPVwiJyt6YXB0Q29udHJvbHNTdHlsZSsnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxhIGlkPVwiemFwdC1jdXJyZW50UG9zaXRpb25cIiBjbGFzcz1cImxlYWZsZXQtY29udHJvbC16b29tLW91dFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgdGl0bGU9XCJQb3Npw6fDo28gYXR1YWxcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHNtYWxsLWljb24gd2hlcmUtaS1hbVwiPmdwc19maXhlZDwvaT48L2E+JyArXG4gICAgICAgICAgICAgICAgJzxhIGlkPVwiemFwdC1jYW5jZWxOYXZpZ2F0aW9uXCIgY2xhc3M9XCJsZWFmbGV0LWNvbnRyb2wtem9vbS1vdXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiICB0aXRsZT1cIkNhbmNlbGFyIE5hdmVnYcOnw6NvXCI+eDwvYT4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGpRdWVyeShcIiN6YXB0LWN1cnJlbnRQb3NpdGlvblwiKS5jbGljaygoKT0+e1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQ3VycmVudExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgalF1ZXJ5KFwiI3phcHQtY2FuY2VsTmF2aWdhdGlvblwiKS5jbGljaygoKT0+e1xuICAgICAgICAgICAgICB0aGlzLmNhbmNlbE5hdmlnYXRpb24oKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zY3JvbGxUb0N1cnJlbnRMb2NhdGlvbi5iaW5kKHRoaXMpLCA1MCk7XG4gICAgICAgICAgICBqUXVlcnkoXCIjXCIrbWFwQ29udGFpbmVySWQpLmZhZGVJbihcInNsb3dcIik7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVEZXZpY2VPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYXdDdXJyZW50UG9zaXRpb25NYXAnLCB0aGlzLmRyYXdDdXJyZW50UG9zaXRpb25NYXBMaXN0ZW5lcik7XG4gICAgICAgICAgICBpZihjYWxsYmFjayl7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplTWF0ZXJpYWxJY29ucygpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgdmFyIGNvbnRhaW5zID0gZmFsc2U7XG4gICAgICBqUXVlcnkoXCJsaW5rXCIpLmVhY2goKGksbGluayk9PntcbiAgICAgICAgbGV0IGhyZWYgPSBqUXVlcnkobGluaykuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZihjb250YWlucyB8fCAoaHJlZi5pbmRleE9mKFwibWF0ZXJpYWxcIik+PTAgJiYgaHJlZi5pbmRleE9mKFwiaWNvbnNcIik+PTApKXtcbiAgICAgICAgICBjb250YWlucyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGFpbnMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmKGNvbnRhaW5zKXtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgICAgIHNzLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgICAgIHNzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuICAgICAgICBzcy5ocmVmID0gXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2ljb24/ZmFtaWx5PU1hdGVyaWFsK0ljb25zXCI7XG4gICAgICAgIHNzLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSk9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVEZXZpY2VPcmllbnRhdGlvbigpe1xuXG4gICAgdGhpcy5vbk9yaWVudGF0aW9uQ2hhbmdlID0gKGUpID0+IHtcbiAgICAgIHZhciBjdXJyZW50T3JpZW50YXRpb24gPSB0aGlzLmdldEN1cnJlbnRPcmllbnRhdGlvbigpO1xuICAgICAgaWYodGhpcy5jdXJyZW50T3JpZW50YXRpb24gIT0gY3VycmVudE9yaWVudGF0aW9uKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJPcmllbnRhdGlvbiBjaGFuZ2VkXCIpO1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lcnMoKTtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuaW5pdGlhbGl6ZU1hcFVJKHRoaXMubWFwQ29udGFpbmVySWQpO30sIDQwMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgdGhpcy5vbk9yaWVudGF0aW9uQ2hhbmdlKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRPcmllbnRhdGlvbigpe1xuXG4gICAgdmFyIGN1cnJlbnRPcmllbnRhdGlvbiA9IFwiXCI7XG5cbiAgICBpZiAod2luZG93Lm9yaWVudGF0aW9uID09IDApIHtcbiAgICAgIGN1cnJlbnRPcmllbnRhdGlvbiA9IFwicG9ydHJhaXRcIjtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5vcmllbnRhdGlvbiA9PSA5MCkge1xuICAgICAgY3VycmVudE9yaWVudGF0aW9uID0gXCJsYW5kc2NhcGVcIjtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5vcmllbnRhdGlvbiA9PSAtOTApIHtcbiAgICAgIGN1cnJlbnRPcmllbnRhdGlvbiA9IFwibGFuZHNjYXBlXCI7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cub3JpZW50YXRpb24gPT0gMTgwKSB7XG4gICAgICBjdXJyZW50T3JpZW50YXRpb24gPSBcInBvcnRyYWl0XCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRPcmllbnRhdGlvbjtcbiAgfVxuXG4gIGRyYXdFYWNoVmFsaWRQb3NpdGlvbigpe1xuICAgIGlmKHRoaXMucG9zaXRpb25RdWV1ZS5sZW5ndGg+MCl7XG4gICAgICB2YXIgeHlMZWFmbGV0ID0gdGhpcy5wb3NpdGlvblF1ZXVlLnNoaWZ0KCkuc3BsaXQoXCJfXCIpO1xuICAgICAgeHlMZWFmbGV0WzBdID0gcGFyc2VGbG9hdCh4eUxlYWZsZXRbMF0pLCB4eUxlYWZsZXRbMV0gPSBwYXJzZUZsb2F0KHh5TGVhZmxldFsxXSk7XG4gICAgICB0aGlzLmRyYXdDdXJyZW50UG9zaXRpb25NYXAoeHlMZWFmbGV0LCAwKTsgLy9hY2N1cmFjeSk7XG4gICAgICBzZXRUaW1lb3V0KCgpPT50aGlzLnNob3dIaWdobGlnaHROZWFyZXN0UGxhY2Uoe2xhdGxuZzp7bGF0OiB4eUxlYWZsZXRbMV0sIGxuZzogeHlMZWFmbGV0WzBdfX0pLCAyMDApO1xuICAgIH1cbiAgfVxuICAvLyBJbml0aWFsaXplIFNlbnNvcnMuXG4gIGluaXRpYWxpemVMb2NhdGlvbkFsZ29yaXRobXMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHYsIHJlamVjdCk9PntcbiAgICAgIHRoaXMuZ2V0Q3VycmVudExvY2FsKCkudGhlbigocGxhY2UpPT57XG4gICAgICAgIHRoaXMuaXBzU2VydmljZSA9IGdldElQU1NlcnZpY2UocGxhY2UpO1xuICAgICAgICB0aGlzLmlwc1NlcnZpY2UuaW5pdGlhbGl6ZSgpLnRoZW4oKCk9PntcbiAgICAgICAgICByZXNvbHYoKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycik9PntcbiAgICAgICAgICBsb2cuZXJyb3IoXCJFcnJvciB3aGVuIHRyaWVkIHRvIGluaXRpYWxpemVkIGxvY2F0aW9uIGFsZ29yaXRobS5cIiwgZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVGZW5jZXMoY3VycmVudExvY2FsT2JqKXtcbiAgICB0aGlzLm1vbml0b3JpbmdGZW5jZVNlcnZpY2UgPSBuZXcgTW9uaXRvcmluZ0ZlbmNlU2VydmljZShjdXJyZW50TG9jYWxPYmoubmFtZSwgY3VycmVudExvY2FsT2JqLnNjYWxlTSk7XG4gICAgdGhpcy5tb25pdG9yaW5nRmVuY2VTZXJ2aWNlLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnByZWxvYWRlZE1hcCA9IHRoaXMucHJlbG9hZGVkTWFwIHx8IHt9O1xuICAgIHRoaXMuc3dpdGNoZWRNYXAgPSB0aGlzLnN3aXRjaGVkTWFwIHx8IHt9O1xuICB9XG5cbiAgY2hlY2tNb25pdG9yaW5nRmVuY2UoeHkpe1xuICAgIHZhciBuZXh0QWN0aW9uID0gdGhpcy5tb25pdG9yaW5nRmVuY2VTZXJ2aWNlLmRlY2lkZU5leHRBY3Rpb24oeHlbMF0sIHh5WzFdKTtcbiAgICBpZihuZXh0QWN0aW9uICYmIG5leHRBY3Rpb24uYWN0aW9uID09PSBNT05JVE9SSU5HX0ZFTkNFX0FDVElPTlMuTE9BRF9NQVApey8vbG9hZGluZyBiZWZvcmUgc3dpdGNoaW5nXG4gICAgICBpZighdGhpcy5wcmVsb2FkZWRNYXBbbmV4dEFjdGlvbi5tYXBJZF0pe1xuICAgICAgICBtYXBGaXJlYmFzZURBTy5jbG91ZE1hcEFuZE1ldGFkYXRhUmV0cmlldmUobmV4dEFjdGlvbi5tYXBJZCwgKCk9PntcbiAgICAgICAgICBsb2cuaW5mbyhcIlByZSBsb2FkZWQgbmV4dCBtYXAgXCIgKyBuZXh0QWN0aW9uLm1hcElkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHJlbG9hZGVkTWFwW25leHRBY3Rpb24ubWFwSWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYobmV4dEFjdGlvbiAmJiBuZXh0QWN0aW9uLmFjdGlvbiA9PT0gTU9OSVRPUklOR19GRU5DRV9BQ1RJT05TLlNXSVRDSF9NQVApe1xuICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgaWYoIXRoaXMuc3dpdGNoZWRNYXBbbmV4dEFjdGlvbi5tYXBJZF0gfHwgbm93IC0gdGhpcy5zd2l0Y2hlZE1hcFtuZXh0QWN0aW9uLm1hcElkXSA+IE1BUF9CRVRXRUVOX1RSQU5TSVRJT05fVElNRSl7XG4gICAgICAgIHRoaXMuc3dpdGNoZWRNYXBbbmV4dEFjdGlvbi5tYXBJZF0gPSBub3c7XG4gICAgICAgIHRoaXMuc3dpdGNoZWRNYXBbY3VycmVudExvY2FsT2JqLm5hbWVdID0gbm93O1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lcnMoKTtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuaW5pdGlhbGl6ZU1hcChuZXh0QWN0aW9uLm1hcElkLCBcIm1hcC1jYW52YXNcIil9LCA0MDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3BMaXN0ZW5lcnMoKSB7XG4gICAgaWYodGhpcy5pcHNTZXJ2aWNlKXtcbiAgICAgIHRoaXMuaXBzU2VydmljZS5jYW5jZWwoKTtcbiAgICB9XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYXdDdXJyZW50UG9zaXRpb25NYXAnLCB0aGlzLmRyYXdDdXJyZW50UG9zaXRpb25NYXBMaXN0ZW5lcik7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCB0aGlzLm9uT3JpZW50YXRpb25DaGFuZ2UpO1xuICAgIHRoaXMuZGVzdGluYXRpb25YID0gbnVsbDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uWSA9IG51bGw7XG4gICAgdGhpcy5jYW5TY3JvbGwgPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgIHRoaXMuY2xlYXJNYXJrZXIoKTtcbiAgICB0aGlzLmxhc3RNYXJrZXIgPSBudWxsO1xuICAgIHRoaXMubGFzdENpcmNsZU1hcmtlciA9IG51bGw7XG4gICAgdGhpcy5kZXN0aW5hdGlvblggPSBudWxsO1xuICAgIHRoaXMuZGVzdGluYXRpb25ZID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG4gICAgdGhpcy5tYXhXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5tYXhIZWlnaHQgPSBudWxsO1xuICAgIHRoaXMudHJhbnNmb3JtZWREZXN0aW5hdGlvbiA9IG51bGw7XG4gICAgdGhpcy5wcmludGVkUGF0aHMgPSBudWxsO1xuICAgIHRoaXMucG9zaXRpb25RdWV1ZSA9IFtdO1xuICAgIHRoaXMucG9zaXRpb25RdWV1ZUludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLnNwYWNlcyA9IG51bGw7XG4gICAgdGhpcy5jYXJkc0NhY2hlID0ge307XG4gICAgZ2xvYmFsLmN1cnJlbnRMb2NhbE9iaiA9IG51bGw7XG5cbiAgICBpZih3aW5kb3cuc2hvcnRlc3RQYXRoSW50ZXJ2YWwpe1xuICAgICAgY2xlYXJJbnRlcnZhbChzaG9ydGVzdFBhdGhJbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKHdpbmRvdy53aWZpSW50ZXJ2YWxJZCl7XG4gICAgICBjbGVhckludGVydmFsKHdpbmRvdy53aWZpSW50ZXJ2YWxJZCk7XG4gICAgfVxuICAgIGlmKHRoaXMucG9zaXRpb25RdWV1ZUludGVydmFsKXtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5wb3NpdGlvblF1ZXVlSW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGpRdWVyeShcIiNcIit0aGlzLm1hcENvbnRhaW5lcklkKS5mYWRlT3V0KFwic2xvd1wiKTtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICBsZXQgaW5zdGFjZU1hcCA9IHRoaXMuZ2V0TWFwKCk7XG4gICAgICBpZihpbnN0YWNlTWFwICE9IG51bGwpe1xuICAgICAgICB0aGlzLmdldE1hcCgpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5tYXAgPSBudWxsO1xuICAgICAgZ2xvYmFsLm1hcCA9IG51bGw7XG4gICAgICB2YXIgbWFwQ29udGFpbmVyUGFyZW50ID0galF1ZXJ5KFwiI1wiK3RoaXMubWFwQ29udGFpbmVySWQpLnBhcmVudCgpO1xuICAgICAgalF1ZXJ5KFwiI1wiK3RoaXMubWFwQ29udGFpbmVySWQpLnJlbW92ZSgpO1xuICAgICAgbWFwQ29udGFpbmVyUGFyZW50LmFwcGVuZCgnPGRpdiBpZD1cIm1hcC1jYW52YXNcIj48L2Rpdj4nKS5jc3MoZ2V0TWFwQ2FudmFzU3R5bGUoKSk7XG4gICAgfSwgMjAwKTtcblxuICAgIGpRdWVyeShcIiN6YXB0LW1hcC1jb250cm9sc1wiKS5mYWRlT3V0KCkucmVtb3ZlKCk7XG4gIH1cblxuICAvL1VzZSBnbG9iYWwgXCJkaXJlY3Rpb25cIiB0byBwbG90XG4gIGRyYXdDdXJyZW50UG9zaXRpb25NYXAoeHksIGFjY3VyYWN5UGl4ZWxzKSB7XG5cbiAgICBpZighdGhpcy5faXNDb29yZHNWYWxpZCh4eSkpe1xuICAgICAgaWYodGhpcy5jdXJyZW50UG9zaXRpb249PW51bGwgfHwgdGhpcy5jdXJyZW50UG9zaXRpb24ubGVuZ3RoPDIpe1xuICAgICAgICB0aGlzLmRyYXdNc2dQb3B1cChcInBvc2l0aW9uX25vdF9hdmFpbGFibGVcIiwgXCJOw6NvIGZvaSBwb3Nzw612ZWwgdGUgbG9jYWxpemFyIG5lc3NlIG1hcGEuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL3JlbW92aW5nIG5vdCBpbnNpZGUgbXNnIGJlY2F1c2Ugd2lsbCBwbG90IHVzZXIgcG9zaXRpb24uXG4gICAgaWYodGhpcy5ub3RJbnNpZGVNc2dQb3B1cCE9bnVsbCl7XG4gICAgICB0aGlzLm5vdEluc2lkZU1zZ1BvcHVwLnJlbW92ZSgpO1xuICAgICAgdGhpcy5ub3RJbnNpZGVNc2dQb3B1cCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy9zYW1lIHBvaW50XG4gICAgaWYodGhpcy5jdXJyZW50UG9zaXRpb24hPW51bGwgJiYgeHkhPW51bGwgJiZcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb25bMF09PXh5WzBdICYmIHRoaXMuY3VycmVudFBvc2l0aW9uWzFdPT14eVsxXSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoYWNjdXJhY3lQaXhlbHMhPW51bGwpe1xuICAgICAgdGhpcy5hY2N1cmFjeSA9IGFjY3VyYWN5UGl4ZWxzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjY3VyYWN5ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubWF4V2lkdGgpIHtcbiAgICAgIHRoaXMubWF4V2lkdGg9cGFyc2VJbnQoY3VycmVudExvY2FsT2JqLmdyaWRIZWlnaHQpO1xuICAgICAgdGhpcy5tYXhIZWlnaHQ9cGFyc2VJbnQoY3VycmVudExvY2FsT2JqLmdyaWRXaWR0aCk7XG4gICAgfVxuXG4gICAgaWYodGhpcy5jdXJyZW50UGF0aCl7XG4gICAgICB0aGlzLmRyYXdQYXRoKHRoaXMuY3VycmVudFBhdGgsIHRydWUpO1xuICAgIH1cblxuICAgIGlmKHRoaXMudHJhbnNmb3JtZWREZXN0aW5hdGlvbil7XG4gICAgICB0aGlzLmRyYXdNYXJrZXIodGhpcy50cmFuc2Zvcm1lZERlc3RpbmF0aW9uWzBdLCB0aGlzLnRyYW5zZm9ybWVkRGVzdGluYXRpb25bMV0pO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd05hdmlnYXRpb25DdXJzb3IoeHlbMF0seHlbMV0pO1xuXG4gICAgdGhpcy5tYXBTY3JvbGxUbyh4eVswXSx4eVsxXSk7XG4gIH1cblxuICBjYW5jZWxOYXZpZ2F0aW9uKCl7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnNob3J0ZXN0UGF0aEludGVydmFsKTtcbiAgICB0aGlzLnNob3J0ZXN0UGF0aEludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uWCA9IG51bGw7XG4gICAgdGhpcy5kZXN0aW5hdGlvblkgPSBudWxsO1xuICAgIHRoaXMuY2FuU2Nyb2xsID0gdHJ1ZTtcbiAgICB0aGlzLmNsZWFyUGF0aHMoKTtcbiAgICB0aGlzLmNsZWFyTWFya2VyKCk7XG4gICAgdGhpcy5jbGVhckludGVyZXN0c0NpcmNsZXMoKTtcbiAgICB0aGlzLnRyYW5zZm9ybWVkRGVzdGluYXRpb24gPSBudWxsO1xuICAgIHRoaXMuZHJhd0N1cnJlbnRQb3NpdGlvbk1hcCh0aGlzLmN1cnJlbnRQb3NpdGlvbik7XG4gICAgdGhpcy5tYXAuc2V0Wm9vbSh0aGlzLmluaXRab29tKTtcbiAgfVxuXG4gIHNjcm9sbFRvQ3VycmVudExvY2F0aW9uKCkge1xuICAgIHZhciBzaG91bGRSZXR1cm5DYW5TY3JvbGwgPSAhdGhpcy5jYW5TY3JvbGw7XG4gICAgdGhpcy5jYW5TY3JvbGwgPSB0cnVlO1xuICAgIGlmKHRoaXMuY3VycmVudFBvc2l0aW9uKXtcbiAgICAgIHRoaXMubWFwU2Nyb2xsVG8odGhpcy5jdXJyZW50UG9zaXRpb25bMF0sdGhpcy5jdXJyZW50UG9zaXRpb25bMV0pO1xuICAgIH1cbiAgfVxuXG4gIG1hcFNjcm9sbFRvKHgseSkge1xuICAgIGlmKHRoaXMuY2FuU2Nyb2xsKXtcbiAgICAgIHRoaXMubWFwLnNldFZpZXcobmV3IEwuTGF0TG5nKHksIHgpKTtcbiAgICB9XG4gIH1cblxuICBmaW5kU2hvcnRlc3RQYXRoQmFzZWRDdXJyZW50TG9jYXRpb24oeCx5KXtcbiAgICAvL3dhaXQgZmlyc3QgdGltZSBncHNcbiAgICB0aGlzLnNob3J0ZXN0UGF0aEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCk9PntcbiAgICAgIGlmKHRoaXMuY3VycmVudFBvc2l0aW9uKXtcbiAgICAgICAgdGhpcy5kcmF3Q3VycmVudFBvc2l0aW9uTWFwKHRoaXMuY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgdmFyIHphcHRDdXJyZW50UG9zaXRpb24gPSB0cmFuc2Zvcm1Db29yZGluYXRlc1RvTGVhZmxldCh0aGlzLmN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIHZhciBwYXRoID0gW1t6YXB0Q3VycmVudFBvc2l0aW9uWzBdLHphcHRDdXJyZW50UG9zaXRpb25bMV1dLFt4LHldXTtcbiAgICAgICAgdGhpcy5jYW5TY3JvbGwgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uWCA9IHBhdGhbMV1bMF0rTWF0aC5mbG9vcihjdXJyZW50TG9jYWxPYmouZ3JpZFdpZHRoLzIpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uWSA9IHBhdGhbMV1bMV0rTWF0aC5mbG9vcihjdXJyZW50TG9jYWxPYmouZ3JpZEhlaWdodC8yKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1lZERlc3RpbmF0aW9uID0gdHJhbnNmb3JtQ29vcmRpbmF0ZXNUb0xlYWZsZXQoW3RoaXMuZGVzdGluYXRpb25YLHRoaXMuZGVzdGluYXRpb25ZXSk7XG4gICAgICAgIHRoaXMuZmluZFNob3J0ZXN0UGF0aChwYXRoKS50aGVuKChyZXN1bHRQYXRoKT0+e1xuICAgICAgICAgIHRoaXMuY3VycmVudFBhdGggPSByZXN1bHRQYXRoO1xuICAgICAgICAgIHRoaXMuZHJhd1BhdGgodGhpcy5jdXJyZW50UGF0aCk7XG4gICAgICAgICAgdGhpcy5kcmF3TWFya2VyKCk7XG4gICAgICAgICAgdGhpcy5jbGVhckludGVyZXN0c0NpcmNsZXMoKTtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc2hvcnRlc3RQYXRoSW50ZXJ2YWwpO1xuICAgICAgICAgIHRoaXMuc2hvcnRlc3RQYXRoSW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICAgIHRoaXMuY2FuU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmaW5kU2hvcnRlc3RQYXRoKHBhdGgpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2LCByZWplY3QpPT57XG4gICAgICB0aGlzLmdldEN1cnJlbnRMb2NhbCgpLnRoZW4oKHBsYWNlKT0+e1xuICAgICAgICB0aGlzLmdldFNwYWNlcyhwbGFjZS5uYW1lKS50aGVuKChzcGFjZXMpPT57XG4gICAgICAgICAgdGhpcy5nZXRQYXRocyhwbGFjZS5uYW1lKS50aGVuKChwYXRocyk9PntcblxuICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uWCA9IHBhdGhbMV1bMF0rTWF0aC5mbG9vcihwbGFjZS5ncmlkV2lkdGgvMik7XG4gICAgICAgICAgICB2YXIgZGVzdGluYXRpb25ZID0gcGF0aFsxXVsxXStNYXRoLmZsb29yKHBsYWNlLmdyaWRIZWlnaHQvMik7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtZWREZXN0aW5hdGlvbiA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KFtkZXN0aW5hdGlvblgsZGVzdGluYXRpb25ZXSk7XG4gICAgICAgICAgICB2YXIgdFhZID0gdHJhbnNmb3JtZWREZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIHZhciBvcmlnaW5YID0gcGF0aFswXVswXTtcbiAgICAgICAgICAgIHZhciBvcmlnaW5ZID0gcGF0aFswXVsxXTtcbiAgICAgICAgICAgIHZhciBnID0gbmV3IEdyYXBoKCk7XG4gICAgICAgICAgICBzcGFjZXMgPSBzcGFjZXMgfHwgW107XG5cbiAgICAgICAgICAgIC8vc29ydCBieSB0aGUgbmVhcmVzdCBwYXRoIGZyb20gdGhlIG9yaWdpblxuICAgICAgICAgICAgcGF0aHMgPSBwYXRocy5zb3J0KChwMSxwMik9PntcbiAgICAgICAgICAgICAgcDEub3JpZ2luRGlzdGFuY2VEaWZmID0gTWF0aC5hYnMoZ2V0RGlzdGFuY2VJblBpeGVsKHAxWzBdWzBdLHAxWzBdWzFdLHAxWzFdWzBdLHAxWzFdWzFdKSAtXG4gICAgICAgICAgICAgICAgKGdldERpc3RhbmNlSW5QaXhlbChwMVswXVswXSxwMVswXVsxXSxvcmlnaW5YLG9yaWdpblkpICsgZ2V0RGlzdGFuY2VJblBpeGVsKG9yaWdpblgsb3JpZ2luWSxwMVswXVswXSxwMVswXVsxXSkpKTtcbiAgICAgICAgICAgICAgcDIub3JpZ2luRGlzdGFuY2VEaWZmID0gTWF0aC5hYnMoZ2V0RGlzdGFuY2VJblBpeGVsKHAyWzBdWzBdLHAyWzBdWzFdLHAyWzFdWzBdLHAyWzFdWzFdKSAtXG4gICAgICAgICAgICAgICAgKGdldERpc3RhbmNlSW5QaXhlbChwMlswXVswXSxwMlswXVsxXSxvcmlnaW5YLG9yaWdpblkpICsgZ2V0RGlzdGFuY2VJblBpeGVsKG9yaWdpblgsb3JpZ2luWSxwMlswXVswXSxwMlswXVsxXSkpKTtcblxuICAgICAgICAgICAgICBwMS5vcmlnaW5EaXN0YW5jZVAxID0gZ2V0RGlzdGFuY2VJblBpeGVsKHAxWzBdWzBdLHAxWzBdWzFdLG9yaWdpblgsb3JpZ2luWSkgO1xuICAgICAgICAgICAgICBwMS5vcmlnaW5EaXN0YW5jZVAyID0gZ2V0RGlzdGFuY2VJblBpeGVsKHAxWzFdWzBdLHAxWzFdWzFdLG9yaWdpblgsb3JpZ2luWSkgO1xuICAgICAgICAgICAgICBwMS5vcmlnaW5EaXN0YW5jZVAxIDwgcDEub3JpZ2luRGlzdGFuY2VQMiA/ICBwMS5uZWFyZXN0UGF0aFBvaW50ID0gcDEub3JpZ2luRGlzdGFuY2VQMSA6IHAxLm5lYXJlc3RQYXRoUG9pbnQgPSBwMS5vcmlnaW5EaXN0YW5jZVAyO1xuXG4gICAgICAgICAgICAgIHAyLm9yaWdpbkRpc3RhbmNlUDEgPSBnZXREaXN0YW5jZUluUGl4ZWwocDJbMF1bMF0scDJbMF1bMV0sb3JpZ2luWCxvcmlnaW5ZKSA7XG4gICAgICAgICAgICAgIHAyLm9yaWdpbkRpc3RhbmNlUDIgPSBnZXREaXN0YW5jZUluUGl4ZWwocDJbMV1bMF0scDJbMV1bMV0sb3JpZ2luWCxvcmlnaW5ZKSA7XG4gICAgICAgICAgICAgIHAyLm9yaWdpbkRpc3RhbmNlUDEgPCBwMi5vcmlnaW5EaXN0YW5jZVAyID8gIHAyLm5lYXJlc3RQYXRoUG9pbnQgPSBwMi5vcmlnaW5EaXN0YW5jZVAxIDogcDIubmVhcmVzdFBhdGhQb2ludCA9IHAyLm9yaWdpbkRpc3RhbmNlUDI7XG5cbiAgICAgICAgICAgICAgcDEucmF0ZSA9IHAxLm9yaWdpbkRpc3RhbmNlRGlmZiArIHAxLm5lYXJlc3RQYXRoUG9pbnQ7XG4gICAgICAgICAgICAgIHAyLnJhdGUgPSBwMi5vcmlnaW5EaXN0YW5jZURpZmYgKyBwMi5uZWFyZXN0UGF0aFBvaW50O1xuXG4gICAgICAgICAgICAgIHJldHVybiBwMS5yYXRlIC0gcDIucmF0ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3JpZ2luUGF0aCA9IHBhdGhzWzBdO1xuXG4gICAgICAgICAgICAvL3NvcnQgYnkgdGhlIG5lYXJlc3QgcGF0aCBmcm9tIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgcGF0aHMgPSBwYXRocy5zb3J0KChwMSxwMik9PntcbiAgICAgICAgICAgICAgcDEuZGVzdGluYXRpb25EaXN0YW5jZURpZmYgPSBNYXRoLmFicyhnZXREaXN0YW5jZUluUGl4ZWwocDFbMF1bMF0scDFbMF1bMV0scDFbMV1bMF0scDFbMV1bMV0pIC1cbiAgICAgICAgICAgICAgICAoZ2V0RGlzdGFuY2VJblBpeGVsKHAxWzBdWzBdLHAxWzBdWzFdLGRlc3RpbmF0aW9uWCxkZXN0aW5hdGlvblkpICsgZ2V0RGlzdGFuY2VJblBpeGVsKGRlc3RpbmF0aW9uWCxkZXN0aW5hdGlvblkscDFbMV1bMF0scDFbMV1bMV0pKSk7XG4gICAgICAgICAgICAgIHAyLmRlc3RpbmF0aW9uRGlzdGFuY2VEaWZmID0gTWF0aC5hYnMoZ2V0RGlzdGFuY2VJblBpeGVsKHAyWzBdWzBdLHAyWzBdWzFdLHAyWzFdWzBdLHAyWzFdWzFdKSAtXG4gICAgICAgICAgICAgICAgKGdldERpc3RhbmNlSW5QaXhlbChwMlswXVswXSxwMlswXVsxXSxkZXN0aW5hdGlvblgsZGVzdGluYXRpb25ZKSArIGdldERpc3RhbmNlSW5QaXhlbChkZXN0aW5hdGlvblgsZGVzdGluYXRpb25ZLHAyWzFdWzBdLHAyWzFdWzFdKSkpO1xuXG4gICAgICAgICAgICAgIHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VQMSA9IGdldERpc3RhbmNlSW5QaXhlbChwMVswXVswXSxwMVswXVsxXSxkZXN0aW5hdGlvblgsZGVzdGluYXRpb25ZKSA7XG4gICAgICAgICAgICAgIHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VQMiA9IGdldERpc3RhbmNlSW5QaXhlbChwMVsxXVswXSxwMVsxXVsxXSxkZXN0aW5hdGlvblgsZGVzdGluYXRpb25ZKSA7XG4gICAgICAgICAgICAgIHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VQMSA8IHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VQMiA/ICBwMS5uZWFyZXN0UGF0aFBvaW50ID0gcDEuZGVzdGluYXRpb25EaXN0YW5jZVAxIDogcDEubmVhcmVzdFBhdGhQb2ludCA9IHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VQMjtcblxuICAgICAgICAgICAgICBwMi5kZXN0aW5hdGlvbkRpc3RhbmNlUDEgPSBnZXREaXN0YW5jZUluUGl4ZWwocDJbMF1bMF0scDJbMF1bMV0sZGVzdGluYXRpb25YLGRlc3RpbmF0aW9uWSkgO1xuICAgICAgICAgICAgICBwMi5kZXN0aW5hdGlvbkRpc3RhbmNlUDIgPSBnZXREaXN0YW5jZUluUGl4ZWwocDJbMV1bMF0scDJbMV1bMV0sZGVzdGluYXRpb25YLGRlc3RpbmF0aW9uWSkgO1xuICAgICAgICAgICAgICBwMi5kZXN0aW5hdGlvbkRpc3RhbmNlUDEgPCBwMi5kZXN0aW5hdGlvbkRpc3RhbmNlUDIgPyAgcDIubmVhcmVzdFBhdGhQb2ludCA9IHAyLmRlc3RpbmF0aW9uRGlzdGFuY2VQMSA6IHAyLm5lYXJlc3RQYXRoUG9pbnQgPSBwMi5kZXN0aW5hdGlvbkRpc3RhbmNlUDI7XG5cbiAgICAgICAgICAgICAgcDEucmF0ZSA9IHAxLmRlc3RpbmF0aW9uRGlzdGFuY2VEaWZmICsgcDEubmVhcmVzdFBhdGhQb2ludDtcbiAgICAgICAgICAgICAgcDIucmF0ZSA9IHAyLmRlc3RpbmF0aW9uRGlzdGFuY2VEaWZmICsgcDIubmVhcmVzdFBhdGhQb2ludDtcblxuICAgICAgICAgICAgICByZXR1cm4gcDEucmF0ZSAtIHAyLnJhdGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uUGF0aCA9IHBhdGhzWzBdO1xuXG4gICAgICAgICAgICBzcGFjZXMuZm9yRWFjaCgoc3BhY2UsaSk9PntcbiAgICAgICAgICAgICAgdmFyIGVkZ2VzID0ge307XG4gICAgICAgICAgICAgIHBhdGhzLmZvckVhY2goKHAyKT0+e1xuICAgICAgICAgICAgICAgIGlmKHAyWzBdWzBdID09IHNwYWNlLmNvb3Jkc1swXSAmJiBwMlswXVsxXSA9PSBzcGFjZS5jb29yZHNbMV0pe1xuICAgICAgICAgICAgICAgICAgZWRnZXNbcDJbMV1bMF0rXCJfXCIrcDJbMV1bMV1dID0gZ2V0RGlzdGFuY2VJblBpeGVsKHAyWzBdWzBdLHAyWzBdWzFdLHAyWzFdWzBdLHAyWzFdWzFdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYocDJbMV1bMF0gPT0gc3BhY2UuY29vcmRzWzBdICYmIHAyWzFdWzFdID09IHNwYWNlLmNvb3Jkc1sxXSl7XG4gICAgICAgICAgICAgICAgICBlZGdlc1twMlswXVswXStcIl9cIitwMlswXVsxXV0gPSBnZXREaXN0YW5jZUluUGl4ZWwocDJbMF1bMF0scDJbMF1bMV0scDJbMV1bMF0scDJbMV1bMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGcuYWRkVmVydGV4KHNwYWNlLmNvb3Jkc1swXStcIl9cIitzcGFjZS5jb29yZHNbMV0sIGVkZ2VzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZW5kUG9pbnQ7XG4gICAgICAgICAgICBpZihkZXN0aW5hdGlvblBhdGguZGVzdGluYXRpb25EaXN0YW5jZVAxPGRlc3RpbmF0aW9uUGF0aC5kZXN0aW5hdGlvbkRpc3RhbmNlUDIpe1xuICAgICAgICAgICAgICBlbmRQb2ludCA9IGRlc3RpbmF0aW9uUGF0aFswXVswXStcIl9cIitkZXN0aW5hdGlvblBhdGhbMF1bMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbmRQb2ludCA9IGRlc3RpbmF0aW9uUGF0aFsxXVswXStcIl9cIitkZXN0aW5hdGlvblBhdGhbMV1bMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50UGF0aCA9IGcuc2hvcnRlc3RQYXRoKG9yaWdpblBhdGhbMF1bMF0rXCJfXCIrb3JpZ2luUGF0aFswXVsxXSwgZW5kUG9pbnQpO1xuXG4gICAgICAgICAgICAvL3JlbW92aW5nIHBhdGggdGhhdCBjb250YWlucyBjdXJyZW50UG9pbnRcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXRoLmxlbmd0aCA+PSAyKXtcbiAgICAgICAgICAgICAgdmFyIHAxID0gY3VycmVudFBhdGhbY3VycmVudFBhdGgubGVuZ3RoLTFdLnNwbGl0KFwiX1wiKTtcbiAgICAgICAgICAgICAgdmFyIHAyID0gY3VycmVudFBhdGhbY3VycmVudFBhdGgubGVuZ3RoLTJdLnNwbGl0KFwiX1wiKTtcbiAgICAgICAgICAgICAgaWYoZ2V0RGlzdGFuY2VJblBpeGVsKHAxWzBdLHAxWzFdLCBvcmlnaW5YLCBvcmlnaW5ZKSArIGdldERpc3RhbmNlSW5QaXhlbChvcmlnaW5YLCBvcmlnaW5ZLCBwMlswXSxwMlsxXSkgLSBnZXREaXN0YW5jZUluUGl4ZWwocDFbMF0scDFbMV0sIHAyWzBdLHAyWzFdKSA8PSA1KXtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGF0aC5sZW5ndGggPSBjdXJyZW50UGF0aC5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnRQYXRoID0gY3VycmVudFBhdGguY29uY2F0KFsgb3JpZ2luWCArIFwiX1wiICsgb3JpZ2luWSBdKS5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXRoLmxlbmd0aD09PTEpe1xuICAgICAgICAgICAgICBjdXJyZW50UGF0aC5wdXNoKGRlc3RpbmF0aW9uWCtcIl9cIitkZXN0aW5hdGlvblkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50UGF0aCA9IGN1cnJlbnRQYXRoLm1hcCgocCk9PntcbiAgICAgICAgICAgICAgcCA9IHAuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgICBwID0gdHJhbnNmb3JtQ29vcmRpbmF0ZXNUb0xlYWZsZXQoW3BbMF0scFsxXV0pO1xuICAgICAgICAgICAgICByZXR1cm4gcFswXStcIl9cIitwWzFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2KGN1cnJlbnRQYXRoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dIaWdobGlnaHROZWFyZXN0UGxhY2UoZSwgY2FtZUJ5Q2xpY2spe1xuXG4gICAgaWYoZS5sYXRsbmc9PW51bGwgfHwgdGhpcy5sYXN0SGlnaGxpZ2h0TmVhcmVzdFBsYWNlIT1udWxsICYmIGUhPW51bGwgJiYgZS5sYXRsbmchPW51bGwgJiZcbiAgICAgICAgdGhpcy5sYXN0SGlnaGxpZ2h0TmVhcmVzdFBsYWNlWzBdPT1lLmxhdGxuZy5sbmcgJiZcbiAgICAgICAgdGhpcy5sYXN0SGlnaGxpZ2h0TmVhcmVzdFBsYWNlWzFdPT1lLmxhdGxuZy5sYXQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB4eSA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KFtlLmxhdGxuZy5sbmcsIGUubGF0bG5nLmxhdF0pO1xuICAgIHRoaXMuZ2V0U3BhY2VzKCkudGhlbigoc3BhY2VzKT0+e1xuICAgICAgaWYoIXNwYWNlcyB8fCBzcGFjZXMubGVuZ3RoPT09MCB8fCAhY3VycmVudExvY2FsT2JqKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBNSU5fUElYRUxTX0lERU5USUZZX1BMQUNFID0gY3VycmVudExvY2FsT2JqLm51bVB4VG9TaG93UG9wdXAgfHwgMTIwO1xuICAgICAgdmFyIGNvb3Jkcywgc3BhY2UsIGZvdW5kQ29vcmRzID0gW107XG5cbiAgICAgIGZvcihsZXQgaT0wOyBpPHNwYWNlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2ldO1xuICAgICAgICBjb29yZHMgPSBzcGFjZS5jb29yZHM7XG5cbiAgICAgICAgaWYoc3BhY2UudHlwZSA9PT0gXCJJXCIgJiYgY29vcmRzICYmIHNwYWNlLmNhdGVnb3J5ICE9PSBcIlNhbml0w6FyaW8gZSBBcG9pb1wiICYmIHNwYWNlLmNhdGVnb3J5ICE9PSBcIlNhbml0w6FyaW9cIil7XG4gICAgICAgICAgY29vcmRzLmRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3Jkc1swXSAtIHh5WzBdLCAyKSArIE1hdGgucG93KGNvb3Jkc1sxXSAtIHh5WzFdLCAyKSk7XG4gICAgICAgICAgaWYoY29vcmRzLmRpc3RhbmNlIDwgTUlOX1BJWEVMU19JREVOVElGWV9QTEFDRSl7XG4gICAgICAgICAgICBmb3VuZENvb3Jkcy5wdXNoKGNvb3Jkcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKGZvdW5kQ29vcmRzLmxlbmd0aCA+IDApe1xuICAgICAgICBmb3VuZENvb3Jkcy5zb3J0KChjMSwgYzIpPT57XG4gICAgICAgICAgcmV0dXJuIGMxLmRpc3RhbmNlIC0gYzIuZGlzdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICBsb2cuZGVidWcoJ0lkZW50aWZpZWQgc3BhY2UnLCBmb3VuZENvb3Jkcyk7XG4gICAgICAgIHRoaXMuZmluZENhcmRCeUxhdExuZyhmb3VuZENvb3Jkc1swXVswXSwgZm91bmRDb29yZHNbMF1bMV0sIGNhbWVCeUNsaWNrKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0SGlnaGxpZ2h0TmVhcmVzdFBsYWNlID0gW2UubGF0bG5nLmxuZywgZS5sYXRsbmcubGF0XTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyUGF0aHMoKXtcbiAgICB0aGlzLnByaW50ZWRQYXRocyA9IHRoaXMucHJpbnRlZFBhdGhzIHx8IFtdO1xuICAgIGlmKHRoaXMucHJpbnRlZFBhdGhzLmxlbmd0aD4wKXtcbiAgICAgIHRoaXMucHJpbnRlZFBhdGhzLmZvckVhY2goKHBhdGgpPT57XG4gICAgICAgIHBhdGgucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjbGVhck1hcmtlcigpe1xuICAgIGlmKHRoaXMubWFya2VyKXtcbiAgICAgIHRoaXMubWFya2VyLnJlbW92ZSgpO1xuICAgICAgdGhpcy5tYXJrZXIgPSBudWxsO1xuICAgICAgaWYodGhpcy5sYXN0Q2lyY2xlTWFya2VyKXtcbiAgICAgICAgdGhpcy5sYXN0Q2lyY2xlTWFya2VyLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmxhc3RDaXJjbGVNYXJrZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGRyYXdOYXZpZ2F0aW9uQ3Vyc29yKHgxLHkxLCByZWRyYXdDaXJjbGUpIHtcblxuICAgIGlmKHRoaXMub25ab29tKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZih0aGlzLm1hcD09bnVsbCl7XG4gICAgICB0aGlzLm1hcCA9IGdsb2JhbC5tYXA7XG4gICAgfVxuXG4gICAgdmFyIGFycm93Wm9vbVJhdGlvID0gdGhpcy5tYXAuZ2V0Wm9vbSgpIDwgMCA/IDEvTWF0aC5hYnModGhpcy5tYXAuZ2V0Wm9vbSgpKSAqIChjdXJyZW50TG9jYWxPYmouYXJyb3dab29tUmF0aW8gfHwgMC41KSA6IHRoaXMubWFwLmdldFpvb20oKSAqIChjdXJyZW50TG9jYWxPYmouYXJyb3dab29tUmF0aW8gfHwgMC41KTtcbiAgICB2YXIgaW5pdEFycm93V2lkdGggPSAzOCwgYXJyb3dXaWR0aCA9IDM4LCBpbml0QXJyb3dIZWlnaHQgPSA0MCwgYXJyb3dIZWlnaHQgPSA0MDtcbiAgICBjb25zdCBBUlJPV19NSU5fSEVJR0hUID0gMTYsIEFSUk9XX01JTl9XSURUSCA9IDEyO1xuICAgIGNvbnN0IENJUkNMRV9NSU5fSEVJR0hUID0gNzgsIENJUkNMRV9NSU5fV0lEVEggPSA3OCwgQ0lSQ0xFX01BWF9IRUlHSFQgPSA4NSwgQ0lSQ0xFX01BWF9XSURUSCA9IDg1O1xuXG4gICAgeDEgKz0gcGFyc2VGbG9hdChjdXJyZW50TG9jYWxPYmouZ3JpZFdpZHRoKTtcbiAgICB5MSAtPSBwYXJzZUZsb2F0KGN1cnJlbnRMb2NhbE9iai5ncmlkSGVpZ2h0KTtcblxuICAgIGlmKCF3aW5kb3cuYW5nbGUpe1xuICAgICAgd2luZG93LmFuZ2xlID0gMDtcbiAgICB9XG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yb3VuZCh3aW5kb3cuYW5nbGUpO1xuICAgIGxvZy5kZWJ1ZyhcIkRyYXdpbmcgYXJyb3cgaW4gXCIgKyBhbmdsZSArIFwiIGRlZ3JlZXNcIik7XG5cbiAgICBpZighd2luZG93LmN1cnJlbnRMb2NhbE9iaiB8fCAhd2luZG93LmN1cnJlbnRMb2NhbE9iai5uYXZpZ2F0aW9uQ3Vyc29yIHx8IHdpbmRvdy5jdXJyZW50TG9jYWxPYmoubmF2aWdhdGlvbkN1cnNvci50b0xvd2VyQ2FzZSgpID09PSAnYXJyb3cnKXtcbiAgICAgIGFycm93V2lkdGggPSAoYXJyb3dXaWR0aCArIGFycm93V2lkdGggKiBhcnJvd1pvb21SYXRpbykgPCBBUlJPV19NSU5fV0lEVEggPyBBUlJPV19NSU5fV0lEVEggOiAoYXJyb3dXaWR0aCArIGFycm93V2lkdGggKiBhcnJvd1pvb21SYXRpbyk7XG4gICAgICBhcnJvd0hlaWdodCA9IChhcnJvd0hlaWdodCArIGFycm93SGVpZ2h0ICogYXJyb3dab29tUmF0aW8pIDwgQVJST1dfTUlOX0hFSUdIVCA/IEFSUk9XX01JTl9IRUlHSFQgOiAoYXJyb3dIZWlnaHQgKyBhcnJvd0hlaWdodCAqIGFycm93Wm9vbVJhdGlvKTtcbiAgICAgIHRoaXMuZHJhd05hdmlnYXRpb25TdmdBcnJvdyh4MSwgeTEsIGFycm93V2lkdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJvd1dpZHRoID0gKGFycm93V2lkdGggKyBhcnJvd1dpZHRoICogYXJyb3dab29tUmF0aW8pIDwgQ0lSQ0xFX01JTl9XSURUSCA/IENJUkNMRV9NSU5fV0lEVEggOiAoYXJyb3dXaWR0aCArIGFycm93V2lkdGggKiBhcnJvd1pvb21SYXRpbyk7XG4gICAgICBhcnJvd0hlaWdodCA9IChhcnJvd0hlaWdodCArIGFycm93SGVpZ2h0ICogYXJyb3dab29tUmF0aW8pIDwgQ0lSQ0xFX01JTl9IRUlHSFQgPyBDSVJDTEVfTUlOX0hFSUdIVCA6IChhcnJvd0hlaWdodCArIGFycm93SGVpZ2h0ICogYXJyb3dab29tUmF0aW8pO1xuICAgICAgaWYoYXJyb3dXaWR0aD5DSVJDTEVfTUFYX1dJRFRIKXtcbiAgICAgICAgYXJyb3dXaWR0aCA9IENJUkNMRV9NQVhfV0lEVEhcbiAgICAgIH1cbiAgICAgIGlmKGFycm93SGVpZ2h0PkNJUkNMRV9NQVhfSEVJR0hUKXtcbiAgICAgICAgYXJyb3dIZWlnaHQgPSBDSVJDTEVfTUFYX0hFSUdIVFxuICAgICAgfVxuICAgICAgdmFyIHVzZXJQb2ludGVyID0gTC5pY29uKHtcbiAgICAgICAgaWNvblVybDogJy4vaW1nL25hdmlnYXRpb24tY3Vyc29yLWNpcmNsZS5wbmcnLFxuICAgICAgICBpY29uU2l6ZTogW2Fycm93V2lkdGgsIGFycm93SGVpZ2h0XSxcbiAgICAgICAgY2xhc3NOYW1lOiBcImxvY2F0aW9uLW1hcmtlclwiXG4gICAgICB9KTtcblxuICAgICAgaWYodGhpcy5sYXN0TWFya2VyPT1udWxsKXtcbiAgICAgICAgdGhpcy5sYXN0TWFya2VyID0gTC5tYXJrZXIoTC5sYXRMbmcoW3kxICwgeDFdKSwge2ljb246IHVzZXJQb2ludGVyLCByb3RhdGlvbkFuZ2xlOiBhbmdsZSwgcm90YXRpb25PcmlnaW46IFwiY2VudGVyIGNlbnRlclwiLCBpbnRlcmFjdGl2ZTogZmFsc2V9KS5hZGRUbyh0aGlzLm1hcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxhc3RNYXJrZXIuc2V0TGF0TG5nKEwubGF0TG5nKFt5MSAsIHgxXSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBhY2N1cmFjeSBjaXJjbGVcbiAgICAgIGlmKHJlZHJhd0NpcmNsZSAmJiB0aGlzLmxhc3RDaXJjbGVNYXJrZXIhPW51bGwpe1xuICAgICAgICB0aGlzLmxhc3RDaXJjbGVNYXJrZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMubGFzdENpcmNsZU1hcmtlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMubGFzdENpcmNsZU1hcmtlcj09bnVsbCl7XG4gICAgICAgIHRoaXMubGFzdENpcmNsZU1hcmtlciA9IEwuY2lyY2xlKEwubGF0TG5nKFt5MSAsIHgxXSksIHtcbiAgICAgICAgICByYWRpdXM6IHRoaXMuYWNjdXJhY3kgfHwgODAsXG4gICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgIGZpbGxDb2xvcjogJyMzMTgwYmEnLFxuICAgICAgICAgIGNvbG9yOiAnIzMxODBiYScsXG4gICAgICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICAgICAgICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgY2xhc3NOYW1lOiBcInphcHQtY2lyY2xlLW1hcmtlci1jb250cm9sXCJcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpRdWVyeShcIi56YXB0LWNpcmNsZS1tYXJrZXItY29udHJvbFwiKS5oaWRlKCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICBpZih0aGlzLmxhc3RDaXJjbGVNYXJrZXI9PW51bGwpe1xuICAgICAgICAgICAgdGhpcy5sYXN0Q2lyY2xlTWFya2VyID0gTC5jaXJjbGUoTC5sYXRMbmcoW3kxICwgeDFdKSwge1xuICAgICAgICAgICAgICByYWRpdXM6IHRoaXMuYWNjdXJhY3kgfHwgODAsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgICAgZmlsbENvbG9yOiAnIzMxODBiYScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzMxODBiYScsXG4gICAgICAgICAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgICAgICAgICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcInphcHQtY2lyY2xlLW1hcmtlci1jb250cm9sXCJcbiAgICAgICAgICAgIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX2lzQ29vcmRzVmFsaWQoW3gxLHkxXSkpe1xuICAgICAgICAgICAgICBqUXVlcnkoXCIuemFwdC1jaXJjbGUtbWFya2VyLWNvbnRyb2xcIikuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmxhc3RDaXJjbGVNYXJrZXIuc2V0TGF0TG5nKEwubGF0TG5nKFt5MSAsIHgxXSkpO1xuICAgICAgICAgICAgICBpZih0aGlzLmFjY3VyYWN5KXtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RDaXJjbGVNYXJrZXIuc2V0UmFkaXVzKHRoaXMuYWNjdXJhY3kpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGpRdWVyeShcIi56YXB0LWNpcmNsZS1tYXJrZXItY29udHJvbFwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1NjApO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH1cblxuICBkcmF3TWFya2VyKHgsIHksIGNhbGxiYWNrKXtcblxuICAgIGlmKHg9PW51bGwpe1xuICAgICAgeCA9IHRoaXMudHJhbnNmb3JtZWREZXN0aW5hdGlvblswXTtcbiAgICB9XG4gICAgaWYoeT09bnVsbCl7XG4gICAgICB5ID0gdGhpcy50cmFuc2Zvcm1lZERlc3RpbmF0aW9uWzFdO1xuICAgIH1cbiAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICB2YXIgcCA9IG5ldyBMLkxhdExuZyh5LCB4KTtcblxuICAgIGlmKHRoaXMubWFya2VyKXtcbiAgICAgIHRoaXMubWFya2VyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya2VyID0gTC5tYXJrZXIocCkuYWRkVG8odGhpcy5tYXApO1xuICAgIHRoaXMubWFwU2Nyb2xsVG8oeCwgeSk7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxuXG4gIGRyYXdQYXRoKHBhdGgsIGRvbnREb1pvb20pe1xuXG4gICAgdmFyIGxhc3RQb2ludDtcbiAgICB2YXIgYmVmb3JlTGFzdFBvaW50O1xuICAgIHZhciBtaW5YO1xuICAgIHZhciBtYXhYO1xuICAgIHZhciBtaW5ZO1xuICAgIHZhciBtYXhZO1xuICAgIHZhciB4MTtcbiAgICB2YXIgeDI7XG4gICAgdmFyIHkxO1xuICAgIHZhciB5MjtcbiAgICB0aGlzLmNsZWFyUGF0aHMoKTtcbiAgICB0aGlzLmNsZWFyTWFya2VyKCk7XG4gICAgdGhpcy5wcmludGVkUGF0aHMgPSBbXTtcbiAgICB2YXIgbWluWD0yMDAwO1xuICAgIHZhciBtYXhYPTA7XG4gICAgdmFyIG1pblk9MjAwMDtcbiAgICB2YXIgbWF4WT0wO1xuXG4gICAgcGF0aC5mb3JFYWNoKChwb2ludCwgY291bnQpPT57XG5cbiAgICAgIHBvaW50ID0gcG9pbnQuc3BsaXQoXCJfXCIpO1xuXG4gICAgICBpZihsYXN0UG9pbnQpe1xuXG4gICAgICAgIHRoaXMucHJpbnRlZFBhdGhzLnB1c2goXG4gICAgICAgICAgdGhpcy5kcmF3TGluZShbW3BhcnNlRmxvYXQobGFzdFBvaW50WzBdKSxwYXJzZUZsb2F0KGxhc3RQb2ludFsxXSldLFtwYXJzZUZsb2F0KHBvaW50WzBdKSxcbiAgICAgICAgICAgIHBhcnNlRmxvYXQocG9pbnRbMV0pXV0sY3VycmVudExvY2FsT2JqLmdyaWRXaWR0aCxjdXJyZW50TG9jYWxPYmouZ3JpZEhlaWdodCwgY3VycmVudExvY2FsT2JqLnBhdGhDb2xvciwgY3VycmVudExvY2FsT2JqLnBhdGhXaWR0aClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wcmludGVkUGF0aHMgPSB0aGlzLnByaW50ZWRQYXRocy5jb25jYXQoXG4gICAgICAgICAgdGhpcy5kcmF3UGF0aEFycm93KFsgW3BhcnNlRmxvYXQocG9pbnRbMF0pLCBwYXJzZUZsb2F0KHBvaW50WzFdKV0sIFtwYXJzZUZsb2F0KGxhc3RQb2ludFswXSkscGFyc2VGbG9hdChsYXN0UG9pbnRbMV0pXSBdLFxuICAgICAgICAgICAgY3VycmVudExvY2FsT2JqLmdyaWRXaWR0aCxjdXJyZW50TG9jYWxPYmouZ3JpZEhlaWdodCxjdXJyZW50TG9jYWxPYmoucGF0aENvbG9yLCBjdXJyZW50TG9jYWxPYmoucGF0aFdpZHRoKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBwYXRoIGFyZWFcbiAgICAgICAgeDI9cGFyc2VJbnQocG9pbnRbMF0pK2N1cnJlbnRMb2NhbE9iai5ncmlkV2lkdGgvMjtcbiAgICAgICAgeTI9cGFyc2VJbnQocG9pbnRbMV0pK2N1cnJlbnRMb2NhbE9iai5ncmlkSGVpZ2h0LzI7XG4gICAgICAgIHgxPXBhcnNlSW50KGxhc3RQb2ludFswXSkrY3VycmVudExvY2FsT2JqLmdyaWRXaWR0aC8yO1xuICAgICAgICB5MT1wYXJzZUludChsYXN0UG9pbnRbMV0pK2N1cnJlbnRMb2NhbE9iai5ncmlkSGVpZ2h0LzI7XG4gICAgICAgIGlmICh4MSA8IG1pblgpIHttaW5YPXgxfTtcbiAgICAgICAgaWYgKHgyIDwgbWluWCkge21pblg9eDJ9O1xuICAgICAgICBpZiAoeDEgPiBtYXhYKSB7bWF4WD14MX07XG4gICAgICAgIGlmICh4MiA+IG1heFgpIHttYXhYPXgyfTtcbiAgICAgICAgaWYgKHkxIDwgbWluWSkge21pblk9eTF9O1xuICAgICAgICBpZiAoeTIgPCBtaW5ZKSB7bWluWT15Mn07XG4gICAgICAgIGlmICh5MSA+IG1heFkpIHttYXhZPXkxfTtcbiAgICAgICAgaWYgKHkyID4gbWF4WSkge21heFk9eTJ9O1xuXG4gICAgICAgIC8vIFRha2UgYSBwb2ludCBpbiB0aGUgbGluZSAxMCBwaXhlbHMgYWhlYWRcbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKSAqIDI1O1xuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpICogMjU7XG4gICAgICAgIHZhciB4ID0geDEgKyBjb3M7XG4gICAgICAgIHZhciB5ID0geTEgKyBzaW47XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFkb250RG9ab29tKXtcbiAgICAgICAgICB0aGlzLm1hcFNjcm9sbFRvKHBhcnNlRmxvYXQocG9pbnRbMF0pLCBwYXJzZUZsb2F0KHBvaW50WzFdKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJlZm9yZUxhc3RQb2ludCA9IGxhc3RQb2ludDtcbiAgICAgIGxhc3RQb2ludCA9IHBvaW50O1xuICAgIH0pO1xuXG4gICAgLy8gRHJhdyB0aGUgZmluYWwgYXJyb3dcbiAgICB4MT1wYXJzZUludChiZWZvcmVMYXN0UG9pbnRbMF0pK2N1cnJlbnRMb2NhbE9iai5ncmlkV2lkdGgvMjtcbiAgICB5MT1wYXJzZUludChiZWZvcmVMYXN0UG9pbnRbMV0pK2N1cnJlbnRMb2NhbE9iai5ncmlkSGVpZ2h0LzI7XG4gICAgeDI9cGFyc2VJbnQobGFzdFBvaW50WzBdKStjdXJyZW50TG9jYWxPYmouZ3JpZFdpZHRoLzI7XG4gICAgeTI9cGFyc2VJbnQobGFzdFBvaW50WzFdKStjdXJyZW50TG9jYWxPYmouZ3JpZEhlaWdodC8yO1xuICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSk7XG4gICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKSAqIDIwO1xuICAgIHZhciBjb3MgPSBNYXRoLmNvcyhhbmdsZSkgKiAyMDtcbiAgICB4MiA9IHgyICsgY29zO1xuICAgIHkyID0geTIgKyBzaW47XG5cbiAgICBpZighZG9udERvWm9vbSl7XG4gICAgICB0aGlzLnpvb21Ub1BhdGgocGFyc2VJbnQobWluWCkscGFyc2VJbnQobWluWSkscGFyc2VJbnQobWF4WCkscGFyc2VJbnQobWF4WSkpO1xuICAgIH1cbiAgfVxuXG4gIHpvb21Ub1BhdGgoeDEseTEseDIseTIpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuY2FuU2Nyb2xsID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2Nyb2xsVG9DdXJyZW50TG9jYXRpb24oKTtcbiAgICAgIHRoaXMubWFwLmZpdEJvdW5kcyhbW3kxLTcwLHgxLTEwMF0sW3kyKzYwLHgyKzEwMF1dKTtcbiAgICAgIHRoaXMuY2FuU2Nyb2xsID0gZmFsc2U7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIGRyYXdMaW5lKG9uZVBhdGgsc3BhY2Vfd2lkdGgsc3BhY2VfaGVpZ2h0LGNvbG9yLGxpbmVXaWR0aCkge1xuXG4gICAgaWYoIWxpbmVXaWR0aCB8fCBsaW5lV2lkdGggPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgbGluZVdpZHRoID0gMTI7XG4gICAgfVxuICAgIGlmKCFjb2xvciB8fCBjb2xvciA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICBjb2xvciA9IFwid2hpdGVcIjtcbiAgICB9XG5cbiAgICB2YXIgeDEgPSBvbmVQYXRoWzBdWzBdICsgc3BhY2Vfd2lkdGgvMjtcbiAgICB2YXIgeTEgPSBvbmVQYXRoWzBdWzFdICsgc3BhY2VfaGVpZ2h0LzI7XG5cbiAgICB2YXIgeDIgPSBvbmVQYXRoWzFdWzBdICsgc3BhY2Vfd2lkdGgvMjtcbiAgICB2YXIgeTIgPSBvbmVQYXRoWzFdWzFdICsgc3BhY2VfaGVpZ2h0LzI7XG5cbiAgICB2YXIgcG9pbnRzID0gW25ldyBMLkxhdExuZyh5MiwgeDIpLCBuZXcgTC5MYXRMbmcoeTEsIHgxKV07XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3ZWlnaHQ6IGxpbmVXaWR0aCxcbiAgICAgIG9wYWNpdHk6IDAuN1xuICAgIH07XG5cbiAgICByZXR1cm4gTC5wb2x5bGluZShwb2ludHMsIG9wdGlvbnMpLmFkZFRvKHRoaXMubWFwKTtcbiAgfVxuXG4gIGRyYXdQYXRoQXJyb3cocGF0aCxzcGFjZV93aWR0aCxzcGFjZV9oZWlnaHQsY29sb3IsbGluZVdpZHRoKSB7XG4gICAgY3VycmVudExvY2FsT2JqLnNjYWxlTSA9IGN1cnJlbnRMb2NhbE9iai5zY2FsZU0gfHwgMTtcbiAgICB2YXIgcG9seWdvbnMgPSBbXTtcbiAgICB2YXIgcHhEaXN0YW5jZSA9IGN1cnJlbnRMb2NhbE9iai5zY2FsZU0gKiAwLjQ7XG4gICAgdmFyIHBvaW50MSA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KHBhdGhbMF0pO1xuICAgIHZhciBwb2ludDIgPSB0cmFuc2Zvcm1Db29yZGluYXRlc1RvTGVhZmxldChwYXRoWzFdKTtcbiAgICB2YXIgYW5nbGUgPSBhZGp1c3RBbmdsZShjYWxjdWxhdGVBbmdsZUNhcnRlc2lhbihwb2ludDFbMF0sIHBvaW50MVsxXSwgcG9pbnQyWzBdLCBwb2ludDJbMV0pICogMTgwL01hdGguUEkpICogTWF0aC5QSS8xODA7XG4gICAgdmFyIHBvc0xhdDAgPSBNYXRoLmNvcyhhbmdsZSArIDkwICogTWF0aC5QSS8xODApKmN1cnJlbnRMb2NhbE9iai5zY2FsZU0gKiAwLjE1O1xuICAgIHZhciBwb3NMb25nMCA9IE1hdGguc2luKGFuZ2xlICsgOTAgKiBNYXRoLlBJLzE4MCkqY3VycmVudExvY2FsT2JqLnNjYWxlTSAqIDAuMTU7XG4gICAgYW5nbGUgKz0gNjIgKiBNYXRoLlBJLzE4MDtcbiAgICB2YXIgcG9zTGF0MSA9IE1hdGguY29zKGFuZ2xlKSpweERpc3RhbmNlO1xuICAgIHZhciBwb3NMb25nMSA9IE1hdGguc2luKGFuZ2xlKSpweERpc3RhbmNlO1xuICAgIGFuZ2xlICs9IDYwICogTWF0aC5QSS8xODA7XG4gICAgdmFyIHBvc0xhdDIgPSBNYXRoLmNvcyhhbmdsZSkqcHhEaXN0YW5jZTtcbiAgICB2YXIgcG9zTG9uZzIgPSBNYXRoLnNpbihhbmdsZSkqcHhEaXN0YW5jZTtcblxuICAgIHBhdGhbMF1bMF0gKz0gc3BhY2Vfd2lkdGgvMjtcbiAgICBwYXRoWzBdWzFdICs9IHNwYWNlX2hlaWdodC8yO1xuICAgIHBhdGhbMV1bMF0gKz0gc3BhY2Vfd2lkdGgvMjtcbiAgICBwYXRoWzFdWzFdICs9IHNwYWNlX2hlaWdodC8yO1xuXG4gICAgdmFyIHBvaW50cyA9IFtcbiAgICAgIG5ldyBMLkxhdExuZyhwYXRoWzFdWzFdIC0gcG9zTGF0MCAqIDEuNCwgcGF0aFsxXVswXSAtIHBvc0xvbmcwICogMS40KSxcbiAgICAgIG5ldyBMLkxhdExuZyhwYXRoWzFdWzFdIC0gcG9zTGF0MCAqIDEuNCArIHBvc0xhdDEsIHBhdGhbMV1bMF0gKyBwb3NMb25nMSAtIHBvc0xvbmcwICogMS40KSxcbiAgICAgIG5ldyBMLkxhdExuZyhwYXRoWzFdWzFdIC0gcG9zTGF0MCAqIDEuNCArIHBvc0xhdDIsIHBhdGhbMV1bMF0gKyBwb3NMb25nMiAtIHBvc0xvbmcwICogMS40KVxuICAgIF07XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGNvbG9yOiBjdXJyZW50TG9jYWxPYmoucGF0aEFycm93Q29sb3IgfHwgXCJncmV5XCIsXG4gICAgICBmaWxsQ29sb3I6IGN1cnJlbnRMb2NhbE9iai5wYXRoQXJyb3dDb2xvciB8fCBcImdyZXlcIixcbiAgICAgIGZpbGw6IHRydWUsXG4gICAgICBmaWxsT3BhY2l0eTogMC43LFxuICAgICAgb3BhY2l0eTogMC43LFxuICAgICAgc3Ryb2tlOiBmYWxzZVxuICAgIH07XG5cbiAgICB2YXIgcG9pbnRzTGluZSA9IFtcbiAgICAgIG5ldyBMLkxhdExuZyhwYXRoWzFdWzFdICsgcG9zTGF0MCAqIDEuMywgcGF0aFsxXVswXSArIHBvc0xvbmcwICogMS4zKSxcbiAgICAgIG5ldyBMLkxhdExuZyhwYXRoWzFdWzFdICsgcG9zTGF0MCAqIDIuMiwgcGF0aFsxXVswXSArIHBvc0xvbmcwICogMi4yKVxuICAgIF07XG4gICAgcG9seWdvbnMucHVzaChMLnBvbHlsaW5lKHBvaW50c0xpbmUsIHtcbiAgICAgIGNvbG9yOiBjdXJyZW50TG9jYWxPYmoucGF0aEFycm93Q29sb3IgfHwgXCJncmV5XCIsXG4gICAgICB3ZWlnaHQ6IGxpbmVXaWR0aC8zLjUsXG4gICAgICBvcGFjaXR5OiAwLjdcbiAgICB9KS5hZGRUbyh0aGlzLm1hcCkpO1xuICAgIHBvbHlnb25zLnB1c2goTC5wb2x5Z29uKHBvaW50cywgb3B0aW9ucykuYWRkVG8odGhpcy5tYXApKTtcbiAgICByZXR1cm4gcG9seWdvbnM7XG4gIH1cblxuICBkcmF3TmF2aWdhdGlvblN2Z0Fycm93KHgseSxhcnJvd1dpZHRoKSB7XG5cbiAgICB2YXIgcHhEaXN0YW5jZSA9IGN1cnJlbnRMb2NhbE9iai5zY2FsZU0gKiAwLjQ7XG4gICAgcHhEaXN0YW5jZTxhcnJvd1dpZHRoPyBweERpc3RhbmNlID0gYXJyb3dXaWR0aCA6IHB4RGlzdGFuY2UgPSBweERpc3RhbmNlO1xuICAgIHZhciBhbmdsZSA9ICFpc05hTihwYXJzZUZsb2F0KGdsb2JhbC5hbmdsZSkpID8gYWRqdXN0QW5nbGUoZ2xvYmFsLmFuZ2xlICsgOTApIDogYWRqdXN0QW5nbGUoKzkwKTtcbiAgICBhbmdsZSA9IGFkanVzdEFuZ2xlKGFuZ2xlICsgNjApO1xuICAgIHZhciBwb3NMYXQxID0geSArIE1hdGguY29zKGFuZ2xlICogTWF0aC5QSS8xODApKnB4RGlzdGFuY2U7XG4gICAgdmFyIHBvc0xvbmcxID0geCArIE1hdGguc2luKGFuZ2xlICogTWF0aC5QSS8xODApKnB4RGlzdGFuY2U7XG4gICAgYW5nbGUgPSBhZGp1c3RBbmdsZShhbmdsZSArIDYwKTtcbiAgICB2YXIgcG9zTGF0MiA9IHkgKyBNYXRoLmNvcyhhbmdsZSAqIE1hdGguUEkvMTgwKSpweERpc3RhbmNlO1xuICAgIHZhciBwb3NMb25nMiA9IHggKyBNYXRoLnNpbihhbmdsZSAqIE1hdGguUEkvMTgwKSpweERpc3RhbmNlO1xuICAgIGFuZ2xlID0gYWRqdXN0QW5nbGUoZ2xvYmFsLmFuZ2xlICsgOTAgKyA5MCkgKiBNYXRoLlBJLzE4MDtcbiAgICB2YXIgcG9zTGF0MyA9IHkgLSBNYXRoLmNvcyhhbmdsZSkqKHB4RGlzdGFuY2UgKyBweERpc3RhbmNlLzcpO1xuICAgIHZhciBwb3NMb25nMyA9IHggLSBNYXRoLnNpbihhbmdsZSkqKHB4RGlzdGFuY2UgKyBweERpc3RhbmNlLzcpO1xuXG4gICAgdmFyIHBvaW50cyA9IFtcbiAgICAgIG5ldyBMLkxhdExuZyh5LHgpLFxuICAgICAgbmV3IEwuTGF0TG5nKHBvc0xhdDEsIHBvc0xvbmcxKSxcbiAgICAgIG5ldyBMLkxhdExuZyhwb3NMYXQzLCBwb3NMb25nMyksXG4gICAgICBuZXcgTC5MYXRMbmcocG9zTGF0MiwgcG9zTG9uZzIpLFxuICAgICAgbmV3IEwuTGF0TG5nKHkseClcbiAgICBdO1xuXG4gICAgdmFyIGRlZmF1bHRBcnJvd0NvbG9yID0gXCIjNDI4NmY0XCI7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBjb2xvcjogZ2xvYmFsLmN1cnJlbnRMb2NhbE9iai5hcnJvd0NvbG9yIHx8IGRlZmF1bHRBcnJvd0NvbG9yLFxuICAgICAgZmlsbENvbG9yOiBnbG9iYWwuY3VycmVudExvY2FsT2JqLmFycm93Q29sb3IgfHwgZGVmYXVsdEFycm93Q29sb3IsXG4gICAgICBmaWxsOiB0cnVlLFxuICAgICAgZmlsbE9wYWNpdHk6IDAuOCxcbiAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgIHN0cm9rZTogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYodGhpcy5sYXN0TWFya2VyIT1udWxsKXtcbiAgICAgIHRoaXMubGFzdE1hcmtlci5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5sYXN0TWFya2VyID0gTC5wb2x5bGluZShwb2ludHMsIG9wdGlvbnMpLmFkZFRvKHRoaXMubWFwKTtcbiAgfVxuXG4gIGRyYXdJbnRlcmVzdHNDaXJjbGVzKGUpIHtcblxuICAgIHZhciBtYXAgPSB0aGlzLmdldE1hcCgpO1xuXG4gICAgaWYodGhpcy5jbGVhckludGVyZXN0c0NpcmNsZXMoKSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5nZXRTcGFjZXMoKS50aGVuKChzcGFjZXMpPT57XG4gICAgICB2YXIgc3BhY2UsIGZvdW5kU3BhY2VzID0gW107XG5cbiAgICAgIGZvcihsZXQgaT0wOyBpPHNwYWNlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2ldO1xuICAgICAgICBpZihzcGFjZS50eXBlID09PSBcIklcIiAmJiBzcGFjZS5jb29yZHNcbiAgICAgICAgICAgICYmIHNwYWNlLmNhdGVnb3J5ICE9PSBcIlNhbml0w6FyaW8gZSBBcG9pb1wiICYmIHNwYWNlLmNhdGVnb3J5ICE9PSBcIlNhbml0w6FyaW9cIil7XG4gICAgICAgICAgZm91bmRTcGFjZXMucHVzaChzcGFjZS5jb29yZHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW50ZXJlc3RDaXJjbGVzID0gW107XG4gICAgICBmb3VuZFNwYWNlcy5mb3JFYWNoKChjb29yZHMpPT57XG4gICAgICAgIGxldCBsZWFmbGV0Q29vcmRzID0gdHJhbnNmb3JtQ29vcmRpbmF0ZXNUb0xlYWZsZXQoY29vcmRzKTtcbiAgICAgICAgdGhpcy5pbnRlcmVzdENpcmNsZXMucHVzaChcbiAgICAgICAgICBMLmNpcmNsZShMLmxhdExuZyhbbGVhZmxldENvb3Jkc1sxXSwgbGVhZmxldENvb3Jkc1swXV0pLCB7XG4gICAgICAgICAgICByYWRpdXM6IGN1cnJlbnRMb2NhbE9iai5zY2FsZU0gKiAxLjcgfHwgNDAsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgICBmaWxsQ29sb3I6ICcjOGQwMmZmJyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzhkMDJmZicsXG4gICAgICAgICAgICBzdHJva2U6IGZhbHNlLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInphcHQtem9vbS1jb250cm9sXCJcbiAgICAgICAgICB9KS5vbignY2xpY2snLCAoZXZlbnQpPT57XG4gICAgICAgICAgICB0aGlzLmNsaWNrSW50ZXJlc3RDaXJjbGUoY29vcmRzKTtcbiAgICAgICAgICB9LCB0aGlzKS5hZGRUbyhtYXApXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaWYoZSl7XG4gICAgICAgIHRoaXMuc2hvd0hpZ2hsaWdodE5lYXJlc3RQbGFjZShlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFySW50ZXJlc3RzQ2lyY2xlcygpe1xuICAgIGlmKHRoaXMuaW50ZXJlc3RDaXJjbGVzICYmIHRoaXMuaW50ZXJlc3RDaXJjbGVzLmxlbmd0aD4wKXtcbiAgICAgIHRoaXMuaW50ZXJlc3RDaXJjbGVzLmZvckVhY2goKGNpcmNsZSk9PntcbiAgICAgICAgY2lyY2xlLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmludGVyZXN0Q2lyY2xlcyA9IFtdO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNsaWNrSW50ZXJlc3RDaXJjbGUoY29vcmRzKXtcbiAgICB0aGlzLmdldFNwYWNlcygpLnRoZW4oKHNwYWNlcyk9PntcbiAgICAgIG1hcExvY2FsU3RvcmFnZURBTy5yZXRyaWV2ZVNwYWNlKGN1cnJlbnRMb2NhbE9iai5uYW1lLGNvb3Jkc1swXSxjb29yZHNbMV0sIHNwYWNlcykudGhlbigoc3BhY2UpPT57XG4gICAgICAgIGlmKHNwYWNlIT1udWxsKXtcbiAgICAgICAgICBsb2cuZGVidWcoJ0lkZW50aWZpZWQgc3BhY2UnLCBjb29yZHNbMF0sIGNvb3Jkc1sxXSk7XG4gICAgICAgICAgdGhpcy5maW5kQ2FyZEJ5TGF0TG5nKGNvb3Jkc1swXSwgY29vcmRzWzFdLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmdldE1hcCgpLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9pbnRlbnRpb25hbCBlcnJvciB0byBicmVhayBsZWFmbGV0IGV2ZW50IGNoYWluXG4gIH1cblxuICBmaW5kQ2FyZEJ5TGF0TG5nKHgsIHksIGNhbWVCeUNsaWNrKXtcblxuICAgIGlmKE9iamVjdC5rZXlzKHRoaXMuY2FyZHNDYWNoZSkubGVuZ3RoPT09MCl7XG4gICAgICByZWdpb25TZXJ2aWNlLmxpc3RSZWdpb25zKHRoaXMua2V5KS50aGVuKChyZWdpb25zKT0+e1xuICAgICAgICBpZihyZWdpb25zIT1udWxsICYmIHJlZ2lvbnMucmVnaW9uc01hcCE9bnVsbCl7XG4gICAgICAgICAgdGhpcy5jYXJkc0NhY2hlID0gcmVnaW9ucy5yZWdpb25zTWFwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNhY2hlZFJlZ2lvbiA9IHJlZ2lvblNlcnZpY2UuX2ZpbmROZWFyZXN0UmVnaW9uQnlYWSh4LHksIHRoaXMua2V5LCB0aGlzLmNhcmRzQ2FjaGUpO1xuICAgICAgaWYoY2FjaGVkUmVnaW9uIT1udWxsKXtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblBvcHVwKGNhY2hlZFJlZ2lvbiwgY2FtZUJ5Q2xpY2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lvblNlcnZpY2UuZmluZE5lYXJlc3RSZWdpb25CeVhZKHgseSwgdGhpcy5rZXkpLnRoZW4oKHJlZ2lvbikgPT4ge1xuICAgICAgaWYocmVnaW9uKXtcbiAgICAgICAgdGhpcy5jYXJkc0NhY2hlW3JlZ2lvbi5pZF0gPSByZWdpb247IC8vY2FjaGluZ1xuICAgICAgICB0aGlzLm9wZW5Qb3B1cChyZWdpb24sIGNhbWVCeUNsaWNrKTtcbiAgICAgIH1cbiAgICB9LCAoZXJyKT0+e1xuICAgICAgbG9nLmVycm9yKFwiRXJyb3Igd2hlbiBmaW5kQ2FyZEJ5TGF0TG5nXCIsIGVycik7XG4gICAgfSk7XG4gIH1cblxuICBvcGVuUG9wdXAocmVnaW9uLCBjYW1lQnlDbGljaykge1xuICAgIC8vc2hvdWxkIG5vdCBvcGVuIHBvcHVwIHdoZW4gcGF0aCBpcyBzaG93bi5cbiAgICBpZighY2FtZUJ5Q2xpY2sgJiYgKHRoaXMuY3VycmVudFBhdGghPW51bGwgfHwgKHRoaXMub3B0cy5pbml0V2l0aG91dFBvcHVwICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpLXRoaXMuaW5pdFRpbWUgPCBUSU1FX0RJU1BMQVlfUE9QVVApKSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNvb3JkcyA9IHRyYW5zZm9ybUNvb3JkaW5hdGVzVG9MZWFmbGV0KFtyZWdpb24ueCwgcmVnaW9uLnldKTtcbiAgICBpZihyZWdpb24pe1xuICAgICAgdmFyIGtleSA9IHJlZ2lvbi54ICsgXCJfXCIgKyByZWdpb24ueTtcbiAgICAgIGlmKCF0aGlzLnBvcHVwc1Nob3duW2tleV0gfHwgY2FtZUJ5Q2xpY2spe1xuICAgICAgICB0aGlzLnBvcHVwc1Nob3duW2tleV0gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaW1hZ2VTZXJ2aWNlLmRvd25sb2FkSW1hZ2UocmVnaW9uLmlkLCByZWdpb24ubWVkaWEpLnRoZW4oKHVybCk9PntcbiAgICAgICAgICB2YXIgdGl0bGUgPSAocmVnaW9uLnRpdGxlIHx8IHJlZ2lvbi5oZWFkZXJUaXRsZSB8fCByZWdpb24uaGVhZGVyU3VidGl0bGUpO1xuICAgICAgICAgIGxvZy5kZWJ1ZyhcIk9wZW5pbmcgcG9wdXAgaWQgXCIgKyByZWdpb24uaWQgKyBcIiB0aXRsZSBcIiArIHRpdGxlKTtcbiAgICAgICAgICBsZXQgaHRtbCA9ICc8ZGl2IGNsYXNzPVwiaW50ZXJlc3QtcG9wdXBcIj48aW1nIHNyYz1cIicgKyB1cmwgKyAnXCIvPicgK1xuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW50ZXJlc3QtcG9wdXAtdGl0bGVcIiAnICsgKHRpdGxlLmxlbmd0aD4yNSA/ICdzdHlsZT1cImZvbnQtc2l6ZTogMTRweCAhaW1wb3J0YW50XCInIDogJycpICsnPicgKyB0aXRsZSArICc8L3NwYW4+PGRpdj4nICtcbiAgICAgICAgICAgICc8c3Bhbj48YSBjbGFzcz1cImludGVyZXN0LXBvcHVwLWFjdGlvbnNcIiBocmVmPVwiIy9jYXJkLycgKyByZWdpb24uaWQgKyAnXCIgc3R5bGU9XCInICsgbXVpVGhlbWUucGFsZXR0ZS5wcmltYXJ5MkNvbG9yICsgJ1wiPlZlciBtYWlzPC9hPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8c3Bhbj48YSBjbGFzcz1cImludGVyZXN0LXBvcHVwLWFjdGlvbnNcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uY2xpY2s9XCJ6YXB0LmNsZWFyUG9wdXAoKTsgemFwdC5maW5kU2hvcnRlc3RQYXRoQmFzZWRDdXJyZW50TG9jYXRpb24oJyArIHJlZ2lvbi54ICsgJywnICsgcmVnaW9uLnkgKyAnKVwiIHN0eWxlPVwiJyArIG11aVRoZW1lLnBhbGV0dGUucHJpbWFyeTJDb2xvciArICdcIj5JciBwYXJhPC9hPjwvc3Bhbj4nO1xuICAgICAgICAgIGh0bWwrPSc8L2Rpdj4nO1xuICAgICAgICAgIHRoaXMuZHJhd1BvcHVwKGNvb3Jkc1swXSwgY29vcmRzWzFdLCBodG1sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSByZWdpb24ueCArIFwiX1wiICsgcmVnaW9uLnkgKyBcIl9hZHNcIjtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lQWRzID0gdGhpcy5wb3B1cHNTaG93bltrZXldIHx8IG5vdyAtIFNBTUVfQURTX0lOVEVSVkFMX1RJTUU7XG4gICAgICBpZighY2FtZUJ5Q2xpY2sgJiYgcmVnaW9uLmFkc1BvcHVwICE9IG51bGwgJiYgbm93IC0gdGltZUFkcyA+PSBTQU1FX0FEU19JTlRFUlZBTF9USU1FKSB7XG4gICAgICAgIHRoaXMucG9wdXBzU2hvd25ba2V5XSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICBsZXQgaHRtbCA9ICc8ZGl2IGNsYXNzPVwiaW50ZXJlc3QtcG9wdXBcIj4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW50ZXJlc3QtcG9wdXAtdGl0bGVcIj4nICsgKHJlZ2lvbi50aXRsZSB8fCByZWdpb24uaGVhZGVyVGl0bGUgfHwgcmVnaW9uLmhlYWRlclN1YnRpdGxlKSArICc8L3NwYW4+PGRpdj4nICtcbiAgICAgICAgICAgICAgJzxzcGFuPicgKyByZWdpb24uYWRzQ29udGVudCArICc8L3NwYW4+PGJyLz4nICtcbiAgICAgICAgICAgICAgJzxzcGFuPjxhIGNsYXNzPVwiaW50ZXJlc3QtcG9wdXAtYWN0aW9uc1wiIGhyZWY9XCIjXCIgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6IDBweDtcIj5RdWVybyBwZWRpciE8L2E+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYXJBZHNQb3B1cCgpO1xuICAgICAgICAgICAgdmFyIHhBZHNQb3MgPSB0aGlzLm1hcC5nZXRTaXplKCkueCA8IHRoaXMuY3VycmVudFBvc2l0aW9uWzFdID8gdGhpcy5jdXJyZW50UG9zaXRpb25bMF0gOiB0aGlzLm1hcC5nZXRTaXplKCkueC8yIC0xNTA7XG4gICAgICAgICAgICB2YXIgeUFkc1BvcyA9IHRoaXMubWFwLmdldFNpemUoKS55IDwgdGhpcy5jdXJyZW50UG9zaXRpb25bMV0gPyB0aGlzLmN1cnJlbnRQb3NpdGlvblsxXSArIHRoaXMubWFwLmdldFNpemUoKS55ICogMi8zIDogNTA7XG4gICAgICAgICAgICB0aGlzLm9sZENhblNjcm9sbCA9IHRoaXMuY2FuU2Nyb2xsO1xuICAgICAgICAgICAgdGhpcy5jYW5TY3JvbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYWRzTWFwUG9wdXAgPSBMLnBvcHVwKHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcIm5lYXJieS1hZHMtcG9wdXBcIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc2V0TGF0TG5nKHRoaXMubWFwLmdldENlbnRlcigpKVxuICAgICAgICAgICAgLnNldENvbnRlbnQoaHRtbClcbiAgICAgICAgICAgIC5vcGVuT24odGhpcy5tYXApO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgIHRoaXMuY2FuU2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5jbGVhckFkc1BvcHVwKCk7XG4gICAgICAgICAgICB9LCBNQVBfQVVUT0NMT1NFX1BPUFVQX1RJTUVPVVQgKiAxLjUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRzTWFwUG9wdXA7XG5cbiAgICAgICAgfSwgMjAwMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhd1BvcHVwKHgsIHksIG1lc3NhZ2UsIG9wdGlvbnMpe1xuICAgIGlmKHRoaXMubWFwUG9wdXAgPT0gbnVsbCl7XG5cbiAgICAgIHZhciBwb3B1cCA9IEwucG9wdXAob3B0aW9ucylcbiAgICAgIC5zZXRMYXRMbmcobmV3IEwuTGF0TG5nKHksIHgpKVxuICAgICAgLnNldENvbnRlbnQobWVzc2FnZSk7XG5cbiAgICAgIHRoaXMub2xkQ2FuU2Nyb2xsID0gdGhpcy5jYW5TY3JvbGw7XG4gICAgICB0aGlzLmNhblNjcm9sbCA9IGZhbHNlO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB0aGlzLm1hcFBvcHVwID0gcG9wdXAub3Blbk9uKHRoaXMubWFwKTtcbiAgICAgIHRoaXMuem9vbVBvcHVwKCk7XG4gICAgICAvL2F1dG9jbG9zZVxuICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICB0aGlzLmNsZWFyUG9wdXAobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuY2FuU2Nyb2xsID0gdGhpcy5vbGRDYW5TY3JvbGw7XG4gICAgICB9LCBNQVBfQVVUT0NMT1NFX1BPUFVQX1RJTUVPVVQpO1xuICAgICAgcmV0dXJuIHRoaXMubWFwUG9wdXA7XG4gICAgfVxuICB9XG5cbiAgZHJhd01zZ1BvcHVwKGlkLCBtc2cpe1xuXG4gICAgaWYodGhpcy5ub3RJbnNpZGVNc2dQb3B1cCE9bnVsbCAmJiB0aGlzLm5vdEluc2lkZU1zZ1BvcHVwLnphcHRJZCAhPSBpZCl7XG4gICAgICB0aGlzLm5vdEluc2lkZU1zZ1BvcHVwLnJlbW92ZSgpO1xuICAgICAgdGhpcy5ub3RJbnNpZGVNc2dQb3B1cCA9IG51bGw7XG4gICAgfSBlbHNlIGlmKHRoaXMubm90SW5zaWRlTXNnUG9wdXAhPW51bGwgJiYgdGhpcy5ub3RJbnNpZGVNc2dQb3B1cC56YXB0SWQgPT09IGlkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaHRtbCA9ICc8ZGl2IGNsYXNzPVwiaW50ZXJlc3QtcG9wdXBcIj4nICtcbiAgICAgICc8c3Bhbj4nICsgbXNnICsgJzwvc3Bhbj48YnIvPicgK1xuICAgICc8L2Rpdj4nO1xuXG4gICAgdGhpcy5vbGRDYW5TY3JvbGwgPSB0aGlzLmNhblNjcm9sbDtcbiAgICB0aGlzLmNhblNjcm9sbCA9IGZhbHNlO1xuICAgIHRoaXMubm90SW5zaWRlTXNnUG9wdXAgPSBMLnBvcHVwKHtcbiAgICAgIGNsYXNzTmFtZTogXCJuZWFyYnktYWRzLXBvcHVwXCIsXG4gICAgfSkuc2V0TGF0TG5nKHRoaXMubWFwLmdldENlbnRlcigpKVxuICAgIC5zZXRDb250ZW50KGh0bWwpXG4gICAgLm9wZW5Pbih0aGlzLm1hcCk7XG5cbiAgICB0aGlzLm5vdEluc2lkZU1zZ1BvcHVwLnphcHRJZCA9IGlkO1xuXG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgdGhpcy5jYW5TY3JvbGwgPSB0aGlzLm9sZENhblNjcm9sbDtcbiAgICAgIGlmKHRoaXMubm90SW5zaWRlTXNnUG9wdXAhPW51bGwpe1xuICAgICAgICB0aGlzLm5vdEluc2lkZU1zZ1BvcHVwLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0sIE1BUF9BVVRPQ0xPU0VfUE9QVVBfVElNRU9VVCAqIDEuNSk7XG4gICAgcmV0dXJuIHRoaXMubm90SW5zaWRlTXNnUG9wdXA7XG4gIH1cblxuICB6b29tUG9wdXAoem9vbUxldmVscz0wKXtcbiAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICBpZighdGhpcy5tYXBQb3B1cCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgTUFYX1pPT01fTEVWRUxTID0gMztcbiAgICAgIHZhciBtYXAgPSB0aGlzLm1hcCxcbiAgICAgICAgICBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChMLkRvbVV0aWwuZ2V0U3R5bGUodGhpcy5tYXBQb3B1cC5fY29udGFpbmVyLCAnbWFyZ2luQm90dG9tJyksIDEwKSB8fCAwLFxuICAgICAgICAgIGNvbnRhaW5lckhlaWdodCA9IHRoaXMubWFwUG9wdXAuX2NvbnRhaW5lci5vZmZzZXRIZWlnaHQgKyBtYXJnaW5Cb3R0b20sXG4gICAgICAgICAgY29udGFpbmVyV2lkdGggPSB0aGlzLm1hcFBvcHVwLl9jb250YWluZXIub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIGxheWVyUG9zID0gbmV3IEwuUG9pbnQodGhpcy5tYXBQb3B1cC5fY29udGFpbmVyTGVmdCwgLWNvbnRhaW5lckhlaWdodCAtIHRoaXMubWFwUG9wdXAuX2NvbnRhaW5lckJvdHRvbSk7XG5cbiAgICAgIGxheWVyUG9zLl9hZGQoTC5Eb21VdGlsLmdldFBvc2l0aW9uKHRoaXMubWFwUG9wdXAuX2NvbnRhaW5lcikpO1xuXG4gICAgICB2YXIgY29udGFpbmVyUG9zID0gbWFwLmxheWVyUG9pbnRUb0NvbnRhaW5lclBvaW50KGxheWVyUG9zKSxcbiAgICAgICAgICBwYWRkaW5nID0gTC5wb2ludCh0aGlzLm1hcFBvcHVwLm9wdGlvbnMuYXV0b1BhblBhZGRpbmcpLFxuICAgICAgICAgIHBhZGRpbmdUTCA9IEwucG9pbnQodGhpcy5tYXBQb3B1cC5vcHRpb25zLmF1dG9QYW5QYWRkaW5nVG9wTGVmdCB8fCBwYWRkaW5nKSxcbiAgICAgICAgICBwYWRkaW5nQlIgPSBMLnBvaW50KHRoaXMubWFwUG9wdXAub3B0aW9ucy5hdXRvUGFuUGFkZGluZ0JvdHRvbVJpZ2h0IHx8IHBhZGRpbmcpLFxuICAgICAgICAgIHNpemUgPSBtYXAuZ2V0U2l6ZSgpLFxuICAgICAgICAgIGR4ID0gMCxcbiAgICAgICAgICBkeSA9IDA7XG5cbiAgICAgIGlmIChjb250YWluZXJQb3MueCArIGNvbnRhaW5lcldpZHRoICsgcGFkZGluZ0JSLnggPiBzaXplLngpIHsgLy8gcmlnaHRcbiAgICAgICAgZHggPSBjb250YWluZXJQb3MueCArIGNvbnRhaW5lcldpZHRoIC0gc2l6ZS54ICsgcGFkZGluZ0JSLng7XG4gICAgICB9XG4gICAgICBpZiAoY29udGFpbmVyUG9zLnggLSBkeCAtIHBhZGRpbmdUTC54IDwgMCkgeyAvLyBsZWZ0XG4gICAgICAgIGR4ID0gY29udGFpbmVyUG9zLnggLSBwYWRkaW5nVEwueDtcbiAgICAgIH1cbiAgICAgIGlmIChjb250YWluZXJQb3MueSArIGNvbnRhaW5lckhlaWdodCArIHBhZGRpbmdCUi55ID4gc2l6ZS55KSB7IC8vIGJvdHRvbVxuICAgICAgICBkeSA9IGNvbnRhaW5lclBvcy55ICsgY29udGFpbmVySGVpZ2h0IC0gc2l6ZS55ICsgcGFkZGluZ0JSLnk7XG4gICAgICB9XG4gICAgICBpZiAoY29udGFpbmVyUG9zLnkgLSBkeSAtIHBhZGRpbmdUTC55IDwgMCkgeyAvLyB0b3BcbiAgICAgICAgZHkgPSBjb250YWluZXJQb3MueSAtIHBhZGRpbmdUTC55O1xuICAgICAgfVxuXG4gICAgICBpZigoZHk8MCkgJiYgem9vbUxldmVsczxNQVhfWk9PTV9MRVZFTFMpe1xuICAgICAgICB0aGlzLm1hcC56b29tT3V0KHRoaXMubWFwLm9wdGlvbnMuem9vbURlbHRhICogNCwge2FuaW1hdGU6IGZhbHNlLCBkdXJhdGlvbjogMC4xfSk7XG4gICAgICAgIHRoaXMuem9vbVBvcHVwKCsrem9vbUxldmVscyk7XG4gICAgICB9XG4gICAgICBpZigoZHg8MCkgJiYgem9vbUxldmVsczxNQVhfWk9PTV9MRVZFTFMpe1xuICAgICAgICB0aGlzLm1hcC56b29tSW4odGhpcy5tYXAub3B0aW9ucy56b29tRGVsdGEgKiA0LCB7YW5pbWF0ZTogZmFsc2UsIGR1cmF0aW9uOiAwLjF9KTtcbiAgICAgICAgdGhpcy5tYXAuc2V0Vmlldyh0aGlzLm1hcFBvcHVwLmdldExhdExuZygpKTtcbiAgICAgICAgdGhpcy56b29tUG9wdXAoKyt6b29tTGV2ZWxzKTtcbiAgICAgIH1cbiAgICB9LCAzNTApO1xuICB9XG5cbiAgY2xlYXJQb3B1cChjb250ZW50KXtcbiAgICBpZih0aGlzLm1hcFBvcHVwIT1udWxsKXtcbiAgICAgIC8vc3BlY2lmaWMgcG9wdXBcbiAgICAgIGlmKGNvbnRlbnQhPW51bGwgJiYgY29udGVudD09dGhpcy5tYXBQb3B1cC5nZXRDb250ZW50KCkpe1xuICAgICAgICB0aGlzLm1hcFBvcHVwLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLm1hcFBvcHVwID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZihjb250ZW50PT1udWxsKXsgLy9hbnkgcG9wdXBcbiAgICAgICAgdGhpcy5tYXBQb3B1cC5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5tYXBQb3B1cCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJBZHNQb3B1cCgpe1xuICAgIGlmKHRoaXMuYWRzTWFwUG9wdXAgIT0gbnVsbCl7XG4gICAgICB0aGlzLmFkc01hcFBvcHVwLnJlbW92ZSgpO1xuICAgICAgdGhpcy5hZHNNYXBQb3B1cCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZmluZE5lYXJlc3RSZXN0cm9vbSgpe1xuICAgIHRoaXMuX2ZpbmRVdGlsaXR5U3BhY2UoWydTYW5pdMOhcmlvIGUgQXBvaW8nLCAnU2FuaXTDoXJpbyddKTtcbiAgfVxuXG4gIGZpbmROZWFyZXN0RXhpdCgpe1xuICAgIHRoaXMuX2ZpbmRVdGlsaXR5U3BhY2UoWydTYcOtZGEnXSk7XG4gIH1cblxuICBfZmluZFV0aWxpdHlTcGFjZSh1dGlsaXR5S2V5cyl7XG4gICAgdGhpcy5nZXRTcGFjZXMoKS50aGVuKChzcGFjZXMpPT57XG4gICAgICBsZXQgZm91bmRTcGFjZXMgPSBbXTtcblxuICAgICAgc3BhY2VzLmZvckVhY2goKHNwYWNlKT0+e1xuICAgICAgICBpZih1dGlsaXR5S2V5cy5pbmRleE9mKHNwYWNlLmNhdGVnb3J5KT49MCl7XG4gICAgICAgICAgZm91bmRTcGFjZXMucHVzaChzcGFjZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZihmb3VuZFNwYWNlcy5sZW5ndGg+MCl7XG4gICAgICAgIHZhciBjYWxjRGlzdGFuY2VGbiA9IChmb3VuZFNwYWNlcyk9PntcbiAgICAgICAgICBpZighdGhpcy5jdXJyZW50UG9zaXRpb24pe1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKCk9PmNhbGNEaXN0YW5jZUZuKGZvdW5kU3BhY2VzKSwgMjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIG5lYXJlc3RDb29yZHMgPSB0aGlzLl9maW5kTmVhcmVzdFNwYWNlKGZvdW5kU3BhY2VzKS5jb29yZHM7XG4gICAgICAgICAgdGhpcy5maW5kU2hvcnRlc3RQYXRoQmFzZWRDdXJyZW50TG9jYXRpb24ocGFyc2VGbG9hdChuZWFyZXN0Q29vcmRzWzBdKSwgcGFyc2VGbG9hdChuZWFyZXN0Q29vcmRzWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsY0Rpc3RhbmNlRm4oZm91bmRTcGFjZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2ZpbmROZWFyZXN0U3BhY2Uoc3BhY2VzKXtcbiAgICB2YXIgbmVhcmVzdERpc3RhbmNlID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsIG5lYXJlc3RDb29yZHMgPSBudWxsLCBzcGFjZURpc3RhbmNlO1xuICAgIHNwYWNlcy5mb3JFYWNoKChzcGFjZSk9PntcbiAgICAgIHZhciBzcGFjZVRyYW5zZm9ybWVkRGlzdGFuY2UgPSB0cmFuc2Zvcm1Db29yZGluYXRlc1RvTGVhZmxldChzcGFjZS5jb29yZHMpO1xuICAgICAgc3BhY2VEaXN0YW5jZSA9IGdldERpc3RhbmNlSW5QaXhlbChzcGFjZVRyYW5zZm9ybWVkRGlzdGFuY2VbMF0sIHNwYWNlVHJhbnNmb3JtZWREaXN0YW5jZVsxXSwgdGhpcy5jdXJyZW50UG9zaXRpb25bMF0sIHRoaXMuY3VycmVudFBvc2l0aW9uWzFdKTtcbiAgICAgIGlmKHNwYWNlRGlzdGFuY2U8bmVhcmVzdERpc3RhbmNlKXtcbiAgICAgICAgbmVhcmVzdERpc3RhbmNlID0gc3BhY2VEaXN0YW5jZTtcbiAgICAgICAgbmVhcmVzdENvb3JkcyA9ICBzcGFjZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbmVhcmVzdENvb3JkcztcbiAgfVxuXG4gIF9pc0Nvb3Jkc1ZhbGlkKHh5KXtcbiAgICB2YXIgbWF4Qm91bmRzID0gdGhpcy5nZXRNYXAoKS5vcHRpb25zLm1heEJvdW5kcztcbiAgICB2YXIgYWNjZXB0YWJsZVJhbmdlID0gMzA7XG4gICAgcmV0dXJuICEoIXh5IHx8ICF4eVswXSB8fCAheHlbMV0gfHwgeHlbMF08MCB8fCB4eVsxXTwwIHx8XG4gICAgICB4eVswXTxtYXhCb3VuZHMuX3NvdXRoV2VzdC5sbmcgfHwgeHlbMV08bWF4Qm91bmRzLl9zb3V0aFdlc3QubGF0IHx8IHh5WzBdPm1heEJvdW5kcy5fbm9ydGhFYXN0LmxuZyB8fCB4eVsxXT5tYXhCb3VuZHMuX25vcnRoRWFzdC5sYXQpO1xuICB9XG5cbiAgZ2V0TWFwKCl7XG4gICAgaWYodGhpcy5tYXA9PW51bGwpe1xuICAgICAgdGhpcy5tYXAgPSBnbG9iYWwubWFwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXA7XG4gIH1cblxuICBnZXRTcGFjZXMobmFtZSl7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHYscmVqZWN0KT0+e1xuICAgICAgaWYodGhpcy5zcGFjZXM9PW51bGwgfHwgdGhpcy5zcGFjZXMubGVuZ3RoPT09MCl7XG4gICAgICAgIGlmKGN1cnJlbnRMb2NhbE9iaj09bnVsbCl7XG4gICAgICAgICAgcmVzb2x2KG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgPSBuYW1lIHx8IHRoaXMua2V5O1xuICAgICAgICBtYXBMb2NhbFN0b3JhZ2VEQU8ucmV0cmlldmVTcGFjZXMobmFtZSkudGhlbigoc3BhY2VzKT0+e1xuICAgICAgICAgIHRoaXMuc3BhY2VzID0gc3BhY2VzO1xuICAgICAgICAgIGlmKHRoaXMuc3BhY2VzPT1udWxsIHx8IHRoaXMuc3BhY2VzLmxlbmd0aD09PTApe1xuICAgICAgICAgICAgbWFwRmlyZWJhc2VEQU8uY2xvdWRTcGFjZXNSZXRyaWV2ZShuYW1lKS50aGVuKChzcGFjZXMpPT57XG4gICAgICAgICAgICAgIHJlc29sdihzcGFjZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdihzcGFjZXN8fFtdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2KHRoaXMuc3BhY2VzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFBhdGhzKG5hbWUpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2LHJlamVjdCk9PntcbiAgICAgIGlmKHRoaXMucGF0aHM9PW51bGwgfHwgdGhpcy5wYXRocy5sZW5ndGg9PT0wKXtcbiAgICAgICAgaWYoY3VycmVudExvY2FsT2JqPT1udWxsKXtcbiAgICAgICAgICByZXNvbHYobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZSA9IG5hbWUgfHwgdGhpcy5rZXk7XG4gICAgICAgIG1hcExvY2FsU3RvcmFnZURBTy5yZXRyaWV2ZVBhdGhzKG5hbWUpLnRoZW4oKHBhdGhzKT0+e1xuICAgICAgICAgIHRoaXMucGF0aHMgPSBwYXRocztcbiAgICAgICAgICBpZih0aGlzLnBhdGhzPT1udWxsIHx8IHRoaXMucGF0aHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICBtYXBGaXJlYmFzZURBTy5jbG91ZFBhdGhzUmV0cmlldmUobmFtZSkudGhlbigocGF0aHMpPT57XG4gICAgICAgICAgICAgIHJlc29sdihwYXRocyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2KHBhdGhzfHxbXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdih0aGlzLnBhdGhzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbCgpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2LHJlamVjdCk9PntcbiAgICAgIGlmKCF0aGlzLmN1cnJlbnRMb2NhbCB8fCB0aGlzLmN1cnJlbnRMb2NhbC5uYW1lICE9IHRoaXMua2V5KXtcbiAgICAgICAgbWFwTG9jYWxTdG9yYWdlREFPLnJldHJpZXZlTG9jYWwodGhpcy5rZXkpLnRoZW4oKGN1cnJlbnRQbGFjZSk9PntcbiAgICAgICAgICBnbG9iYWwuY3VycmVudExvY2FsT2JqID0gY3VycmVudFBsYWNlO1xuICAgICAgICAgIG1hcExvY2FsU3RvcmFnZURBTy5zYXZlQ3VycmVudExvY2FsKGN1cnJlbnRQbGFjZSkudGhlbigoKT0+e1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TG9jYWwgPSBjdXJyZW50UGxhY2U7XG4gICAgICAgICAgICByZXNvbHYoY3VycmVudFBsYWNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goKGVycik9PntcbiAgICAgICAgICBsb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHYodGhpcy5jdXJyZW50TG9jYWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1hcENhbnZhc1N0eWxlKCl7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGdldFdpZHRoKCkgKyBcInB4XCIsXG4gICAgaGVpZ2h0OiAoZ2V0SGVpZ2h0KCktNDkpICsgXCJweFwiXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFphcHQ7XG4iLCJnbG9iYWwuTUlOX1RJTUVfQ0hBTkdFX0NVUlJFTlRfU1RBVEUgPSA0ICogMTAwMDsgLy9pbiBtaWxpc2Vjb25kc1xuZ2xvYmFsLlRJTUVfVE9fQ09ORklSTV9DSEFOR0VfU1RBVEUgPSAyICogMTAwMDtcbmdsb2JhbC5USU1FX1JFRlJFU0hfUFJPR1JFU1NfTkVYVF9DQVJEID0gMzAwO1xuZ2xvYmFsLlRBUF9USU1FID0gMTMwMDtcbmdsb2JhbC5OVU1fRElTUExBWUVEX0NIQVJTX0xJU1RJTkdfVEVYVCA9IDgyO1xuZ2xvYmFsLk1BWF9ESVNUQU5DRV9QTEFDRV9DVVJSRU5UX0xPQ0FUSU9OX0lOX01UUyA9IDEwMDAwO1xuZ2xvYmFsLlBMQUNFX0RJU1RBTkNFX1RPX1NIT1dfTUFQID0gMTAwMDtcbmdsb2JhbC5NQVhfUExBQ0VTX0hPTUUgPSAxMDtcbmdsb2JhbC5NQVhfVkVMT0NJVFkgPSA3OyAvL2ttL2hcbmdsb2JhbC5NQVhfVkVMT0NJVFlfSVBTID0gNTsgLy9rbS9oXG5nbG9iYWwuTUFYX1ZFTE9DSVRZX01FVEVSU19QRVJfU0VDT05EID0gMztcbmdsb2JhbC5BVkdfVkVMT0NJVFlfTUVURVJTX1BFUl9TRUNPTkQgPSAxLjM7XG5nbG9iYWwuREVGQVVMVF9MQU5HVUFHRSA9IFwicHQtYnJcIjtcbmdsb2JhbC5HUFNfUkVVU0VfTUFYX0FHRSA9IDUwMDsgLy9tc1xuZ2xvYmFsLkdQU19USU1FT1VUID0gMTUwMDtcbmdsb2JhbC5NQVhfV0FJVF9USU1FT1VUID0gMzUwMDA7XG5nbG9iYWwuTUFYX1dBSVRfVE9VUl9USU1FT1VUID0gOTAwMDA7XG5nbG9iYWwuUkVGUkVTSF9ESVNUQU5DRV9USU1FID0gNTAwO1xuZ2xvYmFsLk5PVElGSUNBVElPTlNfQ0xFQU5fSU5URVJWQUwgPSA2MDAwMDA7IC8vMTAgTUlOVVRFU1xuZ2xvYmFsLk1BWF9ESVNUQU5DRV9GSU5EX1BMQUNFX1RPVVIgPSAyMDsgLy8yMCBNRVRFUlNcbmdsb2JhbC5UT1VSX01BWF9USU1FX0lHTk9SRV9CRUFDT05TID0gNSAqIDEwMDA7IC8vNSBTRUNPTkRTXG5nbG9iYWwuTUlOX1RJTUVfU0hPV19QT1BVUF9XSEVOX0dPX1RPID0gMjAwMDA7IC8vMjAgU0VDT05EU1xuZ2xvYmFsLk1BWF9JTkRPT1JfQUNDVVJBQ1kgPSAxMDsgLy8xMG1cbmdsb2JhbC5NQVhfVElNRV9JTkFDVElWRV9OQVZJR0FUSU9OID0gMTUwMDsgLy9pbiBtc1xuZ2xvYmFsLkFDQ0VMRVJPTUVURVJfRlJFUVVFTkNZID0gMjAwOyAvL2luIG1zXG5nbG9iYWwuQ09NUEFTU19GUkVRVUVOQ1kgPSA4MDsgLy9pbiBtc1xuZ2xvYmFsLlBFRE9NRVRFUl9GUkVRVUVOQ1kgPSAxMDA7IC8vaW4gbXNcbmdsb2JhbC5NRVRFUlNfVE9fRkVFVCA9IDMuMjgwODQ7XG5nbG9iYWwuU1RFUF9TSVpFID0gMC41OyAvL2luIG1ldGVyc1xuZ2xvYmFsLklTX1dBTEtJTkdfTUFHTklUVURFID0gMC42O1xuZ2xvYmFsLkdSQVZJVFkgPSA5Ljg7XG5nbG9iYWwuU0hBRE9XX0RFVklBVElPTiA9IC0wLjk7XG5nbG9iYWwuUEFUSF9MT1NTID0gMi40O1xuZ2xvYmFsLkxJTUlUX1RIUkVTSE9MRCA9IDMuMzsgLy9tZXRlcnNcbmdsb2JhbC5XQUxLSU5HX0JFQUNPTl9BVkcgPSAxMTAwO1xuZ2xvYmFsLk1BUF9BVVRPQ0xPU0VfUE9QVVBfVElNRU9VVCA9IDMzNTA7IC8vbWlsaXNlY29uZHNcbmdsb2JhbC5NSU5fTVRfQUNDVVJBQ1kgPSAyLjI7XG5nbG9iYWwuU1RPUFBFRF9NSU5fTVRfQUNDVVJBQ1kgPSAxLjI7XG5nbG9iYWwuU0FNRV9BRFNfSU5URVJWQUxfVElNRSA9IDkwMDAwOyAvL21zXG5nbG9iYWwuVElNRV9VUERBVEVfUE9TSVRJT05fQUZURVJfU1RPUCA9IDEwMDAwO1xuZ2xvYmFsLk1PTklUT1JJTkdfRkVOQ0VfSU5URVJWQUwgPSAxMDAwOyAvL21zXG5nbG9iYWwuTUFQX0JFVFdFRU5fVFJBTlNJVElPTl9USU1FID0gNjAwMDA7IC8vbXNcbmdsb2JhbC5NQVhfSVRFTVNfUEVSX1BBR0UgPSAxNTsgLy9tc1xuZ2xvYmFsLlJFRlJFU0hfTUVUQURBVEFfVElNRSA9IDUgKiA2MCAqIDEwMDA7IC8vbXNcbmdsb2JhbC5NQVhfRElTVEFOQ0VfQ09OU0lERVIgPSAyMDsgLy9tZXRlcnNcbmdsb2JhbC5NQVhfVElNRV9DT05TSURFUl9QTEFDRV9MSVNUX0xPQ0FUSU9OX0NBQ0hFID0gNjAgKiA1ICogMTAwMDsgLy9tc1xuXG5pZihOdW1iZXIuTUFYX1NBRkVfSU5URUdFUj09bnVsbCl7XG4gIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcbn1cblxuaWYoTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVI9PW51bGwpe1xuICBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUiA9IC05MDA3MTk5MjU0NzQwOTkxO1xufVxuIl19
