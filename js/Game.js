class Game {
  constructor() {
    this.resetButton = createButton("")
    this.resetTitle = createElement("h2")
    this.leaderbordTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMove = false
    this.leftKeyActive = false
    this.blast = false
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage("car1", img1)
    car1.addImage("blast", blastImage)
    car1.scale = 0.07

    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage("car2", img2)
    car2.addImage("blast", blastImage)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group()
    coins = new Group()
    obstacles = new Group()
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(fuels, 4, fuelImg, 0.02)
    this.addSprites(coins, 18, coinsImg, 0.09)
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)

  }
  addSprites(spriteGroup, numberOfSprites, spriteImage, spriteScale, positions = []) {
    for (let i = 0; i < numberOfSprites; i++) {
      var x, y
      if (positions.length > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }
      var sprite = createSprite(x, y)
      sprite.addImage(spriteImage)
      sprite.scale = spriteScale
      spriteGroup.add(sprite)

    }
  }
  handleElements() {
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetButton.class("resetButton")
    this.resetButton.position(width / 2 + 230, 100)
    this.resetTitle.html("RESET")
    this.resetTitle.position(width / 2 + 230, 40)
    this.resetTitle.class("resetText")

    this.leaderbordTitle.html("PLACAR")
    this.leaderbordTitle.class("resetText")
    this.leaderbordTitle.position(width / 3 - 60, 40)
    this.leader1.position(width / 3 - 50, 80)
    this.leader1.class("leadersText")
    this.leader2.position(width / 3 - 50, 130)
    this.leader2.class("leadersText")

  }
  getState() {
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", (data) => {
      gameState = data.val()
    })
  }
  updateState(state) {
    database.ref("/").update({
      gameState: state
    })
  }
  play() {
    this.handleElements()
    this.handleResetButton()
    Player.getPlayerInfo()
    player.getCarsAtEnd()
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6)
      this.showLeaderbord()
      this.showFuelBar()
      this.showLife()
      var index = 0
      for (var plr in allPlayers) {
        index++
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        var currentLife = allPlayers[plr].life
        if (currentLife <= 0) {
          cars[index - 1].changeImage("blast")
          cars[index - 1].scale = 0.3
        }

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index === player.index) {
          fill("red")
          ellipse(x, y, 60, 60)
          this.handleFuel(index)
          this.handlePowerCoins(index)
          this.handleObstacleCollision(index)
          this.handleCarsCollision(index)
          if (player.life <= 0) {
            this.blast = true
            this.playerMove = false
            setTimeout(() => {
              gameState = 2
              this.gameOver()
            }, 1000);
          }
          camera.position.y = cars[index - 1].position.y
        }
      }
      this.handlePlayerControls()
      const finishLine = height * 6 - 100
      if (player.positionY > finishLine) {
        gameState = 2
        player.ranking++
        Player.updateCarsAtEnd(player.ranking)
        player.update()
        this.showRank()
      }
      if (this.playerMove) {
        player.positionY += 5
        player.update()
      }
      drawSprites()
    }

  }
  handlePlayerControls() {
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10
        player.update()
        this.playerMove = true
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 5
        player.update()
        this.leftKeyActive = false
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5
        player.update()
        this.leftKeyActive = true
      }
    }
  }
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        carsAtEnd: 0,
        players: {}

      })
      window.location.reload()


    })
  }
  showLeaderbord() {
    var leader1, leader2
    var players = Object.values(allPlayers)
    if ((players[0].ranking === 0 && players[1].ranking === 0) || players[0].ranking === 1) {
      leader1 = players[0].ranking + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      leader2 = players[1].ranking + "&emsp;" + players[1].name + "&emsp;" + players[1].score

    }

    if (players[1].ranking === 1) {
      leader2 = players[0].ranking + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      leader1 = players[1].ranking + "&emsp;" + players[1].name + "&emsp;" + players[1].score

    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  handleFuel(index) {
    //adicionando combustível
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
    if (player.fuel > 0 && this.playerMove) {
      player.fuel -= 0.3
    }
    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver()
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 21;
      player.update();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
  }
  showRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível ${player.name}!${"\n"}${player.ranking}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImg, width / 2 - 130, height - player.positionY - 250, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 250, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 250, player.fuel, 20);
    noStroke();
    pop();
  }
  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }
  handleCarsCollision(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }
}




