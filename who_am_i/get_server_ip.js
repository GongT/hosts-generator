let JsonEnv;
const debug = require('debug')('ip:server_map');

if (global.JsonEnv) {
	JsonEnv = global.JsonEnv;
} else {
	JsonEnv = require('@gongt/jenv-data')();
}

const serverDefine = JsonEnv.deploy;
if (!serverDefine || !Object.keys(serverDefine).length) {
	throw new Error('no config.deploy exists');
}

const serverMap = {}, ids = [];
Object.keys(serverDefine).forEach((networkGroup) => {
	serverDefine[networkGroup].machines.forEach((d) => {
		const serverId = `${networkGroup}-${d.name}`;
		d.network = networkGroup;
		d.id = serverId;
		serverMap[serverId] = d;
		ids.push(serverId);
	});
});
serverMap.forEach = function (cb) {
	ids.forEach((k) => {
		cb.call(serverMap, serverMap[k], k);
	});
};
serverMap.some = function (cb) {
	return ids.some((k) => {
		return cb.call(serverMap, serverMap[k], k);
	});
};

debug('server map: %s', JSON.stringify(serverMap, null, 4));
module.exports = serverMap;
