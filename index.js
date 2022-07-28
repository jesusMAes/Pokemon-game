import Background from './background.js'
import Player from './Player.js';
const canvas = document.querySelector('canvas');

canvas.width= window.innerWidth;
canvas.height= window.innerHeight-20;


const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false

const collisionsMap = []
for(let i=0; i< collisions.length; i+=70){
  collisionsMap.push(collisions.slice(i,70+i))
}

let backgroundImageX = -1050;
let backgroundImageY = -550;

const offset = {
  x: -1050,
  y:-550
}


class Boundary {
  static width = 48
  static height = 48
  constructor({position}){
    this.position ={ 
      x: position.x,
      y: position.y
    }
    this.width = 48
    this.height= 48
  }

  draw({offset}){
    c.fillStyle = 'red'
    c.fillRect(this.position.x+offset.x, this.position.y+offset.y, this.width, this.height)
  }
}

const boundaries = []
//recorre el array que guarda dentro arrays con cada fila del mapa, la i hace referencia a la columna asi que la posición en Y será i*el alto de la columna, la x igual pero con el ancho
collisionsMap.forEach((row, i)=> {
  row.forEach((symbol, j) =>{
    if(symbol==1025){
    boundaries.push(
      new Boundary(
        {
          position:{
           x: j * Boundary.width,
           y: i * Boundary.height
          }
        }))}
  })
});


let source = './assets/PokeIslan.png'

const background = new Background(
  {
  source,
  backgroundImageX,
  backgroundImageY
});

const player = new Player({c});




function animate (){
 window.requestAnimationFrame(animate)
 background.update(c)
  boundaries.forEach(boundary =>{
   boundary.draw({offset})
  })

 player.update();
  
}
animate ();


window.addEventListener('keydown', (e) =>{
  
  switch (e.key){
    case 'a':
      case 'ArrowLeft':
        player.cambiaSprite("izquierda")
        background.move("izquierda")
        offset.x +=7;

        break;
    case 'd':
      case 'ArrowRight':
        player.cambiaSprite("derecha")
        background.move("derecha")
        offset.x -=7;
        
        break;
    case 's':
      case 'ArrowDown':
      player.cambiaSprite("abajo")
      background.move("abajo")
      offset.y -=7;

      break;
    
    case 'w':
      case 'ArrowUp':
        player.cambiaSprite("arriba")
        background.move("arriba")
        offset.y +=7;

        break
  }

});