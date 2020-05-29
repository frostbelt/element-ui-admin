/**
 * es2015
 */

const gulp = require('gulp');
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

/**
 * js
 */
gulp.task("js", function(){
  return gulp.src("dist/**/*.js")
    .pipe(babel({
      presets : [
        "env",
      ],
    }))
    // .pipe(uglify())
    .pipe(gulp.dest("output")); 
});
gulp.task("watchjs", function(){
  gulp.watch("dist/**/*.js", ['js']);
});

gulp.task("default", ["js", "watchjs"]);