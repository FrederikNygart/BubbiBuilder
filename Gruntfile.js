module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['public/'],
        browserify: {
            'public/bundle.js': ['client/scripts/game.js']
        },
        copy: {
            images: {
                src: 'images/**',
                dest: 'public/',
                cwd: 'client/',
                expand: true
            },
            sounds: {
                src: 'sounds/*',
                dest: 'public/',
                cwd: 'client/',
                expand: true
            },
            index: {
                src: 'index.html',
                dest: 'public/',
                cwd: 'client/',
                expand: true
            },
            css: {
                src: 'css/*',
                dest: 'public/',
                cwd: 'client/',
                expand: true
            }
        },
        express: {
            dev: {
                options: {
                    script: 'server/app.js'
                }
            }
        },
        watch: {
            clientScripts: {
                files: ['client/**/*.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false,
                }
            },
            clientHtml: {
                files: ['client/index.html'],
                tasks: ['copy:index']
            },
            clientImages: {
                files: ['client/images/**'],
                tasks: ['copy:images'],
                options: {
                    spawn: false,
                }
            },
            clientSounds: {
                files: ['client/sounds/**'],
                tasks: ['copy:sounds'],
                options: {
                    spawn: false,
                }
            },
            clientCss: {
                files: ['client/css/**'],
                tasks: ['copy:css'],
                options: {
                    spawn: false,
                }
            },
            express: {
                files: ['server/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        },
        serve: {

        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.registerTask('default', ['clean', 'browserify', 'copy', 'express', 'watch']);
};