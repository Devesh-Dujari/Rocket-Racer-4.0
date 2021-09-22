//Declaring variables.
var backgroundImg;

var rocket, rocketImg;
var space, spaceImg;
var comet, cometImg, cometGroup;
var bronzeCoin, bronzeCoinImg, bronzeCoinGroup;
var silverCoin, silverCoinImg, silverCoinGroup;
var goldCoin, goldCoinImg, goldCoinGroup;
var weapon, weaponImg, weaponGroup;
var fuel, fuelImg, fuelGroup;

var gameOver, gameOverImg;
var restart, restartImg;

var gameState = "PLAY";
var distance = 0;
var coinCount = 0;
var deaths = 0;
var weaponCount = 10;
var fuelCount = 100;

function preload() {
  //Loading images in variables.
  backgroundImg = loadImage("images/rocketRacer.jpg");

  rocketImg = loadImage("images/rocket.png");
  spaceImg = loadImage("images/space.jpg");

  cometImg = loadImage("images/comet.png");
  bronzeCoinImg = loadImage("images/bronzeCoin.png");
  silverCoinImg = loadImage("images/silverCoin.png");
  goldCoinImg = loadImage("images/goldCoin.png");
  weaponImg = loadImage("images/weapon.png");
  fuelImg = loadImage("images/fuel.png");

  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(400, 500);

  //Creating space.
  space = createSprite(200, 150, 20, 20);
  space.addImage(spaceImg);
  space.scale = 0.86;
  space.velocityY = 8;

  rocket = createSprite(200, 380, 20, 20);
  rocket.addImage(rocketImg);
  rocket.scale = 0.125;
  //rocket.debug=true;
  rocket.setCollider("rectangle", 0, -200, 400, 600);

  gameOver = createSprite(200, 220, 10, 10);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.35;
  gameOver.visible = false;

  restart = createSprite(200, 300, 10, 10);
  restart.addImage(restartImg);
  restart.scale = 0.15;
  restart.visible = false;
  //restart.debug = true;
  restart.setCollider("circle", 0, 0, 300);

  cometGroup = new Group();
  bronzeCoinGroup = new Group();
  silverCoinGroup = new Group();
  goldCoinGroup = new Group();
  weaponGroup = new Group();
  fuelGroup = new Group();
}

function draw() {
  background(0);

  /*if(gameState === "START")
    {
      background(backgroundImg);
      
      space.visible = false;
      rocket.visible = false;
      
      fill(0);
      stroke(255);
      textSize(30);
      text("Press Space to continue", 40, 470);
      
      if(keyDown("space"))
        {
          gameState = "PLAY";
        }
    }*/

  if (gameState === "PLAY") {
    distance = distance + Math.round(getFrameRate() / 50);

    rocket.visible = true;
    space.visible = true;
    gameOver.visible = false;
    //restart.visible = false;

    space.velocityY = 8;

    //Regenerating the background.
    if (space.y > 350) {
      space.y = height / 2;
    }

    //Making rocket move when arrow keys are pressed.
    if (keyDown("right_arrow")) {
      rocket.x = rocket.x + 3;
    }

    if (keyDown("left_arrow")) {
      rocket.x = rocket.x - 3;
    }

    //Making rocket come back from the other side if it goes out from one.
    if (rocket.x > 415) {
      rocket.x = -15;
    }

    if (rocket.x < -15) {
      rocket.x = 415;
    }

    //Function call.
    spawnComets();
    spawnBronzeCoins();
    spawnSilverCoins();
    spawnGoldCoins();
    spawnFuel();

    //Incresing coinCount if rocket Touches coins.
    if (bronzeCoinGroup.isTouching(rocket)) {
      coinCount += 1;
      //to destroy only one touched coin
      bronzeCoinGroup.get(0).destroy();
    }

    if (silverCoinGroup.isTouching(rocket)) {
      coinCount += 5;
      //to destroy only one touched coin
      silverCoinGroup.get(0).destroy();
    }

    if (goldCoinGroup.isTouching(rocket)) {
      coinCount += 10;
      //to destroy only one touched coin
      goldCoinGroup.get(0).destroy();
    }

    if (weaponGroup.isTouching(cometGroup)) {
      //To destroy that single coin touched.
      cometGroup.get(0).destroy();
    }

    if (weaponGroup.isTouching(bronzeCoinGroup)) {
      //To destroy that single coin touched.
      bronzeCoinGroup.get(0).destroy();
    }

    if (weaponGroup.isTouching(silverCoinGroup)) {
      //To destroy that single coin touched.
      silverCoinGroup.get(0).destroy();
    }

    if (weaponGroup.isTouching(goldCoinGroup)) {
      //To destroy that single coin touched.
      goldCoinGroup.get(0).destroy();
    }

    if (keyDown("up_arrow") && weaponCount > 0) {
      spawnWeapons();
      weaponCount -= 1;
    }

    if (frameCount % 500 === 0) {
      fuelCount -= 1;
    }

    if (rocket.isTouching(fuelGroup)) {
      fuelCount += 10;
      //To destroy only the fuel tank touched.
      fuelGroup.get(0).destroy();
    }

    if (cometGroup.isTouching(rocket)) {
      gameState = "END";
      space.velocityY = 0;
      deaths += 1;
    }
  }

  if (gameState === "END") {
    gameOver.visible = true;
    restart.visible = true;
    rocket.visible = false;

    rocket.x = 200;
    rocket.y = 380;

    space.veloctyY = 0;
    rocket.velocityY = 0;
    cometGroup.destroyEach();
    bronzeCoinGroup.destroyEach();
    goldCoinGroup.destroyEach();
    weaponGroup.destroyEach();
    fuelGroup.destroyEach();
    reset();
  }

  drawSprites();

  fill(255);
  textSize(15);
  text("Distance: " + distance, 10, 50);
  text("Coins: " + coinCount, 125, 50);
  text("Deaths: " + deaths, 210, 50);
  text("Fireballs left: " + weaponCount, 290, 50);
  text("Fuel left: " + fuelCount + "%", 10, 75);
  textSize(13);
  text("HIGHEST: 39304,307 (keep this updated [line 176])", 50, 490);
}

function spawnComets() {
  if (frameCount % 50 === 0) {
    comet = createSprite(200, -20, 10, 10);
    comet.addImage(cometImg);
    comet.x = Math.round(random(-10, 410));
    comet.velocityY = 10;
    comet.lifetime = 60;
    comet.scale = 0.1;

    //comet.debug = true;
    comet.setCollider("rectangle", 0, 0, 300, 800);

    cometGroup.add(comet);
    rocket.depth = comet.depth;
    rocket.depth += 1;
  }
}

function spawnBronzeCoins() {
  if (frameCount % 150 === 0) {
    bronzeCoin = createSprite(200, -20, 10, 10);
    bronzeCoin.addImage(bronzeCoinImg);
    bronzeCoin.x = Math.round(random(-10, 410));
    bronzeCoin.velocityY = 7;
    bronzeCoin.lifetime = 80;
    bronzeCoin.scale = 0.04;

    //bronzeCoin.debug = true;
    bronzeCoin.setCollider("circle", 0, 0, 500);

    bronzeCoinGroup.add(bronzeCoin);
    rocket.depth = bronzeCoin.depth;
    rocket.depth += 1;
  }
}

function spawnSilverCoins() {
  if (frameCount % 715 === 0) {
    silverCoin = createSprite(200, -20, 10, 10);
    silverCoin.addImage(silverCoinImg);
    silverCoin.x = Math.round(random(-50, 450));
    silverCoin.velocityY = 18;
    silverCoin.lifetime = 35;
    silverCoin.scale = 0.05;

    //silverCoin.debug = true;
    silverCoin.setCollider("circle", 0, 0, 300);

    silverCoinGroup.add(silverCoin);
    rocket.depth = silverCoin.depth;
    rocket.depth += 1;
  }
}

function spawnGoldCoins() {
  if (frameCount % 1716 === 0) {
    goldCoin = createSprite(200, -20, 10, 10);
    goldCoin.addImage(goldCoinImg);
    goldCoin.x = Math.round(random(-100, 500));
    goldCoin.velocityY = 30;
    goldCoin.lifetime = 25;
    goldCoin.scale = 0.05;

    //goldCoin.debug = true;
    goldCoin.setCollider("circle", 0, 0, 300);

    goldCoinGroup.add(goldCoin);
    rocket.depth = goldCoin.depth;
    rocket.depth += 1;
  }
}

function spawnWeapons() {
  weapon = createSprite(200, 310, 10, 10);
  weapon.addImage(weaponImg);
  weapon.velocityY = -1;
  weapon.lifetime = 320;
  weaponGroup.add(weapon);
  weapon.x = rocket.x;
  weapon.scale = 0.015;
  //weapon.debug = true;
  weapon.setCollider("circle", 0, 2, 1100);
  weapon.depth = rocket.depth;
  weapon.depth += 1;
}

function spawnFuel() {
  if (frameCount % 5000 === 0) {
    fuel = createSprite(200, -20, 10, 10);
    fuel.addImage(fuelImg);
    fuel.scale = 0.1;
    fuel.x = Math.round(random(-50, 450));
    fuel.velocityY = 3;
    fuel.lifetime = 180;
    fuelGroup.add(fuel);
  }
}

function reset() {
  if (mousePressedOver(restart)) {
    distance = 0;
    coinCount = 0;
    fuelCount = 100;
    weaponCount = 10;
    gameState = "PLAY";
    restart.visible = false;
  }
}
