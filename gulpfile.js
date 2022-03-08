var gulp = require("gulp");
var babel = require("gulp-babel");
var minify = require('gulp-minify');

gulp.task("default", function () {
  return gulp.src("main.js")
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(minify())
    .pipe(gulp.dest("dist"));
});