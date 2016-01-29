module.exports = function(grunt) {


    var fs = require('fs');

    // Utility to load the different option files
    // based on their names
    function loadConfig(path) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {
            cwd: path
        }).forEach(function(option) {
            key = option.replace(/\.js$/, '');
            object[key] = require(path + option);
        });

        return object;
    };


    // Initial config
    // var config = {
    //     pkg: grunt.file.readJSON('package.json')
    // };


    // Load tasks from the tasks folder
    // grunt.loadTasks('tasks');

    // // Load all the tasks options in tasks/options base on the name:
    // // watch.js => watch{}
    // grunt.util._.extend(config, loadConfig('./tasks/options/'));

    // grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);


    grunt.loadTasks('tasks');


    var sassOptions = grunt.file.readJSON('sassOptions.json');

    var config = {
        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'expanded'
                },
                files: { // Dictionary of files
                    [sassOptions.dest + '/main.css']: [sassOptions.src + '/*.scss'],
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    [sassOptions.dest + '/main.min.css']: [sassOptions.src + '/*.scss'],
                }
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: [sassOptions.src + '/*.scss', sassOptions.src + '/includes/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                }
            }
        }
    };

    grunt.initConfig(config);


    grunt.registerTask('default', ['sass', 'cssmin', 'watch']);


    // grunt.loadNpmTasks('grunt-contrib-sass');

    // grunt.registerTask("your-task-name", "your description", function() {

    //     // read all subdirectories from your modules folder
    //     grunt.file.expand("./modules/*").forEach(function(dir) {

    //         // get the current concat config
    //         var concat = grunt.config.get('concat') || {};

    //         // set the config for this modulename-directory
    //         concat[dir] = {
    //             src: ['/modules/' + dir + '/js/*.js', '!/modules/' + dir + '/js/compiled.js'],
    //             dest: '/modules/' + dir + '/js/compiled.js'
    //         };

    //         // save the new concat configuration
    //         grunt.config.set('concat', concat);
    //     });
    //     // when finished run the concatinations
    //     grunt.task.run('concat');
    // });

    grunt.registerTask("compile-sass", "Compile SASS to directory", function(n) {

        var sassOptions = grunt.file.readJSON('sassOptions.json');

        // grunt.file.write(sassOptions.src + '/test.txt', 'testing');

        console.log('compile sass options ' + sassOptions.src);


        var sass = grunt.config.get('sass') || {};

        sass[sassOptions] = {
            src: sassOptions.src + '/*.scss',
            dest: sassOptions.dest + '/main.css'
        };

        grunt.config.set('sass', sass);

        grunt.task.run('sass');

    })


    grunt.registerTask('set_global', 'Set a global variable.', function(src, srcval, dest, destval) {
        global[src] = srcval;
        global[dest] = destval;

        var sassOptions = '{"src" : "' + srcval + '", "dest" : "' + destval + '" }';

        console.log(sassOptions);


        grunt.file.write('sassOptions.json', sassOptions);


        grunt.task.run('compile-sass');

    });





};
