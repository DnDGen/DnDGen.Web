module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        msbuild: {
            src: ['DNDGenSite/DNDGenSite.csproj'],
            options: {
                projectConfiguration: 'Debug',
                targets: ['Build'],
                stdout: true
            }
        },
        iisexpress: {
            server: {
                options: {
                    port: 9266,
                    path: 'DNDGenSite'
                }
            }
        },
        protractor: {
            options: { keepAlive: false },
            all: { configFile: "protractor.all.config.js" },
            layout: { configFile: "protractor.layout.config.js" },
            dice: { configFile: "protractor.dice.config.js" },
            treasure: { configFile: "protractor.treasure.config.js" },
            character: { configFile: "protractor.character.config.js" },
            encounter: { configFile: "protractor.encounter.config.js" },
            dungeon: { configFile: "protractor.dungeon.config.js" }
        }
    });

    grunt.loadNpmTasks('grunt-msbuild');
    grunt.loadNpmTasks('grunt-iisexpress');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.registerTask('e2e-all', ['msbuild', 'iisexpress', 'protractor:all']);
    grunt.registerTask('e2e-layout', ['msbuild', 'iisexpress', 'protractor:layout']);
    grunt.registerTask('e2e-dice', ['msbuild', 'iisexpress', 'protractor:dice']);
    grunt.registerTask('e2e-treasure', ['msbuild', 'iisexpress', 'protractor:treasure']);
    grunt.registerTask('e2e-character', ['msbuild', 'iisexpress', 'protractor:character']);
    grunt.registerTask('e2e-encounter', ['msbuild', 'iisexpress', 'protractor:encounter']);
    grunt.registerTask('e2e-dungeon', ['msbuild', 'iisexpress', 'protractor:dungeon']);
};