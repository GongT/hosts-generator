export function getServiceName(ins: DockerInspect) {
	if (!ins.Config.Labels) {
		return '';
	}
	return ins.Config.Labels['org.special-label.serviceName'] || '';
}

export function getServiceAlias(ins: DockerInspect) {
	if (!ins.Config.Labels) {
		return '';
	}
	let alias: any = ins.Config.Labels['org.special-label.alias'];
	if (alias && typeof alias === 'string') {
		try {
			alias = JSON.parse(alias);
		} catch (e) {
			console.error('\x1B[38;5;9m%s\x1B[0m', new Error(`alias json invalid: ${ins.Name}`));
			return '';
		}
	}
	if (alias && !Array.isArray(alias)) {
		alias = [alias]
	}
	if (alias) {
		return alias.join(' ');
	} else {
		return '';
	}
}
