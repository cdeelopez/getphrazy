var gulp = require("gulp");
var babel = require("gulp-babel");
var minify = require('gulp-minify');
var replace = require('gulp-replace');

gulp.task("minify", function () {
  return gulp.src("js/main.js")
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(minify())
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function(){
  gulp.watch('js/main.js', gulp.series('minify', 'cache-bust-css-js'));
  gulp.watch('style.css', gulp.series('cache-bust-css-js'));
});

gulp.task("cache-bust-css-js", function() {
  var cbString = new Date().getTime();
  return gulp
    .src(["index.html"])
    .pipe(
      replace(/ts=\d+/g, function() {
        return "ts=" + cbString;
      })
    )
    .pipe(gulp.dest("."));
});

gulp.task('default', gulp.series('minify', 'watch'));