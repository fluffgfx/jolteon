'use strict';

const gulp = require('gulp')
const source = require('vinyl-source-stream')
const rename = require('gulp-rename')
const browserify = require('browserify')
const glob = require('glob')
const es = require('event-stream')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const shell = require('gulp-shell')

gulp.task('build-client', (done) => {
  let tasks = []

  glob('./app/js/*.js', (err, files) => {
    if(err) done(err)

    tasks.concat(files.map((entry) => {
      return browserify({ entries: [entry] })
        .transform('babelify', { presets: [ 'es2015', 'react' ]})
        .bundle()
        .pipe(source(entry))
        .pipe(gulp.dest('./build/js'))
    }))
  })

  glob('./app/scss/*.scss', (err, files) => {
    if(err) done(err)

    tasks.concat(files.map((entry) => {
      return sass(entry)
        .on('error', sass.logError)
        .pipe(source(entry))
        .pipe(gulp.dest('./build/css'))
    }))
  })

  glob('./app/*.html', (err, files) => {
    if(err) done(err)

    tasks.concat(files.map((entry) => {
      return gulp.src(entry)
        .pipe(gulp.dest('./build/client'))
    }))
  })

  es.merge(tasks).on('end', done)
})

gulp.task('build-server', (done) => {
  glob('./src/*.js', (err, files) => {
    if(err) done(err)

    let tasks = files.map((entry) => {
      return babel(entry, { presets: ['es2015'] })
        .pipe(source(entry))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build', ['build-client', 'build-server'])

gulp.task('watch-client', () => {
  gulp.watch('./app/**/*', ['build-client'], (e) => {
    console.log('File ' + e.path + ' was ' + e.type + ', rebuilding...')
  })
})

gulp.task('watch-server', () => {
  gulp.watch('./src/**/*', ['build-server'], (e) => {
    console.log('File ' + e.path + ' was ' + e.type + ', rebuilding...')
  })
})

gulp.task('watch', ['watch-client', 'watch-server'])

gulp.task('lint', (done) => {
  let tasks = []

  glob('./app/**/*.js', (err, files) => {
    if(err) done(err)

    tasks.concat(files.map((entry) => {
      return eslint(entry)
        .pipe(source(entry))
        .pipe(eslint.format())
    }))
  })

  glob('./src/**/*.js', (err, files) => {
    if(err) done(err)

    tasks.concat(files.map((entry) => {
      return eslint(entry)
        .pipe(source(entry))
        .pipe(eslint.format())
    }))
  })

  es.merge(tasks).on('end', done)
})

gulp.task('open', () => {
  return shell('node_modules/.bin/electron-prebuilt . --enable-logging')
    .pipe(gulp.dest('run.log'))
})
