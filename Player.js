

export default class Player {
  constructor ({
    c
  }){
    
    //vamos a recibir el context por parametros para dibujar
    this.c = c
    this.frameRatio =0
    this.actualFrame=1
    this.spriteSheet = {//al pulsar tecla decimos que current sprite es una de estas
      stand:{
        frames:4,
        y:0
      },
      runLeft:{
        frames:3,
        y:48
      },
      runRight:{
        frames:3,
        y:96
      },
      runUp:{
        frames:3,
        y:144
      }
    }
    this.currentSprite= this.spriteSheet.stand
    
   
  }
 
  draw(){
    const c = this.c
    //dibujamos en funcion de current sprite. como la x coincide en todas current sprite solo cambiara la y
    const personaje = new Image();
    personaje.src = './assets/sprites/player.png'
    c.drawImage(
    personaje,
    48*this.actualFrame,
    this.currentSprite.y,
    48,
    48,
    410,
    480,
    48,
    48
    );
    
  }
  //frame ratio sirve para ralentizar la sucesión de frames del spritesheet
  update(){
    this.frameRatio++
    if(this.frameRatio %18==0){
    this.actualFrame++
    }
    if(this.actualFrame >=3){
      this.actualFrame=1
    }

    this.draw()
  }
  //en lugar de meter el codigo de las keys podemos hacer un metodo que las cambie y llamarlo allí
  cambiaSprite(direccion){
    switch (direccion){
      case "arriba":
        this.currentSprite = this.spriteSheet.runUp;
        break
      case "derecha":
        this.currentSprite = this.spriteSheet.runRight;
        break
        case "izquierda":
          this.currentSprite = this.spriteSheet.runLeft;
          break
        case "abajo":
        this.currentSprite = this.spriteSheet.stand;
        break
    }
    
  }
}