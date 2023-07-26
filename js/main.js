var game;
var gameOptions = {
    slices: 6,
    slicePrizes: [
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 GIFT CARD",
        "🎉 50% OFF",
        "🎉 20% OFF",
        "🎉 TRY AGAIN",
        "🎉 10% OFF"
    ],
    rotationTime: 6000
};

window.onload = function () {
    var gameConfig = {
        type: Phaser.CANVAS,
        width: 850,
        height: 850,
        backgroundColor: 0x880044,
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
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 64px Rajdhani",
            align: "center",
            color: "white"
        });
        this.prizeText.setOrigin(0.5);
        this.canSpin = true;
        this.input.on("pointerdown", this.spinWheel, this);
    }
    spinWheel() {
        if (this.canSpin) {
            this.prizeText.setText("");
            var rounds = Phaser.Math.Between(4, 6);
            var degrees = Phaser.Math.Between(0, 360);
            var totalDegrees = 360 * rounds + degrees;
            var prize = gameOptions.slices - 1 - Math.floor((totalDegrees % 360) / (360 / gameOptions.slices));
            this.canSpin = false;
            this.tweens.add({
                targets: [this.wheel],
                angle: 360 * rounds + degrees,
                duration: gameOptions.rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);
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
