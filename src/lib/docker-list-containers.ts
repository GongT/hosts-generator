export function docker_list_containers(dockerApi): Promise<string[]> {
	return new Promise((resolve, reject) => {
		dockerApi.listContainers((err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
