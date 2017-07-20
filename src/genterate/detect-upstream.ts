import {debugFn} from "../boot";
import {whoAmI} from "../config";
import {getContainerAlias} from "../lib/labels";
import {forEach} from "../lib/who_am_i";
import {findContainerIp} from "./docker-containers";

const UPSTREAM_SERVIE_NAME = 'nginx';

// NOTICE: this feature may remove
export function detectUpstream(inspects: DockerInspect[]) {
	let subnetGateways: string[] = [], localGateway: string, remoteGateways: string[] = [];
	
	debugFn('create upstream: ');
	
	let foundGateway = false;
	inspects.forEach((insp) => {
		const alias = getContainerAlias(insp);
		if (insp.Name.replace(/^\//g, '') === UPSTREAM_SERVIE_NAME || alias.indexOf(UPSTREAM_SERVIE_NAME) !== -1) {
			subnetGateways.push(findContainerIp(insp));
			debugFn(`  subnet gateway "${UPSTREAM_SERVIE_NAME}": ${insp.Id}`);
			foundGateway = true;
		}
	});
	if (!foundGateway) {
		debugFn(`  subnet gateway not exists.`);
	}
	
	forEach((obj) => {
		if (!obj.front || obj.id === whoAmI.id) {
			return;
		}
		
		if (obj.network === whoAmI.network) {
			debugFn(`  local network address ${obj.external}`);
			localGateway = obj.internal;
		} else {
			debugFn(`  internet address ${obj.external}`);
			remoteGateways.push(obj.external);
		}
	});
	
	const hostLines: string[] = [];
	let upstreamLocations: string[];
	if (foundGateway) {
		for (let up of subnetGateways) {
			hostLines.push(`${up}\tupstream # gateway service running in docker`)
		}
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tnext-upstream # remote network`);
		});
		upstreamLocations = [...subnetGateways];
	} else if (localGateway) {
		hostLines.push(`${localGateway}\tupstream # local network`);
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tnext-upstream # remote network`);
		});
		upstreamLocations = [localGateway];
	} else if (remoteGateways.length === 0) {
		hostLines.push(`# no upstream from local network`);
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tupstream next-upstream`);
		});
		upstreamLocations = remoteGateways;
	} else {
		console.error("[!!!] can't find any server as upstream !!!");
		hostLines.push(`# no upstream from local network`);
		hostLines.push(`127.0.0.1\tupstream next-upstream`);
		upstreamLocations = [];
	}
	
	return {
		hostContent: hostLines.join('\n'),
		upstreamList: upstreamLocations,
	};
}
