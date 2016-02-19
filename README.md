# berbs
Babel + Electron + React + Browserify + Sass application stack

## How to get started

Install the [berbs CLI](https://github.com/vulpino/berbs-cli):
`npm install -g berbs`   
`berbs new`

## How to use berbs

- Your client HTML lives in app/.
- Your client javascript lives in app/js/.
- Your client SCSS lives in app/scss.
- Your react components live in app/js/components/.
- Your electron server code lives in src/.
- Everything is programmed using plain Javascript, the new, cool kind (ES2015).

### Building

- Build the client and server bundles: `gulp build`
- Watch app/ and src/ for changes and update automagically: `gulp watch`
- Lint everything (We use StandardJS, but you can modify the .eslintrc): `gulp lint`
- Open up the app: `gulp` (or `gulp open`)
