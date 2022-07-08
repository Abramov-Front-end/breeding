const gulp = require('gulp')
const sass = require('gulp-sass')
const clear = require('gulp-minify-css')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')

const publicCss = 'docs/css'
const srcSCSS = 'src/scss/**/*.scss'

//Compile styles
const compileStyles = () => (
    gulp.src( srcSCSS )
        .pipe( sourcemaps.init() )
        .pipe( sass().on('error', sass.logError) )
        .pipe( postcss([ autoprefixer() ]) )
        .pipe( clear({
            processImport: false
        }))
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest(publicCss) )
)

//Gulp tasks
gulp.task('compile-css', compileStyles)

//Watcher
gulp.task('watch', done => {
    gulp.watch(srcSCSS, gulp.series('compile-css'))
    done();
})


