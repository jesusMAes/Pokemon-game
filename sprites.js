export default class Sprites {
  constructor({
    c,
    position,
    width,
    height,
    source,
    frames
  }){
  this.c = c,
  this.position ={
    x: position.x,
    y: position.y
  },
  this.spritesheet = source,
  this.width = width,
  this.height = height,
  this.frames = frames,
  this.currentFrame = 1
  this.frameRatio = 0
  }

  draw(){
    this.frameRatio+=1
    if(this.frameRatio ==10){
    this.currentFrame++
    this.frameRatio=0
    }
    if(this.currentFrame>=this.frames){
      this.currentFrame=0
    }
    const c= this.c;
    const image = new Image();
   
    image.src =this.spritesheet;

    c.drawImage(
      image,
      this.width * this.currentFrame,
      0,
      this.width,
      this.height-5,
      this.position.x+15,
      this.position.y,
      this.width,
      this.height
      
     )

  }

}