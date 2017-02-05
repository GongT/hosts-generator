import {array_unique} from "../lib/array_unique";
import {debugFn} from "../boot";
const baseDomain = JsonEnv.baseDomainName;

export function getServiceKnownAlias(servName) {
	if (!JsonEnv.services.hasOwnProperty(servName)) {
		debugFn(`  service alias: not a service`);
		return [`${servName}.${baseDomain}`];
	}
	const def = JsonEnv.services[servName];
	const alias: string[] = def['alias'] || [];
	
	const outerDomain = `${def.outerSubDomainName || servName}.${baseDomain}`;
	debugFn(`  service alias: domain - ${outerDomain}`);
	alias.unshift(outerDomain);
	alias.unshift(servName);
	
	return array_unique(alias);
}


