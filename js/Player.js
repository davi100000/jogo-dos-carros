class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.ranking = 0
    this.score = 0
    this.fuel = 185
    this.life = 185
  }
  getCount() {
    var palyerCountRef = database.ref("playerCount")
    palyerCountRef.on("value", (data) => {
      playerCount = data.val()
    })
  }
  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    })
  }
  static updateCarsAtEnd(ranking){
    database.ref("/").update({
      carsAtEnd: ranking
    })
  }
  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value", (data) => {
      this.ranking = data.val()
    })

  }
  addPlayer() {
    var playerIndex = "players/player" + this.index
    if (this.index === 1) {
      this.positionX = width / 2 - 100
    } else {
      this.positionX = width / 2 + 100
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      ranking: this.ranking,
      score: this.score,
      life: this.life
    })
  }
  static getPlayerInfo() {
    database.ref("players").on("value", (data) => {
      allPlayers = data.val()
    })
  }
  update() {
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      ranking: this.ranking,
      score: this.score,
      life: this.life
    })
  }
  getDistance() {
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).on("value", (data) => {
      var dados = data.val()
      this.positionX = dados.positionX
      this.positionY = dados.positionY
    })
  }
}
