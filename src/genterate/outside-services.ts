import {getServiceName, getServiceKnownAlias} from "../lib/labels";
const allKnownService = Object.keys(JsonEnv.services);

import * as Debug from "debug";
import {debugFn} from "../boot";
const debug = Debug('host:main');

export function serviceNotOnCurrent(list: DockerInspect[], upstreamIpList: string[]) {
	const runningService = list.map(getServiceName).filter(e => !!e);
	debug('runningService:\n\t  %s', runningService.join('\n\t  '));
	debug('allKnownService:\n\t  %s', allKnownService.join('\n\t  '));
	
	const debugstr = `# runningService=${runningService.join(', ').replace(/\n/g, '\\n')}
# allKnownService=${allKnownService.join(', ').replace(/\n/g, '\\n')}
`;
	
	return debugstr + allKnownService.filter((servName) => {
			return runningService.indexOf(servName) === -1;
		}).map((servName) => {
			const alias = getServiceKnownAlias(servName);
			
			debugFn(`all names: \n   ${alias.join('\n   ')}`);
			
			return upstreamIpList.map((upstreamIp) => {
				return `${upstreamIp}\t${alias.join(' ')}`;
			}).join('\n')
		}).join('\n');
}
