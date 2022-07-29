export default class PokeClass{
  constructor({
    c,
    spriteheet,
    frames,
    ancho,
    isEnemy=false,
    alto,
    position={
      x,
      y
    }
  }){
    this.c = c,
    this.ancho = ancho,
    this.health=100,
    this.isEnemy=isEnemy,
    this.frames=frames,
    this.frameRatio = 0,
    this.alto = alto,
    this.opacity=1,
    this.columnas,
    this.spriteheet = spriteheet,
    this.position={
      x: position.x,
      y: position.y
    }
  }

  draw(){
    const c=this.c
    const pokemon = new Image();
    pokemon.src = this.spriteheet;
    let frame= this.frames
    c.save();//con c global alpha cambiamos la opacidad del canvas pero c save y c restore hacemos que solo afecte al codigo entre medias, basicamente parpadea el pokemon
    c.globalAlpha = this.opacity;
    c.drawImage(
      pokemon,//png
      86 * frame, //donde empieza a cortar en x
      0,//donde empieza a cortar en y
      86, //cuanto corta en x
      89, //cuanto corta en y
      this.position.x,//posicion x
      this.position.y,//posicion y
      86, //ancho de la imagen
      89 //alto de la imagen
    );
    c.restore()
  }

  update(){

     this.frameRatio++;
    if(this.frameRatio==20){
     this.frames+=1;
     this.frameRatio=0
    }

    
    if(this.frames >=3){
      this.frames = 1
    }
    this.draw()
  }

  atack({attack, recipient}){
    const timeline = gsap.timeline();//permite controlar las animaciones de gsap en el tiempo, usando timeline podemos poner un to() detrás de una animación y definir otra, así se van ejecutando en orden
    this.health -= attack.damage;
    let movementDistance= 20;
    if(this.isEnemy){
      movementDistance =-20;
    }
    let healthBar ='#vidaEnemigo'
    if(this.isEnemy){
      healthBar='#vidaLlamita'
    }
   timeline.to(this.position,{
    x: this.position.x-movementDistance,
   }).to(this.position,{
    x:this.position.x +movementDistance*2,
    duration: 0.1,
    onComplete:() =>{
      gsap.to(healthBar,{
        width: this.health + '%'
        
      })
      gsap.to(recipient.position, {
        x: recipient.position.x+10,
        yoyo:true,
        repeat:4,
        duration:0.1,
      })
      gsap.to(recipient, {
        opacity:0,
        repeat:5,
        yoyo:true,
        duration:0.1
      })
    }
   }).to(this.position,{
    x:this.position.x-20
   })
   //un placaje, lo animamos alante y atrás

   //también hace una animación para cuando el enemigo es alcanzado, moviendolo y haciendo que parpade

  }
}
