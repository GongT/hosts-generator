import {serverMap, whoAmI} from "../config";

let cache = '';
export function generateIdIpMap() {
	if (cache) {
		return cache;
	}
	return cache = Object.keys(serverMap).map((i) => {
		const item = serverMap[i];
		if (item.id === whoAmI.id) {
			return `127.0.0.1\t${item.id}`;
		} else if (item.network === whoAmI.network) {
			return `${item.internal}\t${item.id}`;
		} else {
			return `${item.external}\t${item.id}`;
		}
	}).join('\n');
}
