const DEBUG = true;

/**
* @export
* @method trace: console.log with file name and line number
* @param {...*} var_args
*/
function trace(var_args) {
	let args = Array.prototype.slice.call(arguments);
	if(DEBUG) {
		let stack = new Error().stack.trim(), re = /([\w\.]+)\.js:(\d+)/gmi, fileLine = null, n = 0;
		while(n++ < 2) fileLine = re.exec(stack);
		args.push(("\t" + fileLine[1] + ":" + fileLine[2]).padStart(40, " "));
	}
	console.log.apply(console, args);
}

/**
* @export
* @method merge: merge objects
* @param {...*} var_args
*/
function merge(var_args) {
	return Object.assign.apply(this, Array.prototype.slice.call(arguments));
}

function die() {
	
}

/**
* @export
* @method _btoa: encode string to base64
* @param {string} str: string to encode
*/
function _btoa(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
		return String.fromCharCode('0x' + p1);
    }));
}

/**
* @export
* @method _atob: decode string from base64
* @param {string} str: string to decode
*/
function _atob(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
}