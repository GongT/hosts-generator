import {getAllNames} from "../lib/labels";
const baseDomain = JsonEnv.baseDomainName;

export function runningDockerContainers(list: DockerInspect[]) {
	return list.map((item) => {
		const ip = item.NetworkSettings.IPAddress;
		const allNames = getAllNames(item);
		
		if (/^[a-z\-0-9._]+$/.test(item.Config.Hostname)) {
			allNames.unshift(item.Config.Hostname);
		}
		if (allNames.length) {
			return `${ip}\t${allNames.join(' ')}`;
		} else {
			return `# no valid hostname for container ${item.Config.Hostname}`;
		}
	}).join('\n')
}
