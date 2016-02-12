'use strict';

// because Chrome (v48) doesn't support `for ... of` over NodeList's yet
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
