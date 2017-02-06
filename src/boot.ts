///<reference path="./globals.d.ts"/>
import * as Debug from "debug";
import "source-map-support/register";
import "@gongt/jenv-data/global";
import {generateIdIpMap} from "./genterate/physical-id";
import {handleChange, connectDocker} from "./lib/docker";
import {detectUpstream} from "./genterate/detect-upstream";
import {runningDockerContainers} from "./genterate/docker-containers";
import {serviceNotOnCurrent} from "./genterate/outside-services";
import {mergeHosts} from "./lib/read-write";

const debug = Debug('host:main');
const sub_debug = Debug('host:gen');
export function debugFn(string) {
	sub_debug(`  ${string.replace(/\n/g, '\n\t    ')}`);
}

handleChange(mainHandler);
connectDocker(2000);

async function mainHandler(list) {
	debug('docker status changed!');
	
	const hostParts = [];
	
	hostParts.push('\n# LOCAL INTERFACE: ');
	if (process.env.HOST_LOOP_IP) {
		hostParts.push(`${process.env.HOST_LOOP_IP}\tlocalhost-loop docker-host`);
	} else {
		hostParts.push(`## ERROR. No ipv4 detected. rebuild may resolve this error.`);
	}
	if (process.env.HOST_LOOP_IP6) {
		hostParts.push(`${process.env.HOST_LOOP_IP6}\tlocalhost-loop6 docker-host6`);
	}
	
	hostParts.push('\n# PHYSICAL HOST: ');
	hostParts.push(await generateIdIpMap());
	
	hostParts.push('\n# UPSTREAM: ');
	const ret = detectUpstream(list);
	hostParts.push(ret.hostContent);
	
	hostParts.push('\n# CURRENT RUNNING DOCKER: ');
	hostParts.push(runningDockerContainers(list, ret.upstreamList));
	
	hostParts.push('\n# SERVICE NOT ON CURRENT SYSTEM: ');
	hostParts.push(serviceNotOnCurrent(list, ret.upstreamList));
	
	const newHostsSection = hostParts.join('\n');
	
	console.log(' ----\n%s\n ----', newHostsSection);
	mergeHosts(newHostsSection);
	
	return true;
}
