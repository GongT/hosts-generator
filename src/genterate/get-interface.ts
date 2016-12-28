import {execSync} from "child_process";

const ipv4 = /^\d+\.\d+\.\d+\.\d+$/;
export function determineDockerInterfaceIpAddress(ifName: string = 'docker0'): string[] {
	const getCommand = `ifconfig ${ifName} | grep inet | awk '{ print $2 }'`;
	console.log('try get interface %s ip address by `%s`: ', ifName, getCommand);
	const ret = execSync(getCommand, {
		encoding: 'utf8'
	}).split(/\n/g).map(item => item.trim()).filter(item => !!item);
	
	if (ipv4.test(ret[0])) {
		return ret;
	} else if (ipv4.test(ret[1])) {
		return [ret[1], ret[0]];
	} else {
		throw new Error(`can't get IPv4 address of interface "${ifName}".`);
	}
}
