const { spawn } = require("child_process"),
    eslint = require("gulp-eslint"),
    git = require("gulp-git"),
    gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    os = require("os"),
    projPackage = require("./package"),
    runSequence = require("run-sequence");

/**
 * Run code through a linter.  If there is an error fail
 */
gulp.task("eslint", () => {
    return gulp.src([ "lib/**" ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("test", () => {
    return gulp.src("./tests/**/*.js", { read: false }).pipe(mocha());
});

gulp.task("tag", (done) => {
    git.tag(projPackage.version, null, (tagErr) => {
        if (tagErr) {
            done(tagErr);
        } else {
            git.push("origin", "master", { args: " --tags" }, (pushErr) => {
                done(pushErr);
            });
        }
    });
});

gulp.task("npm", (done) => {
    let cmd = null;
    if (os.platform() === "win32") {
        cmd = "npm.cmd";
    } else {
        cmd = "npm";
    }
    spawn(cmd, [ "publish" ], { stdio: "inherit" }).on("close", done);
});

gulp.task("publish", (done) => {
    runSequence(
        "eslint",
        "test",
        "tag",
        "npm",
        done
    );
});
