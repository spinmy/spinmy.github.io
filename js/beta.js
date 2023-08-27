var game;
var gameOptions = {
    slices: 12,
    slicePrizes: [
        "10",
        "200000",
        "100000",
        "50000",
        "10000",
        "5000",
        "2000",
        "1000",
        "500",
        "100",
        "50",
        "20"
    ],
    rotationTimeRange: {
        min: 7000,
        max: 13000
    }
};

let fixedOutcomes = [];
let currentOutcomeIndex;

fetch('js/outcomes.json')
  .then(response => response.json())
  .then(data => {
    fixedOutcomes = data;
    if (localStorage.getItem('spin') !== null) {
      currentOutcomeIndex = parseInt(localStorage.getItem('spin'));
      console.log('SPIN NUMBER: ', currentOutcomeIndex);
    } else {
      currentOutcomeIndex = 0;
      localStorage.setItem('spin', currentOutcomeIndex.toString());
    }
  })
  .catch(error => {
    console.error('Error loading outcomes:', error);
  });

window.onload = function () {
    var gameConfig = {
        type: Phaser.CANVAS,
        width: 850,
        height: 850,
        backgroundColor: 0xffffff,
        scene: [playGame]
    };

    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("wheel", "images/wheel.png");
        this.load.image("pin", "images/pin.png");
    }
    create() {
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
        this.pin.setOrigin(0.5);
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 45px Rajdhani",
            align: "center",
            color: "green"
        });
        this.prizeText.setOrigin(0.5);
        this.canSpin = true;
        this.input.on("pointerdown", this.spinWheel, this);
    }

    spinWheel() {
        if (this.canSpin) {
            var audio = new Audio("css/ring.mp3");
            audio.play();
            this.prizeText.setText("");
            var randomSpinCount = Phaser.Math.Between(2, 10);
            var totalDegrees = randomSpinCount * 360;

            var spinOutcome = fixedOutcomes[currentOutcomeIndex];

            var targetSlice = gameOptions.slicePrizes.indexOf(spinOutcome.toString());

            currentOutcomeIndex = (currentOutcomeIndex + 1) % fixedOutcomes.length;

            var rotationTime = Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max);
            var randomExtraTime = Phaser.Math.Between(0, 10);
            rotationTime += randomExtraTime;

            this.canSpin = false;

            this.tweens.add({
                targets: [this.wheel],
                angle: totalDegrees + (360 / gameOptions.slices) * targetSlice,
                duration: rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    localStorage.setItem('spin', currentOutcomeIndex + 1);
                    document.getElementById("pyro").style.display = "block";
                    var prize = gameOptions.slicePrizes[targetSlice];
                    this.prizeText.setText("₹ " + prize.toLocaleString() + " JACKPOT!!!");
                    this.canSpin = true;
                    audio.pause();
                }
            });
        }
    }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = windowWidth / gameRatio + "px";
    } else {
        canvas.style.width = windowHeight * gameRatio + "px";
        canvas.style.height = windowHeight + "px";
    }
}
