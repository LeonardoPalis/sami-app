var dest = './www',
  src = './src',
  mui = './node_modules/material-ui/src';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + '/**'
    ]
  },
  markup: {
    src: src + "/www/*.html",
    dest: dest
  },
  static: {
    css: {
      src: src + "/www/static/css/**",
      dest: dest
    },
    fonts: {
      src: src + "/www/static/fonts/**",
      dest: dest + "/fonts"
    },
    img: {
      src: src + "/www/static/img/**",
      dest: dest + "/img"
    },
    js: {
      entries: src + "/www/static/js/**",
      dest: dest,
      outputName: 'bootstrap.js'
    },
    materialIcons: {
      src: src + "/www/static/material-icons/**",
      dest: dest + "/material-icons"
    }
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/app/index.js',
      dest: dest,
      outputName: 'app.js'
    }, {
      entries: src + "/www/static/js/bootstrap.js",
      dest: dest,
      outputName: 'bootstrap.js'
    }],
    extensions: ['.js'],
  }
};
