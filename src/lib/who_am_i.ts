import {serverMap} from "../config";

export interface ServerDefine {
	name: string;
	network: string;
	id: string;
	front?: boolean;
	detect: string;
	internal: string;
	external: string;
}

export function forEach(cb: (e: ServerDefine) => void) {
	Object.keys(serverMap).forEach((k) => {
		cb.call(serverMap, serverMap[k], k);
	});
}

export function some(cb: (e: ServerDefine) => boolean) {
	return Object.keys(serverMap).some((k) => {
		return cb.call(serverMap, serverMap[k], k);
	});
}
