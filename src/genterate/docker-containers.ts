import {getServiceAlias, getServiceName} from "../lib/labels";
const baseDomain = JsonEnv.baseDomainName;

export function runningDockerContainers(list: DockerInspect[]) {
	const nameLen = Math.max.apply(undefined, list.map((item) => {
		const name = item.Name.replace(/^\//, '').replace(/\//, '-');
		if (/[A-Z]/.test(name)) {
			return 0;
		} else {
			return name.length;
		}
	}));
	return list.map((item) => {
		const ip = item.NetworkSettings.IPAddress;
		let name = item.Name.replace(/^\//, '').replace(/\//, '-');
		const label = getServiceName(item);
		const alias = getServiceAlias(item);
		
		if (/[A-Z]/.test(name)) {
			if (!label) {
				return `# ${item.Name}: invalid container name`;
			} else {
				name = '';
			}
		}
		
		const space = (new Array(nameLen - name.length)).fill(' ').join('');
		
		const l1 = `${ip}\t${item.Config.Hostname} ${name}`;
		let l2 = '';
		
		if (label || alias) {
			l2 = `${space}     `;
			if (label) {
				l2 += `${label} ${label}.${baseDomain} `;
			}
			if (alias) {
				l2 += `${alias}`;
			}
		}
		
		return l1 + l2;
	}).join('\n')
}
