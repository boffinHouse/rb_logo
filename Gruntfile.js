(function() {
	'use strict';

	module.exports = function (grunt) {
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
					files: {
						'dist/css/styles.css': 'tmp/styles.scss'
					}
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
						src: ['sources/js/**/*.js', 'tests/**/*.js']
					}
				}
			},
			watch: {
				scss: {
					files: ['sources/sass/**/*.scss'],
					tasks: ['build']
				},
				assemble: {
					files: ['sources/assemble/**/*.hbs', 'component-helpers/assemble/**/*.hbs', 'sources/assemble/data/**/*.json'],
					tasks: ['assemble']
				},
				jshint: {
					files: ['sources/js/**/*.js', 'tests/**/*.js'],
					tasks: ['jshint']
				},
				svg: {
					files:['sources/img/**/*.{svg,png}'],
					tasks: ['svgmin', 'assemble']
				}
			},
			assemble: {
				options: {
					data: 'sources/assemble/data/**/*.{json,yml}',
					helpers: ['component-helpers/assemble/helper/*.js'],
					layoutdir: 'component-helpers/assemble/layouts/',
					partials: ['sources/assemble/**/*.hbs']
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
								'component-helpers/assemble/pages/**/*.hbs',
								'sources/assemble/pages/**/*.hbs'
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
					files: [
						{
							cwd: 'sources/img/logo',
							dest: 'tmp/svgmin/logo',
							expand: true,
							ext: '.svg',
							src: ['*.svg']
						}
					]
				},
				svgIcons: {
					files: [
						{
							cwd: 'sources/img/icons',
							dest: 'tmp/svgmin/icons',
							expand: true,
							ext: '.svg',
							src: ['*.svg']
						}
					]
				}
			},
			svgstore: {
				options: {
					prefix : 'icon-',
					formatting : {
						indent_char: '	',
						indent_size : 1
					},
					svg: {
						style: "display: none;"
					}
				},
				dev: {
					files: {
						'dist/img/icons/icon-sprite.svg': ['tmp/svgmin/icons/*.svg']
					}
				}
			}
		});

		grunt.registerTask( 'css', ['generate-tmp-styles-scss', 'sass', 'autoprefixer']);
		grunt.registerTask('build', [ 'clean:dist', 'copy:js', 'svgmin', 'css',  'assemble', 'clean:tmp']);
		grunt.registerTask('default', ['jshint', 'build', 'watch']);

		grunt.registerTask( 'generate-tmp-styles-scss', 'Generate styles tmp file', function() {
			var resultContent = grunt.file.read( 'component-helpers/sass/styles_config.scss' );

			//get rid of ../../-prefix, since libsass does not support them in @import-statements+includePaths option
			resultContent = resultContent.replace( /\"\.\.\/\.\.\//g, '"' );

			var importMatches = resultContent.match( /^@import.+\*.*$/mg );


			if ( importMatches ) {
				importMatches.forEach( function(initialMatch) {
					// remove all " or '
					var match = initialMatch.replace( /["']/g, '' );
					// remove the preceeding @import
					match = match.replace( /^@import/g, '' );
					// lets get rid of the final ;
					match = match.replace( /;$/g, '' );
					// remove all whitespaces
					match = match.trim();

					// get all files, which match this pattern
					var files = grunt.file.expand(
						{
							'cwd': 'node_modules/rb_layout_defaults/sources/',
							'filter': 'isFile'
						},
						match
					);

					var replaceContent = [];

					files.forEach( function(matchedFile) {
						replaceContent.push( '@import "node_modules/rb_layout_defaults/sources/'  + matchedFile + '";' );
					} );

					resultContent = resultContent.replace( initialMatch, replaceContent.join( "\n" ) );
				} );
			}
			grunt.file.write( 'tmp/styles.scss', resultContent );
		} );
	};
})();
