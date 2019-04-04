/**
* @nocollapse
* @export
*/
class HH {
	
	/**
	* @export
	* @method create: create HTML element (document.createElement proxy)
	* @param {string} name: HTML tag name
	* @return {Element}
	*/
	static create(name) {
		return document.createElement(name);
	}
	
	/**
	* @export
	* @method attr: add attribute(s) to HTML element
	* @param {Element} element: HTML element
	* @param {Object} attributes: key/value pairs
	*/
	static attr(element, attributes) {
		for(let attr in attributes) element.setAttribute(attr, attributes[attr]);
	}
	
	/**
	* @export
	* @method rmattr: remove attribute(s) from HTML element
	* @param {Element} element: HTML element
	* @param {!string|!Array} attributes: array or space separated string
	*/
	static rmattr(element, attributes) {
		if(typeof attributes === "string") attributes = attributes.split(" ");
		for(let attr of attributes) element.removeAttribute(attr);
	}
	
	/**
	* @export
	* @method insertBefore: insert element before other element
	* @param {Element} element: HTML element to insert
	* @param {Element} before: before which element 
	*/
	static insertBefore(element, before) {
		before.parentNode.insertBefore(element, before);
	}

	/**
	* @export
	* @method insertAfter: insert element after other element
	* @param {Element} element: HTML element to insert
	* @param {Element} after: after which element 
	*/
	static insertAfter(element, after) {
		after.parentNode.insertBefore(element, after.nextSibling);
	}
	
	/**
	* @export
	* @method empty: remove all children
	* @param {Element} element: HTML element to empty
	*/
	static empty(element) {
		while(element.firstChild) element.removeChild(element.firstChild);
		/* RECURSE ?
		while(element.firstChild) {
			HH.empty(element.firstChild);
			element.removeChild(element.firstChild);
		}		
		*/
	}
	
	/**
	* @export
	* @method toString: return complete element string
	* @param {Element} element: HTML element
	*/
	static toString(element) {
		let wrapper = HH.create("div");
		wrapper.appendChild(element);
		// null element before return string ?
		return wrapper.innerHTML;
	}
	
}

/**
* @nocollapse
* @export
*/
class SS {
	
	/**
	* @export
	* @method style: element styling
	* @param element: HTML element
	* @param {Object} styles: key/value pairs with camelCase style props
	*/
	static style(element, styles) {
		Object.assign(element.style, styles);
	}
	
	/**
	* @export
	* @method addClass: add class(es) to element
	* @param element: HTML element
	* @param {!string|!Array} classes: array or space separated string
	*/
	static addClass(element, classes) {
		if(typeof classes === "string") classes = classes.split(" ");
		for(let c of classes) {
			let cl = " " + element.className + " ";
			if(cl.indexOf(" " + c + " ") == -1) element.className = (cl + c).trim();
		}
	}
	
	/**
	* @export
	* @method removeClass: remove class(es) from element
	* @param element: HTML element
	* @param {!string|!Array} classes: array or space separated string
	*/
	static removeClass(element, classes) {
		if(typeof classes === "string") classes = classes.split(" ");
		for(let c of classes) {
			let cl = " " + element.className + " ";
			if(cl.indexOf(" " + c + " ") != -1) element.className = cl.replace(" " + c + " ", " ").trim();
		}
	}
	
}

/**
* @nocollapse
* @export
*/
class Events {
	
	/**
	* @nocollapse
	* @export
	* @method on: element.addEventListener proxy
	* @param {Element} element: HTML element
	* @param {string} event: event name
	* @param {Function} callback: event callback
	*/
	static on(element, event, callback) {
		element.addEventListener(event, callback);
	}
	
	/**
	* @nocollapse
	* @export
	* @method off: element.removeEventListener proxy
	* @param {Element} element: HTML element
	* @param {string} event: event name
	* @param {Function} callback: event callback
	*/
	static off(element, event, callback) {
		element.removeEventListener(event, callback);
	}
	
}

/**
* @nocollapse
* @export
*/
class Views {
	
	static initialize() {
		this.views = [];
		this.current = "";
		this.next = "";
	}
	
	/** @export */
	static add(view) {
		trace("add view :", view.name);
		this.views.push(view);
	}
	
	/** @export */
	static remove(view) {
		trace("remove view :", view.name);
		let viewIndex = this.indexFromName(view.name);
		if(viewIndex != -1) {
			if(this.current == view.name) this.swap("", true);
			else this.views.splice(viewIndex, 1);
		}
		else trace("view", view.name, "doesn't exist");
	}
	
	static resize() {
		this.views.map(view => view.resize(window.Main.fullbounds));
	}
	
	/**
	* @export
	* @method swap: swap to other view
	* @param {string} name: name of the view to swap to
	* @param {boolean=} kill: destroy previous view
	*/
	static swap(name, kill) {
		this.next = name;
		this.doSwap(this.indexFromName(this.next), this.indexFromName(this.current), kill);
		this.current = this.next;
	}
	
	static doSwap(viewIn, viewOut, kill) {
		if(viewIn != -1) this.swapIn(this.views[viewIn]);
		if(viewOut != -1) this.swapOut(this.views[viewOut], kill);
	}

	static swapIn(view) {
		trace("swap in", view.name);
		SS.addClass(view.stage, "hide");
		view["attach"].apply(view, [window.Main.stage]);
		Fade.in(view.stage, this.swappedIn.bind(this), view);
	}
	
	static swappedIn(view) {
		view["activate"].apply(view, []);
	}
	
	static swapOut(view, kill) {
		trace("swap out", view.name);
		Fade.out(view.stage, this.swappedOut.bind(this), view, kill);
	}
	
	static swappedOut(view, kill) {
		view["deactivate"].apply(view, []);
		view["detach"].apply(view, []);
		if(kill) view.destroy.apply(view, []);
	}
	
	static indexFromName(name) {
		for(let i = 0, l = this.views.length; i < l; i++) if(this.views[i].name == name) return i;
		return -1;
	}
	
}

/**
* @nocollapse
* @export
*/
class Message {
	
	static initialize() {
		
		this.pool = [];
		this.queue = [];
		this.max = 10;
		
	}
	
	static print(msg) {
		if(this.pool.length >= this.max) this.queue.push(msg);
		else this.disp(msg);
	}
	
	static disp(msg) {
		let box = HH.create("div");
		SS.style(box, {backgroundColor: "rgba(0, 0, 0, 0.5)", color: "rgba(255, 255, 255)"});
		document.body.appendChild(box);
		this.pool.push(box);
	}
}

/**
* @nocollapse
* @export
*/
class Fade {
	
	/**
	* @export
	* @method in: 
	* @param element
	* @param callback
	* @param {...*} var_args
	*/
	static in(element, callback, var_args) {
		let args = Array.prototype.slice.call(arguments, 2);
		let listener = (event) => {
			element.removeEventListener("transitionend", listener);
			callback.apply(this, args);
		};
		element.addEventListener("transitionend", listener);
		SS.removeClass(element, "hide");
		SS.addClass(element, "show");
	}
	
	/**
	* @export
	* @method out: 
	* @param element
	* @param callback
	* @param {...*} var_args
	*/
	static out(element, callback, var_args) {
		let args = Array.prototype.slice.call(arguments, 2);
		let listener = (event) => {
			element.removeEventListener("transitionend", listener);
			callback.apply(this, args);
		};
		element.addEventListener("transitionend", listener);
		SS.removeClass(element, "show");
		SS.addClass(element, "hide");
	}
	
	
}

Views.initialize();