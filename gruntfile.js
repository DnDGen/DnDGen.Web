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
            layout: { configFile: "Tests/Integration/Views/protractor.layout.config.js" },
            dice: { configFile: "Tests/Integration/Views/protractor.dice.config.js" },
            treasure: { configFile: "Tests/Integration/Views/protractor.treasure.config.js" },
            character: { configFile: "Tests/Integration/Views/protractor.character.config.js" },
            encounter: { configFile: "Tests/Integration/Views/protractor.encounter.config.js" },
            dungeon: { configFile: "Tests/Integration/Views/protractor.dungeon.config.js" },
            all: { configFile: "Tests/Integration/Views/protractor.all.config.js" },
            live: { configFile: "Tests/Integration/Views/protractor.live.config.js" },
            error: { configFile: "Tests/Integration/Views/protractor.error.config.js" }
        }
    });

    grunt.loadNpmTasks('grunt-msbuild');
    grunt.loadNpmTasks('grunt-iisexpress');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.registerTask('e2e-layout', ['msbuild', 'iisexpress', 'protractor:layout']);
    grunt.registerTask('e2e-dice', ['msbuild', 'iisexpress', 'protractor:dice']);
    grunt.registerTask('e2e-treasure', ['msbuild', 'iisexpress', 'protractor:treasure']);
    grunt.registerTask('e2e-character', ['msbuild', 'iisexpress', 'protractor:character']);
    grunt.registerTask('e2e-encounter', ['msbuild', 'iisexpress', 'protractor:encounter']);
    grunt.registerTask('e2e-dungeon', ['msbuild', 'iisexpress', 'protractor:dungeon']);
    grunt.registerTask('e2e-all', ['msbuild', 'iisexpress', 'protractor:all']);
    grunt.registerTask('e2e-live', ['protractor:live']);
    grunt.registerTask('e2e-error', ['msbuild', 'iisexpress', 'protractor:error']);
};