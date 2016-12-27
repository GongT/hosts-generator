import {some, whoAmI} from "../../who_am_i/index";

export function detectUpstream(inspects: DockerInspect[]) {
	let upstreamIp: string, commentId: string;
	inspects.some((insp) => {
		if (insp.Name.replace(/^\//g, '') === 'nginx') {
			commentId = `docker: ${insp.Name} - ${insp.Id}`;
			upstreamIp = insp.NetworkSettings.IPAddress;
			return true;
		}
	});
	if (!upstreamIp) {
		some((obj) => {
			if (obj.front && obj.network === whoAmI.network) {
				commentId = `local network server: ${obj.id}`;
				upstreamIp = obj.internal;
				return true;
			}
		});
	}
	if (!upstreamIp) {
		some((obj) => {
			if (obj.front) {
				commentId = `internet server: ${obj.id}`;
				upstreamIp = obj.external;
				return true;
			}
		});
	}
	if (upstreamIp) {
		return {
			host: `${upstreamIp}\tupstream  # ${commentId}`,
			ip: upstreamIp,
		};
	}
	throw new Error("can't find any server as upstream !!!");
}
