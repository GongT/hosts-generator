///<reference path="../globals.d.ts"/>
import * as Debug from "debug";
import "source-map-support/register";
import "@gongt/jenv-data/global";
import {generateIdIpMap} from "./genterate/physical-id";
import {handleChange} from "./lib/docker";
import {detectUpstream} from "./genterate/detect-upstream";
import {runningDockerContainers} from "./genterate/docker-containers";
import {serviceNotOnCurrent} from "./genterate/outside-services";
import {mergeHosts} from "./lib/read-write";
import {determineDockerInterfaceIpAddress} from "./genterate/get-interface";

const debug = Debug('host:main');

handleChange((list) => {
	debug('docker status changed!');
	
	const hostParts = [];
	
	try {
		hostParts.push('\n# LOCAL INTERFACE: ');
		const ips = determineDockerInterfaceIpAddress();
		hostParts.push(`${ips[0]}  localhost-loop`);
		if (ips[1]) {
			hostParts.push(`${ips[1]}  localhost-loop6`);
		}
	} catch (e) {
		hostParts.push(`## ERROR. ${JSON.stringify(e.message)}`);
	}
	
	hostParts.push('\n# PHYSICAL HOST: ');
	hostParts.push(generateIdIpMap());
	
	hostParts.push('\n# UPSTREAM: ');
	const ret = detectUpstream(list);
	hostParts.push(ret.host);
	
	hostParts.push('\n# CURRENT RUNNING DOCKER: ');
	hostParts.push(runningDockerContainers(list));
	
	hostParts.push('\n# SERVICE NOT ON CURRENT SYSTEM: ');
	hostParts.push(serviceNotOnCurrent(list, ret.ip));
	
	const newHostsSection = hostParts.join('\n');
	
	console.log(' ----\n%s\n ----', newHostsSection);
	mergeHosts(newHostsSection);
});
