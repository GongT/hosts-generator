import {some, forEach} from "../lib/who_am_i";
import {whoAmI} from "../config";
import {debugFn} from "../boot";

const UPSTREAM_SERVIE_NAME = 'nginx';

export function detectUpstream(inspects: DockerInspect[]) {
	let subnetGateway: string, localGateway: string, remoteGateways: string[] = [];
	
	debugFn('create upstream: ');
	
	let foundGateway = inspects.some((insp) => {
		if (insp.Name.replace(/^\//g, '') === UPSTREAM_SERVIE_NAME) {
			subnetGateway = insp.NetworkSettings.IPAddress;
			debugFn(`  subnet gateway "${UPSTREAM_SERVIE_NAME}": ${insp.Id}`);
			return true;
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
	
	if (!subnetGateway && !localGateway && remoteGateways.length === 0) {
		throw new Error("can't find any server as upstream !!!");
	}
	
	const hostLines: string[] = [];
	let upstreamLocations: string[];
	if (subnetGateway) {
		hostLines.push(`${subnetGateway}\tupstream # gateway service running in docker`)
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tnext-upstream # remote network`);
		});
		upstreamLocations = [subnetGateway];
	} else if (localGateway) {
		hostLines.push(`${localGateway}\tupstream # local network`);
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tnext-upstream # remote network`);
		});
		upstreamLocations = [localGateway];
	} else {
		hostLines.push(`# no upstream from local network`);
		remoteGateways.forEach((ip) => {
			hostLines.push(`${ip}\tupstream next-upstream`);
		});
		upstreamLocations = remoteGateways;
	}
	
	return {
		hostContent: hostLines.join('\n'),
		upstreamList: upstreamLocations,
	};
}
