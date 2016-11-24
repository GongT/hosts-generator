import {getServiceName} from "../lib/labels";
const allKnownService = Object.keys(JsonEnv.nginx_services);
const baseDomain = JsonEnv.baseDomainName;

export function serviceNotOnCurrent(list: DockerInspect[], upstreamIp: string) {
	const runningService = list.map(getServiceName).filter(e => !!e);
	
	return allKnownService.filter((servName) => {
		return runningService.indexOf(servName) === -1;
	}).map((servName) => {
		return `${upstreamIp}\t${servName} ${servName}.${baseDomain}`;
	}).join('\n');
}
