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
		HH.attr(this.canvas, {"width" : this.width, "height" : this.height});
		
		this.stage.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		this.context.rect(50, 50, 100, 100);
		this.context.stroke();
		
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
		let i = 0;
		while(i< Infinity){
			let img = await this.afterXms(this.image[i % this.image.length], 1000);
			let f = (img.width > img.height) ? img.width/this.width : img.height/ this.height;
			let newWidth = img.width/f;
			let newHeight = img.height/f;
			this.context.clearRect(0,0,this.width, this.height);
			this.context.drawImage(img,this.width/2 - newWidth/2,this.height/2 - newHeight/2, newWidth, newHeight);
			i++;
		}
		
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
