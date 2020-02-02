var gulp = require('gulp'),
  path = require('path'),
  zip = require('gulp-zip'),
  minimist = require('minimist'),
  moment = require('moment'),
  fs = require('fs');

var knownOptions = {
  string: 'packageName',
  string: 'packagePath',
  string: 'packageBuildId',
  string: 'packageVersionFilepath',
  default: {
    packageName: "Package.zip",
    packagePath: path.join(__dirname, '_package'),
    packageBuildId: 'None',
    packageVersionFilepath: 'version.txt'
  }
}

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('package', function () {

  var versionContent = "Package Time: " + moment().format() + "\n"
      + "Build ID: " + options.packageBuildId;

  fs.writeFileSync(options.packageVersionFilepath, versionContent);

  var packagePaths = ['**',
    '!**/_package/**',
    '!**/typings/**',
    '!typings',
    '!_package',
    '!gulpfile.js']

  //add exclusion patterns for all dev dependencies
  var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  var devDeps = packageJSON.devDependencies;

  for(var propName in devDeps)
  {
    var excludePattern1 = "!**/node_modules/" + propName + "/**";
    var excludePattern2 = "!**/node_modules/" + propName;
    packagePaths.push(excludePattern1);
    packagePaths.push(excludePattern2);
  }

  return gulp.src(packagePaths)
    .pipe(zip(options.packageName))
    .pipe(gulp.dest(options.packagePath));
});

gulp.task('default', gulp.series(
  'package'
));
