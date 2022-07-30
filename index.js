import Background from './background.js'
import Player from './Player.js';
import Pokemon from './PokeClass.js'
import Sprites from './sprites.js';

const canvas = document.querySelector('canvas');


canvas.width= 1024;
canvas.height= 768;


const c = canvas.getContext('2d');


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

let animationId=0;
function animate (){
  
 animationId= window.requestAnimationFrame(animate);
 console.log(animationId)
 background.update(c)
  boundaries.forEach(boundary =>{
   boundary.draw('rgba(0,0,0,0)')
  });
  hierba.draw(c);
  battleZonesMap.forEach(zone =>{
    zone.draw('rgba(0,0,0,0)')
  })


 player.update();

 foreground.update(c)
  
}

//escena de moverse por el mundo
// animate ();
let gusano  
//  new  Pokemon({
//   name:'Gusano',
//   c,
//   spriteheet: './assets/sprites/draggleSprite.png',
//   frames:5,
//   position:{
//     x:800,
//     y:150,
//   },
//   isEnemy:true,
//   attacks:[attacks.Tackle, attacks.Fireball]
// });

let llamita = new Pokemon({
  name:'Llamita',
  c,
  spriteheet: './assets/sprites/embySprite.png',
  frames:4,
  position:{
    x:300,
    y:450
  },
  attacks:[attacks.Tackle, attacks.Fireball]
})

//escena de peleas

const battleBackground = new Background({
  backgroundImageX: 0,
  backgroundImageY: 0,
  source: './assets/battleBackground.png',
  width:canvas.width,
  heigt:canvas.height
})

let renderedSprites =[gusano,llamita];
const botones = document.querySelector('#ataques');
let battleAnimationId;
let queue = []

//la llamamos al inicio de cada batalla para resetear la interfaz
function initBattle(){
  document.querySelector('#userInterface').style.display='block'
  document.querySelector('#dialogue').style.display='none'
  document.querySelector('#vidaEnemigo').style.width='100%'
  document.querySelector('#vidaLlamita').style.width='100%'
  document.querySelector('#ataques').replaceChildren()
  gusano = new  Pokemon({
    name:'Gusano',
    c,
    spriteheet: './assets/sprites/draggleSprite.png',
    frames:5,
    position:{
      x:800,
      y:150,
    },
    isEnemy:true,
    attacks:[attacks.Tackle, attacks.Fireball]
  });
  llamita = new Pokemon({
    name:'Llamita',
    c,
    spriteheet: './assets/sprites/embySprite.png',
    frames:4,
    position:{
      x:300,
      y:450
    },
    attacks:[attacks.Tackle, attacks.Fireball]
  });
  renderedSprites =[gusano,llamita];
  //metemos los botones en initbatle por si cambian los ataques que se generen al inicio
  llamita.attacks.forEach(attack =>{
    const boton = document.createElement('button');
    boton.innerHTML = attack.name
    botones.append(boton);
  })
  //vaciamos la cola de acciones 
  queue = []

//event listener para las peleas
document.querySelectorAll('button').forEach(button =>{
  button.addEventListener('click', (e) => {
    const selectedAtack = attacks[e.currentTarget.innerHTML];
    llamita.attack({
      attack:selectedAtack,
      recipient: gusano,
      renderedSprites
    });
    if(gusano.health <=0){
      //cuando el enemigo muere
      queue.push(()=>{  
        gusano.faint()
       
      })
       //cortinilla y volvemos al mapa
       queue.push(()=>{  
        gsap.to('#blackscreen',{
          opacity:1,
          onComplete: () =>{
            window.cancelAnimationFrame(battleAnimationId)
            animate()
            document.querySelector('#userInterface').style.display='none'
            gsap.to('#blackscreen',{
              
              opacity:0

            })
            battle.initiated=false

          }
        })
      })
    }
    
    //ataque enemigo
    const randomAttack=gusano.attacks[Math.floor(Math.random()*gusano.attacks.length)];

    queue.push(()=>{  
      gusano.attack({
        attack:randomAttack,
        recipient: llamita,
        renderedSprites
      });
      if(llamita.health <=0){
        //cuando el tu mueres
        queue.push(()=>{  
          llamita.faint()
        })  
        gsap.to('#blackscreen',{
          opacity:1,
          onComplete: () =>{
            window.cancelAnimationFrame(battleAnimationId)
            animate()
            document.querySelector('#userInterface').style.display='none'
            gsap.to('#blackscreen',{
              opacity:0
            })
            battle.initiated=false
          }
        })
      }
    })
  })
 
  button.addEventListener('mouseenter', (e)=>{
    const selectedAtack = attacks[e.currentTarget.innerHTML];
    
    document.querySelector('#tipoAtaque').innerHTML=selectedAtack.type+'<br> Damage: '+selectedAtack.damage+'%';
    document.querySelector('#tipoAtaque').style.color=selectedAtack.color;

    
  })
  button.addEventListener('mouseleave', (e)=>{
    document.querySelector('#tipoAtaque').innerHTML='Attack Type';
    document.querySelector('#tipoAtaque').style.color='black';
  })
});

}//FIN INIT BATTLE
function animateBattle(){
  battleAnimationId=window.requestAnimationFrame(animateBattle)
  //eso almacena el frame en battle animation y al mismo tiempo ejecuta la animación en bucle
  battleBackground.update(c)

 gusano.update()
 llamita.update()

  renderedSprites.forEach((sprite)=>{
    sprite.draw();
  })
 
}
initBattle()
animateBattle()


document.querySelector('#dialogue').addEventListener('click', (e)=>{
  if(queue.length >0){
    queue[0]();//así ejecutamos una función almacenada en el array
    queue.shift()
  }else{
  e.currentTarget.style.display='none'
  }
})


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
       //desactivamos el animate actual
       window.cancelAnimationFrame(animationId)
      gsap.to('#blackscreen', {
        opacity: 1,
        repeat: 2,
        yoyo: true,
        duration: 0.3,
        onComplete() {
          //llamamos a init battle para que ponga la interfaz
          initBattle()
          gsap.to('#blackscreen', {
            opacity: 1,
            onComplete() {
              //activamos una nueva animación cuando acaba anterior
              animateBattle()
              gsap.to('#blackscreen', {
                opacity: 0

              })
            }
          })
        }
        
      })
      
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