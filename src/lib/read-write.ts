import {readFileSync, existsSync, writeFileSync} from "fs";
import {resolve} from "path";
const hostPath = resolve(__dirname, '../../host-etc/hosts');

const prepend = `#   ==== created by hosts generator ====
#          === do not modify ANYTHING ===
`;
const append = `
#   ==== generate end ====
#`;
const sigReg = new RegExp(escapeRegExp(prepend) + '[\\s\\S]+' + escapeRegExp(append));

if (!existsSync(hostPath)) {
	writeNewHosts('127.0.0.1 localhost');
}

function readOriginalHosts() {
	return readFileSync(hostPath, 'utf-8');
}

function writeNewHosts(text) {
	return writeFileSync(hostPath, text, 'utf-8');
}

export function mergeHosts(hostsText) {
	const text = readOriginalHosts();
	const newSection = prepend + hostsText.trim() + append;
	
	let newText;
	if (sigReg.test(text)) {
		newText = text.replace(sigReg, newSection);
	} else {
		newText = text + '\n\n' + newSection + '\n\n';
	}
	
	if (text !== newText) {
		writeNewHosts(newText);
	}
}
function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
