(function (exports) {
'use strict';

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
var polyfill = (function() {
  var isCallable = function(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function(value) {
    if(value != null) {
      if(['string','number','boolean','symbol'].indexOf(typeof value) > -1){
        return Symbol.iterator;
      } else if (
        (typeof Symbol !== 'undefined') &&
        ('iterator' in Symbol) &&
        (Symbol.iterator in value)
      ) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
        return '@@iterator';
      }
    }
  };
  var getMethod = function(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if(func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if(done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */ ) {
    'use strict';

    // 1. Let C be the this value.
    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          'Array.from: when provided, the second argument must be a function'
        );
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError(
          'Array.from requires an array-like or iterable object'
        );
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        }
        else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        }
        else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
})();

var arrayFrom = (typeof Array.from === 'function' ?
  Array.from :
  polyfill
);

var decamelize = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	sep = typeof sep === 'undefined' ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rgbHex = createCommonjsModule(function (module) {
'use strict';
/* eslint-disable no-mixed-operators */
module.exports = function (red, green, blue, alpha) {
	var isPercent = (red + (alpha || '')).toString().includes('%');

	if (typeof red === 'string') {
		var res = red.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
		// TODO: use destructuring when targeting Node.js 6
		red = res[0];
		green = res[1];
		blue = res[2];
		alpha = res[3];
	} else if (alpha !== undefined) {
		alpha = parseFloat(alpha);
	}

	if (typeof red !== 'number' ||
		typeof green !== 'number' ||
		typeof blue !== 'number' ||
		red > 255 ||
		green > 255 ||
		blue > 255) {
		throw new TypeError('Expected three numbers below 256');
	}

	if (typeof alpha === 'number') {
		if (!isPercent && alpha >= 0 && alpha <= 1) {
			alpha = Math.round(255 * alpha);
		} else if (isPercent && alpha >= 0 && alpha <= 100) {
			alpha = Math.round(255 * alpha / 100);
		} else {
			throw new TypeError(("Expected alpha value (" + alpha + ") as a fraction or percentage"));
		}
		alpha = (alpha | 1 << 8).toString(16).slice(1);
	} else {
		alpha = '';
	}

	return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
};
});

//all properties are available
//using getComputedStyle(element)
//document.documentElement gets :root pseudo stuff
function cssProxy(
    element,
    props,
    pseudo
){
    if ( element === void 0 ) { element = document.documentElement; }
    if ( props === void 0 ) { props = {}; }

    if(typeof props !== 'object'){
        props = {};
    }

    var allstyles = getComputedStyle(element, pseudo);

    function getName(name){
        //Computed styles contain all the properties.
        if(allstyles[name] === void 0){
            //supporting camelcase properties
            return '--'+decamelize(name, '-');
        }
        return decamelize(name, '-');
    }

    var css = Object.assign(Object.create(null), ( obj = {
        setProperty: function setProperty(name, value, priority){
            element.style.setProperty(name, value, priority);
        },
        getProperty: function getProperty(name){
            return allstyles.getPropertyValue(name);
        },
        cssGet: function cssGet(name){
            if(nameOnElement(element, name)){
                return element.style[name];
            }
            var v = this.getProperty(getName(name));
            return !v || !v.length ? undefined : v.trim();
        },
        cssSet: function cssSet(name, value, priority){
            this.setProperty(getName(name), convertValue(value), priority);
        },
        remove: function remove(name){
            element.style.removeProperty(name);
        },
        setAll: function setAll(){
            var arguments$1 = arguments;

            var this$1 = this;
            var propObjects = [], len = arguments.length;
            while ( len-- ) { propObjects[ len ] = arguments$1[ len ]; }

            propObjects.forEach(function (props){
                Object.keys(props).forEach(function (key){
                    this$1.cssSet(key, props[key]);
                });
            });
            return this;
        }
    }, obj[Symbol.toPrimitive] = function (hint){
            return '[object CSSProxy]';
        }, obj ));
    var obj;

    var proxy = new Proxy(css, {
        get: function get(target, name){
            //Return methods
            if(typeof target[name] === 'function')
                { return target[name].bind(target); }
            //Return properties
            return target.cssGet(name);
        },
        set: function set(target, name, value){
            target.cssSet(name, value);
            return true;
        }
    });

    Object.keys(props).forEach(function (key){
        proxy[key] = props[key];
    });

    return proxy;
}

function nameOnElement(e, name){
    return !/[-]{2}/.test(name) && e.style[name] !== undefined;
}

/*
Setting variables, from variables works different.
document.documentElement.style.setProperty("--my-bg-colour", "var(--my-fg-colour)");*/
function convertValue(value){
    if(/[-]{2}/.test(value + '')){
        return ("var(--" + (decamelize(value + '')) + ")");
    }else {
        return value;
    }
}

var props = (function (){
    //Renamed properties, and properties with unique behaviors
    //are assigned directly to the original props object
    var props = {
        parent: {
            get: function get(){ return this.element.parentNode; }
        },
        first:{
            get: function get(){
                return this.element.firstChild;
            },
            set: function set(value){
                if(this.element.firstChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.firstChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        last: {
            get: function get(){
                return this.element.lastChild;
            },
            set: function set(value){
                if(this.element.lastChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.lastChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        children: {
            get: function get(){
                return arrayFrom(this.element.children);
            },
            set: function set(children){
                var this$1 = this;

                this.element.innerHTML = '';
                arrayFrom(children).forEach(function (child){
                    this$1.element.appendChild(get(child));
                });
            }
        },
        childNodes: {
            get: function get(){
                return arrayFrom(this.element.childNodes);
            }
        },
        style: {
            get: function get(){
                if(this._style === void 0){
                    if(Proxy === void 0) { return this.element.style; }
                    this._style = cssProxy(this.element);
                }
                return this._style;
            }
        },
        root: {
            get: function get(){
                return this.element.rootNode;
            }
        },
        data: {
            get: function get(){
                return this.element.dataset;
            }
        }
    };


    //Define simpler getters, and setters
    ['value', 'innerHTML', 'outerHTML', 'textContent',
    'className', 'classList']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            },
            set: function set(value){
                this.element[prop] = value;
            }
        };
    });

    //Define simpler getters
    ['nodeName', 'nextSibling', 'nodeType', 'nodeName']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            }
        };
    });

    //Enumerable properties are easier to debug
    Object.keys(props).forEach(function (key){ return props[key].enumerable = true; });
    return props;
})();


function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

function mixinDOMProperties(dest){
    return mixin(dest);
}

function get(e){
    if(e.element !== void 0) { return e.element; }
    return e;
}

exports.mixin = mixin;
exports.mixinDOMProperties = mixinDOMProperties;
exports.props = props;

}((this.domPropertiesMixin = this.domPropertiesMixin || {})));
//# sourceMappingURL=dom-properties-mixin.js.map
