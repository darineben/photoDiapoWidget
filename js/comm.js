/**
* @nocollapse
* @export
*/
class Comm {
	
	static async request(url, options) {
		return new Promise(function(resolve, reject) {
			try {
				options = merge({"method": "GET", "data": undefined, "user": undefined, "password": undefined, "progress": die}, options);
				let xhr = new XMLHttpRequest();
				if(options.hasOwnProperty("progress")) xhr.upload.onprogress = function(event) {
					options["progress"].apply(xhr, [(event.loaded / event.total * 100).toFixed(1)]);
				};
				xhr.onreadystatechange = function() {
					//Comm.xhr_state(xhr.status, xhr.readyState);
					if(xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) resolve({"state": true, "status": xhr["status"], "response": JSON.parse(xhr["responseText"])});
					else if(xhr.status !== 200 && xhr.status !== 0) if(xhr.readyState === 4) resolve({"state": false, "status": xhr["status"], "response": JSON.parse(xhr["responseText"])});
				};
				xhr.open(options["method"], url, true, options["user"], options["password"]);
				if(options.hasOwnProperty("headers")) for(let header in options["headers"]) xhr.setRequestHeader(header, options["headers"][header]);
				if(typeof options["data"] !== "undefined") {
					let data = Object.keys(options["data"]).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(options["data"][key])).join("&");
					xhr.send(data);
				}
				else xhr.send();
			}
			catch(e) {
				console.log(e);
			}
		});
	}
	
	/*static xhr_state(status, readyState) {
		let s = {0: "READY", 200: "OK", 302: "FOUND", 304: "NOT MODIFIED", 400: "BAD REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT FOUND", 405: "METHOD NOT ALLOWED", 500: "INTERNAL SERVER ERROR"};
		let r = {0: "UNSENT", 1: "OPENED", 2: "HEADERS_RECEIVED", 3: "LOADING", 4: "DONE"};
		trace(s[status] || status, r[readyState] || readyState);
	}*/
	
	static async urlrequest(url, options) {
		return await this.request(url, merge(options, {"headers": {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}}));
	}
	
	static async jwtrequest(url, options, jwt) {
		return await this.request(url, merge(options, {"headers": {"Authorization": "Bearer " + jwt, "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}}));
	}
	
	/**
	* @param url: 
	* @this {AppBase}
	*/
	static async get(url) {
		return await Comm.urlrequest("/" + this._name + url, {});
	}
	
	/**
	* @param url: 
	* @param data: 
	* @this {AppBase}
	*/
	static async post(url, data) {
		return await Comm.urlrequest("/" + this._name + url, {"method": "POST", "data": data});
	}
}

/**
* @nocollapse
* @export
*/
class SocketIO {
	
	constructor() {}
	
	static initialize(jwt) {
		
		trace("start io", "/" + window.Main.appname);
		
		this.jwt = jwt;
		
		this.io = io("https://node.nicopr.fr/" + window.Main.appname, {
			//transports: ["websocket"], // modern browsers only, see server side cluster
			"query": {
				"jwt": jwt,
				"app": window.Main.appname
			}
		}); 
		
		this.io.on("connect", this.onConnect.bind(this));
		this.io.on("connect_timeout", this.onConnectTimeout.bind(this));
		this.io.on("disconnect", this.onDisconnect.bind(this));
		
	}
	
	static onConnect() {
		trace("io connect");
		
	}
	
	static onConnectTimeout() {
		trace("io connect timeout");
		
	}
	
	static onDisconnect() {
		trace("io disconnect");
		
	}
	
	static on(type, callback) {
		this.io.on(type, callback);
	}
	
	static send(type, data, callback) {
		trace("send", type, data);
		this.io.binary(false).emit(type, data, callback || die);
	}
	
	static jwtsend(type, data, callback) {
		this.send(type, merge(data || {}, {jwt: this.jwt}), callback);
	}
}