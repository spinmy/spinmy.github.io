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
var fixedOutcomes = [10, 10, 10, 10, 20, 10, 10, 10, 10, 20, 50, 100 , 500, 1000, 2000, 5000, 10000, 50000, 100000, 200000];
var currentOutcomeIndex = 0;

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
            this.prizeText.setText("");
            var randomSpinCount = Phaser.Math.Between(10, 20);
            var totalDegrees = randomSpinCount * 360;

            var spinOutcome = fixedOutcomes[currentOutcomeIndex];
            var targetSlice = gameOptions.slicePrizes.indexOf(spinOutcome.toString());

            currentOutcomeIndex = (currentOutcomeIndex + 1) % fixedOutcomes.length;

            var rotationTime = Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max);
            var randomExtraTime = Phaser.Math.Between(0, 10);
            rotationTime += randomExtraTime;
            
            setTimeout(() => {
                var victorySound = document.getElementById("victorySound");
                victorySound.play();
            }, rotationTime - 4000);

            this.canSpin = false;

            this.tweens.add({
                targets: [this.wheel],
                angle: totalDegrees + (360 / gameOptions.slices) * targetSlice,
                duration: rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    document.getElementById("pyro").style.display = "block";
                    var prize = gameOptions.slicePrizes[targetSlice];
                    this.prizeText.setText("₹ " + prize.toLocaleString() + " JACKPOT!!!");
                    this.canSpin = true;
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
