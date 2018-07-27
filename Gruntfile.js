module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: './dist/result.txt',
                    quiet: false,
                    timeout: 10000,
                    clearRequireCache: false,
                    noFail: false
                },
                src: ['./test/*.js']
            }
        },
        browserify: {
            all: {
                options: {
                    browserifyOptions: {
                        standalone: 'Blockchain'
                    }
                },
                src: ['./index.js'],
                dest: './dist/index.js',
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    './dist/index.js': './dist/index.js'
                }
            }
        },
        uglify: {
            js: {
                src: ['./dist/index.js'],
                dest: './dist/index.min.js'
            }
        }

    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['mochaTest', 'browserify', 'babel', 'uglify']);
    grunt.registerTask('build', ['browserify', 'babel', 'uglify']);
    grunt.registerTask('test', ['mochaTest']);
};
