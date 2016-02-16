# WardDraw

## About
This is a simple canvas based drawing app. Fundamentally experimental in nature, I'm using it as a learning exercise to teach myself aspects of working with html 5's `<canvas>` element and it's associated `CanvasRenderingContext2D`. I'm also using the opportunity to do an immersion dive into using ECMAScript 6.

## Install/Build
1. In order to build and test the app, you will need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.
2. Once you have that squared away, you will also need to have [Gulp](http://gulpjs.com/) installed: `sudo npm install gulp -g`
3. Then at the root of the project directory in the terminal enter `npm install`. It's been my experience (on OSX) to run this command with `sudo`. This will create the _node_modules_ directory and download and install the necessary modules.
4. Finally, to do a build enter `gulp` to execute the default gulp task (build and test).
    * To only build the app, run `gulp build`
    * To only test the app, run `gulp test`

## Running And Testing The App
### Running
The build task (`gulp build`) will create a _`dist`_ directory, with an _`index.html`_ you can load directly in a web browser. The app code is in native ES6, and is not currently being transpiled to ES5. Therefore you will need to load the app in a browser which can run ES6 natively. My current version of Chrome (Version 48) can do this if you manually enable the ["Enable Experimental JavaScript"](chrome://flags/#enable-javascript-harmony) flag.
### Testing
There is a gulp task to test the app, triggered as part of the default task (or again `gulp test` standalone). Mocha is the test framework being used, however Mocha doesn't understand ES6. Therefore for testing only I did have to introduce babel transpilation of the code to ES5. Unfortunately life at the bleeding edge is never easy — the transpilation introduced a leakage of strict execution scope which ended up breaking the mocha tests. I haven't been able to discover an elegant way to [fix this](http://stackoverflow.com/questions/33821312/how-to-remove-global-use-strict-added-by-babel). But there is an ugly way :disappointed:. Navigate to _`node_modules/babel-preset-es2015/node_modules/babel-plugin-transform-es2015-modules-commonjs/lib/index.js`_. On line 130 (currently) you'll find this line: `inherits: require("babel-plugin-transform-strict-mode"),`. **Comment it out** :scream:. Or just don't run the tests.

## Usage of WardDraw
TK

## Design of WardDraw
TK

## License
Copyright (c) 2016 Ward Ruth

Licensed under the MIT License