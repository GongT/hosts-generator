/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'hosts-generator';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(`${projectName}.${JsonEnv.baseDomainName}`);

build.isInChina(JsonEnv.gfw.isInChina);
build.forceLocalDns(false, true);
build.npmInstallSource(JsonEnv.gfw.npmRegistry.upstream);
build.npmInstall('./package.json', ['git', 'python', 'g++', 'make']);

build.systemd({
	type: 'notify',
//	watchdog: 5,
});
build.startupCommand('dist/entry.js');
build.shellCommand('/usr/local/bin/node');

build.addPlugin(EPlugins.jenv);
build.addPlugin(EPlugins.typescript, {
	source: 'src',
	target: 'dist',
});

build.environmentVariable('DEBUG', 'ip:*,host:*,docker');

build.volume('/var/run', './host-var-run');

build.dependService('microservice-dnsmasq', 'https://github.com/GongT/microservice-dnsmasq.git');
build.dockerRunArgument('--volumes-from=microservice-dnsmasq');

build.noDataCopy(true);

build.onConfig(() => {
	process.env.DEBUG += ',ip:*';
	try {
		const resolve = require('path').resolve;
		const fs = require('fs');
		
		const save = resolve(__dirname, './src/config.ts');
		const whoAmI = require(resolve(__dirname, './who_am_i/who_am_i'));
		const serverMap = require(resolve(__dirname, './who_am_i/get_server_ip'));
		
		fs.writeFileSync(save, `
export const whoAmI = ${JSON.stringify(whoAmI, null, 4)};
export const serverMap = ${JSON.stringify(serverMap, null, 4)};
`, 'utf-8');
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
});
