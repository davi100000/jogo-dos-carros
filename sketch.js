var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount,gameState;
var img1
var img2
var track
var car1
var car2
var cars=[]
var allPlayers
var fuels
var coins
var fuelImg
var coinsImg
var obstacles
var obstacle1Image
var obstacle2Imag
var lifeImage
var blastImage

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  img1 = loadImage("./assets/car1.png");
  img2 = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelImg = loadImage("./assets/fuel.png");
  coinsImg = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");
  
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.updateState(1)
  }
  if (gameState === 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
