(function() {
	'use strict';

	module.exports = function (grunt) {
		grunt.task.loadNpmTasks('grunt-scssglobbing');
		grunt.task.loadNpmTasks('grunt-auto-install');
		grunt.task.loadNpmTasks('grunt-sass');
		grunt.task.loadNpmTasks('grunt-contrib-copy');
		grunt.task.loadNpmTasks('grunt-contrib-clean');
		grunt.task.loadNpmTasks('grunt-autoprefixer');
		grunt.task.loadNpmTasks('grunt-contrib-watch');
		grunt.task.loadNpmTasks('grunt-contrib-jshint');
		grunt.task.loadNpmTasks('assemble');
		grunt.task.loadNpmTasks('grunt-svgmin');
		grunt.task.loadNpmTasks('grunt-svgstore');

		grunt.initConfig({
			auto_install: {
				subdir: {
					options: {
						bower: 'false'
					}
				}
			},
			sass: {
				options: {
					outputStyle: 'nested',
					sourceMap: false
				},
				dist: {
					options: {
						outputStyle: 'nested',
						sourceMap: false
					},
					files: [
						{
							'dist/css/styles.css': 'component-helpers/sass/tmp_styles.scss'
						}
					]
				}
			},
			clean: {
				options: {
					force: true
				},
				dist: {
					files: [
						{
							src: ['dist']
						}
					]
				},
				tmp: {
					files: [
						{
							src: ['tmp']
						}
					]
				},
				scssglobbing: {
					files: [
						{
							src: ['component-helpers/sass/tmp_styles.scss']
						}
					]
				}
			},
			autoprefixer: {
				options: {
					browsers: ['last 2 versions']
				},
				dev: {
					options: {
						map: true
					},
					src: 'dist/css/*.css'
				}
			},
			jshint: {
				options: {
					jshintrc: true
				},
				js: {
					files: {
						src: ['sources/components/**/*.js', 'tests/**/*.js']
					}
				}
			},
			watch: {
				scss: {
					files: ['sources/components/**/*.scss', 'component-helpers/sass/**/*.scss'],
					tasks: ['build']
				},
				assemble: {
					files: ['sources/components/**/*.{json,hbs}', 'component-helpers/assemble/**/*.hbs'],
					tasks: ['svgmin','assemble']
				},
				jshint: {
					files: ['sources/components/**/*.js', 'tests/**/*.js'],
					tasks: ['jshint']
				},
				svg: {
					files:['sources/img/**/*.{svg,png}'],
					tasks: ['svgmin', 'assemble']
				}
			},
			assemble: {
				options: {
					data: 'sources/components/**/*.{json,yml}',
					helpers: ['component-helpers/assemble/helper/*.js'],
					layoutdir: 'component-helpers/assemble/layouts/',
					partials: ['sources/components/**/*.hbs']
				},
				dev: {
					options: {
						production: false
					},
					files: [
						{
							dest: 'dist',
							expand: true,
							flatten: true,
							src: [
								'component-helpers/assemble/pages/**/*.hbs'
							]
						}
					]
				}
			},
			copy: {
				js: {
					cwd: 'component-helpers/js/',
					dest: 'dist/js',
					expand: true,
					src: ['**/*.js']
				}
			},
			svgmin: {
				options: {
					plugins: [
						{ cleanupAttrs: true },
						{ cleanupEnableBackground: true },
						{ cleanupIDs: true },
						{ cleanupListOfValues: true },
						{ cleanupNumericValues: true },
						{ collapseGroups: true },
						{ convertColors: true },
						{ convertPathData: true },
						{ convertShapeToPath: true },
						{ convertStyleToAttrs: true },
						{ convertTransform: true },
						{ mergePaths: true },
						{ moveElemsAttrsToGroup: true },
						{ moveGroupAttrsToElems: true },
						{ removeComments: true },
						{ removeDesc: true },
						{ removeDoctype: true },
						{ removeEditorsNSData: true },
						{ removeEmptyAttrs: true },
						{ removeEmptyContainers: true },
						{ removeEmptyText: true },
						{ removeHiddenElems: true },
						{ removeMetadata: true },
						{ removeNonInheritableGroupAttrs: true },
						{ removeRasterImages: true },
						{ removeTitle: true },
						{ removeUnknownsAndDefaults: true },
						{ removeUnusedNS: true },
						{ removeUselessDefs: true },
						{ removeUselessStrokeAndFill: false },
						{ removeViewBox: false },
						{ removeXMLProcInst: false },
						{ sortAttrs: true },
						{ transformsWithOnePath: false }
					]
				},
				svgLogo: {
					options: {
						plugins: [
							{ removeXMLProcInst: true },
							{ removeTitle: true },
						]
					},
					files: {
						'tmp/svgmin/logo.svg': ['sources/img/logo/*.svg']
					},
				},
			},
			svgstore: {
				options: {
					formatting : {
						indent_char: '	',
						indent_size : 1
					}
				},
				svgLogo: {
					options: {
						prefix : 'page-',
						svg: {
							style: "display: none;"
						}
					},
					files: {
						'dist/img/logo.svg': ['tmp/svgmin/logo.svg']
					}
				}
			},
			scssglobbing: {
				main: {
					files: {
						src:"component-helpers/sass/__styles.scss"
					}
				}
			}
		});

		grunt.registerTask( 'css', ['scssglobbing', 'sass', 'autoprefixer', 'clean:scssglobbing']);
		grunt.registerTask( 'svg', ['svgmin', 'svgstore']);
		grunt.registerTask('build', [ 'auto_install', 'clean:dist', 'svg', 'css',  'assemble', 'clean:tmp']);
		grunt.registerTask('default', ['jshint', 'build', 'watch']);

	};
})();
