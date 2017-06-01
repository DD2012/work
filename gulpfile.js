var gulp = require('gulp');
var connect = require('gulp-connect');
var spawn = require('cross-spawn');
var webserver = require('gulp-webserver')
var sass = require('gulp-sass');

gulp.task('watch', function() {
    gulp.watch(['./*.html', './*/*.js', './config/*.js'], ['html']);
    gulp.watch('./pages/**/*.scss',['sass']);

});


gulp.task('sass',function () {
    gulp.src('./pages/**/*.scss')
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(gulp.dest('./pages/'));
});



gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(connect.reload());
});
// gulp.task('webserver', function() {
//     console.log("服务启动完毕");
//     connect.server({
//         livereload: true,
//         root: './'
//     });
//     var args = ['run', 'proxy'].filter(function(e) {
//         return e;
//     });
//     var proc = spawn('npm', args, {
//         stdio: 'inherit'
//     });
//     proc.on('close', function(code) {
//         if (code !== 0) {
//             console.error('`npm ' + args.join(' ') + '` failed');
//             return;
//         }
//
//     });
//
// });

gulp.task('webserver', function() {
    gulp.src( './' ) // 服务器目录（./代表根目录）
            .pipe(webserver({ // 运行gulp-webserver
                livereload: true, // 启用LiveReload
                open: true // 服务器启动时自动打开网页
            }));

    var args = ['run', 'proxy'].filter(function(e) {
        return e;
    });
    var proc = spawn('npm', args, {
        stdio: 'inherit'
    });
    proc.on('close', function(code) {
        if (code !== 0) {
            console.error('`npm ' + args.join(' ') + '` failed');
            return;
        }

    });
});


gulp.task('default', ['webserver', 'watch','sass']);


