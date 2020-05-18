const gulp = require("gulp");
const config = require("./env.paths.json");
const env = process.env.NODE_ENV;

// плагины галпа отдельно подключать не нужно,
// используем в пайпе как $gp.имяПлагина (без приставки gulp-)
const $gp = require("gulp-load-plugins")();

const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const del = require("del");



// переносим шрифты
gulp.task("fonts", () => {
  return gulp
    .src(`${config.SRC_DIR}/fonts/**`)
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/fonts/`));
});

// переносим pdf
gulp.task("documents", () => {
  return gulp
    .src(`${config.SRC_DIR}/documents/**`)
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/documents/`));
});

// переносим видео
gulp.task("video", () => {
  return gulp
    .src(`${config.SRC_DIR}/video/**`)
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/video/`));
});

// переносим картинки
gulp.task("images", () => {
  return gulp
    .src([
      `${config.SRC_DIR}/images/**/*.*`,
      `!${config.SRC_DIR}/images/icons/*.*`
    ])
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/images/`));
});

// очистка
gulp.task("clean", () => {
  return del(config.ROOT_PATH);
});

//рендерим странички
gulp.task("pug", () => {
  return gulp
    .src(`${config.VIEWS_DIR}/pages/*.pug`)
    .pipe($gp.plumber())
    .pipe($gp.pug())
    .pipe(gulp.dest(`${config.DIST_DIR}`))
    .pipe(reload({ stream: true }));
});

// стили
gulp.task("styles", () => {
  return gulp
    .src(`${config.SRC_DIR}/styles/main.scss`)
    .pipe($gp.sourcemaps.init())
    .pipe($gp.plumber())
    .pipe($gp.postcss(require("./postcss.config")))
    .pipe($gp.rename("main.min.css"))
    .pipe($gp.if(env === "development", $gp.sourcemaps.write()))
    .pipe(gulp.dest(`${config.DIST_DIR}`))
    .pipe(reload({ stream: true }));
});

// переносим скрипты
gulp.task("local_scripts", () => {
  return gulp
    .src([
      `${config.SRC_DIR}/scripts/modules/*.*`
    ])
    .pipe(gulp.dest(`${config.DIST_DIR}`));
});

// dev сервер + livereload (встроенный)
gulp.task("server", () => {
  browserSync.init({
    server: {
      baseDir: `${config.DIST_DIR}`
    },
    open: true
  });
});


// галповский вотчер
gulp.task("watch", () => {
  gulp.watch(`${config.SRC_DIR}/fonts/*`, gulp.series("fonts"));
  gulp.watch(`${config.SRC_DIR}/documents/*`, gulp.series("documents"));
  gulp.watch(`${config.SRC_DIR}/video/*`, gulp.series("video"));
  gulp.watch(`${config.SRC_DIR}/images/**/*.*`, gulp.series("images"));
  gulp.watch(`${config.VIEWS_DIR}/**/*.pug`, gulp.series("pug"));
  gulp.watch(`${config.SRC_DIR}/styles/**/*.scss`, gulp.series("styles"));
});

// GULP:DEV
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel(
      "fonts",
      "documents",
      "video",
      "images",
      "pug",
      "styles",
      "local_scripts"
    ),
    gulp.parallel("watch", "server")
  )
);

// GULP:build
gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "fonts", 
      "documents", 
      "video",
      "images",
      "pug",
      "styles",  
      "local_scripts", 
     
      )
  )
);
