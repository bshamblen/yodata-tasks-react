module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            react: {
                files: ['react_components/*.jsx', 'react_components/*.js'],
                tasks: ['browserify']
            }
        },

        browserify: {
            options: {
                transform: [['babelify', {presets: ['es2015', 'react']}]]
            },
            client: {
                src: ['react_components/**/*.jsx'],
                dest: 'dist/js/bundle.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['browserify']);
};