import {serverMap} from "../config";

export function forEach(cb) {
	Object.keys(serverMap).forEach((k) => {
		cb.call(serverMap, serverMap[k], k);
	});
}

export function some(cb) {
	return Object.keys(serverMap).some((k) => {
		return cb.call(serverMap, serverMap[k], k);
	});
}
