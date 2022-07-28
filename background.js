 export default class Background {
  constructor ({
    backgroundImageX,
    backgroundImageY,
    source
  }){
    this.position ={
      x:backgroundImageX,
      y:backgroundImageY//la primera vez lo creamos aquí luego lo movemos
    }
    this.src= source
    
  }

  draw(c){
    const image = new Image;
    image.src = this.src
   
    c.drawImage(image, this.position.x, this.position.y)
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

