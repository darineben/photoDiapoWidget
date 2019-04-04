class Try {
	
	constructor() {}
	
	get try() {
		// https://stackoverflow.com/questions/48696678
		// + setter https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Proxy/handler/set
		return new Proxy(this, {
			get: function(target, name) {
				if(typeof target[name] === "function") {
					if(target[name][Symbol.toStringTag] === "AsyncFunction") {
						return async function() {
							try {
								await target[name].apply(target, arguments);
							}
							catch(e) {
								console.error(e);
							}
						};
					}
					else {
						return function() {
							try {
								return target[name].apply(target, arguments);
							}
							catch(e) {
								console.error(e);
							}
						};
					}
				}
				return target[name];
			},
			set: function(target, prop, value) {
				try {
					return Reflect.set.apply(target, arguments);
				}
				catch(e) {
					console.error(e);
				}
			}
		});
	}
	
}

class Widget extends Try {
	
	constructor(id, model, view, controller, app) {
		super();
		
		this.try.name = this.constructor.name.toLowerCase().replace("widget", "");
		trace("new widget", this.try.name);
		
		this.try.id = id;
		
		this.try.app = app;
		
		this.try.mvc = {};
		
		this.try.mvc.model = new model();
		this.try.mvc.view = new view();
		this.try.mvc.controller = new controller();
		
		this.try.mvc.model.mvc = {main: this, view: this.try.mvc.view, controller: this.try.mvc.controller};
		this.try.mvc.view.mvc = {main: this, model: this.try.mvc.model, controller: this.try.mvc.controller};
		this.try.mvc.controller.mvc = {main: this, model: this.try.mvc.model, view: this.try.mvc.view};
		
		this.try.setUp();
		
		this.try.mvc.view.try.draw();
		
		this.try.ready();
	}
	
	setUp() {
		this.try.radius = 20;
		this.try.header = false;
		this.try.footer = false;
		this.try.defaultSize = 150;
		this.try.sizeX = 1;
		this.try.sizeY = 1;
	}
	
	ready() {
		trace(this.name, "ready");
		
	}
	
	/**
	* @async
	* @method: dom: load website via server
	* @param url: website url
	* @return http request result
	*/
	async dom(url) {
		return await this.app.get("/dom/load/" + encodeURIComponent(url));
	}
	
	/**
	* @async
	* @method: load: load data from widget server class
	* @param method: remote method name
	* @return http request result
	*/
	async load(method) {
		return await this.app.get("/dash/load/" + this.try.name + "/" + method);
	}
	
	/**
	* @async
	* @method: send: post data to widget server class
	* @param method: remote method name
	* @param {Object} data: key/value pairs to send
	* @return http request result
	*/
	async send(method, data) {
		return await this.app.post("/dash/send/" + this.try.name + "/" + method, data);
	}
	
	/**
	* @method: store: store data in localStorage
	* @param field: storage field
	* @param value: value
	*/
	store(field, value) {
		Store.set(this.try.id + "_" + this.try.name + "_" + field, value);
	}
	
	/**
	* @method: restore: get data from localStorage
	* @param field: storage field
	* @return data or null
	*/
	restore(field) {
		return Store.get(this.try.id + "_" + this.try.name + "_" + field);
	}
	
	/**
	* @method: has: check field exists in localStorage
	* @param field: storage field
	* @return true or false
	*/
	has(field) {
		return Store.has(this.try.id + "_" + this.try.name + "_" + field);
	}
	
	/**
	* @method: destroy: remove field from localStorage
	* @param field: storage field
	*/
	destroy(field) {
		Store.destroy(this.try.id + "_" + this.try.name + "_" + field);
	}
	
	
}

class WidgetModel extends Try {
	
	constructor() {
		super();
		this.try.setUp();
	}
	
	setUp() {
		
	}
	
}

class WidgetView extends Try {
	
	constructor() {
		super();
		this.try.setUp();
	}
	
	setUp() {
		
	}
	
	draw() {
		
		let w = this.try.mvc.main.defaultSize * this.try.mvc.main.sizeX;
		let h = this.try.mvc.main.defaultSize * this.try.mvc.main.sizeY;
		
		this.try.stage = HH.create("div");
		SS.style(this.try.stage, {"position": "relative", "width": w + "px", "height": h + "px", "overflow": "hidden", "backgroundColor": "rgba(200, 200, 200, 1)", "borderRadius": this.try.mvc.main.radius + "px"});
		
		if(this.try.mvc.main.header) {
			this.try.header = HH.create("div");
			SS.style(this.try.header, {"z-index": 100, "userSelect": "none", "width": "100%", "height": "25px", "lineHeight": "25px", "textAlign": "center", "border-top-left-radius": this.try.mvc.main.radius + "px", "border-top-right-radius": this.try.mvc.main.radius + "px","backgroundColor": "#0072ff"});
			this.try.header.innerHTML = this.try.mvc.main.name;
			this.try.stage.appendChild(this.try.header);
		}
		
		if(this.try.mvc.main.footer) {
			this.try.footer = HH.create("div");
			SS.style(this.try.footer, {"position": "absolute", "bottom": "0px", "z-index": 100, "width": "100%", "height": "25px", "lineHeight": "25px", "textAlign": "center", "border-bottom-left-radius": this.try.mvc.main.radius + "px", "border-bottom-right-radius": this.try.mvc.main.radius + "px","backgroundColor": "#0072ff"});
			this.try.footer.innerHTML = "footer";
			this.try.stage.appendChild(this.try.footer);
		}
		
	}
	
}

class WidgetController extends Try {
	
	constructor() {
		super();
		this.try.setUp();
	}
	
	setUp() {
		
	}
	
}