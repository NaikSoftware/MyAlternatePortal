module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                compress: true
            },
            compress: {
                files: {
                    'public/js/main.min.js': ['public/js/jquery-2.1.4.min.js', 'public/js/bootstrap.min.js', 'public/js/api.js', 'public/js/schedule_adapter.js', 'public/js/main.js'],
                    'public/js/index.min.js': ['public/js/moment.min.js', 'public/js/schedule_controller.js']
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'public/css/main.min.css': ['public/css/bootstrap.min.css', 'public/css/main.css', 'public/css/schedule.css']
                }
            }
        },
        processhtml: {
            html_edit: {
                files: {
                    'templates/index.html': 'templates/index.html',
                    'templates/header.html': 'templates/header.html'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('production', ['uglify', 'cssmin', 'processhtml']);
}