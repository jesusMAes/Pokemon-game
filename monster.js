//aquí vamos a meter toda la info de los monstruos incluyendo sus ataques y tal lo hace como un objeto que dentro tiene objetos, yo lo haría como un array que dentro tiene objetos pero bueno

const monsters = {
  Llamita: {
  name:'Llamita',
  spriteheet: './assets/sprites/embySprite.png',
  frames:4,
  position:{
    x:300,
    y:450
  }
  },
  Gusano: {
    name:'Gusano',
    spriteheet: './assets/sprites/draggleSprite.png',
    frames:5,
    position:{
      x:800,
      y:150,
    },
    isEnemy:true
  }
}