module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          paths: ['css'],
          compress: false
        },
        files: {
          'client/css/_style.css' : 'client/css/_style.less'
        }
      },
      production: {
        options: {
          paths: ['css'],
          compress: true
        },
        files: {
          'client/css/_style.css' : 'client/css/_style.less'
        }
      }
    },

    html2js: {
      // Application Templates
      main: {
        src: [
          'client/views/**/*.html',
          'client/views/*.html'
        ],
        dest: 'client/js/src/_templates.js'
      }
    },

    concat: {
      appjs : {
        src: [
          'client/js/src/**/*.js'
        ],
        dest: 'client/js/app.dev.js'
      }
    },

    uglify: {
      beautify : {
        quote_keys: true
      },
      production: {
        files: {
          'client/js/app.min.js' : ['client/js/app.dev.js']
        }
      }
    },

    targethtml: {
      development: {
        files: {
          'client/index.ejs' : 'client/index.template.html'
        }
      },
      production: {
        files: {
          'client/index.ejs' : 'client/index.template.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('production', [
    'less:production', 'html2js', 'concat', 'uglify:production', 'targethtml:production'
    ]);
  grunt.registerTask('development', [
    'less:development', 'html2js', 'concat', 'targethtml:development'
    ]);
  grunt.registerTask('default', ['development']);
};