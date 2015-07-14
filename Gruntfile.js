module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /* IMAGES */
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7 // `optimizationLevel` is only applied to PNG files (not JPG)
                },
                files: [{
                    expand: true,
                    cwd: './src/images/',
                    // NOTE: We ignore 'launcher icon' as this is handled by grunt 'responsive_images'.
                    //       We also ignore 'svg-fallbacks' as they are inline base64.
                    src: ['**/*.png', '!**/launcher-icon/**', '!**/svg-fallbacks/**'],
                    dest: './dist/images/',
                    ext: '.png'
                }]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: './src/images/',
                    // NOTE: We ignore 'launcher icon' as this is handled by grunt 'responsive_images'
                    //       We also ignore 'svg-fallbacks' as they are inline base64.
                    src: ['**/*.jpg', '!**/launcher-icon/**', '!**/svg-fallbacks/**'],
                    dest: './dist/images/',
                    ext: '.jpg'
                }]
            }
        },

        responsive_images: {
            icons: {
                options: {
                    sizes: [{
                        width: 36,
                        height: 36
                    }, {
                        width: 48,
                        height: 48
                    }, {
                        /*name: 'large',*/
                        width: 60,
                        height: 60
                            /*suffix: '_x2',
                            quality: 60*/
                    }, {
                        width: 72,
                        height: 72
                    }, {
                        width: 76,
                        height: 76
                    }, {
                        width: 96,
                        height: 96
                    }, {
                        width: 120,
                        height: 120
                    }, {
                        width: 144,
                        height: 144
                    }, {
                        width: 152,
                        height: 152
                    }, {
                        width: 180,
                        height: 180
                    }, {
                        width: 192,
                        height: 192
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'src/images/launcher-icon/',
                    src: ['**/*.png'],
                    dest: './dist/images/launcher-icons/'
                }]
            }
        },

        /* VALIDATION */
        jshint: {
            dist: {
                files: {
                    src: './dist/js/*.js'
                },
                options: {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    sub: true,
                    undef: true,
                    boss: true,
                    eqnull: true,
                    browser: true,
                    smarttabs: true,
                    globals: {}
                }
            },
            docs: {
                files: {
                    src: ['./temp/js/*.js']
                },
                options: {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    sub: true,
                    undef: true,
                    boss: true,
                    eqnull: true,
                    browser: true,
                    smarttabs: true,
                    globals: {}
                }
            }
        },

        /* CONCATENATION and MINIFICATION */
        concat: {
            dist: {
                src: ['src/js/third-party/request-animation-frame.js', 'src/js/param.js', 'src/js/utils.js', 'src/js/button.js', 'src/js/tray-reveal.js', 'src/js/slide-panel.js', 'src/js/setup-dialog.js'],
                dest: './dist/js/<%= pkg.name %>' + '.min.js'
            },
            docs: {
                src: ['src/js/third-party/request-animation-frame.js', 'src/js/param.js', 'src/js/utils.js', 'src/js/button.js', 'src/js/tray-reveal.js', 'src/js/slide-panel.js', 'src/js/setup-dialog.js'],
                dest: './temp/js/<%= pkg.name %>' + '.min.js'
            },
            css: {
                src: ['src/css/reset.css', 'src/css/main.css', 'src/css/view-options-dialog.css'],
                dest: './dist/css/style.min.css'
            }
        },

        uglify: {
            my_target: {
                files: {
                    './dist/js/<%= pkg.name %>.min.js': './dist/js/<%= pkg.name %>.min.js' // Destination : Source
                }
            }
        },

        cssmin: {
            my_target: {
                src: './dist/css/style.min.css',
                dest: './dist/css/style.min.css'
            }
        },

        /* HTML */
        processhtml: {
            options: {
                data: {
                    message: 'Hello world!'
                }
            },
            dist: {
                files: {
                    './dist/index.html': ['./src/index.html'] //destination : source  !
                }
            }
        },

        replace: {
            dist: {
                src: ['./dist/index.html'],
                overwrite: true,
                replacements: [{
                    from: /<html([^>]+)>/,
                    to: '<html$1 manifest="manifest.appcache">'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    './dist/index.html': './dist/index.html' //destination : source  !
                }
            }
        },

        /* APPCACHE */
        appcache: {
            options: {
                basePath: './dist'
            },
            all: {
                dest: './dist/manifest.appcache',
                //cache: './dist/**/*',
                cache : {
                    patterns: [
                        './dist/**/*', 
                        '!./dist/images/launcher-icons/*', // DO NOT include launcher icons.
                        '!./dist/manifest.json'
                    ]
                },
                network: '*'
            }
        },

        /* COPY */
        copy: {
            chromeManifest: {
                cwd: './src/',
                expand: true,
                src: ['manifest.json'],
                dest: 'dist/',
                flatten: false
            },
        },

        /* DOCUMENTATION */
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: 'none',
                options: {
                    paths: './src/js/',
                    themedir: './tools/yuidoc_theme/friendly-theme',
                    outdir: './docs'
                }
            }
        },

        /** LICENSING **/
        usebanner: {
            js: {
                options: {
                    banner: [
                        '/**',
                        '<%= grunt.file.read("licenses/MIT.txt") %>',
                        '<%= grunt.file.read("licenses/requestanimationframe.txt") %>',
                        '*/'
                    ].join('\n\n---\n\n')
                },
                files: {
                    src: ['./dist/js/<%= pkg.name %>.min.js']
                }
            },

            css: {
                options: {
                    banner: '/** \n<%= grunt.file.read("licenses/MIT.txt") %>\n*/'
                },
                files: {
                    src: ['./dist/css/style.min.css']
                }
            }
        },

        /** CLEANUP **/
        clean: ['./temp']


    });

    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-appcache');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');


    // Default
    grunt.registerTask('default', [
        'responsive_images:icons',
        'concat:dist',
        'jshint:dist',
        'concat:css',
        'uglify',
        'cssmin',
        'processhtml',
        'replace',
        'imagemin',
        'appcache',
        'usebanner:js',
        'usebanner:css',
        'copy:chromeManifest',
        'htmlmin:dist'
    ]);

    // Documentation
    grunt.registerTask('docs', [
        'concat:docs',
        'jshint:docs',
        'yuidoc',
        'clean'
    ]);

};