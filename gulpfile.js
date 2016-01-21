var gulp = require('gulp');
var del = require('del');
var q = require('q');
var console = require('better-console');
var nodemon = require('nodemon');
var concat = require('gulp-concat');
var less = require('gulp-less');
var open = require('gulp-open');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var runSequence = require('run-sequence');
var gnf = require('gulp-npm-files');
var zip = require('gulp-zip');
var jscs = require('gulp-jscs');
var prompt = require('gulp-prompt');

var paths = {
	vendorScript  :[
		"node_modules/angular/angular.js",
		"node_modules/angular-route/angular-route.js",
		"node_modules/angular-resource/angular-resource.js",
		"node_modules/angular-aria/angular-aria.js",
		"node_modules/angular-sanitize/angular-sanitize.js",
		"node_modules/angular-animate/angular-animate.js",
		"node_modules/angular-material/angular-material.min.js",
		"node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js",
		"node_modules/ng-lodash/build/ng-lodash.min.js",
		"node_modules/angular-translate/dist/angular-translate.min.js",
		"node_modules/angular-cookies/angular-cookies.min.js",
		"node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
		"node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local.min.js",
		"node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js"
	],
	appScript     :['src/client/app.js','src/client/view/**/*.js'],
	styles        :['src/client/public/less/app.less'],
	//copy resources with preserve path
	copyIndexFIle :['src/client/index.html'],
	//copy resources without preserve path to a different location
	move          :['src/client/public/fonts/*.*',
		'src/client/public/image/*.*',
		'src/client/public/bundle/*.*'],
	json          :['src/client/view/property/*.json'],
	//configJSON    : ['config/*.*'],
	templates     :['src/client/view/**/*.html'],
	clean         :['build/*','dist/*','!build/server/server.js'],
	lessStyles    :['src/client/public/less/*.less'],
	copyServerCode:['src/server/**'],
	preBuild      :['package.json','Dockerfile'],
	webUrl        :'http://localhost:3000'
};

function handleError(err) {
	this.emit('end');
};
//Task to copy resources as it is
gulp.task('prebuild',function () {
	var def = q.defer();
	gulp.src(paths.preBuild,{
		base:'./'
	}).pipe(gulp.dest('build'))
		.on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to Clean the build directory
gulp.task('clean',function () {
	return del.sync(paths.clean);
});

gulp.task('copyNpmDependenciesOnly',function () {
	gulp.src(gnf(),{base:'./'}).pipe(gulp.dest('./build'));
});

//Task to copy Node.js code as it is
gulp.task('copyServerCode',function () {
	console.log('copyServerCode started');
	var def = q.defer();
	gulp.src(paths.copyServerCode,{
		base:'src/'
	}).pipe(gulp.dest('build'))
		.on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to copy config directory as it is
/*gulp.task('configJSON', function () {
 var def = q.defer();
 gulp.src(paths.configJSON, {
 base: './'
 }).pipe(gulp.dest('build'))
 .on('end', function () {
 def.resolve();
 }).on('error', def.reject);
 return def.promise;
 });*/

//Task to copy resources as it is
gulp.task('config',function () {
	var def = q.defer();
	gulp.src(paths.json,{
		base:'src/client/view/property'
	}).pipe(gulp.dest('build/client'))
		.on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to copy resources as it is
gulp.task('move',function () {
	var def = q.defer();
	gulp.src(paths.move,{
		base:'src/client/public'
	}).pipe(gulp.dest('build/client'))
		.on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to copy resources as it is
gulp.task('copy',function () {
	var def = q.defer();
	gulp.src(paths.copyIndexFIle,{
		base:'src/'
	}).pipe(gulp.dest('build'))
		.on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to build template cache
gulp.task('template',function () {
	var def = q.defer();
	gulp.src(paths.templates)
		.pipe(templateCache({
			module      :'careApp',
			transformUrl:function (url) {
				return "/" + url;
			}
		}))
		.pipe(gulp.dest('build/client'))
		.on('end',function () {
			def.resolve();
		})
		.on('error',def.reject);
	return def.promise;
});

//Task to combine all the application javascript written by developer, JSCS integrated
gulp.task('appScript',function () {
	var def = q.defer();
	gulp.src(paths.appScript)
		//.pipe(jscs())
		//.pipe(jscs.reporter())
		.pipe(sourcemaps.init())
		.pipe(concat('app-script.js'))
		.pipe(gulp.dest('build/client'))
		.on('end',function () {
			def.resolve();
		})
		.on('error',def.reject);
	return def.promise;
});

//Task to combine all the javascript library from different vendors
gulp.task('vendorScript',function () {
	var def = q.defer();
	gulp.src(paths.vendorScript)
		.pipe(sourcemaps.init())
		.pipe(concat('vendor-script.js'))
		.pipe(gulp.dest('build/client')).on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task to compile Less files to generate CSS
gulp.task('less',function () {
	var def = q.defer();
	gulp.src(paths.styles)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(gulp.dest('build/client')).on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//Task For opening the index.html in a browser
gulp.task('open',function () {
	var def = q.defer();
	gulp.src('./build/client/index.html')
		.pipe(open({uri:'http://localhost:3000/'})).on('end',function () {
			def.resolve();
		}).on('error',def.reject);
	return def.promise;
});

//This is a build task
gulp.task("build",function () {
	var def = q.defer();

	var env = 'development';
	process.env.NODE_ENV = env;
	runSequence('clean',
		//Callback indicating build task completed
		function () {
			console.log("Gulp build task executed successfully");
			runSequence('copyServerCode','vendorScript','appScript',
				'less','template','copy',/*'configJSON',*/
				'move','config','prebuild'
			);
			def.resolve();
		});
	return def.promise;
});

//Task For creating Development server with Reload option
gulp.task('start',function () {
	return nodemon({
		script:'build/server/server.js',
		ext   :'js html less css json',
		delay :"2000ms",
		watch :['src/client/*','src/server/*']
	}).on('restart',function () {
		runSequence('copyServerCode','vendorScript','appScript',
			'less','template','copy',/*'configJSON',*/
			'move','config','prebuild'
		);
	});
});

//This is a default task which contains complete build process
gulp.task('default',['build'],function () {
	return runSequence('start');
});

//This is a default task which contains complete build process
gulp.task('zip',function () {
	return gulp.src(['build/**'],{base:'./build'})
		.pipe(zip('careapp.zip'))
		.pipe(gulp.dest('dist'))
});

gulp.task('dist',function () {
	var def = q.defer();
	runSequence('clean',
		'copyServerCode',
		//Callback indicating build task completed
		function () {
			console.log("Gulp build task executed successfully");
			runSequence('vendorScript','appScript',
				'less','template','copy',/*'configJSON',*/
				'move','config','prebuild',
				function () {
					runSequence('zip',function () {
						def.resolve();
					});
				}
			);
		});
	return def.promise;
});