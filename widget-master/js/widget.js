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
		this.fileList = ["image1.jpg", "image2.jpg", "image3.jpeg"];
	}
	
	loadImage(){
		this.stockerListe = [];
		for(let i = 0; i < this.fileList.length; i++){
			let img = HH.create("img");
			HH.attr(img, {"src" : this.imgFolder + this.fileList[i]});
			this.stockerListe.push(img);
		}
		console.log(this.stockerListe);
		return this.stockerListe;
	}

}

class DiapoPhotoView extends WidgetView {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}

	draw() {
		super.draw();
		let i = 0;
		let width = this.mvc.main.sizeX * 150;
		let height = this.mvc.main.sizeY * 150;
		let a = this.mvc.controller.loadImage();
		a[i].width = width;
		this.stage.appendChild(a[i]);
	}

	
}

class DiapoPhotoController extends WidgetController {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}
	
	loadImage(){
		return this.mvc.model.loadImage();
	}
	
}
