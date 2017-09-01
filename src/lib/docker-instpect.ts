export function docker_inspect(dockerApi, nameOrInfo): Promise<DockerInspect> {
	return new Promise<DockerInspect>((resolve, reject) => {
		const id = typeof nameOrInfo === 'string'? nameOrInfo : nameOrInfo.Id;
		
		dockerApi.getContainer(id).inspect((err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

export async function docker_inspect_all(dockerApi, list): Promise<DockerInspect[]> {
	const ret = [];
	for (const cInfo of list) {
		ret.push(await docker_inspect(dockerApi, cInfo));
	}
	return ret;
}
