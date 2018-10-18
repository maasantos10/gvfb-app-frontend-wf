const gulp = require('gulp')
const util = require('gulp-util')
const sequence = require('run-sequence')

//gulp.task('default', function () { console.log('Hello Gulp!') });

require('./gulpTasks/app')
require('./gulpTasks/deps')
require('./gulpTasks/server')

// feito desta forma para que seja executado na sequencia abaixo justamente
// para não incorrer em erros tais como os arquivos estarem prontos e
// servidor ainda não.

gulp.task('default',  function () {
  if(util.env.production) {
    sequence('deps', 'app')
  } else {
    sequence('deps', 'app', 'server')
  }
})
