///<reference path="../lib/labels.ts"/>
import {getAllNames, getServiceName} from "../lib/labels";

export function findContainerIp(item: DockerInspect): string {
	if (item.NetworkSettings.IPAddress) {
		return item.NetworkSettings.IPAddress;
	}
	for (let config of Object.values(item.NetworkSettings.Networks)) {
		if (config.IPAddress) {
			return config.IPAddress;
		}
	}
}

export function runningDockerContainers(list: DockerInspect[], upstreamList: string[]) {
	return list.map((item) => {
		const proxy = getContainerProxySetting(item);
		const ip = findContainerIp(item);
		const allNames = getAllNames(item);
		
		let ret = `${ip? ip : '# no ip # - '}\t${item.Config.Hostname} `;
		if (proxy) {
			upstreamList.forEach((upstream) => {
				ret += ` # continue:
${upstream}\t${allNames.join(' ')}`;
			});
		} else {
			ret += allNames.join(' ');
		}
		return ret;
	}).join('\n')
}

function getProxyLabel(item: DockerInspect) {
	if (!item.Config.Labels) {
		return '';
	}
	return item.Config.Labels['org.special-label.proxy'] || '';
}

function getContainerProxySetting(item: DockerInspect) {
	// debugFn(`  get container IP address:`);
	let proxy = getProxyLabel(item);
	
	if (!proxy) {
		const servName = getServiceName(item);
		if (JsonEnv.services.hasOwnProperty(servName)) {
			proxy = 'nginx';
		}
	}
	return proxy;
	/*
	 if (proxy) {
	 debugFn(`    use proxy: ${item.NetworkSettings.IPAddress}`);
	 } else {
	 debugFn(`    use own ip: ${item.NetworkSettings.IPAddress}`);
	 return item.NetworkSettings.IPAddress;
	 }*/
}
