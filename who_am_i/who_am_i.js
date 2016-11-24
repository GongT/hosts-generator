const os = require('os');
const ifaces = os.networkInterfaces();
const serverIpMap = require('./get_server_ip');
const extend = require('util')._extend;
const debug = require('debug')('ip:who_am_i');

module.exports = {
	id: undefined,
	name: undefined,
	localhost: undefined,
	internal: undefined,
	external: undefined,
	noSSL: false,
};

// try find myself
let foundMySelf;

if (process.env.DOCKER_MY_SERVER_ID) {
	debug('who_am_i: found server id from env [%s]', process.env.DOCKER_MY_SERVER_ID);
	foundMySelf = serverIpMap[process.env.DOCKER_MY_SERVER_ID];
	foundMySelf.id = process.env.DOCKER_MY_SERVER_ID;
} else {
	const matchedItems = [];
	Object.keys(ifaces).forEach((ifName) => {
		debug('found interface %s', ifName);
		return ifaces[ifName].forEach((ifcfg) => {
			debug('   found %s address: %s', ifcfg.family, ifcfg.address);
			
			const ip = ifcfg.address.trim();
			
			return serverIpMap.forEach(function (def, id) {
				def.id = id;
				if (def.detect === ip) {
					debug('       match self: %s', id);
					if (ifcfg.internal) {
						matchedItems.push(def);
					} else {
						matchedItems.unshift(def);
					}
				}
			});
		});
	});
	if (matchedItems.length) {
		foundMySelf = matchedItems[0];
	}
}

if (!foundMySelf) {
	console.error(`CAN'T FIND OUT WHO AM I\n  maybe a new server not list in server_ip.json ?`);
	console.error('server ip map: ', serverIpMap);
	process.exit(2);
}

extend(module.exports, foundMySelf);

debug('who am i: self = %s', JSON.stringify(module.exports, null, 4));
