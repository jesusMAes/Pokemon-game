import Background from './background.js'
import Player from './Player.js';
const canvas = document.querySelector('canvas');


canvas.width= window.innerWidth;
canvas.height= window.innerHeight-20;


const c = canvas.getContext('2d');

gsap.to('#blackscreen', {
  opacity: 1,
  repeat: 3,
  yoyo:true,
  duration:0.3
})
const collisionsMap = []
for(let i=0; i< collisions.length; i+=70){
  collisionsMap.push(collisions.slice(i,70+i))
}


const battleZones =[];
for(let i=0; i< battlezones.length; i+=70){
  battleZones.push(battlezones.slice(i,70+i))
}

let backgroundImageX = -1050;
let backgroundImageY = -550;


const offset = {
  x: -1050,
  y: -550
}


class Boundary {
  static width = 48
  static height = 48
  constructor({position}){
    this.position ={ 
      x: position.x + offset.x,
      y: position.y + offset.y
    }
    this.width = 48
    this.height= 48
  }

  draw(color){
    c.fillStyle = color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  move(direccion){
    switch (direccion){
      case 'izquierda':
          this.position.x +=7;
          break;
      case 'derecha':
          this.position.x -=7;
          break;
      case 'abajo':
          this.position.y -=7;
        break;
      
      case 'arriba':
          this.position.y +=7;
          break
    }
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

const battleZonesMap=[];
battleZones.forEach((row, i)=> {
  row.forEach((symbol, j) =>{
    if(symbol==1025){
    battleZonesMap.push(
      new Boundary(
        {
          position:{
           x: j * Boundary.width,
           y: i * Boundary.height
          }
        }))}
  })
});




function rectangularCollision({rectangle1, rectangle2}){

return (
  rectangle1.position.x + rectangle1.width/2 > rectangle2.position.x &&
  rectangle1.position.x < rectangle2.position.x + rectangle2.width/2 &&
  rectangle1.position.y < rectangle2.position.y+rectangle2.height/2 &&
  rectangle1.position.y + rectangle1.height*1.2 > rectangle2.position.y)
}




let source = './assets/PokeIslan.png'

const background = new Background(
  {
  source,
  backgroundImageX,
  backgroundImageY
});

let fore = './assets/foreground.png'

const foreground = new Background({
  source:fore,
  backgroundImageX,
  backgroundImageY
});

let hierbaAlta = './assets/battlezones.png';
const hierba = new Background({
  source: hierbaAlta,
  backgroundImageX,
  backgroundImageY
})


const detalles = [];
detalles.push(foreground,hierba)
const player = new Player({c});

let moving = true


function animate (){
  
 window.requestAnimationFrame(animate)
 background.update(c)
  boundaries.forEach(boundary =>{
   boundary.draw('rgba(0,0,0,0)')
  });
  hierba.draw(c);
  battleZonesMap.forEach(zone =>{
    zone.draw('blue')
  })


 player.update();

 foreground.update(c)
  
}

animate ();


let BatallaActiva=false;

const battle ={
  initiated:false
}
function activarBatalla(){
  if(battle.initiated==true){
    return
    //sale de la función activar batalla sin mirar nada más, cuando acabemos el combate la volvemos a poner en false
  }
  for(let i=0; i<battleZonesMap.length;i++){
    const battlezone = battleZonesMap[i];
    const overlappingArea = 
    (Math.min(
      player.position.x+player.width,
      battlezone.position.x+battlezone.width
      ) -
      Math.max(player.position.x, battlezone.position.x)) * (Math.min(player.position.y+player.height, battlezone.position.y+battlezone.height) - Math.max(player.position.y, battlezone.position.y))
    if(
      rectangularCollision({
       rectangle1:player,
       rectangle2: battlezone
       })==true && 
       overlappingArea > (player.width * player.height/2) &&
       Math.random()<0.09//hacemos más dificil que se active la batalla
      ){//if

      battle.initiated=true
      console.log(battle)
      
      break
    
    }
  }
}

window.addEventListener('keydown', (e) =>{
  moving = true;
  if(battle.initiated==true){
    moving =false //evitamos que se mueva 
  }

  switch (e.key){
    case 'a':
      case 'ArrowLeft':
        player.cambiaSprite("izquierda")
        for(let i=0; i<boundaries.length;i++){
          const boundary = boundaries[i];
          if(
            rectangularCollision({
             rectangle1:player,
             rectangle2: {...boundary, position:{
              x:boundary.position.x+7,
              y:boundary.position.y
                  }}
             })//rectangularcollision
            ){//if
            moving = false
            break
          }//fin del if
        }
        activarBatalla();


        if(moving==true){
        background.move("izquierda")
        detalles.forEach(detalle => {
          detalle.move("izquierda");
        })

        boundaries.forEach(boundary =>{
        boundary.move("izquierda")
        })
        battleZonesMap.forEach(batle =>{
          batle.move("izquierda")
          })
        
      }

        break;
    case 'd':
      case 'ArrowRight':
        player.cambiaSprite("derecha")
        for(let i=0; i<boundaries.length;i++){
          const boundary = boundaries[i];
          if(
            rectangularCollision({
             rectangle1:player,
             rectangle2: {...boundary, position:{
              x:boundary.position.x-7,
              y:boundary.position.y
                  }}
             })//rectangularcollision
            ){//if
            moving = false
            break
          }//fin del if
        }
        activarBatalla();

        if(moving){
        background.move("derecha")
        detalles.forEach(detalle => {
          detalle.move("derecha");
        })
        boundaries.forEach(boundary =>{
          boundary.move("derecha")
          })
        battleZonesMap.forEach(batle =>{
          batle.move("derecha")
          })
        }

        
        break;
    case 's':
      case 'ArrowDown':
      player.cambiaSprite("abajo")
      for(let i=0; i<boundaries.length;i++){
        const boundary = boundaries[i];
        if(
          rectangularCollision({
           rectangle1:player,
           rectangle2: {...boundary, position:{
            x:boundary.position.x,
            y:boundary.position.y-7
                }}
           })//rectangularcollision
          ){

          moving = false
          break
        }//fin del if
      }
      activarBatalla();


      if(moving){
      background.move("abajo")
      detalles.forEach(detalle => {
        detalle.move("abajo");
      })

      boundaries.forEach(boundary =>{
        boundary.move("abajo")
        })
        battleZonesMap.forEach(batle =>{
          batle.move("abajo")
          })
      }

      break;
    
    case 'w':
      case 'ArrowUp':
        player.cambiaSprite("arriba")
        for(let i=0; i<boundaries.length;i++){
          const boundary = boundaries[i];
          if(
            rectangularCollision({
             rectangle1:player,
             rectangle2: {...boundary, position:{
              x:boundary.position.x,
              y:boundary.position.y+7
                  }}
             })//rectangularcollision
            ){//if

            moving = false
            break
          }//fin del if
        }
        activarBatalla();

        //condicion para moverse arriba
        if(moving){
        background.move("arriba")
        detalles.forEach(detalle => {
          detalle.move("arriba");
        })
        // foreground.move("arriba")
        boundaries.forEach(boundary =>{
          boundary.move("arriba")
          })
          battleZonesMap.forEach(batle =>{
            batle.move("arriba")
            })
        }


        break
  }

});