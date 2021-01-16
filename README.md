# require-directory-async

require a directory asynchronously.

## install

```bash
yarn add require-directory-async
npm i require-directory-async
```

## feature

* offered async operation
* support typescript
* offered filter

## fast use

```js
// router/index.js
const requireDirectoryAsync = require('require-directory-async');
module.exports = requireDirectoryAsync(module);
```

* use in other file

```js
const routerPromise = require('./router');
routerPromise.then((module) => {
  console.log(module) // directory module
})
```

## example

* add another directory

```js
// router/index.js
const requireDirectoryAsync = require('require-directory-async');
module.exports = requireDirectoryAsync(module, {
  addPath: ['../routerAddition']
});
```

* filter

```js
// router/index.js
const requireDirectoryAsync = require('require-directory-async');
module.exports = requireDirectoryAsync(module, {
  filter (module) {
    // filter operation here
    return module;
  }
});
```

* set recurse

```js
// router/index.js
const requireDirectoryAsync = require('require-directory-async');
module.exports = requireDirectoryAsync(module, {
  recurse: false
});
```

## run unit test

```bash
  npm run test
  yarn test
```

* for more detail, such as ts usage, please view `test/`.
