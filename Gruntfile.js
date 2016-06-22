module.exports = function (grunt) {

    "use strict";

    // grunt plugins
    require("load-grunt-tasks")(grunt);
    grunt.loadTasks("build/tasks");


    var coreFiles = [
	];

    var uiFiles = coreFiles.map(function (file) {
        return "ui/" + file;
    }).concat(expandFiles("ui/*.js").filter(function (file) {
        return coreFiles.indexOf(file.substring(3)) === -1;
    }));


    function expandFiles(files) {
        return grunt.util._.pluck(grunt.file.expandMapping(files), "src").map(function (values) {
            return values[0];
        });
    }

    function stripDirectory(file) {
        return file.replace(/.+\/(.+?)>?$/, "$1");
    }

    function createBanner(files) {
        // strip folders
        var fileNames = files && files.map(stripDirectory);
        return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
            "<%= grunt.template.today('isoDate') %>\n" +
            "<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
            (files ? "* Includes: " + fileNames.join(", ") + "\n" : "") +
            "* Copyright <%= pkg.author.name %>;" +
            " Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";
    }


    grunt.initConfig({

        pkg: grunt.file.readJSON( "package.json" ),

        jshint: {
            options: {
                jshintrc: true
            },
            all: [
                "ui/*.js",
                "Gruntfile.js",
                "build/**/*.js",
                "tests/unit/**/*.js",
                "tests/lib/**/*.js",
                "demos/**/*.js"
            ]
        },
        csslint: {
            base_theme: {
                src: "themes/base/*.css",
                options: {
                    csslintrc: ".csslintrc"
                }
            }
        },

        // Does not seem to work.
        jscs: {
            ui: {
                options: {
                    config: true
                },
                files: {
                    src: ["demos/**/*.js", "build/**/*.js", "ui/**/*.js"]
                }
            },
            tests: {
                options: {
                    config: true,
                    maximumLineLength: null
                },
                files: {
                    src: ["tests/**/*.js"]
                }
            }
        },

        requirejs: {
            js: {
                options: {
                    baseUrl: "./",
                    paths: {
                        // jquery: "./external/jquery/jquery",
                        // external: "./external/"
                    },
                    preserveLicenseComments: false,
                    optimize: "none",
                    findNestedDependencies: true,
                    skipModuleInsertion: true,
                    //exclude: ["jquery"],
                    include: expandFiles(["ui/**/*.js", "!ui/core.js", "!ui/i18n/*"]),
                    out: "dist/jquery-lab-widgets.js",
                    wrap: {
                        start: createBanner(uiFiles)
                    }
                }
            }
        }


    });


    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", ["asciilint", "jshint", "csslint"]);
    grunt.registerTask("sizer", ["requirejs:js"]);
};