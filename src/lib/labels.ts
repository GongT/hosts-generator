import {debugFn} from "../boot";
import {array_unique} from "./array_unique";
import {getServiceKnownAlias} from "../genterate/alias.inc";

export function getServiceName(item: DockerInspect) {
	const name = item.Name.replace(/^\//, '').replace(/\//, '-');
	return /^[a-z\-0-9._]+$/.test(name)? name : '';
}

export function getServiceMap(list: DockerInspect[]): {[id: string]: DockerInspect} {
	const ret = {};
	list.forEach((ins) => {
		const name = getServiceName(ins);
		if (name) {
			ret[name] = ins;
		}
	});
	return ret;
}

export function getAllNames(item: DockerInspect) {
	const name = getServiceName(item);
	debugFn(`docker container service: ${name}`);
	
	if (!name) {
		debugFn(` - invalid service name: ${item.Name}`);
		return [];
	}
	
	const alias = getContainerAlias(item);
	
	let ret = [name].concat(alias, getServiceKnownAlias(name));
	
	ret = array_unique(ret);
	
	debugFn(`all names: \n   ${ret.join('\n   ')}`);
	return ret;
}

export function getContainerAlias(ins: DockerInspect) {
	if (!ins.Config.Labels) {
		debugFn(`  container alias: not set - no labels`);
		return [];
	}
	let alias: any = ins.Config.Labels['org.special-label.alias'];
	if (!alias) {
		debugFn(`  container alias: not set - no alias`);
		return [];
	}
	
	if (typeof alias === 'string') {
		try {
			alias = JSON.parse(alias);
		} catch (e) {
			debugFn(`\x1B[38;5;9mError:\x1B[0m JSON ${alias} not valid:\n${e.stack}`);
			return [];
		}
	}
	
	if (!Array.isArray(alias)) {
		alias = [alias]
	}
	if (!alias.length) {
		debugFn(`  container alias: not set - zero length`);
		return [];
	}
	
	debugFn(`  container alias: [ ${alias.join(', ')} ]`);
	return alias;
}
