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
		this.imgFolder = "pictures/";
		this.fileList = ['r.jpeg', 'image3.jpeg', 'image1.jpg', '2.jpeg', 't.jpeg', 'image2.jpg', 'v.jpeg', '5.jpeg', 'p.jpeg', 'images.jpeg', '1.jpeg', '9.jpeg', '0.jpeg', '4.jpeg', 's.jpeg', '8.jpeg']
;
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
		this.time = 0;
		
	}

	async draw() {  // Affichage
		super.draw();
		let i = 0;
		this.width = this.mvc.main.sizeX * 150;
		this.height = this.mvc.main.sizeY * 150;
		this.canvas = HH.create("canvas");
		this.hidden  = HH.create("canvas");
		HH.attr(this.canvas, {"width" : this.width, "height" : this.height});
		HH.attr(this.hidden, {"width" : this.width, "height" : this.height});
		
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
	
	
	async update(){  // Raffraichit l'affichage
		let i = 0, j = 0;
		let one = true;
		while(i< Infinity){
			
			
			j += 1;
			if(one){
				let img = await this.afterXms(this.image[i % this.image.length], 0);
				let dim = this.getDimension(img);
				let rect = this.getRect(img, this.width/2 - dim[0]/2, this.height/2 - dim[1]/2);
				this.fadeIn(img, rect, j);
				this.buffer.drawImage(img,this.width/2 - dim[0]/2,this.height/2 - dim[1]/2, dim[0], dim[1]);
				if(j >= 256){
					let test = await this.afterXms(0, 5000);
					i++;
					j = 0;
					one = (Math.random() > 0.5)? true: false;
				}
			}
			else{
				let img = await this.afterXms(this.image[(i-1) % this.image.length], 0);
				let dim = this.getDimension(img);
				let rect = this.getRect(img, this.width/2 - dim[0]/2, this.height/2 - dim[1]/2);
				let img2 = await this.afterXms(this.image[i % this.image.length], 0);
				let dim2 = this.getDimension(img2);
				let rect2 = this.getRect(img2, this.width/2 - dim2[0]/2, this.height/2 - dim2[1]/2);
				this.context.drawImage(img, (rect.x - j),  this.height/2 - dim[1]/2, dim[0], dim[1]);
				this.context.drawImage(img2, (rect2.x - j) + rect.w,  this.height/2 - dim2[1]/2, dim2[0], dim2[1]);
				if(j >= dim[0]){
					let test = await this.afterXms(0, 5000);
					i++;
					j = 0;
					one = (Math.random() > 0.5)? true: false;
				}
			}
		}		
	}
	
	getRect(img, x, y){
		let dim = this.getDimension(img);
		let rect = {x: x, y: y, w: dim[0], y: dim[1]};
		return rect;
	}
	
	getDimension(img){
		let newWidth;
		let newHeight;
		if(img.width < this.width || img.height < this.height){
			let f = (img.width < img.height && img.width != img.height) ? this.width/img.width : this.height/img.height;
			newWidth = img.width*f;
			newHeight = img.height*f;
		}else {
			let f = (img.width > img.height) ? img.width/this.width : img.height/this.height;
			newWidth = img.width/f;
			newHeight = img.height/f;
		}
		return [newWidth, newHeight];
	}
	
	left (img1, img2, rect1, rect2, frame){
		this.context.drawImage(img1,(rect1.x + frame) % 2 * this.width ,rect1.y, rect1.w, rect1.h);
		this.context.drawImage(img2,(rect2.x + frame) % 2 * this.width ,rect2.y, rect2.w, rect2.h);
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
	}
	
	setUp() {
		super.setUp();
		
	}
	
	async loadImage(){
		let allImg = [];
		for(let i = 0; i < this.mvc.model.fileList.length; i++){
			let src = this.mvc.model.imgFolder + this.mvc.model.fileList[i];
			 this.mvc.model.loadImage(src).then(img => allImg.push(img));
		}
		return allImg;
	}
	
}
