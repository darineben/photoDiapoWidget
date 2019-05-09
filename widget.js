class DiapoPhoto extends Widget {
	
	constructor(id, app) {
		super(id, DiapoPhotoModel, DiapoPhotoView, DiapoPhotoController, app);
	}
	
	setUp() {
		super.setUp();
		this.sizeX = 2;
		this.sizeY = 1.3;
	}
}

class DiapoPhotoModel extends WidgetModel {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		this.imgFolder = "media/";
		this.fileList = ['peuple.jpeg','drole.jpeg','espace.jpeg','chat.jpeg','nature.jpeg',
		'index.jpeg','tel.jpeg','5.jpeg','un.jpeg','s.jpeg','image1.jpg','r.jpeg','adn.jpeg',
		'0.jpeg','deux.jpeg','image3.jpeg','image2.jpg','images.jpeg','1.jpeg','anime.jpeg',
		'six.jpeg','bb.jpeg','culture.jpeg','soleil.jpeg','trois.jpeg','v.jpeg'];
	}
	
	async loadImage(src){  // charger l'image
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = src;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}
}

class DiapoPhotoView extends WidgetView {
	
	constructor() {
		super();
		this.image = []
	}
	
	setUp() {
		super.setUp();
		this.waitTime = 4;
	}

	async draw() {  // Affichage
		super.draw();
		let i = 0;
		this.width = this.mvc.main.sizeX * 150;
		this.height = this.mvc.main.sizeY * 150;
		this.canvas = HH.create("canvas");
		this.canvas.addEventListener("click",() => this.toggle(this));
		this.hidden  = HH.create("canvas");
		HH.attr(this.canvas, {"width" : this.width, "height" : this.height});
		HH.attr(this.hidden, {"width" : this.width, "height" : this.height});
		SS.style(this.stage, {"background-color" : "black"});
		this.stage.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		this.buffer = this.hidden.getContext("2d");
		this.image = await (new Promise(async resolve => {
				let x = await this.afterXms(this.mvc.controller.loadImage());
				resolve(x);
			})).catch((e) => {
				console.log(e);
			});
		this.update();
	}
	
	toggle(){ // change l'etat de la variable booléenne useFilter du controller
		this.mvc.controller.toggle();
	}
	
	useFilter(){ //renvoie  l'etat de la variable booléenne useFilter du controller
		return this.mvc.controller.useFilter();	
	}
	
	applyFilter(){ //applique un filtre sur l'image
			let pixels = this.buffer.getImageData(0,0,this.width, this.height);
			for (let x = 0 ;x < this.width*this.height *4; x+=4){
				let sum = (pixels.data[x] + pixels.data[x+1] + pixels.data[x+2]) / 3
				pixels.data[x] = sum;
				pixels.data[x+1] = sum;
				pixels.data[x+2] = sum;
			}
		   this.context.putImageData(pixels, 0,0);
	}
	
	async update(){  // Raffraichit l'affichage
		let i = 0, j = 0;
		let one = true;
		while(i< Infinity){
			if(one){
				let img = await this.afterXms(this.image[i % this.image.length], 0);
				let dim = this.getDimension(img);
				let rect = this.getRect(img, this.width/2 - dim[0]/2, this.height/2 - dim[1]/2);
				this.fadeIn(img, rect, j);
				this.buffer.drawImage(img,this.width/2 - dim[0]/2,this.height/2 - dim[1]/2, dim[0], dim[1]);
				if(this.useFilter()){
					this.applyFilter();
				}	
				if(j >= 256){
					if(this.checkTime(this.waitTime * 1000 + 1500)){
						i++;
						j = 0;
						one = (Math.random() > 0.5)? true: false;
						this.resetTime();
					}
				}
				else{
					j+= 1;
				}
			}
			else{
				let img = await this.afterXms(this.image[(i-1) % this.image.length], 0);
				let dim = this.getDimension(img);
				let rect = this.getRect(img, this.width/2 - dim[0]/2, this.height/2 - dim[1]/2);
				let img2 = await this.afterXms(this.image[i % this.image.length], 0);
				let dim2 = this.getDimension(img2);
				let rect2 = this.getRect(img2, this.width/2 - dim2[0]/2, this.height/2 - dim2[1]/2);
				if(this.useFilter()){
					this.buffer.drawImage(img, (rect.x - j),  this.height/2 - dim[1]/2, dim[0], dim[1]);
					this.buffer.drawImage(img2, (rect2.x - j) + rect.w,  this.height/2 - dim2[1]/2, dim2[0], dim2[1]);
					this.applyFilter();
				}else{
					this.context.drawImage(img, (rect.x - j),  this.height/2 - dim[1]/2, dim[0], dim[1]);
					this.context.drawImage(img2, (rect2.x - j) + rect.w,  this.height/2 - dim2[1]/2, dim2[0], dim2[1]);
				}
				if(j >= dim[0]){
					if(this.checkTime(this.waitTime * 1000 + 2700)){
						i++;
						j = 0;
						one = (Math.random() > 0.5)? true: false;
						this.resetTime();
					}
				}
				else{
					j+= 1;
				}
			}
		}
	}
	
	getRect(img, x, y){ // renvoie un object rect fait à partir d'une image
		let dim = this.getDimension(img);
		let rect = {x: x, y: y, w: dim[0], y: dim[1]};
		return rect;
	}
	
	getDimension(img){ // Renvoie les dimension idéal pour afficher une image
		let newWidth;
		let newHeight;
		
		if(img.width < this.width || img.height < this.height){
			let f = (img.width < img.height && img.width != img.height) ? this.width/img.width : this.height/img.height;
			newWidth = img.width*f;
			newHeight = img.height*f;
			if(newWidth < this.width){
				f = this.width/img.width
				newWidth = img.width*f;
				newHeight = img.height*f;
			}
			if(newHeight < this.height){
				f = this.width/img.height
				newWidth = img.width*f;
				newHeight = img.height*f;
			}
		}else {
			let f = (img.width > img.height) ? img.width/this.width : img.height/this.height;
			newWidth = img.width/f;
			newHeight = img.height/f;
		}
		return [newWidth, newHeight];
	}
	
	resetTime(){ // demande au controller de reprendre le temps 
		this.mvc.controller.resetTime();
	}
	
	checkTime(x){ // demande au controller de vérifer le temps
		return this.mvc.controller.checkTime(x);
	}
	
	fadeIn(img, rect, frame){ // transition 1 par changement d'opacité
			this.buffer.drawImage(img,rect.x,rect.y, rect.w, rect.h);
			let pixels = this.buffer.getImageData(0,0,this.width, this.height);
			for (let x = 3 ;x < this.width*this.height *4; x+=4){
				pixels.data[x] = Math.floor(frame);
			}
		   this.context.putImageData(pixels, 0,0);
	}
	
	async afterXms(x, y = 50) { // fonction d'affection de variables avec un délais
		return new Promise (resolve => {
			setTimeout(() => {
				resolve(x);
			}, y);
		});
	} 

	
}

class DiapoPhotoController extends WidgetController {
	
	constructor() {
		super();
		this.filter = false;
		this.lastTime = new Date().getTime();
	}
	
	setUp() {
		super.setUp();
		
	}
	
	async loadImage(){ // renvoie une liste d'image charger par le controller
		let allImg = [];
		for(let i = 0; i < this.mvc.model.fileList.length; i++){
			let src = this.mvc.model.imgFolder + this.mvc.model.fileList[i];
			 let img = this.mvc.model.loadImage(src);
			 allImg.push(img);
		}
		return allImg;
	}
	 toggle(){ // inverse l'etat de la variable booléenne
	 	this.filter = !this.filter;
	 }
	 
	 resetTime(){ // recupère le timestamp unix
	 	this.lastTime = new Date().getTime();
	 }
	 
	 checkTime(x){// verifie si x milliseconde se sont ecoulé depuis la derniere utilisation de la fonction checkTime
	 let deltaTime = new Date().getTime() - this.lastTime;
	 	return x <= (deltaTime);
	 }
	 
	 
	 useFilter(){ //renvoie la booléenne
	 	return this.filter;
	 }
}
