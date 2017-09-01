import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {serverMap, whoAmI} from "../config";
// import {resolve4} from "dns";

let cache = '';

export async function generateIdIpMap() {
	if (cache) {
		return cache;
	}
	const ps = Object.keys(serverMap).map(async (i) => {
		const item = serverMap[i];
		if (item.id === whoAmI.id) {
			return `127.0.0.1\t${item.id}`;
		} else if (item.network === whoAmI.network) {
			return `${item.internal}\t${item.id}`;
		} else {
			const external = ('' + (item.external || item.interface)).trim();
			if (/\d+\.\d+\.\d+\.\d+(:\d+)?/.test(external)) {
				return `${external}\t${item.id}`;
			} else {
				const ipList = await resolveDnsIpv4Promise(external);
				return ipList.map((ip) => {
					return `${ip}\t${item.id}`;
				}).join('\n');
			}
		}
	});
	
	const list = await Promise.all(ps);
	
	return list.join('\n');
}

const resolve4 = require('dns').resolve4;
let nextCacheInvalid = new Date;
let cached = [];
const sill = createLogger(LOG_LEVEL.SILLY, 'dns');

function resolveDnsIpv4Promise(hostname): Promise<string[]> {
	hostname = hostname.replace(/:\d+$/, ''); // no port
	
	return new Promise((resolve, reject) => {
		if (new Date > nextCacheInvalid) {
			sill('lookup %s', hostname);
			resolve4(hostname, {ttl: true}, (err, hostlist) => {
				if (err) {
					reject(err);
				} else if (hostlist.length) {
					nextCacheInvalid = new Date;
					nextCacheInvalid.setSeconds(nextCacheInvalid.getSeconds() + hostlist[0].ttl);
					cached = hostlist.map((e) => {
						return e.address;
					});
					resolve(cached);
				} else {
					reject(new Error(`can not resolve host: ${hostname}`));
				}
			});
		} else {
			resolve(cached);
		}
	});
}
