import {getServiceName} from "../lib/labels";
const allKnownService = Object.keys(JsonEnv.nginx_services);
const baseDomain = JsonEnv.baseDomainName;

export function serviceNotOnCurrent(list: DockerInspect[], upstreamIp: string) {
	const runningService = list.map(getServiceName).filter(e => !!e);
	console.log('runningService=%s', runningService);
	console.log('allKnownService=%s', allKnownService);
	
	const debugstr = `# runningService=${runningService.join(',').replace(/\n/g, '')}
# allKnownService=${allKnownService.join(',').replace(/\n/g, '')}
`;
	
	return debugstr + allKnownService.filter((servName) => {
			return runningService.indexOf(servName) === -1;
		}).map((servName) => {
			return `${upstreamIp}\t${servName} ${servName}.${baseDomain}`;
		}).join('\n');
}
