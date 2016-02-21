# Jolteon
![jolteon](http://cdn.bulbagarden.net/upload/c/c1/Spr_5b_135.png)

Babel + Electron + React + Browserify + Sass application stack. Gets the stupid work done so you can actually make something.

![moving picture](http://i.imgur.com/WkZ19h9.gif)

## What stupid work, exactly?

- Build your app with one command.
- Open a live-reloading instance of your app with another command.
- Lint your app using a third command.

## How to get started

- `npm install -g gulp-cli electron-prebuilt`
- `git clone https://github.com/vulpino/jolteon`
- `cd jolteon`
- `npm install`

### If you're on windows...

`gulp package-osx` will fail because symlinks. Sorry. Blame gulp-atom-electron.

## Directory Structure

- Your client HTML lives in app/.
- Your client javascript lives in app/js/.
- Your client SCSS lives in app/scss.
- Your react components live in app/js/components/.
- Your electron server code lives in src/.
- Everything is programmed using Javascript, the new, cool kind (ES2015).

### Building

- Build the client and server bundles: `gulp build`
- Watch app/ and src/ for changes and update build/ automagically: `gulp watch`
- Lint everything (We use StandardJS, but you can modify the .eslintrc): `gulp lint`
- Open up the app: `gulp serve`. This will also live reload everything, so don't worry about that.
- Package the app for release: `gulp package`.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
