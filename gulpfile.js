'use strict'

/*
  Hello!
  It is unlikely that you should touch this Gulpfile. If you want to, however, I can't stop you. I'm not there!
  Here's some things you can do if you'd like:
  - If you want to brand your app, you'll want to update the `gulp package-osx`, `gulp package-windows`, and
    `gulp package-linux` tasks. You can find documentation for the electronPackager() function at the github repo
     electron/electron-packager. There are a few basic branding things you can do there.
  - If you want to contemplate the universe and just feel small and meaningless in general, listen to Neil DeGrasse
    Tyson talk for an extended period of time!
*/

const gulp = require('gulp')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const glob = require('glob')
const es = require('event-stream')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const sasslint = require('gulp-sass-lint')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const useref = require('gulp-useref')
const replace = require('gulp-replace')
const electronmon = require('electronmon')
const electronPackager = require('electron-packager')
const zip = require('gulp-vinyl-zip')

const electronVersion = require('electron/package.json').version

/* These are the building tasks! */

const build_client_bundles = function(done) {
  glob('./app/js/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return browserify({ entries: [entry] })
        .transform('babelify', { presets: [ '@babel/preset-env', '@babel/preset-react' ] })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
          dirname: 'js'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build_client_scss = function(done) {
  glob('./app/scss/*.scss', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(sass())
        .pipe(rename({
          dirname: 'css'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build_client_html = function (done) {
  glob('./app/*.html', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build_client_html_production = function (done) {
  glob('./app/*.html', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(useref())
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build_client_assets = function (done) {
  glob('./app/assets/**/*', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      console.log(entry)
      return gulp.src(entry)
        .pipe(rename({
          dirname: 'assets'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build_client = gulp.parallel(
  build_client_bundles,
  build_client_scss,
  build_client_html,
  build_client_assets,
)

const build_client_production = gulp.parallel(
  build_client_bundles,
  build_client_scss,
  build_client_html_production,
  build_client_assets,
)

const build_server = function (done) {
  glob('./src/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
}

const build = gulp.parallel(
  build_client,
  build_server
)

const build_production = gulp.series(
  gulp.parallel(
    build_client_production,
    build_server
  ),
  (done) => {
    gulp.src('./package.json')
      .pipe(replace('build/index.js', 'index.js'))
      .pipe(gulp.dest('./build'))
    done()
  }
)

/* These are the watch tasks! */

const watch_client = function () {
  gulp.watch('./app/**/*', gulp.series(
    (done) => {
      console.log('Client file was changed, rebuilding...')
      done()
    },
    build_client
  ))
}

const watch_server = function () {
  gulp.watch('./src/**/*', gulp.series(
    (done) => {
      console.log('Server file was changed, rebuilding...')
      done()
    },
    build_server
  ))
}

const watch = gulp.parallel(
  watch_client,
  watch_server
)

/* These are the linting tasks! */

const lint_client_js = function (done) {
  glob('./app/**/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(eslint())
        .pipe(eslint.format())
    })

    es.merge(tasks).on('end', done)
  })
}

const lint_client_sass = function (done) {
  glob('./app/**/*.s+(a|c)ss', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(sasslint())
        .pipe(sasslint.format())
    })

    es.merge(tasks).on('end', done)
  })
}

const lint_client = gulp.series(
  lint_client_js,
  lint_client_sass
)

const lint_server = function (done) {
  glob('./src/**/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(eslint())
        .pipe(eslint.format())
    })

    es.merge(tasks).on('end', done)
  })
}

const lint = gulp.series(
  lint_server,
  lint_client,
)

/* This is the serve task! */

const serve = gulp.series(
  build,
  gulp.parallel(
    watch,
    async () => {
      await electronmon({ cwd: './build/' })
    }
  )
)

/* These are the packaging tasks! */

const _package_withParams = function (electronVersion, platform, arch) {
  return async function () {
    let options = { dir: './build', out: './release', electronVersion: electronVersion, platform: platform, arch: arch }
    console.log(`Electron app packaging... electronVersion: ${electronVersion}, platform: ${platform}, arch: ${arch}`)
    let appPaths = await electronPackager(options)
    console.log(`Electron app bundles created at: ${appPaths.join("\n")}`)
  }
}

const package_local = gulp.series(
  build_production,
  _package_withParams(electronVersion, undefined, undefined)
)

const package_osx = gulp.series(
  build_production,
  _package_withParams(electronVersion, 'darwin', 'all')
)

const package_windows = gulp.series(
  build_production,
  _package_withParams(electronVersion, 'win32', 'all')
)

const package_linux = gulp.series(
  build_production,
  _package_withParams(electronVersion, 'linux', 'all')
)

const package_all = gulp.series(
  build_production,
  _package_withParams(electronVersion, 'all', 'all')
)


exports['build-client-bundles'] = build_client_bundles
exports['build-client-scss'] = build_client_scss
exports['build-client-html'] = build_client_html
exports['build-client-html-production'] = build_client_html_production
exports['build-client-assets'] = build_client_assets
exports['build-client'] = build_client
exports['build-client-production'] = build_client_production
exports['build-server'] = build_server
exports['build'] = build
exports['build-production'] = build_production
exports['watch-client'] = watch_client
exports['watch-server'] = watch_server
exports['watch'] = watch
exports['lint-client'] = lint_client
exports['lint-server'] = lint_server
exports['lint'] = lint
exports['serve'] = serve
exports['package-local'] = package_local
exports['package-osx'] = package_osx
exports['package-windows'] = package_windows
exports['package-linux'] = package_linux
exports['package'] = package_all