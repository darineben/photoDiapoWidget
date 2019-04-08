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
	
	async loadImage(src){
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

	async draw() {
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
		this.f1();
		this.update();
		
	}
	
	async f1(){
		let x = await this.afterXms(10);
		console.log(x);
	}
	async update(){
		let i = 0, j = 0;
		while(i< Infinity){
			let img = await this.afterXms(this.image[i % this.image.length], 0);
			let newWidth;
			let newHeight;
			if(img.width < this.width || img.height < this.height){
				let f = await (img.width < img.height) ? this.width/img.width : this.height/img.height;
				newWidth = img.width*f;
				newHeight = img.height*f;
			}else {
				let f = await (img.width > img.height) ? img.width/this.width : img.height/this.height;
				newWidth = img.width/f;
				newHeight = img.height/f;
			}
			let 	rect = {x: this.width/2 - newWidth/2, y: this.height/2 - newHeight/2, w: newWidth, y: newHeight};
			this.buffer.drawImage(img,this.width/2 - newWidth/2,this.height/2 - newHeight/2, newWidth, newHeight);
			await this.fadeIn(img, rect, j);
			j += 1;
			if(j >= 256){
				let test = await this.afterXms(0, 5000);
				i++;
				j = 0;
			}
		}		
	}
	
	async fadeIn(img, rect, frame){
			this.buffer.drawImage(img,rect.x,rect.y, rect.w, rect.h);
			let pixels = this.buffer.getImageData(0,0,this.width, this.height);
			for (let x = 3 ;x < this.width*this.height *4; x+=4){
				pixels.data[x] = Math.floor(frame);
			}
		   this.context.putImageData(pixels, 0,0);
	}
	
	afterXms(x, y = 50) {
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
