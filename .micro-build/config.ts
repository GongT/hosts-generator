import {MicroBuildConfig, EPlugins} from "./x/microbuild-config";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'host-generator';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(`${projectName}.${JsonEnv.baseDomainName}`);

build.isInChina(JsonEnv.gfw.isInChina);
build.npmInstallSource(JsonEnv.gfw.npmRegistry.upstream);
build.install('./package.json');

// build.forwardPort(80, 'tcp').publish(8080);

build.startupCommand('dist/boot.js');
build.shellCommand('/usr/local/bin/node');
// build.stopCommand('stop.sh');

build.addPlugin(EPlugins.typescript, {
	source: 'src',
	target: 'dist',
});

build.environmentVariable('DEBUG', 'ip:*,host:*');

build.volume('/etc', './host-etc');
build.volume('/var/run', './host-var-run');

// build.prependDockerFile('/path/to/docker/file');
// build.appendDockerFile('/path/to/docker/file');

process.env.DEBUG += ',ip:*';
try {
	require(require('path').resolve(__dirname, '../who_am_i/index'));
} catch (e) {
	console.error(e);
	process.exit(1);
}
