module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      scrollify: {
        files: {
          'jquery.scrollify.min.js': 'jquery.scrollify.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};
