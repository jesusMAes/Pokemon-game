import Sprites from "./sprites.js";

export default class PokeClass{
  constructor({
    name,
    c,
    spriteheet,
    frames,
    ancho,
    isEnemy=false,
    alto,
    position={
      x,
      y
    },
    attacks
  }){
    this.name=name,
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
    this.attacks=attacks
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

  attack({attack, recipient, renderedSprites}){
    //mostrar el dialogo del ataque
    let dialogo =  document.querySelector('#dialogue');
    dialogo.style.display ='block';
     dialogo.innerHTML= this.name+ ' usó '+attack.name+'. Hace '+ attack.damage+' puntos de daño.';

    let healthBar ='#vidaEnemigo'
        if(this.isEnemy){
          healthBar='#vidaLlamita'
        }
    recipient.health -= attack.damage;
    const c=this.c
    switch(attack.name){
      case 'Fireball':
        audio.initFireball.play();
       const fireball = new Sprites({
        c,
        position: this.position,
        width: 64,
        height: 64,
        source:'./assets/sprites/fireball.png',
        frames:2
       })
       renderedSprites.push(fireball)

       gsap.to(fireball.position, {
        x:recipient.position.x,
        y:recipient.position.y,
        onComplete: ()=> {
          //golpea enemigo
          gsap.to(healthBar,{
            width: recipient.health + '%'
            
          })
          gsap.to(recipient.position, {
            x: recipient.position.x+10,
            yoyo:true,
            repeat:3,
            duration:0.1,
          })
          audio.fireballHit.play()
          gsap.to(recipient, {
            opacity:0,
            repeat:5,
            yoyo:true,
            duration:0.1
          })
          renderedSprites.pop()
        }
       })
       break
      case 'Tackle':
        const timeline = gsap.timeline();//permite controlar las animaciones de gsap en el tiempo, usando timeline podemos poner un to() detrás de una animación y definir otra, así se van ejecutando en orden

        let movementDistance= 20;
        if(this.isEnemy){
          movementDistance =-20;
        }
        
       timeline.to(this.position,{
        x: this.position.x-movementDistance,
       }).to(this.position,{
        x:this.position.x +movementDistance*2,
        duration: 0.1,
        onComplete:() =>{
          //golpea enemigo
          gsap.to(healthBar,{
            width: recipient.health + '%'
            
          })
          gsap.to(recipient.position, {
            x: recipient.position.x+10,
            yoyo:true,
            repeat:3,
            duration:0.1,
          })
          audio.tackleHit.play(),
          gsap.to(recipient, {
            opacity:0,
            repeat:5,
            yoyo:true,
            duration:0.1
          })
        }
       }).to(this.position,{
         x:this.position.x,//vuelve a la posición
         
        })
        break
    }

   
  
   //un placaje, lo animamos alante y atrás

   //también hace una animación para cuando el enemigo es alcanzado, moviendolo y haciendo que parpade

  }

  faint(){
    let dialogo =  document.querySelector('#dialogue');
    dialogo.innerHTML = this.name + ' ha sido derrotado! '
    gsap.to(this.position, {
        y: this.position.y+20
    })
    audio.battle.stop()
    audio.victory.play()
    gsap.to(this,{
      
      opacity:0,
    })
  }
}
