 export default class Background {
  constructor ({
    backgroundImageX,
    backgroundImageY,
    source,
    width,
    heigt
  }){
    this.position ={
      x:backgroundImageX,
      y:backgroundImageY//la primera vez lo creamos aquí luego lo movemos
    }
    this.src= source
    this.width=width,
    this.heigt=heigt
    
  }

  draw(c){
    const image = new Image;
    image.src = this.src
   
    c.drawImage(image, this.position.x, this.position.y)
    if(this.width!=''){
      c.drawImage(image, this.position.x, this.position.y, this.width, this.heigt)
    }
  }

  update (c){
    this.draw(c);  
  }
  move(direccion){
    switch (direccion){
      case "arriba":
        this.position.y +=7;
        break
      case "derecha":
        this.position.x -=7;
        break
      case "izquierda":
        this.position.x +=7;;
        break
      case "abajo":
        this.position.y -=7;
        break
    }
  }
  
}

