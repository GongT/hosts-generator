import {getAllNames} from "../lib/labels";
const baseDomain = JsonEnv.baseDomainName;

export function runningDockerContainers(list: DockerInspect[]) {
	return list.map((item) => {
		const ip = item.NetworkSettings.IPAddress;
		const allNames = getAllNames(item);
		
		return `${ip}\t${item.Config.Hostname} ${allNames.join(' ')}`;
	}).join('\n')
}
