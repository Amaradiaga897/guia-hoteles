'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')), 
    browserSync = require('browser-sync').create(),
    // Cambiamos la forma de importar 'del' para evitar el error de "not a function"
    { deleteSync } = require('del'), 
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

// Compilar SASS
gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream()); 
});

// Watch SASS
gulp.task('sass:watch', function() {
    gulp.watch('./css/*.scss', gulp.series('sass'));
});

// Servidor en vivo
gulp.task('browser-sync', function() {
    var files = ['./*.html', './css/*.css', './img/*.{png,jpg,jpeg,webp,gif}', './js/*.js'];
    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

// Tarea por defecto (Desarrollo)
gulp.task('default', gulp.parallel('browser-sync', 'sass:watch'));

// Limpiar carpeta dist - CORREGIDO
gulp.task('clean', function(done) {
    deleteSync(['dist']);
    done(); // Avisamos a Gulp que la tarea terminó
});

// Copiar fuentes (Bootstrap Icons)
gulp.task('copyfonts', function () {
    return gulp.src('./node_modules/bootstrap-icons/font/fonts/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./dist/fonts'));
});

// Optimizar imágenes
gulp.task('imagemin', function() {
    return gulp.src('./img/*.{png,jpg,jpeg,gif,webp}')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('dist/img'));
});

// Usemin (Preparar para producción)
gulp.task('usemin', function() {
    return gulp.src('./*.html')
        .pipe(flatmap(function(stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [function() { return htmlmin({collapseWhitespace: true}) }],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }));
        }))
        .pipe(gulp.dest('dist/'));
});

// Build final (Producción)
gulp.task('build', gulp.series('clean', 
    gulp.parallel('copyfonts', 'imagemin', 'usemin')));