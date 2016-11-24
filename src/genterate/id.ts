import {serverMap} from "../../who_am_i/index";
let cache = '';
export function generateIdIpMap() {
	if(cache){
		return cache;
	}
	return Object.keys(serverMap).forEach(() => {
	    
	})
}
