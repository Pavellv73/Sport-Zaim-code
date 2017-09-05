'use strict';

/*
 npm install colors
 npm install gulp
 npm install gulp-concat
 npm install gulp-pug
 npm install gulp-stylus
 npm install gulp-uglify
 npm install gulp-watch
 npm install gulp-rename
 npm install gulp-string-replace
 */

var gulp = require('gulp');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var colors = require('colors');
var rename = require('gulp-rename');
var replace = require('gulp-string-replace');
const autoprefixer = require('gulp-autoprefixer');

var paths = {
	dest: "./bin/",
	styl: [
		"./sources/styl/reset.styl",
		"./sources/styl/fonts.styl",
		"./sources/styl/*.styl",
		"!./sources/styl/_*.styl",
		"!./sources/styl/section*.styl",
		"!./sources/styl/grids.styl"
	],
	pug: [
		"./sources/pug/*.pug",
		"!./sources/pug/_*.pug",
		"!./sources/pug/block*.pug",
		"!./sources/pug/footer.pug",
		"!./sources/pug/header.pug",
		"!./sources/pug/head.pug"
	],
	js: [
		"./sources/js/*.js"
	],
	img: [
		"./sources/img/*.*"
	]
};

gulp.task('pug', function() {
	gulp.src(paths.pug)
		.pipe(pug({
			pretty: true
		}))
		.on("error", errorReport)
		.pipe(replace('<php>','<?php '))
		.pipe(replace('</php>',' ?>'))
		.pipe(rename({
			extname: ".php"
		}))
		.on("error", errorReport)
		.pipe(gulp.dest(paths.dest+ ''))
});

gulp.task('stylus', function(){
	gulp.src(paths.styl)
		.pipe(concat('style.styl'))
		.pipe(stylus({
			'compress': false,
			'include css': true
		}))
		.pipe(autoprefixer())
		.on("error", errorReport)
		.pipe(gulp.dest(paths.dest+ '/'));
});

gulp.task('js', function(){
	gulp.src(paths.js)
	.pipe(concat('script.js'))
	.pipe(uglify())
		.on("error", errorReport)
		.pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('img', function(){
	gulp.src(paths.img)
		.pipe(gulp.dest(paths.dest + '/img'));
});

gulp.task('watch', function () {
	gulp.watch( paths.styl[2], ['stylus'] );
	gulp.watch( paths.js, ['js'] );
	gulp.watch( paths.pug[0], ['pug'] );
	gulp.watch( paths.img, ['img'] );
});

gulp.task('build', [
	'pug', 'stylus', 'js', 'watch', "img"
]);

gulp.task('default',['build']);

function errorReport(err){
	console.log("\n");
	console.log("  ERROR".red, "("+ err.plugin +")");
	console.log("");
	console.log(("  Line #" + (err.lineno?err.lineno:err.line)).white);
	console.log(("  Column #" + err.column).white);
	console.log("");
	console.log("  " + err.message.cyan );
	console.log("\n");
}
