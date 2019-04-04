window.addEventListener("load", event => {
	window.Main = new Main();
	window.Main.load();
});

class Main {
	
	constructor() {
		trace("load dash");
		this._name = "dash";
	}
	
	load() {
		let widget = new DiapoPhoto(1, this);
		document.body.appendChild(widget.mvc.view.stage);
	}
	
	async get(url) {
		return await Comm.urlrequest("https://node.nicopr.fr/" + this._name + url, {});
	}
	
	async post(url, data) {
		return await Comm.urlrequest("https://node.nicopr.fr/" + this._name + url, {"method": "POST", "data": data});
	}
	
	get appname() {
		return this._name;
	}
}
