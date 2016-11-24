const resolve = require('path').resolve;
const fs = require('fs');
const saveRoot = __dirname;

if (process.env.RUN_IN_DOCKER) {
	module.exports = {
		whoAmI: require('./get_server_ip.json'),
		serverMap: require('./who_am_i.json'),
	};
} else {
	const resultGetServerIp = require('./get_server_ip.js');
	const resultWhoAmI = require('./who_am_i.js');
	fs.writeFileSync(resolve(saveRoot, 'get_server_ip.json'), JSON.stringify(resultGetServerIp, null, 4));
	fs.writeFileSync(resolve(saveRoot, 'who_am_i.json'), JSON.stringify(resultWhoAmI, null, 4));
	module.exports = {
		whoAmI: resultWhoAmI,
		serverMap: resultGetServerIp,
	};
}
