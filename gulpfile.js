var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
 
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function() {
  return gulp.src(['./assets/scss/**/*.scss'])
    .pipe( 
    	sass({
	      compass: true, // ใช้ Compass 
	      style: 'compressed', // เลือก output แบบ compressed
    	})
    ).on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest('./assets/css')) // เก็บไฟล์ css ไว้ที่โฟลเดอร์ css
});

gulp.task('default', ['sass', 'browser-sync'], function() {

  gulp.watch(['./**/*.html'], browserSync.reload);
  gulp.watch(['./assets/css/**/*.css'], browserSync.reload);
  gulp.watch(['./assets/js/**/*.js'], browserSync.reload);

  gulp.watch("./assets/scss/**/*.scss", ['sass']);
});